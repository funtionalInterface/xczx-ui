<template>
  <div>
    <!--查询表单-->
    <el-form :model="params" style="margin-top: 10px">
      原始名称：
      <el-input v-model="params.fileOriginalName" size="small" style="width:100px"></el-input>
      处理状态：
      <el-select v-model="params.processStatus" style="width:100px;margin-right: 10px" size="small"
                 placeholder="请选择处理状态">
        <el-option
          v-for="item in processStatusList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" v-on:click="query" size="small">查询</el-button>
      <router-link class="mui-tab-item" :to="{path:'/upload'}">
        <el-button type="primary" size="small" v-if="ischoose !== true">上传文件</el-button>
      </router-link>
    </el-form>
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" align="center" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="fileOriginalName" align="center" label="原始文件名称" width="220">
      </el-table-column>
      <el-table-column prop="fileName" align="center" label="文件名称" width="220">
      </el-table-column>
      <el-table-column prop="fileUrl" align="center" label="访问url" width="260">
      </el-table-column>
      <el-table-column prop="tag" align="center" label="标签" width="100">
      </el-table-column>
      <el-table-column prop="fileSize" align="center" label="文件大小" width="100">
      </el-table-column>
      <el-table-column prop="processStatus" align="center" label="处理状态" width="100" :formatter="formatProcessStatus">
      </el-table-column>
      <el-table-column prop="uploadTime" align="center" label="创建时间" width="110" :formatter="formatCreatetime">
      </el-table-column>
      <el-table-column fixed="right" label="处理" align="center" width="220" v-if="ischoose !== true">
        <template slot-scope="scope">
          <el-button
            size="small" type="success" plain @click="player(scope.row.fileId,scope.row.processStatus)">播放
          </el-button>
          <el-button
            size="small" type="primary" plain @click="process(scope.row.fileId,scope.row.processStatus)">处理
          </el-button>
          <el-button
            size="small" type="danger" plain @click="delete_media(scope.row.fileId)">删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="选择" width="80" v-if="ischoose === true">
        <template slot-scope="scope">
          <el-button
            size="small" type="primary" plain @click="choose(scope.row)">选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">

      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :page-size="this.params.size"
        :total="total"
        :current-page="this.params.page"
        style="text-align: center;margin-top: 10px">
      </el-pagination>
    </el-col>
  </div>
</template>
<script>
  import * as mediaApi from '../api/media'
  import utilApi from '@/common/utils';

  export default {
    props: ['ischoose'],
    data() {
      return {
        params: {
          page: 1,//页码
          size: 10,//每页显示个数
          tag: '',//标签
          fileName: '',//文件名称
          processStatus: ''//处理状态
        },
        listLoading: false,
        list: [],
        total: 0,
        processStatusList: []
      }
    },
    methods: {
      formatCreatetime(row, column) {
        var createTime = new Date(row.uploadTime);
        if (createTime) {
          return utilApi.formatDate(createTime, 'yyyy-MM-dd hh:mm:ss');
        }
      },
      formatProcessStatus(row, column) {
        var processStatus = row.processStatus;
        if (processStatus) {
          if (processStatus === '303001') {
            return "处理中";
          } else if (processStatus === '303002') {
            return "处理成功";
          } else if (processStatus === '303003') {
            return "处理失败";
          } else if (processStatus === '303004') {
            return "无需处理";
          }
        }
      },
      choose(mediaFile) {
        if (mediaFile.processStatus !== '303002' && mediaFile.processStatus !== '303004') {
          this.$message.error('该文件未处理，不允许选择');
          return;
        }
        if (!mediaFile.fileUrl) {
          this.$message.error('该文件的访问url为空，不允许选择');
          return;
        }
        //调用父组件的choosemedia方法
        this.$emit('choosemedia', mediaFile.fileId, mediaFile.fileOriginalName, mediaFile.fileUrl);
      },
      changePage(page) {
        this.params.page = page;
        this.query()
      },
      process(id, status) {
        if (status === "303001") {
          this.$message.error('视频正在处理！');
          return;
        }
        if (status === "303002") {
          this.$message.error('视频已处理完成，无需重复处理！');
          return;
        }
        this.$confirm('您确认处理该文件吗?', '提示', {}).then(() => {
          // 调用服务端接口
          mediaApi.media_process(id).then((res) => {
            if (res.success) {
              this.$message.success('开始处理，请稍后查看处理结果');
            } else {
              this.$message.error(res.message);
            }
          })
        })

      },
      delete_media(id) {
        if (status === "303001") {
          this.$message.error('视频正在处理，不可删除！');
          return;
        }
        this.$confirm('您确认删除该文件吗?', '提示', {}).then(() => {

          // 调用服务端接口
          mediaApi.delete_media(id).then((res) => {
            if (res.success) {
              this.$message.success('删除媒资文件成功！');
              // 刷新列表
              this.query()
            } else {
              this.$message.error(res.message);
            }
          })
        })


      },
      query() {
        mediaApi.media_list(this.params.page, this.params.size, this.params).then((res) => {
          this.total = res.queryResult.total
          this.list = res.queryResult.list
          for (let i = 0; i < this.list.length; i++) {
            let size = this.list[i].fileSize;
            this.list[i].fileSize = (size / 1024 / 1024 * 1.0).toFixed(2) + " mb";
          }
        })
      },
      player(id,status){
        if (status === "303001") {
          this.$message.error('视频正在处理，不能播放！');
          return;
        }
        this.$router.push({
          path: '/video',
          query: {
            mediaId: id,
            status : status
          }
        })
      }
    },
    created() {
      //默认第一页
      this.params.page = Number.parseInt(this.$route.query.page || 1);
    },
    mounted() {
      //默认查询页面
      this.query()
      //初始化处理状态
      this.processStatusList = [
        {
          id: '',
          name: '全部'
        },
        {
          id: '303001',
          name: '处理中'
        },
        {
          id: '303002',
          name: '处理成功'
        },
        {
          id: '303003',
          name: '处理失败'
        },
        {
          id: '303004',
          name: '无需处理'
        }
      ]
    }
  }
</script>
<style>

</style>

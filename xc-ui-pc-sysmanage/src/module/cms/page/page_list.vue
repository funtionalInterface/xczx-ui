<template>
  <div>
    <!--编写页面静态部分，即view部分-->
    <!--查询表单-->
    <el-form :model="params" style="margin-top: 10px">
      <el-select v-model="params.siteId" clearable size="small" style="width: 100px" placeholder="请选择站点">
        <el-option
          v-for="item in siteList"
          :key="item.siteId"
          :label="item.siteName"
          :value="item.siteId">
        </el-option>
      </el-select>
      <el-input v-model="params.pageAliase" size="small" placeholder="页面别名" style="width: 100px"></el-input>
      <el-button type="primary" size="small" v-on:click="query">查询</el-button>
      <router-link :to="{path:'/cms/page/add',query:{
        page:this.params.page,
        siteId:this.params.siteId,
        pageAliase:this.params.pageAliase
      }}">
        <el-button type="primary" size="small">新增页面</el-button>
      </router-link>
    </el-form>

    <el-table
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px">
      <el-table-column label="序号" align="center" type="index" width="50">
      </el-table-column>
      <el-table-column prop="pageName" label="页面名称" width="380">
      </el-table-column>
      <el-table-column prop="pageAliase" align="center" label="别名" width="120">
      </el-table-column>
      <el-table-column prop="pageType" align="center" label="页面类型" width="100">
      </el-table-column>
      <el-table-column prop="pageWebPath" label="访问路径" width="220">
      </el-table-column>
      <el-table-column prop="pagePhysicalPath" label="物理路径" width="500">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="300">
        <template slot-scope="page">
          <el-button
            size="small" type="warning"
            @click="edit(page.row.pageId)">编辑
          </el-button>
          <el-button
            size="small" type="danger"
            @click="del(page.row.pageId)">删除
          </el-button>
          <el-button @click="preview(page.row.pageId)" type="primary" size="small">预览</el-button>
          <el-button @click="postPage(page.row.pageId)" type="success" size="small">发布</el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="params.size"
      :current-page="params.page"
      v-on:current-change="changePage"
      style="text-align: center;margin-top: 10px">
    </el-pagination>
  </div>
</template>
<script>
  /*编写页面静态部分，即model及vm部分。*/
  import * as cmsApi from '../api/cms'

  export default {
    data() {
      return {
        siteList: [], // 站点列表
        list: [],
        total: 0,
        params: {

          siteId: '',
          pageAliase: '',
          page: 1,
          size: 5
        }
      }
    },
    methods: {
      getSiteList() {
        // 初始化站点列表
        // 调用服务端接口
        cmsApi.site_list().then(res => {
          if (res.success) {
            this.siteList = res.queryResult.list;
          }
        })
      },
      // 页面查询
      query: function () {
        this.getSiteList();
        // 调用服务端的接口
        cmsApi.page_list(this.params.page, this.params.size, this.params).then((res) => {
          // 将res结果数据赋值给数据模型对象
          this.list = res.queryResult.list;
          this.total = res.queryResult.total;
        })

      },
      changePage: function (page) { // 形参就是当前页码
        // 调用query方法
        this.params.page = page;
        this.query()
      },
      edit: function (pageId) {
        // 打开修改页面
        this.$router.push({
          path: '/cms/page/edit/' + pageId,
          query: {
            page: this.params.page,
            siteId: this.params.siteId,
            pageAliase: this.params.pageAliase
          }
        })
      },

      del: function (pageId) {
        this.$confirm('您确认删除吗?', '提示', {}).then(() => {

          // 调用服务端接口
          cmsApi.page_del(pageId).then(res => {

            if (res.success) {
              this.$message.success("删除成功")
              // 刷新页面
              this.query()
            } else {
              this.$message.error("删除失败")
            }
          })
        })

      },

      // 页面预览
      preview: function (pageId) {
        // 打开浏览器窗口
        window.open("http://www.xuecheng.com/cms/preview/" + pageId);
      },
      postPage(id) {
        this.$confirm('确认发布该页面吗?', '提示', {}).then(() => {
          cmsApi.page_postPage(id).then((res) => {
            if (res.success) {
              console.log('发布页面id=' + id);
              this.$message.success('发布成功，请稍后查看结果');
            } else {
              this.$message.error('发布失败');
            }
          });
        }).catch(() => {
        });
      },
    },
    created() {
      // 取出路由中的参数，赋值给数据对象
      this.params.page = Number.parseInt(this.$route.query.page || 1)
      this.params.siteId = this.$route.query.siteId || ''
      this.params.pageAliase = this.$route.query.pageAliase || ''

    },

    mounted() {
      // 当DOM元素渲染完成后调用query
      this.query()
      this.getSiteList()
    }
  }
</script>
<style>
  /*编写页面样式，不是必须*/
</style>

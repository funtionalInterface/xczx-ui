<template>
  <section>
    <!--查询表单-->
    <el-form :model="params" style="margin-top: 10px;margin-left: 35px">
      <el-input v-model="params.name" placeholder="课程名称" style="width: 200px"></el-input>
      <el-input v-model="params.companyId" placeholder="发布状态" style="width: 100px"></el-input>
      <el-button type="primary" size="small" v-on:click="getCourse"
                 style="margin-top: 3px;height: 35px;margin-left: 3px">查询
      </el-button>
    </el-form>
    <el-row>
      <el-col :span="8" :offset=2>
        <el-card :body-style="{ padding: '10px' }">
          <img src="/static/images/add.jpg" class="image" height="150px">
          <div style="padding: 10px;">
            <span>课程名称</span>
            <div class="bottom clearfix">
              <time class="time"></time>
              <router-link class="mui-tab-item" :to="{path:'/course/add/base',query:{
               page:this.page,
               courseName: this.params.name,
               companyId:this.params.companyId
              }}">
                <el-button type="text" class="button">新增课程</el-button>
              </router-link>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-for="(course, index) in courses" :key="course.id" :offset="index > 0 ? 2 : 2">

        <el-card :body-style="{ padding: '10px' }">
          <img :src="course.pic!=null?imgUrl+course.pic:'/static/images/nonepic.jpg'" class="image" height="150px">
          <div style="padding: 10px;">
            <span>{{course.name}}</span>
            <div class="bottom clearfix">
              <time class="time"></time>
              <el-button type="text" class="button" @click="handleManage(course.id,page,params.name,params.companyId)">
                管理课程
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!--分页-->
      <el-col :span="24" class="toolbar">
        <el-pagination background layout="prev, pager, next"
                       @current-change="handleCurrentChange"
                       :page-size="size"
                       :current-page.sync="page"
                       :total="total"
                       style="text-align: center;margin-top: 10px">
        </el-pagination>
      </el-col>
    </el-row>
  </section>
</template>
<script>
  import * as courseApi from '../api/course';
  import utilApi from '../../../common/utils';

  let sysConfig = require('@/../config/sysConfig')
  export default {
    data() {
      return {
        page: 1,
        size: 7,
        total: 0,
        courses: [],
        sels: [],//列表选中列
        imgUrl: sysConfig.imgUrl,
        params: {
          name: '',
          companyId: ''
        }
      }
    },
    methods: {
      //分页方法
      handleCurrentChange(val) {
        this.page = val;
        this.getCourse();
      },
      //获取课程列表
      getCourse() {
        courseApi.findCourseList(this.page, this.size, this.params).then((res) => {
          if (res.success) {
            this.total = res.queryResult.total;
            this.courses = res.queryResult.list;
          }
        });
      },
      handleManage: function (id, page, courseName, companyId) {
        this.$router.push({path: '/course/manager/' + id + "?page=" + page + "&courseName=" + courseName + "&companyId=" + companyId})
      },
      blank(str) {
        return isNaN(str) || str === undefined;
      }
    },
    created() {
      const tmp_page = this.$route.query.page;
      this.page = this.blank(tmp_page) ? 1 : parseInt(tmp_page);
      this.params.name = this.$route.query.courseName;
      this.params.companyId = this.$route.query.companyId;
    },
    mounted: function () {
      //查询我的课程
      this.handleCurrentChange(this.page);
    }
  }
</script>
<style scoped>
  .el-col-8 {
    width: 20%
  }

  .el-col-offset-2 {
    margin-left: 2%
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>

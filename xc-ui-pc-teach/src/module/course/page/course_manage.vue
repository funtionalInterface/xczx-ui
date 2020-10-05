<template>
  <div>
    <el-menu
      :router="true"
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#eee"
      text-color="#000"
      active-text-color="#000"
      style="margin-top: 10px">
      <el-menu-item :route="{path:'/course/manage/summary/'+this.courseid}" index="1">课程首页
      </el-menu-item>
      <el-menu-item
        :route="{path: '/course/manage/baseinfo/'+this.courseid+ '?page=' + this.page+ '&courseName=' + this.courseName + '&companyId=' + this.companyId}"
        index="2">基本信息
      </el-menu-item>
      <el-menu-item :route="{path: '/course/manage/picture/'+this.courseid}" index="3">课程图片
      </el-menu-item>
      <el-menu-item :route="{path: '/course/manage/marketinfo/'+this.courseid}" index="4">课程营销
      </el-menu-item>
      <el-menu-item :route="{path: '/course/manage/plan/'+this.courseid}" index="5">课程计划
      </el-menu-item>
      <el-menu-item :route="{path: '/course/manage/teacher/'+this.courseid}" index="6">教师信息
      </el-menu-item>
      <el-menu-item :route="{path: '/course/manage/pub/'+this.courseid}" index="7">发布课程
      </el-menu-item>
    </el-menu>
    <router-view class="main" style="margin-top: 10px"></router-view>
  </div>
</template>
<script>
  import * as courseApi from '../api/course';
  import utilApi from '../../../common/utils';

  export default {
    data() {
      return {
        activeIndex: '2',
        courseid: '',
        page: 1,
        courseName: '',
        companyId: ''
      }
    },
    methods: {},
    mounted() {
      // 课程id
      this.courseid = this.$route.params.courseid
      this.page = this.$route.query.page;
      const tmpName = this.$route.query.courseName;
      this.courseName = tmpName === undefined ? '' : tmpName;
      const tmpCompany = this.$route.query.companyId;
      this.companyId = tmpCompany === undefined ? '' : tmpCompany;
      // 跳转到课程基本信息
      this.$router.push({path: '/course/manage/baseinfo/' + this.courseid + "?page=" + this.page + "&courseName=" + this.courseName + "&companyId=" + this.companyId})
    }
  }
</script>
<style scoped>


</style>

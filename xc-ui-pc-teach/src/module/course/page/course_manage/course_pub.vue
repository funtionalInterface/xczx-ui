<template>
  <div>
    <template>
      <div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>课程预览</span>
          </div>
          <div class="text item">
            <el-button type="primary" @click.native="preview">课程预览</el-button>
            <br/><br/>
            <span v-if="previewurl && previewurl!==''">
              <a :href="previewurl" target="_blank">
                <el-button type="success">点我查看课程预览页面</el-button>
              </a>
            </span>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>课程发布</span>
          </div>
          <div class="text item">
            <div v-if="course.status === '202001'">
              状态：制作中
              <el-button type="primary" @click.native="publish" :loading="editLoading">新课程发布</el-button>
            </div>
            <div v-else-if="course.status === '202003'">
              状态：已下线
              <a :href="'http://www.xuecheng.com/course/detail/'+this.courseid+'.html'"
                 target="_blank">
                <el-button type="success">点我查看课程详情页面</el-button>
              </a>
            </div>
            <div v-else-if="course.status === '202002'">
              状态：已发布<br/><br/>
              <el-button type="primary" @click.native="publish" :loading="editLoading">修改发布</el-button>
              <a :href="'http://www.xuecheng.com/course/detail/'+this.courseid+'.html'"
                 target="_blank"><br/><br/>
                <el-button type="success">点我查看课程详情页面</el-button>
              </a>
            </div>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>
<script>
  import * as sysConfig from '@/../config/sysConfig';
  import * as courseApi from '../../api/course';
  import utilApi from '../../../../common/utils';
  import * as systemApi from '../../../../base/api/system';

  export default {

    data() {
      return {
        editLoading: false,
        dotype: '',
        courseid: '',
        course: {"id": "", "name": "", "status": ""},
        previewurl: ''
      }
    },
    methods: {
      // 预览
      preview() {
        // 调用课程管理服务的预览接口，得到课程预览url
        courseApi.preview(this.courseid).then((res) => {
          if (res.success) {
            this.$message.success('预览页面生成成功，请点击下方预览链接');
            if (res.previewUrl) {
              // 预览url
              this.previewurl = res.previewUrl
            }
          } else {
            this.$message.error(res.message);
          }
        });
      },
      publish() {
        this.editLoading = true;
        // 课程发布
        courseApi.publish(this.courseid).then(res => {
          if (res.success) {
            this.$message.success("发布成功，请点击下边的链接查询课程详情页面")
            this.getCourseView()
            this.editLoading = false;
          } else {
            this.$message.error(res.message)
            this.editLoading = false;
          }
        }).catch(()=>{
          this.$message.error('您没有权限操作该选项！');
          this.editLoading = false;
        })

      },
      getCoursePreUrl() {
        courseApi.previewUrl().then(res => {
          if (res.success) {
            this.previewurl = res.previewUrl;
            this.previewurl += this.courseid;
          }
        })
      },
      getCourseView() {
        courseApi.findCourseView(this.courseid).then(res => {
          if (res && res.courseBase) {
            // 获取课程状态
            this.course.status = res.courseBase.status;
          }
        })
      }
    },
    mounted() {
      // 课程id
      this.courseid = this.$route.params.courseid;
      // this.getCoursePreUrl();
      // 查询课程信息
      this.getCourseView();
    }
  }
</script>
<style>

</style>

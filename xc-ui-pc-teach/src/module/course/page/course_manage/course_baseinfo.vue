<template>
  <div>
    <el-form :model="courseForm" label-width="80px" :rules="courseRules" ref="courseForm">
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="courseForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="适用人群" prop="users">
        <el-input v-model="courseForm.users" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="课程分类" prop="categoryActive">
        <el-cascader
          expand-trigger="hover"
          :options="categoryList"
          v-model="categoryActive"
          :props="props"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="课程等级" prop="grade">
        <b v-for="grade in gradeList">
          <el-radio v-model="courseForm.grade" :label="grade.sdId">{{ grade.sdName }}</el-radio>&nbsp;&nbsp;
        </b>
      </el-form-item>
      <el-form-item label="学习模式" prop="studymodel">
        <b v-for="studymodel_v in studymodelList">
          <el-radio v-model="courseForm.studymodel" :label="studymodel_v.sdId">{{ studymodel_v.sdName }}</el-radio>&nbsp;&nbsp;
        </b>
      </el-form-item>
      <el-form-item label="课程介绍" prop="description">
        <el-input type="textarea" v-model="courseForm.description"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="save">提交</el-button>
      <el-button type="primary" @click.native="go_back">返回</el-button>
    </div>
  </div>
</template>

<script>
  import * as courseApi from '../../api/course'
  // eslint-disable-next-line no-unused-vars
  import utilApi from '../../../../common/utils'
  import * as systemApi from '../../../../base/api/system'

  export default {

    data () {
      return {
        routerStatus: '',
        dotype: '',
        courseid: '',
        studymodelList: [],
        gradeList: [],
        props: {
          value: 'id',
          label: 'name',
          children: 'children'
        },
        categoryList: [],
        categoryActive: [],
        courseForm: {
          id: '',
          name: '',
          users: '',
          grade: '',
          studymodel: '',
          mt: '',
          st: '',
          description: ''
        },
        courseRules: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          categoryActive1: [
            {required: true, message: '请选择课程分类', trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请选择课程等级', trigger: 'blur'}
          ],
          studymodel: [
            {required: true, message: '请选择学习模式', trigger: 'blur'}
          ]

        }
      }
    },
    methods: {

      handleChange () {
        console.log(this.categoryActive)
      },

      save: function () {
        // 修改课程
        this.$refs.courseForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              let mt = this.categoryActive[0]
              let st = this.categoryActive[1]
              this.courseForm.mt = mt
              this.courseForm.st = st
              let id = this.courseForm.id
              courseApi.updateCoursebase(id, this.courseForm).then((res) => {
                if (res.success) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                } else {
                  if (res.message) {
                    this.$message.error(res.message)
                  } else {
                    this.$message.error('提交失败')
                  }
                }
                // eslint-disable-next-line handle-callback-err
              }).catch(error => {
                this.$message.error('您没有权限操作该选项！')
              })
            })
          }
        })
      },
      go_back () {
        this.$router.push({
          path: '/course/list',
          query: {
            page: this.$route.query.page, // 取出路由中的参数
            courseName: this.$route.query.courseName,
            companyId: this.$route.query.companyId
          }
        })
      }
    },
    created () {

    },
    mounted () {
      // 查询数据字典字典
      systemApi.sys_getDictionary('201').then((res) => {
        this.studymodelList = res.dvalue
      })
      systemApi.sys_getDictionary('200').then((res) => {
        this.gradeList = res.dvalue
      })
      // 取课程分类
      courseApi.category_findlist({}).then((res) => {
        this.categoryList = res.queryResult.list
      })
      // 查询课程信息
      // 课程id
      this.courseid = this.$route.params.courseid
      courseApi.getCoursebaseById(this.courseid).then((res) => {
        this.courseForm = res
        // 课程分类显示，需要两级分类
        this.categoryActive.push(this.courseForm.mt)  // 1-2
        this.categoryActive.push(this.courseForm.st)  // 1-2-2
      })
    }
  }
</script>

<style scoped>


</style>

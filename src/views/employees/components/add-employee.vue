<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 放置表单 -->
    <el-form label-width="120px" :model="formDate" :rules="rules" ref="addEmployee">
      <el-form-item label="姓名" prop="username">
        <el-input style="width: 50%" placeholder="请输入姓名" v-model="formDate.username" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input style="width: 50%" placeholder="请输入手机号" v-model="formDate.mobile" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker style="width: 50%" placeholder="请选择入职时间"  v-model="formDate.timeOfEntry"/>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select style="width: 50%"
         placeholder="请选择"
         v-model="formDate.formOfEmployment" 
         >
         <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input style="width: 50%" placeholder="请输入工号" v-model="formDate.workNumber" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input style="width: 50%" placeholder="请选择部门" v-model="formDate.departmentName" @focus="getDepartments" v-loading="loading" />
        <el-tree :data="treeDate" :props="{label:'name'}" empty-text="" :default-expand-all="true" v-if="showTree" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker style="width: 50%" placeholder="请选择转正时间" v-model="formDate.correctionTime" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel" >取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import {getDepartments} from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import {addEmployee} from '@/api/employees'
export default {
  name: "HrsaasAddEmployee",
    props:{
        showDialog:{
            type:Boolean,
            default:false
        }
    },
  data() {
    return {
      EmployeeEnum,
      formDate: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      treeDate:[],
      loading:false,
      showTree:false,
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },

  mounted() {

  },

  methods: {
    async getDepartments (){
      this.loading = true
      const {depts} = await getDepartments()
      this.treeDate = tranListToTreeData(depts,'')
      this.showTree = true
      this.loading = false
    },
    selectNode(node){
      this.formDate.departmentName = node.name
      this.showTree = false
    },
    async btnOk(){
     try {
       await this.$refs.addEmployee.validate()
       await addEmployee(this.formDate)
       this.$message.success('新增成功')
       this.$parent.getEmployeeList()
       this.$parent.showDialog = false
     } catch (error) {
       console.log(error)
     }
    },
    btnCancel(){
            // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 重置校验结果
      this.$parent.showDialog = false
    }
  },
  
}
</script>

<style lang="scss" scoped></style>

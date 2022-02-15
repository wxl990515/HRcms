<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close='btnCancel'>
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" :model="formData" :rules="rules" ref="deptForm">
      <el-form-item label="部门名称" prop="name">
        <el-input style="width: 80%" placeholder="1-50个字符" v-model="formData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input style="width: 80%" placeholder="1-50个字符" v-model="formData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select style="width: 80%" placeholder="请选择" v-model="formData.manager" @focus="getEmployeeSimple">
          <el-option
          v-for="item in options "
          :key="item.id"
          :value="item.username"
          :label="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments , addDepartments ,getDepartDetail ,updateDepartments} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode:{
      type:Object,
      default:null,
    },
  },
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        // 没id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式  因为编辑模式下 不能算自己
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称长度为1-50个字符串",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator:checkNameRepeat,
          }
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码长度为1-50个字符串",
            trigger: "blur",
          },
          {
            trigger:'blur',
            validator:checkCodeRepeat,
          }
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门负责人长度为1-50个字符串",
            trigger: "blur",
          },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍长度为1-300个字符串",
            trigger: "blur",
          }
        ]
      },
      options:[],
    }
  },
  methods: {
      async getEmployeeSimple(){
      const res = await getEmployeeSimple()
      this.options = res
    },
      // 调用接口 获取员工详情 将数据回写给表单
      async getDepartDetail(id){
      const res = await getDepartDetail(id)
      this.formData = res
    },
    btnOk(){
      this.$refs.deptForm.validate(async isOk => {
        if(isOk){
          if(this.formData.id){
            await updateDepartments(this.formData) //调用编辑接口 并传入一个对象
          }else{
            //如果ok表示可以提交数据 调用新增部门的接口了
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id 就是子部门的pid
          }
            this.$emit('addDept')
            this.$emit('update:showDialog',false)
        }
      })
    },
    btnCancel(){
      this.formData = {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      }
      // 重置表单校验
      this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog',false)
    }
  },
  computed: {
    showTitle(){
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  }
}
</script>

<style></style>

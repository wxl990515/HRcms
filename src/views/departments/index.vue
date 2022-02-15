<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织机构的头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools :treeNode='company' :isRoot="true" @addDept="changeShowDialog"/>
        <!-- ------------------------------------------------------------------------------------ -->
        <!-- 树形结构 -->
        <el-tree  :data="departs" :props="defaultProps" :default-expand-all="true">
            <!-- 传入内容 插槽内容 会循环很多次 有多少节点 就循环多少次 -->
            <!-- 放置结构内容 -->
            <!-- 作用域插槽 -->
        <TreeTools :treeNode='data' slot-scope="{data}"
         @delDept="getDepartments" 
         @addDept="changeShowDialog" 
         @editDept="editDept" />
        </el-tree>
      </el-card>
    </div>
     <!-- 放置弹层组件 -->
      <AddDept ref="addDept" :showDialog.sync="showDialog" :treeNode="node" @addDept="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: {},
      showDialog:false,
      node:null,//记录当前点击的node节点数据
    }

  },
  components: {
    TreeTools,
    AddDept
  },
  created(){
    this.getDepartments()
  },
  methods: {
    async getDepartments(){
    const res = await getDepartments()
    this.company = {name:res.companyName,manager:'负责人',id:''}
    this.departs = tranListToTreeData(res.depts,'')
    },
    changeShowDialog(node){
      this.showDialog = true //显示弹出层
      this.node = node //将当前点击的node节点数据记录下来
    },
    editDept(node){
      this.showDialog = true //显示弹出层
      this.node = node //将当前点击的node节点数据记录下来
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}</style>

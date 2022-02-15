<template>
    <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
          <!-- 放置左侧内容 -->
          <el-col>
            <span>{{treeNode.name}}</span>
          </el-col>
          <!-- 放置右侧内容 -->
          <el-col :span="8">
            <el-row type="flex" justify="end">
              <el-col>{{treeNode.manager}}</el-col>
              <el-col>
                <!-- 放置下拉菜单 -->
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                    <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
                    <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
    </el-row>
</template>

<script>
import {delDepartments} from '@/api/departments'
export default {
    props: {
        treeNode: {
            type: Object,
            required: true
        },
        isRoot:{
          type: Boolean,
          default: false
        }
    },
  methods: {
    handleCommand(command){
      //当点击了添加按钮时 触发
      if(command == 'add'){
          this.$emit('addDept',this.treeNode)
      }
      //当点击了编辑按钮时 触发
      else if( command == 'edit'){
         this.$emit('editDept',this.treeNode)
      }
      // 当点击了删除按钮时 触发
      else if (command == 'del'){
        this.$confirm('确定要删除该部门吗？').then( () => {
          // 如果点击了确定就会进入这个.then回调函数
          return  delDepartments(this.treeNode.id) //返回Promise对象
        }).then( () => {//如果执行成功了就会进入到成功的回调函数
          this.$emit('delDept') //触发组定义事件 （删除成功后 前端页面没有刷新 通过触发自定义事件 通知父组件重新获取页面组织架构的数据源）
          this.$message.success('部门删除成功！')//提示成功后的消息
        })
      }
    }
  }
}
</script>

<style>

</style>
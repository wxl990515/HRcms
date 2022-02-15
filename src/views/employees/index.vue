<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置头部内容 -->
      <PageTools :showBefore="true">
          <span slot="before">共{{this.page.total}}条记录</span>
          <template slot="after">
            <el-button size="small" type="warning">导入</el-button>
            <el-button size="small" type="danger">导出</el-button>
            <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
          </template>
      </PageTools>
      <!-- 放置表格内容 和 分页组件 -->
      <el-card>
        <!-- 表格数据 -->
        <el-table border="" v-loading="loading" :data="UserList">
          <el-table-column label="序号" sortable="" type="index"></el-table-column>
          <el-table-column label="姓名" sortable="" prop="username"></el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber"></el-table-column>
          <el-table-column label="聘用形式"
            sortable="" prop="formOfEmployment"
           :formatter="formatEmployment"
           ></el-table-column>
          <el-table-column label="部门" sortable="" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" >
            <!-- 作用域插槽 -->
            <template slot-scope="{row}">
              {{
                row.timeOfEntry | formatDate
              }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <!-- 作用域插槽 结构出数据 -->
            <template slot-scope="{row}">
              <el-switch 
              :value="row.enableState === 1"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 分页组件 -->
        <el-row type="flex" justify="center" style="height:60px" align="middle">
          <el-pagination
           background
           layout="prev, pager, next"
           :total="page.total"
           :current-page="page.page"
           @current-change="changePage"
          >
          </el-pagination>  
        </el-row>
    </div>
    <!-- 弹层组件 -->
    <!-- sync修饰符 是 子组件 去改变父组件的数据时的一个语法糖 可以简化我们的代码 -->
    <add-employee :showDialog="showDialog" />
  </div>
</template>

<script>
import {getEmployeeList,delEmployee} from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
export default {
  data(){
    return{
      UserList:[],
      page:{
        page:1,
        size:10,
        total:0
      },
      loading:false,//显示遮罩层
      value:true,//显示隐藏状态开关
      showDialog:false,//显示弹层
    }
  },
  components:{
    AddEmployee
  },
  created () {
    this.getEmployeeList()
  },
  methods:{
    async getEmployeeList(){
     this.loading = true
     const {total,rows} = await getEmployeeList(this.page)
     this.page.total = total
     this.UserList = rows
     this.loading = false
    },
    async delEmployee(id){
      try {
        await this.$confirm('确定要删除该员工吗？')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功！')
      } catch (error) {
        console.log(error)
      }
    },
    changePage(newPage){
      this.page.page = newPage
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index){
      const obj = EmployeeEnum.hireType.find( item => item.id === cellValue )
      return obj ? obj.value : '未知形式'
    },

    
  },
  
}
</script>

<style>

</style>

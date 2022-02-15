<template>
  <div class="dashboard-container">
    <div class="app-container">
    <!-- 放置内容 -->
    <el-card>
      <el-tabs>
        <el-tab-pane label="角色管理" >
          <!-- 左侧内容 -->
          <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" @click="addRoleFn">新增角色</el-button>
          </el-row>
       <!-- 表格 -->
            <el-table border="" :data="List">
              <el-table-column type="index" label="序号" width="120" align="center" />
              <el-table-column prop="name" label="角色名称" width="240" align="center"/>
              <el-table-column prop="description" label="描述" align="center" />
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
           <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination background layout="prev, pager, next"
               :total="page.total" 
               :page-size="page.pagesize"
               :current-page="page.page"
               @current-change="changePage"
               >
               </el-pagination>
           </el-row>
        </el-tab-pane>

        <el-tab-pane label="公司信息">
          <!-- 右侧内容 -->
          <!-- 放置表单组件 -->  
          <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"/>
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="企业名称">
              <el-input disabled style="width:400px" v-model="formDate.name" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input disabled style="width:400px" v-model="formDate.companyAddress"/>
            </el-form-item>
            <el-form-item label="电话">
              <el-input disabled style="width:400px" v-model="formDate.companyPhone"/>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input disabled style="width:400px" v-model="formDate.mailbox"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input disabled style="width:400px" v-model="formDate.remarks"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    </div> 
    <el-dialog :title="changeTitle" :visible="showDialog" @close="btnCancel">
      <el-form label-width="80px" :model="roleForm" :rules="rules" ref="roleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
         <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {getRoleList,getCompanyInfo,deleteRole,updateRole,getRoleDetail ,addRole} from '@/api/setting'
import {mapGetters} from 'vuex'
export default {
    data(){
      return {
        List:[],//承接数据的数组
        rules:{
          name:[{required:true,trigger:'blur',message:'角色名称不能为空'}]
        },
        page:{
          page:1,
          pagesize:4,
          total:0,
        },
        formDate:{
          // 公司信息
        },
        showDialog:false,//控制弹层的显示
        roleForm:{
          name:'',
          description:''
        },
        changeTitle:''
      }
    },
    computed:{
      ...mapGetters(['companyId'])
    },
    created(){
      this.getRoleList()
      this.getCompanyInfo()
    },
    methods:{
      async getRoleList(){
      const {rows,total} = await getRoleList(this.page)
      this.page.total = total 
      this.List = rows
      },
      async getCompanyInfo(){
      this.formDate = await getCompanyInfo(this.companyId)
      },
      changePage(newPage){
        this.page.page = newPage
        this.getRoleList()
      },
      async deleteRole(id){
        // this.$confirm('确认删除该角色吗？').then(() =>{
        // return deleteRole(id)//调用删除接口删除角色
        // this.getRoleList()
        // }).then(()=>{
        //   this.$message.success('角色删除成功！')
        // })
        try {
          await this.$confirm('确认删除该角色吗？')
          await deleteRole(id)
          this.getRoleList()
          this.$message.success('角色删除成功！')
        } catch (error) {
          
        }
      },
      async editRole(id){
        this.roleForm = await getRoleDetail(id) //调用接口获取角色详情数据 回写数据
        this.changeTitle = '编辑角色'
        this.showDialog = true //显示弹出层
      },
      addRoleFn(){
        this.changeTitle = '新增角色'
        this.showDialog =true
      },
      async btnOk(){
        try {
          await this.$refs.roleForm.validate()
          if(this.roleForm.id){
            //有id说明是编辑功能
          await updateRole(this.roleForm) //提交编辑后的数据
          this.$message.success('角色修改成功') //成功后的提示数据
          }else{
            // 没有id就是新增功能
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          }
          this.getRoleList() //重新拉取列表数据
          this.showDialog = false
        } catch (error) {
          console.log(error);
        }
      },
        btnCancel(){
        this.roleForm = {
          name:'',
          description:''
        }
        this.$refs.roleForm.resetFields()
        this.showDialog = false
      }
    }

}
</script>

<style>

</style>

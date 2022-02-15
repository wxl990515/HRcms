<template>
    <el-card class="page-tools">
        <el-row type="flex" justify="space-between" align="middle">
            <el-col>
                <!-- 有名字的就是具名插槽 没有名字的就是匿名插槽 -->
                <!-- 前置插槽-->
                <div class="before" v-if="showBefore">
                    <i class="el-icon-info" />
                    <slot name="before"/>
                </div>
            </el-col>
            <el-col>
              <el-row type="flex" justify="end">
                    <!-- 后置插槽 -->
                <slot name="after" />
              </el-row>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
    name: 'HrsaasIndex',
    props:{
       showBefore:{
        default:false,
        type:Boolean
       }
    },
    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="scss" scoped>
.page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
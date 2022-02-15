//负责注册全局自定义的组件
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
export default {
    install(Vue) {
        // 组件的注册
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    }
}
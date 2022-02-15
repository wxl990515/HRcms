import Layout from '@/layout'
//导出员工的路由规则
export default {
    //路由规则
    path: '/approvals', //路由地址
    // name: 'approvals', //给模块的以及路由加一个name属性 这个属性 我们会在做权限的时候用到
    component: Layout,
    children: [{
        path: '', //这里什么都不写表示 会显示/employees 也会显示二级默认路由
        component: () =>
            import ('@/views/approvals'),
        meta: { title: '审批', icon: 'tree-table' } //这里用title 是因为左侧导航会读取这里的title属性 用于菜单的显示名字
    }]
}
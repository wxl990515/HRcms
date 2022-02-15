import request from '@/utils/request'

//获取员工的简单列表
export function getEmployeeSimple() {
    return request({
        url: '/sys/user/simple'
    })
}
// 获取员工数据的综合列表
export function getEmployeeList(params) {
    return request({
        url: '/sys/user',
        params
    })
}
// 删除员工接口
export function delEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete'
    })
}
// 新增员工的表单校验
export function addEmployee(data) {
    return request({
        url: '/sys/user',
        method: 'post',
        data
    })
}
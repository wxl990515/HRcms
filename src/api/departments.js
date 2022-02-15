import request from '@/utils/request'

//获取组织架构的数据
export function getDepartments() {
    return request({
        url: '/company/department'
    })
}

// 删除组织结构的部门
export function delDepartments(id) {
    return request({
        url: `/company/department/${id}`,
        method: 'delete',
    })
}
// 编辑组织结构的部门
export function editDepartments(id) {
    return request({
        url: `/company/department/${id}`,
        method: 'put'
    })
}

//   新增部门接口
export function addDepartments(data) {
    return request({
        url: '/company/department',
        method: 'post',
        data
    })
}

// 获取部门详情
export function getDepartDetail(id) {
    return request({
        url: `/company/department/${id}`
    })
}
//编辑部门详情
export function updateDepartments(data) {
    return request({
        url: `/company/department/${data.id}`,
        method: 'put',
        data
    })
}
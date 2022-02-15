import request from '@/utils/request'
//登录接口
export function login(data) {
    return request({
        url: '/sys/login',
        method: 'POST',
        data
    })
}
//获取用户的基本资料
export function getUserInfo() {
    return request({
        url: 'sys/profile',
        method: 'POST',
    })
}
//获取用户头像  获取用户信息，完全是为了显示头像  根据用户id查询用户基本信息
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}
export function getInfo(token) {}
export function logout() {}
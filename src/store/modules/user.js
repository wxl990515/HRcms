import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
//状态
const state = {
    token: getToken(), //设置token共享状态 刚初始化vuex的时候 就先从缓存中读取
    userInfo: {} //定义一个空对象
}
const mutations = {
    setToken(state, token) {
        state.token = token //将数据设置给vuex
            //同步给缓存，vuex数据持久化
        setToken(token)
    },
    removeToken(state) {
        state.token = null //将vuex的数据置空
            //同步给缓存
        removeToken()
    },
    setUserInfo(state, res) {
        //更新state里面的空对象
        state.userInfo = res //里面的数据是响应式数据
    },
    removeUserInfo(state) {
        state.userInfo = {} //这里不能设置为null.不然会引起报错
    }
}
const actions = {
    async login(context, data) {
        //调用api接口
        const res = await login(data) //拿到token
        context.commit('setToken', res) //设置token
            //拿到token说明登录成功
            //设置当前时间戳
        setTimeStamp()
    },
    async getUserInfo(context) {
        const res = await getUserInfo()
            //获取用户基本信息
        const baseInfo = await getUserDetailById(res.userId)
        const obj = {...res, ...baseInfo }
        context.commit('setUserInfo', obj) //将数据提交到 vuex数据中
        return res //后续做权限的时候用不到obj里面的类容，所以只需要返回res就可以了
    },
    logout(context) {
        //删除token
        //删除用户资料
        context.commit('removeToken') //同时删除了vuex和缓存中的token
        context.commit('removeUserInfo') //删除了用户信息
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
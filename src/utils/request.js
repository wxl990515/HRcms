import axios from "axios"
import { Message } from "element-ui"
import store from "@/store"
import { getTimeStamp } from "@/utils/auth"
import router from '@/router'
const Timeout = 3600 //定义超时时间
const service = axios.create({
        baseURL: process.env.VUE_APP_BASE_API, // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
        // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
        timeout: 5000 //超时时间

    })
    //请求拦截器
service.interceptors.request.use(config => {
        //config是请求的配置信息
        //注入token
        if (store.getters.token) {
            //只有在有token的情况下才有必要去检查时间戳 是否超时
            if (IsCheckTimeOut()) {
                // 如果为true,表示token已经过期了
                store.dispatch('user/logout') //调用登出操作
                    //跳转到登录页
                router.push('/login')
                return Promise.reject(new Error('页面已经失效了，请重新登录！'))
            }
            config.headers['Authorization'] = `Bearer ${store.getters.token}`
        }
        return config //是必须返回的
    }, error => {
        return Promise.reject(error)
    })
    //响应拦截器
service.interceptors.response.use(response => {
        const { success, message, data } = response.data //解构响应回来的数据
        if (success) {
            return data
        } else {
            Message.error(message) //提示错误信息
            return Promise.reject(new Error(message)) //业务已经错了 不能进then 应该进catch
        }
    }, error => {
        Message.error(error.message) //提示错误信息
        return Promise.reject(error) //返回执行错误，让当前的执行链跳出成功 直接进入catch
    })
    //检查是否超时
    //超时的逻辑  当前时间 - 缓存中的时间 是否大于时间差
function IsCheckTimeOut() {
    var currentTime = Date.now() // 当前时间戳
    var timeStamp = getTimeStamp() // 缓存时间戳
    return (currentTime - timeStamp) / 1000 > Timeout
}
export default service
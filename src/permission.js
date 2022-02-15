import router from '@/router' //引入路由实例
import store from '@/store' //引入store实例
import nprogress from 'nprogress' //引入一条进度条
import 'nprogress/nprogress.css' //引入进度条样式
//不需要导出，因为只需要代码执行
//前置守卫
// next是前置守卫必须执行的钩子  next必须执行 如果不执行 页面就会死掉
//next（）是放过
//next（false）跳转终止
// next(地址) 跳转到某个页面
//自定义一个白名单
const whiteList = ['/login', '/404'] //也就是不需要token就能访问的页面
router.beforeEach(async(to, from, next) => {
        nprogress.start() //开启进度条
        if (store.getters.token) { //有token的情况
            //才能去获取资料
            //有token并且判断如果是登录页则跳转到主页
            if (to.path == '/login') {
                next('/')
            } else { //否则原地放行
                //放过的时候才获取用户资料，但不是每次都获取
                //如果当前的vuex中有用户的id才表示已经资料了 如果没有id 则获取资料
                if (!store.getters.userId) {
                    await store.dispatch('user/getUserInfo') //这里必须强制等到资料获取完了以后才能放行
                }
                next()
            }
        } else { //没有token的情况
            if (whiteList.indexOf(to.path) > -1) { //如果在白名单，则原地放行
                next()
            } else { //判断如果不在白名单，则跳转回登录页
                next('/login')
            }
        }
        nprogress.done() //解决了手动跳转登录页，进度条不关闭的问题
    })
    //后置守卫
router.afterEach(() => {
    nprogress.done() //关闭进度条
})
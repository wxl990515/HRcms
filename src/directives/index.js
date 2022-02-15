//负责所有的自定义指令
export const imagError = {
    inserted(dom, options) {
        //options 是变量中的变量的解释 其中有一个属性 叫value
        //dom表示当前指令作用的对象
        //dom认为此时就是作为在图片上
        //当图片有地址，但是地址没有加载成功的时候 会报错 会触发图片的一个事件 =>onerror
        dom.onerror = function() {
            //当图片出现异常时 会将配置的默认的图片设置为图片的内容
            //dom可以注册onerror事件
            dom.src = options.value //这里不能写死 
        }
    }

}
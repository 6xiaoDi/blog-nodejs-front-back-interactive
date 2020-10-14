let utils = {
    // a函数(但是把其当做对象来用)      b原型     context 保护this执行
    extends(a,b,context){
        for(let key in b){
            // for in 会循环原型链里的内容，因此最好判断一下原型链上有没有key，要是原型链有其他东西我们不去管它（不进逻辑）
            if(b.hasOwnProperty(key)){
                if(typeof b[key]==='function'){
                    // 函数；
                    a[key] = b[key].bind(context);
                }else{
                    // 属性；
                    a[key] = b[key]
                }
            }
        }
    }
}

class Axios{
    constructor(){
        this.test = "一些属性";
        this.interceptors = {
            request:new InterceptorManager(),
            response:new InterceptorManager()
        }
        this.adapter = new Adapter();
    }
    request(config){
        // 组装队列
        let chain = [this.dispatchXhr.bind(this),undefined];   // 网络请求放中间
        // 发现越往后发的request请求拦截器，最新打印
        this.interceptors.request.handles.forEach(interceptor=>{
            // 在队列之前添加
            chain.unshift(interceptor.fulfilled,interceptor.rejected);
        })

        this.interceptors.response.handles.forEach(interceptor=>{
            // 在队列尾部添加
            chain.push(interceptor.fulfilled,interceptor.rejected);
        })
        // 异步执行队列
        let primose = Promise.resolve(config);
        while(chain.length>0){
            // 一次执行两个，再删除，then再反复执行！
            primose = primose.then(chain.shift(),chain.shift());
        }
        return primose;
    }
    // 触发网络请求
    dispatchXhr(config){
        // 判断环境？特殊的变量；
        // 如客户端：我们可以在浏览器的控制台用window，我们再nodejs的控制台环境中打，是没有window这个属性的，而有process
        if(typeof process !=='undefined'){
            // 服务端（node端）
            return this.adapter.http(config);
        }else{
            // 客户端
            return  this.adapter.xhr(config);
        }
    }
}

// 适配器：adapter  适配node端和js端；
class Adapter{
    http(config){
        console.log("node端执行了",config);
    }
    xhr(config){
        // 客户端请求；
        return new Promise(resolve=>{
            let xhr = new XMLHttpRequest();
            // 解构config
            let {url="",data=null,method='get',headers={}} = config;
            xhr.open(method,url,true);
            xhr.onload = function(){
                // 对返还做包装，我们这里就不包装了
                resolve(xhr.responseText);
            }
            xhr.send(data);
        })
    }
}

// 拦截器搜集器
class InterceptorManager{
    constructor(){
        this.handles = []; // 队列
    }
    // fulfilled 成功 rejected 失败
    use(fulfilled,rejected){
        this.handles.push({
            fulfilled,
            rejected
        });
    }
}

let methodsArr = ['get',"post","put","delete","options","head"];
methodsArr.forEach(method=>{
    Axios.prototype[method] = function(config){
        config.method = method;
        return this.request(config);
    }
})

// 创建实例
function createInstance(){
    let context = new Axios();
    let instance = context.request.bind(context);
    // 把原型里的方法混入到instance里；
    utils.extends(instance,Axios.prototype,context);
    utils.extends(instance,context); // 将构造函数的属性混入进去
    console.dir(instance);
    return instance
}
let axios = createInstance();
// 在html中引入是可以直接拿到axios变量的，但是在js中，作为node端使用的话，它是通过commonJs做的模块化，它是拿不到axios变量的。这里只能将axios变量导出出去！
if(typeof process !=='undefined'){
    // 服务端
    module.exports = axios;
}
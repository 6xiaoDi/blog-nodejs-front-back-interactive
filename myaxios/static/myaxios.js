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
        // 在nodejs端发送请求的；（服务端代理）
        // 代理转发（相当于客户端模拟服务端）
        return new Promise((resolve, reject) => {
            const http = require("http");
            // const https = require("https")

            // url也是原生模块，如它可以把http://localhost:4000/axios这样地址（协议、域名、路由、端口等）拆分到一个对象中去
            const urls = require("url");
            let { data = null, url, method = 'get', params, headers = {} } = config;

            let pathObj = urls.parse(url)

            // http.request的配置项
            let options = {
                host: pathObj.hostname, // 服务端
                port: pathObj.port, // 端口号
                path: pathObj.path, // 路径
                method: config.method.toUpperCase(), // 方法
                headers: headers // 头部
            };

            // 配置项参考配置如下注释
            // let options = {
            //     host:'localhost',
            //     port:3000,
            //     path:'/atest',
            //     method:'POST',
            //     headers:{
            //         "content-type":"application/json"
            //     }
            // }

            // http.request方法就是原生js发送服务端代理，即代理请求，它可以请求其他服务器（如node、java等的服务器也可）
            let request = http.request(options, res => {
                let reslut = "";

                // 结果通过“流”获取，不停地监听“data”事件，拿到的数据都放在data事件中,chunk就相当于每一个小方块，每一次流量
                res.on("data", chunk => {
                    reslut += chunk;
                })

                // 最终在"end"事件中拿到结果
                // 原生post接收数据也是同样的"流"的思想,但是如对拿到的post数据之后,还需要进行处理,buff转换成字符串,再转换为对象,比较麻烦!
                res.on("end", () => {
                    // 发送完结果在这里拿到，如果有想发送的可通过req.write
                    console.log(reslut.toString())
                    resolve(JSON.parse(reslut.toString()));
                })
            })
            // 发生错误就进入这里了
            request.on("error", err => {
                reject(err);
            })
            // 请求完毕需要end()
            request.end();
        })
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
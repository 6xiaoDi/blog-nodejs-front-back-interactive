let utils = {
    // a函数(但是把其当做对象来用)      b原型
    extends(a,b){
        for(let key in b){
            // for in 会循环原型链里的内容，因此最好判断一下原型链上有没有key，要是原型链有其他东西我们不去管它（不进逻辑）
            if(b.hasOwnProperty(key)){
                if(typeof b[key]==='function'){
                    // 函数；
                    a[key] = b[key]
                }
            }
        }
    }
}

class Axios{
    constructor(){
    }
    request(config){
        return new Promise(resolve=>{
            console.log("发送请求",config);
            resolve("发送请求");
        })
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
    let instance = context.request;
    // 把原型里的方法混入到instance里；
    utils.extends(instance,Axios.prototype);
    return instance
}
let axios = createInstance();
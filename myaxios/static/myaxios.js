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
    }
    request(config){
        return new Promise(resolve=>{
            let xhr = new XMLHttpRequest();
            // 解构config
            let {url="",data=null,method='get',headers={}} = config;
            xhr.open(method,url,true);
            xhr.onload = function(){
                // 对返还做包装（config和xhr都在其内等），我们这里就不包装了
                resolve(xhr.responseText);
            }
            xhr.send(data);
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
    utils.extends(instance,Axios.prototype,context);
    utils.extends(instance,context); // 将构造函数的属性混入进去
    console.dir(instance);
    return instance
}
let axios = createInstance();
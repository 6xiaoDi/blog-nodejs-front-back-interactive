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
console.dir(Axios);

// 创建实例
function createInstance(){
    let context = new Axios();
    let instance = context.request;
    return instance
}
let axios = createInstance();
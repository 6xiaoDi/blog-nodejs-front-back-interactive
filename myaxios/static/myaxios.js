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

// 创建实例
function createInstance(){
    let context = new Axios();
    let instance = context.request;
    return instance
}
let axios = createInstance();
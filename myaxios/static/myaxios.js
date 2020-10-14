class Axios{
    constructor(){
    }
    request(config){
        console.log("发送请求",config)
    }
}

// 创建实例
function createInstance(){
    let context = new Axios();
    let instance = context.request;
    return instance
}
let axios = createInstance();
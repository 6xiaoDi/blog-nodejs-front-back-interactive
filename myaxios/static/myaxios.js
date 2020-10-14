class Axios{
    constructor(){
    }
    request(){
        console.log("发送请求")
    }
}

// 创建实例
function createInstance(){
    let context = new Axios();
    let instance = context.request;
    return instance
}
let axios = createInstance();
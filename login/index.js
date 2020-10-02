const Koa = require("koa");
const static = require("koa-static");
const Router = require("koa-router");
let app = new Koa();
app.use(static(__dirname+"/static"));
let router = new Router();

const usersData = require("./data/users.json");
console.log(usersData);

router.get("/",(ctx,next)=>{
    ctx.body = "hello";
})
router.get("/checkUserName",(ctx,next)=>{
    // 接收get参数
    console.log(ctx.query);
    // 向Ajax返回参数
    // ctx.body = "hello";
    // 注意：require会自动将json转为对象数组，无需使用JSON.parse方法
    let res =  usersData.find(v => v.username === ctx.query.username);
    if(res){
        // 在node中会自动将以下对象转为json，由xhr.responseText接收到
        ctx.body = {
            status:1,
            info:"用户名正确"
        };
    }else{
        ctx.body = {
            status:2,
            info:"用户名错误"
        };
    }
})
router.get("/get/:id",(ctx,next)=>{
    console.log(ctx.params);
    ctx.body = {
        status:1,
        info:"请求成功"
    }
})
app.use(router.routes());
app.listen(3000);
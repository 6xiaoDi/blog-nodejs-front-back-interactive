const Koa = require("koa");
const static = require("koa-static");
const Router = require("koa-router");
let app = new Koa();
let router = new Router();
app.use(static(__dirname+"/static"));

router.get("/",(ctx,next)=>{
    ctx.body = "hello run at 4000";
})

router.get("/getAjax",(ctx,next)=>{
    console.log("4000 run ");
    let cb = ctx.query.cb;
    // 使回调函数发送到客户端html页面上执行
    // ctx.body = `${cb}(20)`;
    let obj = {
        a:20,
        b:20
    };
    ctx.body = `${cb}(${JSON.stringify(obj)})`;
})

app.use(router.routes());
app.listen(4000);
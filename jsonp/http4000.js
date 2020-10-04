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
    console.log(ctx.query.name);
    // ctx.body = {
    //     name:"李四4000",
    //     age:20
    // }
    // 返还js语句给前端，前端即可自动执行
    ctx.body = "var a = 20";
})

app.use(router.routes());
app.listen(4000);
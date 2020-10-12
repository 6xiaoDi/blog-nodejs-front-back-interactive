const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
let app = new Koa();
let router = new Router();
app.use(static(__dirname+"/static"));
// 对所有的预检请求都可以通过（给任何返回，它就默认是可以通过的）
router.options("/:splat*",ctx=>{
    // 允许cors跨域；
    ctx.set("Access-Control-Allow-Origin","http://localhost:3000")
    ctx.body = "";
})

router.get("/",ctx=>{
    ctx.body = "some value... at 4000";
});

router.post("/getData",ctx=>{
    console.log("请求过来了");
    // 允许跨域；允许地址
    // ctx.set("Access-Control-Allow-Origin","*")
    ctx.set("Access-Control-Allow-Origin","http://localhost:3000")
    ctx.body = {
        info:"I am at 4000"
    };
});
app.use(router.allowedMethods());
app.use(router.routes());
app.listen(4000);
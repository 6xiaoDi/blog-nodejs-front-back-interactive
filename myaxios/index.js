const Koa = require("koa");
const Router = require("koa-router");
const koaBody = require("koa-body");
const static = require("koa-static");
let app = new Koa();
let router = new Router();
app.use(koaBody());
app.use(static(__dirname+"/static"));
router.get("/", ctx=>{
    ctx.body = "some value......";
})

router.get("/myaxios",ctx=>{
    ctx.body = {
        info:"myaxios get返还数据"
    }
})

router.get("/axios",ctx=>{
    console.log("axios get请求过来");
    ctx.body = {
        info:"get返还数据"
    }
})

app.use(router.routes());
app.listen(4000);
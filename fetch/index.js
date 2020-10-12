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

router.get("/get",ctx=>{
    console.log("get请求过来");
    let res = ctx.request.query;  // querystring形式
    console.log(res);
    ctx.body = {
        info:"get返还数据"
    }
})
router.post("/post",ctx=>{
    console.log(ctx.request.body);
    ctx.body = {
        info:"post返还数据"
    };
})

router.get("/test/:id",ctx=>{
    let res =   ctx.params.id  // param形式
//    ctx.request.query  querystring :查询参数；name=zhangsan&age=20
    console.log(res);
    ctx.body = "some value....";
})

app.use(router.routes());
app.listen(4000);
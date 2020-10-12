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
    // 允许设置的头部信息；
    // 注意与正式请求一致
    ctx.set("Access-Control-Allow-Headers","Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild")
    // 允许前端获取的头部
    // 如果是多个可在第二个参数中用逗号隔开
    ctx.set("Access-Control-Expose-Headers","Date,Access-Control-Allow-Headers")
    //允许前端请求的方法 ；
    ctx.set("Access-Control-Allow-Methods",'PUT, POST, GET, DELETE, OPTIONS');
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
    // 允许设置的头部信息；（如果允许还有多个的话，可继往后追加），除此之外的头部信息，是不允许的，前端需提前与后端商量
    // 注意预检请求也得同步设置
    ctx.set("Access-Control-Allow-Headers","Content-type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild")
    // 允许前端获取的头部
    // 如果是多个可在第二个参数中用逗号隔开
    ctx.set("Access-Control-Expose-Headers","Date,Access-Control-Allow-Headers")
    //允许前端请求的方法 ；
    ctx.set("Access-Control-Allow-Methods",'PUT, POST, GET, DELETE, OPTIONS');
    ctx.body = {
        info:"I am at 4000"
    };
});

app.use(router.routes());
app.listen(4000);
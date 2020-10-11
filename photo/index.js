const Koa = require("koa");
const fs = require("fs");
const static = require("koa-static");
const Router = require("koa-router");
// 接收post参数及上传的文件；
const koaBody = require("koa-body");

const users = require("./data/users.json");
const images = require("./data/images.json");

let app = new Koa();
let router = new Router();
app.use(static(__dirname+"/static"));
app.use(koaBody({
    multipart:true
}))
router.get("/",ctx=>{
    ctx.body = "some value";
})

// 上传接口
router.post("/upload",ctx=>{
    fs.createReadStream(ctx.request.files['img'].path).pipe(fs.createWriteStream("static/imgs/" +      ctx.request.files['img'].name))
    //将图片路径存入images.json文件
    let uid = ctx.cookies.get("uid");
    let imageData = {
        imgUrl:`imgs/${ctx.request.files['img'].name}`,
        imgName:ctx.request.files['img'].name,
        uid
    }
    images.push(imageData);
    let res = fs.writeFileSync("data/images.json",JSON.stringify(images));
    ctx.body = res;

})

router.get("/checkUserName", (ctx, next) => {
    let res = users.find(v => v.username == ctx.query.name);
    if (res) {
        ctx.body = {
            status: 1,
            info: "用户名正确"
        }
    } else {
        ctx.body = {
            status: 2,
            info: "用户名错误"
        }
    }
})

// 用户登录验证
router.post("/checkUser",(ctx,next)=>{
    let res =  users.find(v=>(v.username==ctx.request.body.username && v.pwd==ctx.request.body.pwd));
    if(res){
        ctx.cookies.set("uid",res.uid,{
            maxAge:30*24*60*60*1000,
            overwrite:true,
            httpOnly:true,
        })
        ctx.redirect("/photo.html");
    }else{
        ctx.redirect("/login.html");
    }
})

// 查询相册数据做对应呈现；
router.get("/getImageData",(ctx,next)=>{
    let uid = ctx.cookies.get("uid");
    // 查询当前用户上传的所有图片（通过uid进行用户区分）
    let res =  images.filter(v=>v.uid==uid);
    ctx.body = res;
})

app.use(router.routes());
app.listen(3000);
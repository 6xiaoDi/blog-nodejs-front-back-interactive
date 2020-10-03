const Koa = require("koa");
const static = require("koa-static");
const Router = require("koa-router");
const koaBody = require("koa-body");
const fs = require("fs");
let app = new Koa();
app.use(static(__dirname+"/static"));
//  post使用
app.use(koaBody());

app.use(koaBody({
    multipart:true  // 允许接收文件
}));

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

router.post("/post",(ctx,next)=>{
    console.log(ctx.request.body);
    ctx.body = {
        status:1,
        info:"post请求成功"
    }
})

router.get("/xml",(ctx,next)=>{
    // ctx.set("content-type","text/xml");
    ctx.body = `<?xml version='1.0' encoding='utf-8' ?>
                    <books>
                        <nodejs>
                            <name>nodejs实战</name>
                            <price>56元</price>
                        </nodejs>
                        <react>
                            <name>react入门</name>
                            <price>50元</price>
                        </react>
                    </books>
                `
})

router.post("/upload",(ctx,next)=>{
    console.log(ctx.request.body);  // 参数传递
    console.log(ctx.request.files.img); // 对应form.append("img",file);
    let fileData =  fs.readFileSync(ctx.request.files.img.path);
    // 1、写入路径+文件名 2、读取的文件对象
    fs.writeFileSync("static/imgs/"+ctx.request.files.img.name,fileData);
    ctx.body = "请求成功";
})

app.use(router.routes());
app.listen(3000);
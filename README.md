## 基于NodeJs的mongodb基本操作
## 1. NodeJs简介
#### node是什么
 - node 就是JavaScript语言在服务器端的运行环境
 - 所谓运行环境的意思有两层：
   - 首先，javascript语言通过node在服务器运行，在这个意义上，node有点像JavaScript虚拟机
   - 在服务端，java是运行在java vm上,C#运行在.net framework 上，JavaScript运行在node上，因此这三者之间是存在竞争关系的
   - 其次，node提供大量工具库，是JavaScript语言与操作系统互动，比如读写文件，新建子进程等等，在这个意义上node又是JavaScript的工具库，主要是以前js环境办不到的事，例如文件操作，网络操作，系统操作等等
#### 为什么选择node
- JavaScript目前是开发行业中最火热的一门语言，会的人很多
- 据node.js创始人ryan dahl 回忆，他最初希望采用ruby，但是ruby的虚拟机效率不行。
- 因此 ，是node选择了JavaScript不是JavaScript发展出来了一个node。
#### node的实现
 - node内部采用chrome的V8引擎作为JavaScript语言解释器。
 - 通过自行开发的libuv库调用系统资源
#### node的用途
- node 开发的application处理用户的所有请求和给用户响应。
- node作为客户端和服务器的中间层 分发调用服务接口，渲染html页面
## 2. Mongodb简介
> MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

[关系型和非关系型数据库的区别](https://blog.csdn.net/longxingzhiwen/article/details/53896702)

## 3. 基于NodeJs操作Mongodb简介
 1、安装Mongodb,[windows环境下的安装](https://blog.csdn.net/heshushun/article/details/77776706)；[Mac环境下安装](https://blog.csdn.net/thatway_wp/article/details/79362261)
 
 2、启动数据库mongod --dbpath D:\software\MongoDB\data\db --port=27017
 
 3、启动数据可视化工具
 
 4、使用express启动一个最简单的node服务
 
```JavaScript
const express  = require('express') ;
const chalk  = require('chalk');
const app = express();
app.get('/',function(req,res,next){
    res.send('api根目录');
});
app.listen(8081, () => {
    console.log(
        chalk.green(`成功监听端口：${8081}`)
    )
});
```

5、基本需求，实现账号、密码的注册和登录。设计表结构实体。表结构设计工具：astah professional、PowerDesigner

```JavaScript
'use strict';
const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    admin_id:Number,//管理员id
    admin_name:String,//管理员姓名
    admin_pass_word:String,//管理员密码
    admin_register_time: String//管理员注册时间
});
const Admin = mongoose.model('Admin',adminSchema);
export default  Admin;

```

6、node链接mongodb

```
const express  = require('express') ;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const chalk  = require('chalk') ;
const  cookieParser  =  require('cookie-parser');
const session  =  require('express-session');
import common from './utils/common';
import responseData from './utils/responseData';
const dtime = require('time-formater');
import AdminModel from './schemas/admin/admin.js';
const app = express();
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'express:4.15.2');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/',function(req,res,next){
    res.send('api根目录');
});
app.post('/call/login',function(req,res,next){
    let t = this;
    var paramJson =  JSON.parse(req.body.paramJson);
    var sendData = {};
    if(common.isEmptyObject(paramJson)||common.isNothing(paramJson)){
        //传入的是空对象或者没有传值
        sendData = responseData.createResponseData({
            message:'参数有误',
            data:'NO DATA',
            code:0,//登录失败
            pk:0
        });
        res.send(sendData);
    }else {
        let name = paramJson.adminName;
        let originalPassWord = paramJson.adminPassWord;
        let passWord = common.encryption(originalPassWord);
        const admin = AdminModel.findOne({'admin_name': name}, function (error, userInfo) {
            if (userInfo) {
                if (userInfo.admin_pass_word === passWord) {
                    //密码一致
                    sendData = responseData.createResponseData({
                        message: '登录成功',
                        data: {
                            adminName: userInfo.admin_name
                        },
                        code: 2,//登录成功
                        pk: userInfo.id
                    });
                    res.send(sendData);
                } else {
                    //密码不一致
                    sendData = responseData.createResponseData({
                        message: '账号或密码不正确',
                        data: 'NO DATA',
                        code: 1,//密码不正确
                        pk: 0
                    });
                    res.send(sendData);
                }
            } else {
                sendData = responseData.createResponseData({
                    message: '账号或密码不正确',
                    data: 'NO DATA',
                    code: 1,//密码不正确
                    pk: 0
                });
                res.send(sendData);
            }
        });
    }
});
app.post('/call/register',function(req,res,next){
    var paramJson =  JSON.parse(req.body.paramJson);
    var sendData = {};
    if(common.isEmptyObject(paramJson)||common.isNothing(paramJson)){
        //传入的是空对象或者没有传值
        sendData = responseData.createResponseData({
            message:'注册管理员失败',
            data:'NO DATA',
            code:0,
            responsePk:0
        });
        res.send(sendData);
    }else{
        let name = paramJson.registerName;
        const  admin = AdminModel.findOne({'admin_name':name},function(error,userInfo){
            if(error){
                sendData = responseData.createResponseData({
                    message:'注册管理员失败',
                    data:'NO DATA',
                    code:0,
                    pk:0
                });
                res.send(sendData);
            }else{
                if(userInfo){
                    sendData = responseData.createResponseData({
                        message:'该用户已经存在',
                        data:'NO DATA',
                        code:1,
                        pk:userInfo.id
                    });
                    res.send(sendData);
                }else{

                    var timestamp = (new Date()).getTime();
                    var datestr = dtime().format('YYYY-MM-DD HH:mm:ss');
                    var passWord = paramJson.registerPassWord;
                    let encryptPassword = common.encryption(passWord);
                    const newAdmin = {
                        id:timestamp,
                        admin_name:name,//管理员姓名
                        admin_pass_word:encryptPassword,//管理员密码
                        admin_register_time: datestr//管理员注册时间
                    };
                    AdminModel.create(newAdmin);
                    sendData = responseData.createResponseData({
                        message:'注册成功',
                        data:{
                            adminId:timestamp,
                            adminName:name,
                            registerTime:datestr
                        },
                        code:2,//注册成功
                        pk:timestamp
                    });
                    res.send(sendData);
                }

            }
        });
    }
});
mongoose.connect('mongodb://localhost:27017/shareMongodb',{useMongoClient:true},function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.use(cookieParser());
        app.use(session({
            name: 'SID',
            secret: 'SID',
            resave: true,
            saveUninitialized: false,
            cookie:  {
                httpOnly: true,
                secure:   false,
                maxAge:   365 * 24 * 60 * 60 * 1000,
         }
        }));
        app.listen(8081, () => {
            console.log(
                chalk.green(`成功监听端口：${8081}`)
            )
        });
    }
});
```
7、登录、注册前后端逻辑实现


## 4. 项目整理优化

```JavaScript
const express  = require('express') ;
const config  = require('config-lite') ;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const chalk  = require('chalk') ;
import router from './routes/index.js';
const  cookieParser  =  require('cookie-parser');
const session  =  require('express-session');
const app = express();
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'express:4.15.2');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/',function(req,res,next){
    res.send('api根目录');
});
mongoose.connect('mongodb://localhost:27017/shareMongodb',{useMongoClient:true},function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.use(cookieParser());
        app.use(session({
            name: config.session.name,
            secret: config.session.secret,
            resave: true,
            saveUninitialized: false,
            cookie: config.session.cookie
        }))
        router(app);
        app.listen(config.port, () => {
            console.log(
                chalk.green(`成功监听端口：${config.port}`)
            )
        });
    }
});

```



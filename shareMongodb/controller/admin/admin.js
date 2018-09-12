'use strict';
import common from '../../utils/common';
import responseData from '../../utils/responseData';
const dtime = require('time-formater');
const crypto  = require('crypto');
import AdminModel from '../../schemas/admin/admin.js';
class Admin {
    constructor(){
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.encryption = this.encryption.bind(this);
    }
    async register(req,res,next){
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
    }
    async login(req,res,next){
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
    }
    async getUserList(req,res,next){
        const  admin = AdminModel.find({},function(error,userList){
            var sendData = {};
            if(error){
                sendData = responseData.createResponseData({
                    message:'获取列表数据失败',
                    data:'NO DATA',
                    code:0,
                    pk:0
                });
                res.send(sendData);
            }else {
                if (userList) {
                    sendData = responseData.createResponseData({
                        message: '用户列表数据',
                        data: userList,
                        code: 1,
                        pk: 0
                    });
                    res.send(sendData);
                }
            }
        })
    }
    encryption(password){
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword
    }
    Md5(password){
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }

}
export default  new Admin();
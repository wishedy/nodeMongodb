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
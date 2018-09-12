<template>
  <el-container>
    <el-header class="header">基于NodeJs的mongodb基本操作</el-header>
    <el-main class="main" center>
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm" v-show="!registerOnOff">
        <!--<i class="el-icon-close"></i>-->
        <el-form-item label="账号" prop="pass">
          <el-input type="email" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          <el-button @click="resetForm('ruleForm2')">重置</el-button>
          <el-button type="info" @click.stop="goRegister">注册</el-button>
        </el-form-item>
      </el-form>
      <el-form  :model="registerForm" status-icon :rules='registerRules' ref="registerForm" label-width="100px" class="demo-ruleForm"  v-show="registerOnOff">
        <el-form-item label="姓名" prop="registerName">
          <el-input type="name" v-model="registerForm.registerName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"  prop="registerPassWord">
          <el-input type="password" v-model="registerForm.registerPassWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click.stop="submitRegisterForm('registerForm')">提交</el-button>
          <el-button @click="resetForm('registerForm')">重置</el-button>
          <el-button type="info" @click.stop="goLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
  import {mapActions} from 'vuex';
  import regularTest from '../utils/regularTest.js';
  import axios from 'axios';
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          console.log(this.ruleForm2.checkPass);
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }  else {
          callback();
        }
      };
      var validateName = (rule,value,callBack)=>{
        if(value===''){
          callBack(new Error('请输入名字'));
        }else{
          console.log(this.registerForm.registerName,value,regularTest.testName(value));
          if(!regularTest.testName(value)){
            callBack(new Error('请输入正确的名字'));
          }else{
            this.$refs.registerForm.validateField('registerPassWord');
            callBack();
          }
        }
      };
      var validatePassWord = (rule,value,callBack)=>{
        if(value===''){
          callBack(new Error('请输入密码'));
        }else{
          callBack();
        }
      };
      return {
        options: [{
          value: '0',
          label: '超级管理员'
        }, {
          value: '1',
          label: '管理员'
        }],
        ruleForm2: {
          pass: '',
          checkPass: ''
        },
        registerForm:{
          registerName:'',
          registerPassWord:''
        },
        registerRules:{
          registerName:[
            {
              validator:validateName,trigger:'blur'
            }
          ],
          registerPassWord:[
            {
              validator:validatePassWord,trigger:'blur'
            }
          ]
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        registerOnOff:false
      };
    },
    methods: {
      submitRegisterForm(formName){
        let t = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            t.registerAdmin()
          } else {
            t.$message.error('请填写正确的注册信息');
            return false;
          }
        });
      },
      login(){
        let t = this;
      },
      registerAdmin(){
        let t = this;
        axios({
          method: 'post',
          url: '/call/admin/register',
          transformRequest: [function(data) {
            return "paramJson=" + JSON.stringify(data);
          }],
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: {
            registerName:t.registerForm.registerName,//管理员姓名
            registerPassWord:t.registerForm.registerPassWord//
          }
        }).then(function(response) {
          let reqData = response.data;
          if(reqData.responseObject.responsePk>0){
            t.$message({
              type: 'success',
              message: '管理员注册成功!'
            });
            t.registerOnOff = false;
            t.resetForm('registerForm');
          }
          console.log(response.data);
        });
      },
      changeGrade(state){
        let t = this;
        console.log(state);
      },
      checkLogin(){
        let t = this;
        axios({
          method: 'post',
          url: '/call/admin/login',
          transformRequest: [function(data) {
            return "paramJson=" + JSON.stringify(data);
          }],
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: {
            adminName:t.ruleForm2.pass,
            adminPassWord:t.ruleForm2.checkPass
          }
        }).then(function(response) {
          let reqData = response.data;
          if(reqData.responseObject.responsePk){
            t.login(reqData.responseObject.responseData.adminName);
            localStorage.setItem('userName',reqData.responseObject.responseData.adminName);
            localStorage.setItem('adminId',reqData.responseObject.responsePk);
            t.$message({
              type: 'success',
              message: '登录成功!'
            });
          }else{
            if(reqData.responseObject.responseCode==1){
              t.$message.error('请填写正确的用户名或密码');
            }else if(reqData.responseObject.responseCode==0){
              t.$message.error('登录参数有误');
            }
          }
        });
      },
      goRegister(){
        let t = this;
        t.registerOnOff = true;
      },
      goLogin(){
        let t = this;
        t.registerOnOff = false;
      },
      submitForm(formName) {
        let t = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            t.checkLogin()
          } else {
            t.$message.error('请填写正确的登录信息');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .header{
    font-family: MicrosoftYaHei-Bold;
    font-size: 32px;
    color: #000000;
    line-height: 60px;
    text-align: center;
  }
  .main{
    background: #1BBC9B;
    width: 100%;
    height: 100%;
    top:60px;
    position: fixed;
    z-index: 2000;
    color: #df0d4c;
    .el-form{
      width: 356px;
      padding: 30px 60px 30px 0;
      background: #ffffff;
      position: relative;
      border-radius: 10px;
      left: 50%;
      top:50%;
      transform: translate(-50%,-50%);
      .el-icon-close{
        position: absolute;
        right:0;
        top:0;
        font-size: 24px;
        padding: 5px;

      }
    }
  }
</style>

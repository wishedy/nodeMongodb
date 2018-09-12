const crypto  = require('crypto');
class common {
    constructor(){
        this.isEmptyObject = this.isEmptyObject.bind(this);
        this.isNothing = this.isNothing.bind(this);
        this.toHump = this.toHump.bind(this);
        this.toLine = this.toLine.bind(this);
        this.encryption = this.encryption.bind(this);
        this.Md5 = this.Md5.bind(this);
    }
    //空对象判断方法
    isEmptyObject(obj){
        for(let n in obj){return false}
        return true;
    }
    isNothing(val){
        if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
            return true;
        }else{
            return false;
        }
    }
    // 下划线转换驼峰
    toHump(name) {
        return name.replace(/\_(\w)/g, function(all, letter){
            return letter.toUpperCase();
        });
    }
    // 驼峰转换下划线
    toLine(name) {
        return name.replace(/([A-Z])/g,"_$1").toLowerCase();
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
export default new common();
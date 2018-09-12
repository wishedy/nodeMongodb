//全站正则判断
class regularTest {
    constructor(){

    }
    testNum(val){
        //判断数字
        return (/^\d+$/g).test(val);
    }
    testName(val){
        //判断名字，涵盖少数民族
        return (/^[\u4e00-\u9fa5\s\.·-]{1,25}$|^[\@A-Za-z_\s\.·-]{1,50}$|^[A-Za-z\u4e00-\u9fa5]{1,20}$|^[\u4e00-\u9fa5A-Za-z]{1,20}$/).test(val);
    }
    testPhoneNum(val){
        //判断手机号 包含16、17号段
        //return (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/).test(val);
        return (/^1\d{10}$/).test(val);
    }
    testEmail(str){
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(str);
    }
    testID(val){
        //判断身份证
        return (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(val);
    }
    isPInt(str) {
        return (/^[1-9]*[1-9][0-9]*$/).test(str);
    }
    decimals(str){
        return (/^\d+(\.\d+)?$/).test(str);
    }
    minus(str){
        return (/^(\-|\+)?\d+(\.\d+)?$/).test(str);
    }
};
export default  new regularTest();

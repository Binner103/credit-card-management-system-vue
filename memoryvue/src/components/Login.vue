<template>
    <div class="login_container">
        <img src="../assets/Loginview.jpg" alt="">
        <!-- 登录块 -->
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/loginlogo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="ligon_form" label-width="0">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-unlock" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                    <el-button type="primary" >注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 表单对象
            loginForm:{
                username:"",
                password:""
            },
            addDialogVisible: false,
            // 验证对象
            loginRules:{
                // 校验用户名
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' }, // 必填项验证
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' } //长度验证
                ],
                // 校验密码
                password:[
                    { required: true, message: '请输入用户密码', trigger: 'blur' }, // 必填项验证
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' } //长度验证
                ],
            },
        };
    },
    methods:{
        // "重置"按钮配置
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        // 处理登录，触发登录按钮时如果登录成功，会跳转到指定页面
        login(){
            // 1.验证校验规则
            this.$refs.loginFormRef.validate(async valid => {
                if( !valid ) return; //取反，无操作的话默认登录失败
                const {data:res} = await this.$http.post("login",this.loginForm);   //访问JAVA后台
                if( res.flag == "ok" ){
                    this.$message.success("操作成功！！！");    // 消息提示
                    window.sessionStorage.setItem("user",res.user); // 存储user对象
                    this.$router.push({path:"/home"});// 跳转到home
                }else{
                    this.$message.error("操作失败！！！");      //消息提示
                }
            });
        },
    },
}
</script>
<style lang="less" scoped>
// 根节点样式
.login_container{
    height: 100%;
    width: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 2px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #eee;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
.btns{
    display: flex;
    justify-content: flex-end;
}
.ligon_form{
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}
}
</style>
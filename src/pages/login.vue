<template>
  <div class="login">
    <el-card class="card" v-loading="loading">
      <img src="../assets/img/login.png" style="margin-bottom: 20px" />
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="account">
          <el-input type="text" v-model="ruleForm.account" autocomplete="off" placeholder="请输入您的账号/邮箱"
            prefix-icon="el-icon-user-solid" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入您的密码"
            prefix-icon="el-icon-key" clearable></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <el-input class="checkCodeInput" v-model="ruleForm.checkCode" placeholder="请输入下方侧验证码"
            style="margin-bottom: 20px" prefix-icon="el-icon-picture-outline" clearable></el-input>
          <img class="checkCodeImg" ref="kaptcha" @click="refreshKaptcha()" />
          <a @click="refreshKaptcha()">点击刷新验证码</a>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="ruleForm.rememberMe">记住我</el-checkbox>
          <!-- <span class="forget" @click="forgetPassword()">忘记密码</span>
          <span class="forget" @click="forgetAccount()">忘记账号</span> -->
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { checkKaptcha, login } from "../api/webApi";
export default {
  inject: ["reload"],
  name: "login",
  data() {
    var checkAccount = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("账号不能为空"));
      } else {
        if (value !== "") {
          const regEn = /[`~!#@$%^&*()+<>?:"{},.\/;'[\]]/im;
          const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
          if (regEn.test(value) || regCn.test(value)) {
            callback(new Error("请输入正确账号"));
          } else {
            const regInclude = /^(?![^A-Za-z]+$)(?![^0-9]+$)[0-9A-Za-z]{4,15}$/;
            if (!regInclude.test(value)) {
              callback(new Error("请输入正确账号"));
            }
          }
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var checkCode = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        if (value !== "") {
          await checkKaptcha(value).then((res) => {
            if (res.data.status != 200) {
              callback(new Error(res.data.message));
            } else {
              callback();
            }
          });
        }
      }
    };
    return {
      loading: false,
      timer: null,
      ruleForm: {
        account: "",
        pass: "",
        checkCode: "",
        rememberMe: false,
      },
      rules: {
        account: [{ validator: checkAccount, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkCode: [{ validator: checkCode, trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.refreshKaptcha();
  },
  methods: {
    refreshKaptcha() {
      this.$refs.kaptcha.src =
        this.$store.state.url + "/kaptcha?p=" + Math.random();
    },
    submitForm(formName) {
      let username = this.ruleForm.account;
      let password = this.ruleForm.pass;
      let rememberMe = this.ruleForm.rememberMe;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login(username, password, rememberMe).then((res) => {
            if (res.data.status == 200) {
              this.$message({
                type: "success",
                message: `登陆成功，将在3s后跳转到首页`,
              });
              this.loading = true;
              this.timer = setTimeout(() => {
                //设置延迟执行
                this.reload();
                this.loading = false;
                this.$router.push("/home");
              }, 3000);
            } else {
              this.$message({
                type: "error",
                message: `action: ${res.data.message}`,
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 93.8vh;
  ;
}

a:hover {
  cursor: pointer;
  text-decoration: underline;
}

.card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  width: 30vw;
}

.forget {
  cursor: pointer;
  text-decoration: underline;
  margin-left: 20px;
}

.checkCodeImg {
  width: 5vw;
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
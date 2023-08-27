<template>
  <div class="register" v-loading="loading">
    <el-card class="box-card">
      <img src="../assets/img/register.png" style="margin-bottom: 20px" />

      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        必填
        <el-form-item label="昵称" prop="nickname">
          <el-input type="text" v-model="ruleForm.nickname" autocomplete="off" placeholder="不能为空，不能超过10个字符" clearable
            prefix-icon="el-icon-user-solid" suffix-icon="*"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input type="text" v-model="ruleForm.account" autocomplete="off" placeholder="4-15位，要求数字、字母的组合，其中数字和字母必须同时存在"
            clearable prefix-icon="el-icon-user-solid" suffix-icon="*"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="6-16位,密码必须由数字、字母、除空格外的特殊字符组合"
            prefix-icon="el-icon-key" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请再次输入您的密码"
            prefix-icon="el-icon-key" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="ruleForm.email" autocomplete="off" placeholder="请输入您的邮箱"
            prefix-icon="el-icon-message" clearable></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="checkCode">
          <el-input v-model="ruleForm.checkCode" placeholder="请输入下方侧验证码" style="margin-bottom: 20px"
            prefix-icon="el-icon-picture-outline" clearable></el-input>
          <img class="checkCode" ref="kaptcha" @click="refreshKaptcha()" />
          <a @click="refreshKaptcha()">点击刷新验证码</a>
        </el-form-item>
        选填
        <el-form-item label="手机号" prop="phone">
          <el-input type="text" v-model="ruleForm.phone" autocomplete="off" placeholder="请输入您的手机号"
            prefix-icon="el-icon-mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="所在地区">
          <v-distpicker :placeholders="place" @selected="onSelected"></v-distpicker>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="birthData" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { refreshKaptcha, checkKaptcha, register } from "../api/webApi";
export default {
  name: "register",
  data() {
    var checkAccount = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("账号不能为空"));
      } else {
        if (this.ruleForm.account !== "") {
          const regEn = /[`~!#@$%^&*()+<>?:"{},.\/;'[\]]/im;
          const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
          if (regEn.test(value) || regCn.test(value)) {
            callback(new Error("不能包含特殊字符"));
          } else {
            const regInclude = /^(?![^A-Za-z]+$)(?![^0-9]+$)[0-9A-Za-z]{4,15}$/;
            if (!regInclude.test(value)) {
              callback(
                new Error(
                  "4-15位，要求数字、字母的组合，其中数字和字母必须同时存在"
                )
              );
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
        if (this.ruleForm.pass !== "" && value.indexOf(" ") !== -1) {
          callback(new Error("密码不能包含空格"));
        } else {
          const regInclude = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/;
          if (!regInclude.test(value)) {
            callback(
              new Error(
                "密码必须由数字、字母、除空格外的特殊字符组合,请输入6-16位"
              )
            );
          }
        }
        callback();
      }
    };
    var checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkCode = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        let result = "";
        if (this.ruleForm.checkCode !== "") {
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
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      // 不合法的邮箱
      callback(new Error("请输入合法的邮箱"));
    };
    var checkPhone = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        // 验证手机号的正则表达式
        const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/;

        if (regMobile.test(value)) {
          // 合法的手机号
          callback();
        }
        // 不合法
        callback(new Error("请输入合法的手机号"));
      }
      // 验证手机号的正则表达式
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/;

      if (regMobile.test(value)) {
        // 合法的手机号
        return callback();
      }
      // 不合法
      callback(new Error("请输入合法的手机号"));
    };

    return {
      loading: false,
      birthData: "",
      place: {
        province: "------- 省 --------",
        city: "--- 市 ---",
        area: "--- 区 ---",
      },
      ruleForm: {
        nickname: "",
        account: "",
        pass: "",
        checkCode: "",
        checkPass: "",
        email: "",
        phone: "",
      },
      rules: {
        nickname: [{ required: true, message: "必填" },
        { min: 1, max: 10, message: '长度在1~10个字符', trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: checkPass, trigger: "blur" }],
        checkCode: [{ validator: checkCode, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let nickname = this.ruleForm.nickname;
          let username = this.ruleForm.account;
          let password = this.ruleForm.pass;
          let email = this.ruleForm.email;
          let phone = this.ruleForm.phone;
          let province = this.place.province;
          let city = this.place.city;
          let area = this.place.area;
          let birthData = this.birthData
          this.loading = true;

          this.$confirm('确认你的信息填充没有错噢！确认注册后需要您到邮箱激活账户哦！', '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            register(username, password, email, phone, province, city, area, birthData, nickname).then((res) => {
              if (res.data.status == 200) {
                this.$message({
                  type: 'success',
                  message: '注册成功!，请前往您的注册邮箱激活账号！'
                });
                this.loading = false;
                this.$router.push("/login");
              } else {
                this.loading = false;
                this.$message({
                  type: 'error',
                  message: res.data.data
                });
              }
            })

          }).catch(() => {
            this.loading = false;
            this.$message({
              type: 'info',
              message: '已取消注册！'
            });
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onSelected(data) {
      const { province, city, area } = data;
      if (!province.code && !city.code && !city.code) return;
      this.place.province = province.value;
      this.place.city = city.value;
      this.place.area = area.value;
    },
  },
};
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 93.8vh;
  ;
}

了。 .checkCode {
  width: auto;
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
}

a:hover {
  cursor: pointer;
  text-decoration: underline;
}

.box-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  width: 40vw;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
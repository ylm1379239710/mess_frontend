<template>
  <div class="main">
    <!-- 顶部导航栏 -->
    <el-row style="position: fixed; z-index: 100">
      <el-col :span="24">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
          style="display: flex; justify-content: center">
          <img src="../assets/img/logoname.png" style="
                height: 36px;
                width: 87px;
                margin-top: 10px;
                margin-right: 20px;
              " />
          <el-menu-item index="1" @click="goHome()">首页</el-menu-item>
          <el-menu-item index="2" @click="goTranInfo()">交易信息中心</el-menu-item>
          <!-- <el-menu-item index="7">论坛中心</el-menu-item> -->

          <el-menu-item index="3" @click="goBlackList()">交易黑名单</el-menu-item>
          <el-menu-item index="4" @click="goSupport()">捐赠支持</el-menu-item>
          <div style="width: 30vw"></div>
          <!-- <el-input v-model="search" placeholder="搜索你想要的内容" style="width: auto; margin-top: 10px" @keyup.enter.native="goSearch()"></el-input> -->
          <!-- <el-button type="primary" plain style="height: 40px; margin-left: 10px; margin-top: 10px" @click="goSearch()">搜索</el-button> -->
          <el-button type="primary" v-show="!ticket" @click="goLogin()"
            style="height: 40px; margin-left: 10px; margin-top: 10px">登录</el-button>
          <el-button type="primary" v-show="!ticket" @click="goRegister()"
            style="height: 40px; margin-left: 10px; margin-top: 10px">注册</el-button>
          <el-submenu index="3" v-show="ticket">
            <template slot="title">消息中心</template>
            <!-- <el-menu-item index="3-1" @click="goSysNotice()">系统通知</el-menu-item> -->
            <el-menu-item index="3-1" @click="goComment()">收到评论</el-menu-item>
          </el-submenu>
          <el-submenu index="4" v-show="ticket">
            <template slot="title">个人中心</template>
            <el-menu-item index="4-1" @click="goUserInfo()">个人信息</el-menu-item>
            <el-menu-item index="4-2" @click="goTranInfoManage()">我的交易</el-menu-item>
            <el-menu-item index="4-3" @click="loginOut()">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
    <!-- 空白div顶替顶部导航栏的位置 使下面的文档正常显示 -->
    <div style="height: 60px"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import { loginOut } from "../api/webApi";

import axios from "axios";
export default {
  inject: ["reload"],
  name: "HomePage",
  data() {
    return {
      search: "",
      activeIndex: "1",
      ticket: this.$cookie.get("ticket"),
    };
  },
  methods: {
    goHome() {
      this.$router.push("/home");
    },
    goUserInfo() {
      this.$router.push("/userinfo");
    },
    goLogin() {
      this.$router.push("/login");
    },
    goRegister() {
      this.$router.push("/register");
    },
    goTranInfo() {
      this.$router.push("/traninfo");
    },
    goBlackList() {
      this.$router.push("/blacklist");
    },
    goSupport() {
      this.$router.push("/support");
    },
    goSysNotice() {
      this.$router.push("/sysnotice");
    },
    goTranInfoManage() {
      this.$router.push("/traninfomanage");
    },
    goComment() {
      this.$router.push("/comment");
    },
    goSearch(){
      this.search='',
      this.$router.push("/search");
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    loginOut() {
      this.$confirm("确定退出登录吗？呜呜呜", "真的要离开我吗？", {
        confirmButtonText: "确定",
        cancelButtonText: '取消',
      }).then(() => {
        loginOut().then((res) => {
          if (res.data.status == 200) {
            this.$message({
              type: "info",
              message: `成功登出`,
            });
            this.$cookie.remove("ticket");
            this.reload();
            this.$router.push("/home");

          } else {
            this.$message({
              type: "error",
              message: `服务器错误`,
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出登录'
        });
      });

    },

  },
};
</script>


<style>
.el-row {
  margin-bottom: 20px;
  width: 100vw;
}

.el-col {
  border-radius: 4px;
}

.main {
  background-image: url(../assets/img/back.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
}

html {
  overflow-x: hidden;
}

.box-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
}
</style>
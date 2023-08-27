<template>
  <div class="userinfo">
    <el-card class="card">
      <div class="demo-basic--circle">
        <div class="block">
          <el-avatar :size="100" :src="user.headerUrl"></el-avatar>
          <h1 class="name">{{ user.nickname }}</h1>
        </div>
      </div>
    </el-card>
    <el-card class="card">
      <el-descriptions title="基本信息" :column="1" border>
        <template slot="extra">
          
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ user.username }}
        </el-descriptions-item>
        
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            邮箱
          </template>
          {{ user.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            个性签名
          </template>
          {{ user.signature }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            所在地区
          </template>
          {{ user.province }}-{{ user.city }}-{{ user.area }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            生日
          </template>
          {{ user.birthDate }}
        </el-descriptions-item>
      </el-descriptions>
      
    </el-card>
  </div>
</template>

<script>
import { loginOut, getUserInfo } from "../api/webApi";
export default {
  name: "userinfo",
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    getUserInfo().then((res) => {
      if (res.data.status == 200) {
        this.user = res.data.data;
      } else {
        this.$message({
          type: "error",
          message: `服务器错误`,
        });
      }
    });
  },
};
</script>

<style scoped>
.userinfo {
  display: flex;
  /* justify-content: center; */
  flex-direction: column;
  align-items: center;
  height: 80vh;
}
.card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  width: 60vw;
  margin-top: 20px;
}
.name{
    display: inline-block;
    margin-left: 50px;
}
</style>
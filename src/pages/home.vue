<template>
  <div class="home">
    <!-- 首页logo -->
    <div class="top">
      <img src="../assets/img/logoimg.png" />
      <div class="down">
        <a @click="go('main')"><img src="../assets/img/down.png" /></a>
      </div>
    </div>
    <!-- 主要内容 -->
    <el-row style="margin-left: 15vw; margin-top: 20px" id="main">
      <!-- 左半部分 banner和帖子-->
      <el-col :span="12">
        <div class="banner">
          <el-carousel>
            <el-carousel-item v-for="(item, index) in banner" :key="index">
              <a :href="item.url" target="_blank"><img :src="item.img" /></a>
            </el-carousel-item>
          </el-carousel>
        </div>
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="最新" name="latest">
            <el-card v-for="post in discussPost" :key="post.post.id" class="card">
              <div slot="header" class="clearfix">
                <span>
                  <h2>{{ post.post.title }}</h2>
                </span>
                <el-tag v-if="post.post.type == 1">出售</el-tag>
                <el-tag v-else type="danger">收购</el-tag>
                <el-button style="float: right; padding: 3px 0" type="text"
                  @click="goTranInfoDetail(post.post.id)">点击查看详情</el-button>
              </div>
              <div slot="header">
                <div class="user">
                  <span v-text="'发布人：' + post.user.nickname" class="nickname" @click="getUserDetail()">
                  </span>
                  <span class="right">
                    <span class="time">发布于 <b v-text="post.post.cTime"></b></span>
                    <span class="like">
                      <img src="../assets/img/like.png" />
                      <i v-text="post.likeCount"></i>
                    </span>
                  </span>
                </div>
              </div>
              <div>
                <el-image style="width: 100px; height: 100px" :src="post.post.coverImg" fit="fit"
                  v-show="post.post.coverImg"></el-image>
                <div class="content" v-html="post.post.content"></div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="最热" name="hottest">
            <el-card v-for="post in discussPost" :key="post.post.id" class="card">
              <div slot="header" class="clearfix">
                <span>
                  <h2>{{ post.post.title }}</h2>
                </span>
                <el-tag v-if="post.post.type == 1">出售</el-tag>
                <el-tag v-else type="danger">收购</el-tag>
                <el-button style="float: right; padding: 3px 0" type="text"
                  @click="goTranInfoDetail(post.post.id)">点击查看详情</el-button>
              </div>
              <div slot="header">
                <div class="user">
                  <span v-text="'发布人：' + post.user.nickname" class="nickname" @click="getUserDetail()">
                  </span>
                  <span class="right">
                    <span class="time">发布于 <b v-text="post.post.cTime"></b></span>
                    <span class="like">
                      <img src="../assets/img/like.png" />
                      <i v-text="post.likeCount"></i>
                    </span>
                  </span>
                </div>
              </div>
              <div>
                <el-image style="width: 100px; height: 100px" :src="post.post.coverImg" fit="fit"
                  v-show="post.post.coverImg"></el-image>
                <div class="content" v-html="post.post.content"></div>
              </div>
            </el-card></el-tab-pane>
          <!-- <el-tab-pane label="关注">
            <el-card
              v-for="post in discussPost"
              :key="post.post.id"
              class="card"
            >
              <div slot="header" class="clearfix">
                <span
                  ><h2>{{ post.post.title }}</h2></span
                >
                <el-tag v-if="post.post.type == 1">出售</el-tag>
                <el-tag v-else type="danger">收购</el-tag>
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                  @click="goTranInfoDetail(post.post.id)"
                  >点击查看详情</el-button
                >
              </div>
              <div slot="header">
                <div class="user">
                  <span
                    v-text="'发布人：' + post.user.nickname"
                    class="nickname"
                    @click="getUserDetail()"
                  >
                  </span>
                  <span class="right">
                    <span class="time"
                      >发布于 <b v-text="post.post.cTime"></b
                    ></span>
                    <span class="like">
                      <img src="../assets/img/like.png" />
                      <i v-text="post.likeCount"></i>
                    </span>
                  </span>
                </div>
              </div>
              <div>
                <el-image
                  style="width: 100px; height: 100px"
                  :src="post.post.coverImg"
                  fit="fit"
                  v-show="post.post.coverImg"
                ></el-image>
                <div class="content" v-html="post.post.content"></div>
              </div> </el-card
          ></el-tab-pane> -->
        </el-tabs>
      </el-col>
      <!-- 右半部分：用户信息、二维码等 -->
      <el-col :span="6" style="position: sticky; top: 70px">
        <el-aside style="width: 20vw">
          <!-- 用户信息部分 -->
          <!-- 登录后 -->
          <el-card v-show="ticket" class="box-card" style="
              height: auto;
              width: 18vw;
              margin-left: 20px;
              margin-bottom: 20px;
            ">
            <div class="avatar">
              <el-avatar :size="100" :src="user.headerUrl"></el-avatar>
            </div>
            <div class="info">
              <span class="name" v-if="user.nickname"><b>{{ user.nickname }}</b></span>
            </div>
            <div class="button">
              <el-row :gutter="5">
                <el-col :span="10">
                  <el-dropdown trigger="click" @command="handleCommand">
                    <el-badge :is-dot="noticeList.commentNotice ? true : false" class="item"><el-button
                        type="primary">消息通知</el-button></el-badge>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="clearfix" command="/comment">
                        未读评论
                        <el-badge class="mark" :value="noticeList.commentNotice
                            ? noticeList.commentNotice.unread
                            : 0
                          " />
                      </el-dropdown-item>
                      <!-- <el-dropdown-item class="clearfix" command="/sysnotice">
                        系统通知
                      </el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <el-col :span="10">
                  <el-button type="primary" @click="goUserInfo()">个人信息</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="5">
                <el-col :span="10">
                  <el-button type="primary" @click="goTranInfoManage()">交易管理</el-button>
                </el-col>
                <el-col :span="10">
                  <el-button type="danger" @click="loginOut()">登出</el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <!-- 登录前 -->
          <el-card v-show="!ticket" class="box-card" style="
              height: auto;
              width: 18vw;
              margin-left: 20px;
              margin-bottom: 20px;
            ">
            <div class="info">
              <el-row>
                <el-button type="primary" @click="goLogin()">请登录！</el-button>
              </el-row>
              <el-row><el-button type="primary" @click="goRegister()">前去注册！</el-button></el-row>
            </div>
          </el-card>
          <!-- <el-card v-show="ticket" class="box-card" style="
                      height: auto;
                      width: 18vw;
                      margin-left: 20px;
                      margin-bottom: 20px;
                    ">
            <div>
              <el-statistic group-separator="," :precision="2" :value="1000" title="网站访问次数"></el-statistic>
            </div>
          </el-card> -->
          <!-- 交流群二维码 -->
          <el-card class="box-card" style="
              height: auto;
              width: 18vw;
              margin-left: 20px;
              margin-bottom: 20px;
            ">
            <div class="juanzhu">
              <span>作者QQ：1379239710</span>
              <img src="../assets/img/qq.jpg" />
              <span>QQ交流群：732208983</span>
              <span>或扫下方二维码加入群聊</span>
              <img src="../assets/img/qun.jpg" />
            </div>
          </el-card>
        </el-aside>
      </el-col>
    </el-row>
    <el-row>
      <div style="height: 10px; width: 100vw"></div>
    </el-row>
  </div>
</template>

<script>
import {
  getHomeData,
  loginOut,
  getUserInfo,
  noticeList,
  getAllBanner,
} from "../api/webApi";
export default {
  inject: ["reload"],
  name: "home",
  data() {
    return {
      banner: [],
      noticeList: {
        commentNotice: {
        },
      },
      discussPost: [],
      ticket: this.$cookie.get("ticket"),
      user: {},
      activeName: "latest",
    };
  },
  mounted() {
    if (this.ticket != null) {
      getUserInfo().then((res) => {
        if (res.data.status == 200) {
          this.user = res.data.data;
        } else if (res.data.status == 401) {
          this.$message({
            type: "error",
            message: res.data.message,
          });
          this.ticket = "";
          this.$cookie.remove("ticket");
          this.goLogin();
        } else {
          this.$message({
            type: "error",
            message: res.data.message,
          });
        }
      });
      setTimeout(() => {
        noticeList().then((res) => {
          if (res.data.status == 200) {
            this.noticeList = res.data.data;
          } else if (res.data.status == 401) {
            this.$message({
              type: "error",
              message: res.data.message,
            });
            this.ticket = "";
            this.$cookie.remove("ticket");
            this.goLogin();
          } else {
            this.$message({
              type: "error",
              message: res.data.message,
            });
          }
        });
      }, 1500);
    }

    getAllBanner().then((res) => {
      if (res.data.status == 200) {
        this.banner = res.data.data;
      } else if (res.data.status == 401) {
        this.$message({
          type: "error",
          message: res.data.message,
        });
        this.ticket = "";
        this.$cookie.remove("ticket");
        this.goLogin();
      } else {
        this.$message({
          type: "error",
          message: res.data.message,
        });
      }
    });

    this.getHomeData(0);
  },
  methods: {
    goUserInfo() {
      this.$router.push("/userinfo");
    },
    goLogin() {
      this.$router.push("/login");
    },
    goRegister() {
      this.$router.push("/register");
    },
    go(value) {
      let element = document.getElementById(value);
      window.scrollTo(0, element.offsetTop - 80);
    },
    getHomeData(orderMode) {
      getHomeData(orderMode).then((res) => {
        if (res.data.status == 200) {
          this.discussPost = res.data.data;
          this.discussPost.forEach((element) => {
            element.post.content = this.escapeHtml(element.post.content);
          });
        }
      });
    },
    loginOut() {
      this.$confirm("确定退出登录吗？呜呜呜", "真的要离开我吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出登录",
          });
        });
    },
    goTranInfoManage() {
      this.$router.push("/traninfomanage");
    },
    goTranInfoDetail(id) {
      let routeData = this.$router.resolve({
        query: { traninfoid: id },
        name: "traninfodetail",
      });
      window.open(routeData.href, "_blank");
    },
    goSysNotice() {
      this.$router.push("/sysnotice");
    },
    goComment() {
      this.$router.push("/comment");
    },
    handleClick(tab, event) {
      if (tab.name == "hottest") {
        this.getHomeData(1);
      } else {
        this.getHomeData(0);
      }
    },
    handleCommand(command) {
      this.$router.push(command);
    },
    escapeHtml(str) {
      var arrEntities = {
        lt: "<",
        gt: ">",
        nbsp: " ",
        amp: "&",
        quot: '"',
      };
      return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
        return arrEntities[t];
      });
    },
  },
};
</script>

<style scoped>
.home {
  height: 100%;
}

.name {
  width: 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.top {
  background-image: url(../assets/img/head.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  height: 700px;
  padding-left: 17vw;
}

.top img {
  width: 65vw;
  height: 700px;
}

.down {
  position: relative;
  top: -50px;
  left: 600px;
  z-index: 2;
  width: 20px;
  height: 10px;
  /* background:red; */
  animation: mymove 1.5s infinite;
  -webkit-animation: mymove 1.5s infinite;
}

.down :hover {
  cursor: pointer;
}

.down img {
  width: 30px;
  height: 20px;
}

.banner {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.banner img {
  width: 100%;
  height: 100%;
}

.box-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
}

.card {
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  margin-bottom: 20px;
}

.avatar {
  display: inline-block;
  width: 100px;
  height: 100px;
}

.info {
  display: inline-block;
  width: 190px;
}

.info .name {
  width: 140px;
  position: relative;
  top: -50px;
  left: 30 px;
  font-size: 20px;
  /* justify-content: space-between; */
  /* flex-direction: column; */
}

.author {
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
}

.nickname {
  margin-right: 10px;
}

.user {
  display: flex;
  justify-content: space-between;
}

.user .right {
  margin-right: 10px;
}

.user .right .time {
  margin-right: 20px;
}

.user .right .like {
  margin-right: 10px;
}

.user .right .like img {
  width: 20px;
  height: 20px;
}

.button {
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.juanzhu {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.juanzhu img {
  width: 14vw;
  height: 24vh;
}

@keyframes mymove {
  0% {
    transform: translate(0px, 0px);
  }

  50% {
    transform: translate(0px, -10px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

/*Safari 和 Chrome:*/
@-webkit-keyframes mymove {
  0% {
    transform: translate(0px, 0px);
  }

  50% {
    transform: translate(0px, -10px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}
</style>
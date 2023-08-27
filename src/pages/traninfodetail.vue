<template>
  <div>
    <!-- 内容 -->
    <div>
      <!-- 帖子详情-->
      <el-card class="card">
        <!-- 标题 -->
        <h1>
          <span>{{ post.title }}</span>
        </h1>
        <!-- 作者 -->
        <div class="author">
          <el-avatar shape="square" :size="50" :src="user.headerUrl" @click="getUserDetail()" alt="用户头像"></el-avatar>
          <div class="info">
            <span v-text="user.nickname" class="nickname" @click="getUserDetail()">
            </span>
            <span class="right">
              <span class="time">发布于 <b v-text="post.cTime"></b></span>
              <span class="like">
                <a href="javascript:;" @click="like(1, post.id, user.id, post.id)">
                  <img v-show="likeStatus == 0" src="../assets/img/nolike.png" />
                  <img v-show="likeStatus == 1" src="../assets/img/like.png" />
                  <i v-text="likeCount"></i>
                </a>
              </span>
              <span class="split">|</span>
              <span>
                <a href="#replyform">回帖 <i v-text="post.commentCount"></i></a>
              </span>
            </span>
          </div>
        </div>
        <!-- 正文 -->
        <div class="content">
          <div v-html="post.content"></div>
        </div>
      </el-card>
      <!-- 回帖 -->
      <el-card class="card">
        <!-- 回帖数量 -->
        <div class="row">
          <div class="col-8">
            <h6>
              <b class="square"></b> <i v-text="post.commentCount"></i>条回帖
            </h6>
          </div>
          <div class="col-4 text-right">
            <a href="#comment" class="btn btn-primary btn-sm">&nbsp;&nbsp;回&nbsp;&nbsp;帖&nbsp;&nbsp;</a>
          </div>
        </div>
        <!-- 回帖列表 -->
        <el-card class="reply-card" v-for="(com, index) in comments" :key="index">
          <!-- <a th:href="@{|/user/profile/${com.user.id}|}"> -->
          <img :src="com.user.headerUrl" />
          <div class="media-body">
            <div class="mt-0">
              <span class="font-size-12 text-success" v-text="com.user.nickname"></span>
              <span class="badge badge-secondary float-right floor">
                <!-- 楼数 -->
                <i v-text="(currentPage - 1) * pageSize + index + 1"></i> 楼
              </span>
            </div>
            <div class="mt-2" v-text="com.comment.content"></div>
            <div class="mt-4 text-muted font-size-12">
              <span>发布于 <b v-text="com.comment.createTime"></b></span>
              <a href="javascript:;" @click="like(2, com.comment.id, com.user.id, post.id)" class="text-primary">
                <b v-text="com.likeStatus == 1 ? '已赞' : '赞'"></b>(<i v-text="com.likeCount"></i>)
              </a>
              <span class="d-inline ml-2">|</span>
              <span class="d-inline ml-2">
                <a href="#" class="text-primary">回复(<i v-text="com.replyCount"></i>)</a>
              </span>
            </div>
            <!-- 回复列表 -->
            <el-card class="com-reply-card" v-for="(reply, index) in com.isent
              ? com.replys
              : com.replys.slice(0, 2)" :key="index">
              <div>
                <span v-if="reply.target == null">
                  <a class="text-info" v-text="reply.user.nickname" href="javascript:;"
                    @click="getUserDetail()"></a>:&nbsp;&nbsp;
                </span>
                <span v-if="reply.target != null">
                  <a class="text-info" v-text="reply.user.nickname" href="javascript:;" @click="getUserDetail()"></a>
                  回复
                  <a class="text-info" v-text="reply.target.nickname" href="javascript:;"
                    @click="getUserDetail()"></a>:&nbsp;&nbsp;
                </span>
                <span v-text="reply.reply.content"></span>
              </div>
              <div class="mt-3">
                <span v-text="reply.reply.createTime"></span>
                <span class="d-inline ml-2">
                  <a href="javascript:;" @click="like(2, reply.reply.id, reply.user.id, post.id)" class="text-primary">
                    <b v-text="reply.likeStatus == 1 ? '已赞' : '赞'"></b>(<i v-text="reply.likeCount"></i>)
                  </a>
                </span>
                <!-- 回复评论 -->
                <input type="text" class="input-size" name="content" :placeholder="'回复' + reply.user.nickname"
                  :ref="index" @input="changeRep" @focus="clearRep" />
                <button class="btn btn-primary btn-sm" @click="addComment(2, com.comment.id, reply.user.id, index)">
                  &nbsp;&nbsp;回&nbsp;&nbsp;复&nbsp;&nbsp;
                </button>
              </div>
              
            </el-card>
            <div class="showButton" v-show="com.replys.length > 2" @click="changeIsent(index)">
              {{ com.isent ? "收起" : "展开全部"+com.replys.length+"条回复" }}
              <img src="../assets/img/pull.png" v-show="!com.isent">
              <img src="../assets/img/push.png" v-show="com.isent">
            </div>

            <!-- 回复评论 -->
            <input type="text" class="input-size" name="content" placeholder="请输入你的观点" @input="changeRep"
              @focus="clearRep" />
            <button class="btn btn-primary btn-sm" @click="addComment(2, com.comment.id, com.user.id)">
              &nbsp;&nbsp;回&nbsp;&nbsp;复&nbsp;&nbsp;
            </button>
          </div>
        </el-card>
        <iframe width="0" height="0" frameborder="0" id="myiframe" name="myiframe"></iframe>
        <!-- 分页 -->
        <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="total"
          @size-change="handleSizeChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 20, 30, 40, 50]"
          :page-size="5" @current-change="handleCurrentChange">
        </el-pagination>
      </el-card>
      <!-- 回帖输入 -->
      <el-card class="card">
        <!-- 回复评论 -->
        <textarea type="text" id="comment" rows="10" maxlength="300" placeholder="在这里畅所欲言你的看法吧!最多三百个字哦！"
          @input="changeRep" @focus="clearRep"></textarea>
        <button class="btn btn-primary btn-sm" @click="addComment(1, post.id, user.id)">
          &nbsp;&nbsp;回&nbsp;&nbsp;复&nbsp;&nbsp;
        </button>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getTranInfoDetail, addComment, like } from "../api/webApi";
export default {
  inject: ["reload"],
  name: "traninfodetail",
  data() {
    return {
      rep: "",
      currentPage: 1,
      pageSize: 5,
      total: 0,
      id: null,
      user: {},
      post: {},
      comments: [],
      likeCount: 0,
      likeStatus: 0,
      element: null,
      isent: 0,
    };
  },
  mounted() {
    this.id = this.$route.query.traninfoid;
    this.goDetail();
  },
  methods: {
    goDetail() {
      getTranInfoDetail(this.id, this.currentPage, this.pageSize).then(
        (res) => {
          if (res.data.status == 200) {
            this.user = res.data.data.user;
            this.post = res.data.data.post;
            this.post.content = this.escapeHtml(this.post.content);
            this.comments = res.data.data.comments;
            this.comments.forEach((element) => {
              this.$set(element, "isent", 0);
            });
            this.likeCount = res.data.data.likeCount;
            this.likeStatus = res.data.data.likeStatus;
            this.total = res.data.data.pagination.total;
          } else {
            this.$message({
              type: "error",
              message: `action: ${res.data.message}`,
            });
          }
        }
      );
    },
    changeRep(e) {
      this.rep = e.target.value;
      this.element = e;
    },
    clearRep() {
      this.rep = "";
    },
    addComment(entityType, entityId, targetId) {
      if (this.rep != "") {
        addComment(this.post.id, entityType, entityId, targetId, this.rep).then(
          (res) => {
            if (res.data.status == 200) {
              this.$message({
                type: "success",
                message: `action: ${res.data.message}`,
              });
              this.rep = "";
              this.goDetail();
              this.element.target.value = "";
            } else {
              this.$message({
                type: "error",
                message: `action: ${res.data.message}`,
              });
            }
          }
        );
      } else {
        this.$message({
          type: "error",
          message: `action: 回复不能为空`,
        });
      }
    },
    like(entityType, entityId, entityUserId, postId) {
      like(entityType, entityId, entityUserId, postId).then((res) => {
        this.likeCount = res.data.data.likeCount;
        this.likeStatus = res.data.data.likeStatus;
      });
      this.goDetail();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.goDetail();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.goDetail();
    },
    changeIsent(index) {
      this.comments[index].isent = !this.comments[index].isent;
    },
    // 处理方法
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
@import url(../assets/css/bootstrap.min.css);
@import url(../assets/css/global.css);

.card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  margin-bottom: 20px;
  width: 95vw;
  margin-left: 2.5vw;
}

.card:first-child {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  margin-bottom: 20px;
  margin-top: 20px;
  width: 95vw;
  margin-left: 2.5vw;
}


.reply-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  margin-bottom: 20px;
  width: 90vw;
  margin-left: 1.5vw;
}

.reply-card img{
  width: 50px;
  height: 50px;
}
.com-reply-card {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  margin-bottom: 20px;
  width: 85vw;
  margin-left: 1vw;
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

.info {
  display: flex;
  justify-content: space-between;
}

.info .right {
  margin-right: 10px;
}

.info .right .time {
  margin-right: 20px;
}

.info .right .like {
  margin-right: 10px;
}

.info .right .like img {
  width: 20px;
  height: 20px;
}

.info .right .split {
  margin-right: 10px;
}

.content {
  border: 1px solid #ccc;
  padding: 30px;
  border-radius: 5px;
}

.content {
  font-size: 16px;
  line-height: 2em;
}

.card textarea {
  width: 100%;
  height: 200px;
}

.floor {
  background: #dcdadc;
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 14px;
}

.input-size {
  display: block;
  width: 30%;
  height: 35px;
}


/*防止评论内容超出页面*/
.media-body {
  -ms-flex: 1;
  flex: 1;
  width: 100%;
}

.showButton{
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.showButton{
  display: flex;
}
.showButton :hover{
  cursor: pointer;
}
.showButton img{
  width: 20px;
  height: 20px;
}
</style>
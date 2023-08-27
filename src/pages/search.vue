<template>
    <el-card class="box-card">
      <el-card class="search">
        <el-form :inline="true" :model="searchformData" class="demo-form-inline">
          <el-form-item label="关键字">
            <el-input v-model="keyWord" placeholder="输入想要或出售的道具名称"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="searchformData.type" placeholder="选择信息类型">
              <el-option label="全部" value="0"></el-option>
              <el-option label="出售" value="1"></el-option>
              <el-option label="收购" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="show()">我要收购/出售</el-button>
      </el-card>
  
      <el-card>
        <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="total"
          @size-change="handleSizeChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 20, 30, 40, 50]"
          :page-size="5" @current-change="handleCurrentChange">
        </el-pagination>
  
        <el-card v-for="item in traninfo" :key="item.id" class="card">
          <div slot="header" class="clearfix">
            <span>
              <h2>{{ item.title }}</h2>
            </span>
            <el-tag v-if="item.type == 1">出售</el-tag>
            <el-tag v-else type="danger">收购</el-tag>
            <el-button style="float: right; padding: 3px 0" type="text"
              @click="goTranInfoDetail(item.id)">点击查看详情</el-button>
          </div>
  
          <div>
            <div class="content" v-html="item.content"></div>
          </div>
        </el-card>
  
        <el-dialog title="发布交易信息" :visible.sync="dialogVisible" width="90%" :before-close="handleClose">
          <el-form label-position="right" label-width="80px" :model="formData">
            <el-form-item label="标题:">
              <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="标题:">
              <Toolbar class="Toolbar" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
              <Editor class="Editor" v-model="formData.content" :defaultConfig="editorConfig" :mode="mode"
                @onCreated="onCreated" />
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="formData.type">
                <el-radio label="1">出售</el-radio>
                <el-radio label="2">收购</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addTranInfo()">确 定</el-button>
          </span>
        </el-dialog></el-card>
    </el-card>
  </template>
  
  
  <script>
  import { findTranInfoByCondition, addTranInfo } from "../api/webApi";
  import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
  
  export default {
    inject: ["reload"],
    components: { Editor, Toolbar },
    name: "traninfo",
    data() {
      return {
        keyWord: "",
        formData: {
          title: "",
          content: "",
          type: "1",
        },
        searchformData: {
          title: "",
          content: "",
          type: "0",
        },
        editor: null,
        toolbarConfig: {},
        editorConfig: {
          placeholder: "请输入内容...",
          MENU_CONF: {
            uploadImage: {
              server: "http://localhost:8080/discussPost/uploadPic",
              // server: '/api/upload-img-10s', // test timeout
              // server: '/api/upload-img-failed', // test failed
              // server: '/api/xxx', // test 404
              timeout: 5 * 1000, // 5s
              fieldName: "imageFile",
              meta: { ticket: this.$cookie.get("ticket") },
              metaWithUrl: true, // join params to url
              // headers: { Accept: "text/x-json" },
              maxFileSize: 10 * 1024 * 1024, // 10M
              onBeforeUpload(file) {
                console.log("onBeforeUpload", file);
                return file; // will upload this file
                // return false // prevent upload
              },
              onProgress(progress) {
                console.log("onProgress", progress);
              },
              onSuccess(file, res) {
                console.log("onSuccess", file, res);
              },
              onFailed(file, res) {
                alert(res.message);
                console.log("onFailed", file, res);
              },
              onError(file, err, res) {
                alert(err.message);
                console.error("onError", file, err, res);
              },
            },
          },
        },
        mode: "default", // or 'simple',
        dialogVisible: false,
        currentPage: 1,
        pageSize: 5,
        total: 0,
        paramMap: {
          title: "",
          content: "",
          type: [1, 2],
        },
        traninfo: [],
      };
    },
    beforeDestroy() {
      const editor = this.editor;
      if (editor == null) return;
      editor.destroy(); // 组件销毁时，及时销毁编辑器
    },
    mounted() {
      this.findTranInfoByCondition();
      // 模拟 ajax 请求，异步渲染编辑器
      setTimeout(() => {
        this.html = "<p>模拟 Ajax 异步设置内容 HTML</p>";
      }, 1500);
    },
    methods: {
      findTranInfoByCondition() {
        findTranInfoByCondition(
          this.currentPage,
          this.pageSize,
          this.paramMap
        ).then((res) => {
          if (res.data.status == 200) {
            this.traninfo = res.data.data.list;
            this.traninfo.forEach((element) => {
              element.content = this.escapeHtml(element.content);
            });
            this.total = res.data.data.pagination.total;
          } else if (res.data.status == 401) {
            this.$message({
              type: "error",
              message: res.data.message,
            });
            this.ticket = "";
            this.$cookie.remove("ticket");
          } else {
            this.$message({
              type: "error",
              message: `action: ${res.data.message}`,
            });
          }
        });
      },
      addTranInfo() {
        this.dialogVisible = false;
        addTranInfo(
          this.formData.title,
          this.formData.content,
          this.formData.type
        ).then((res) => {
          if (res.data.status == 200) {
            this.$message({
              type: "success",
              message: `action: ${res.data.message}`,
            });
            this.findTranInfoByCondition();
          } else {
            this.$message({
              type: "error",
              message: `action: ${res.data.message}`,
            });
          }
        });
      },
      search() {
        if (this.searchformData.type != "0") {
          let type = [];
          type.push(parseInt(this.searchformData.type));
          this.paramMap.type = type;
          this.paramMap.title = this.keyWord;
          this.paramMap.content = this.keyWord;
          this.findTranInfoByCondition();
        } else {
          this.paramMap.type = [1, 2];
          this.paramMap.title = this.keyWord;
          this.paramMap.content = this.keyWord;
          this.findTranInfoByCondition();
        }
      },
      goTranInfoDetail(id) {
        let routeData = this.$router.resolve({
          query: { traninfoid: id },
          name: "traninfodetail",
        });
        window.open(routeData.href, "_blank");
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.findTranInfoByCondition();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.findTranInfoByCondition();
      },
      show() {
        this.dialogVisible = true;
      },
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then((_) => {
            done();
          })
          .catch((_) => { });
      },
      onCreated(editor) {
        this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
        this.toolbarConfig.toolbarKeys = [
          "bold",
          "underline",
          "italic",
          "through",
          "clearStyle",
          "color",
          "bgColor",
          "fontSize",
          "fontFamily",
          "indent",
          "delIndent",
          "justifyLeft",
          "justifyRight",
          "justifyCenter",
          "justifyJustify",
          "lineHeight",
          "uploadImage",
          "insertImage",
          "editImage",
          "viewImageLink",
          "divider",
          "emotion",
          "blockquote",
          "headerSelect",
          "todo",
          "redo",
          "undo",
          "bulletedList",
          "numberedList",
          "insertTable",
        ];
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
  
  <style src="@wangeditor/editor/dist/css/style.css"></style>;
  <style scoped>
  .Toolbar {
    border: 1px solid #ccc;
  }
  
  .Editor {
    height: 500px;
    overflow-y: hidden;
    border: 1px solid #ccc;
    border-top: none;
  }
  
  .card {
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: 0.3s;
    margin-bottom: 20px;
    width: 95vw;
  }
  
  .search {
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: 0.3s;
    margin-bottom: 10px;
  }
  
  .content {
    height: 8.5vh;
    overflow: hidden;
  }
  </style>
  
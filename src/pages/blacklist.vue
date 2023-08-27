<template>
    <el-card class="box-card">
        <el-card class="search">
            <el-form :inline="true" :model="searchformData" class="demo-form-inline">
                <el-form-item label="涉案人信息">
                    <el-input v-model="paramMap.key" placeholder="输入涉案人QQ、网易账户或者游戏id" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="findBlackListByCondition">查询</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="show()">我要挂榜</el-button>
            注意：涉案信息需要经过审核确认，若您举报的用户还未显示请耐心等待！
        </el-card>

        <el-card>
            <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="total"
                @size-change="handleSizeChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 20, 30, 40, 50]"
                :page-size="5" @current-change="handleCurrentChange">
            </el-pagination>

            <el-card v-for="item in blackList" :key="item.id" class="card" v-show="item.isAudit">
                <div slot="header" class="clearfix">
                    <span>涉案人员QQ：{{ item.personInvolved }}</span>
                </div>
                <div>
                    <div class="content">
                        涉案人员游戏id：{{ item.accountId }}
                        <br />
                        涉案行为：
                        <div class="content" v-html="item.behaviorDescription"></div>
                        <br />
                        涉案人员网易账户：{{ item.wyAccount }}
                        <br />
                        举报人QQ：{{ item.reportUser }}
                        <br />
                        举报时间：{{ item.createTime }}
                    </div>
                </div>
            </el-card>
            <el-dialog title="发布交易信息" :visible.sync="dialogVisible" width="90%" :before-close="handleClose">
                <el-form label-position="right" label-width="150px" :model="formData">
                    <el-form-item label="涉案人员QQ:">
                        <el-input v-model="formData.personInvolved"></el-input>
                    </el-form-item>
                    <el-form-item label="涉案人员游戏id:">
                        <el-input v-model="formData.accountId"></el-input>
                    </el-form-item>
                    <el-form-item label="涉案行为:">
                        <Toolbar class="Toolbar" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
                        <Editor class="Editor" v-model="formData.behaviorDescription" :defaultConfig="editorConfig"
                            :mode="mode" @onCreated="onCreated" />
                    </el-form-item>
                    <el-form-item label="涉案人员网易账户：">
                        <el-input v-model="formData.wyAccount"></el-input>
                    </el-form-item>
                    <el-form-item label="您的QQ:">
                        <el-input v-model="formData.reportUser"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addBlackList()">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </el-card>
</template>
  
  
<script>
import { findBlackListByCondition, addBlackList } from "../api/webApi";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
    inject: ["reload"],
    components: { Editor, Toolbar },
    name: "blackList",
    data() {
        return {
            dialogVisible: false,
            currentPage: 1,
            pageSize: 5,
            total: 0,
            paramMap: {
                key: "",
            },
            blackList: [],
            formData: {
                personInvolved: "",
                accountId: "",
                behaviorDescription: "",
                wyAccount: "",
                reportUser: "",
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
        };
    },
    beforeDestroy() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁编辑器
    },
    mounted() {
        this.findBlackListByCondition();
        setTimeout(() => {
            this.html = "<p>模拟 Ajax 异步设置内容 HTML</p>";
        }, 1500);
    },
    methods: {
        findBlackListByCondition() {
            findBlackListByCondition(
                this.currentPage,
                this.pageSize,
                this.paramMap
            ).then((res) => {
                if (res.data.status == 200) {
                    this.blackList = res.data.data.list;
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
        addBlackList() {
            this.dialogVisible = false;
            addBlackList(
                this.formData.personInvolved,
                this.formData.accountId,
                this.formData.behaviorDescription,
                this.formData.wyAccount,
                this.formData.reportUser,
            ).then((res) => {
                if (res.data.status == 200) {
                    this.$message({
                        type: "success",
                        message: `action: ${res.data.message}`,
                    });
                    this.findBlackListByCondition();
                } else {
                    this.$message({
                        type: "error",
                        message: `action: ${res.data.message}`,
                    });
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.findBlackListByCondition();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.findBlackListByCondition();
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
    height: auto;
    overflow: hidden;
}

.Toolbar {
    border: 1px solid #ccc;
}

.Editor {
    height: 500px;
    overflow-y: hidden;
    border: 1px solid #ccc;
    border-top: none;
}
</style>
  
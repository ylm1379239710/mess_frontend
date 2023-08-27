<template>
    <div class="mian">
        <div><img src="../assets/img/168114305779976.png"></div>
        <div class="support">
            <div class="card">
                <img src="../assets/img/weixin.png" />
                <div style="padding: 14px">
                    <span>微信捐助</span>
                </div>
                <img src="../assets/img/zhifubao.jpg" />
                <div style="padding: 14px">
                    <span>支付宝捐助</span>
                </div>
            </div>
            <div class="card">
                <img src="../assets/img/qun.jpg" />
                <div style="padding: 14px">
                    <span>QQ交流群：732208983</span>
                </div>
                <img src="../assets/img/qq.jpg" />
                <div style="padding: 14px">
                    <span>作者QQ：1379239710</span>
                </div>
            </div>
        </div>
    </div>
</template>
  
  
<script>
export default {
    name: "support",
    data() {
        return {};
    },

    methods: {},
};
</script>
  
<style scoped>
.mian{
    height: 93.8vh;
}
.support {
    display: flex;
    /* flex-wrap: wrap; */
    justify-content: center;
    /* align-items: center; */
}

.card {
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: 0.3s;
    margin: 20px;
    width: fit-content;
    height: 73vh;
}

.card img {
    width: 18vw;
    height: 30vh;
}
</style>
  
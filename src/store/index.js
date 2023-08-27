import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex) 

const store = new Vuex.Store({
    state:{
        url: "http://localhost:8081",
    }
})

export default store
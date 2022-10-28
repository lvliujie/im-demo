<template>
  <div class="container">
    <el-row>
      <el-button type="primary" @click="login('patient')">患者登陆</el-button>
      <el-button type="primary" @click="login('doctor')">医生登陆</el-button>
      <el-button type="primary" @click="login('assistant')">医助登陆</el-button>
    </el-row>
  </div>
</template>
  
<script>
import { genTestUserSig } from '../debug/GenerateTestUserSig.js'
export default {
  name: 'Homepage',
  data() {
    return {
      sdkReady: false
    }
  },
  created() {
    this.onSdkReady()
  },
  methods: {
    login(userId) {
      const userSig = genTestUserSig({
        SDKAppID: 1400755069,
        secretKey: '844681682a040d3b6f92c9fa903e19dc59ca0eef76c1f02b8ef1695d6b3020a6',
        userID: userId
      }).userSig;
      let promise = this.tim.login({userID: userId, userSig: userSig});
      const self = this
      promise.then(function(imResponse) {userId
        console.log(userId+'登录成功', imResponse.data); // 登录成功
        if (imResponse.data.repeatLogin === true) {
          // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
          console.log(imResponse.data.errorInfo);
          self.$router.push({name:'conversations'})
        }
      }).catch(function(imError) {
        console.warn('login error:', imError); // 登录失败的相关信息
      });
    },
    onSdkReady() {
      let handler = function() {
        this.$router.push({name:'conversations'})
      }
      this.tim.on(this.TIM.EVENT.SDK_READY, handler, this);
    },
  }
}
</script>
  
<style scoped>
.container{
  margin: 20px;
}
</style>
  
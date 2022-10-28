<template>
  <div>
    <div>
      userId:<input type="text" v-model="senderId">
      <button @click="loginHandler">点击登录im</button>
      <button @click="logoutHandler">退出登录</button>
    </div>
    <div v-if="sdkReady">
      发送对象userId:<input type="text" v-model="receiverId">
      消息:<input type="text" v-model="textMessage">
      <button @click="sendHandler">发送文本消息</button>
    </div>

    <div>
      <h1>聊天记录</h1>
      <ul>
        <li v-for="(message, i) in messages" :key="i">
          昵称：【{{message.nick}}】
          信息：【{{message.payload.text}}】
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { genTestUserSig } from '../debug/GenerateTestUserSig.js'
export default {
  name: 'SingleMessage',
  data() {
    return {
      senderId:'',
      receiverId: '',
      sdkReady: false,
      textMessage: '',
      messages: []
    }
  },
  created() {
    this.onSdkReady()
    this.onMessageReceived()
  },
  methods: {
    loginHandler() {
      let senderId = this.senderId
      const userSig = genTestUserSig({
        SDKAppID: 1400755069,
        secretKey: '844681682a040d3b6f92c9fa903e19dc59ca0eef76c1f02b8ef1695d6b3020a6',
        userID: senderId
      }).userSig;
      let promise = this.tim.login({userID: senderId, userSig: userSig});
      promise.then(function(imResponse) {
        console.log(senderId+'登录成功', imResponse.data); // 登录成功
        if (imResponse.data.repeatLogin === true) {
          // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
          console.log(imResponse.data.errorInfo);
        }
      }).catch(function(imError) {
        console.warn('login error:', imError); // 登录失败的相关信息
      });
    },
    logoutHandler() {
      let promise = this.tim.logout();
      promise.then(function(imResponse) {
        console.log('登出成功'+imResponse.data); // 登出成功
      }).catch(function(imError) {
        console.warn('logout error:', imError);
      });
    },
    sendHandler() {
      let message = this.tim.createTextMessage({ to: this.receiverId, conversationType: 'C2C', payload: { text: this.textMessage }});
      this.tim.sendMessage(message);
      this.messages.push({
        type: this.TIM.TYPES.MSG_TEXT,
        nick: '我',
        payload: {
          text: this.textMessage
        }
      })
    },
    onSdkReady() {
      let handler = function(event) {
        console.log(event)
        this.sdkReady = true
      }
      this.tim.on(this.TIM.EVENT.SDK_READY, handler, this);
    },
    onMessageReceived() {
      let handler = function(event) {
        // event.data - 存储 Message 对象的数组 - [Message]
        const messageList = event.data;
        messageList.forEach((message) => {
          if (message.type === this.TIM.TYPES.MSG_TEXT) {
            this.messages.push(message)
          }
        });
      };
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, handler, this);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<template>
    <div>
      <div>
        <h1>登陆</h1>
        患者/医生id:<input type="text" v-model="userId">
        <button @click="loginHandler">点击登录im</button>
        <button @click="logoutHandler">退出登录</button>
      </div>
      <!-- <div>
        <h1>拉群</h1>    
        医生id:<input type="text" v-model="doctorId">
        医助id:<input type="text" v-model="assistantId">
        <button @click="createGroup">拉群</button>
      </div> -->
      <div>
        <h1>咨询与回复</h1>
        资讯文本内容:<input type="text" v-model="textMessage">
        <button @click="sendHandler('text')">发送</button>
        <button @click="sendHandler('img')">咨询图片内容</button>
      </div>
      <div>
        <h1>咨询群聊天记录</h1>
        <ul>
          <li v-for="(message, i) in messages" :key="i">
            {{message.cloudCustomData}}
            昵称：【{{message.nick}}】
            <div v-if="message.cloudCustomData=='text'">文本信息：【{{message.payload.text}}】</div>
            <div v-else-if="message.cloudCustomData=='img'">图片信息：<img :src="message.payload.text" alt=""></div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { genTestUserSig } from '../debug/GenerateTestUserSig.js'
  export default {
    name: 'GroupMessage',
    data() {
      return {
        userId: 'patient',
        doctorId: 'doctor',
        assistantId: 'assistant',
        sdkReady: false,
        textMessage: '',
        group: {groupID: '@TGS#15PGVAFJR', name: '医疗咨询'},
        messages: [],
        imgUrl: 'http://shimi-test.nos-eastchina1.126.net/tenant/1/jUle0KHy4PL9Pn0784RKcDiR.jpg'
      }
    },
    created() {
      this.onSdkReady()
      this.onMessageReceived()
    },
    methods: {
      sendHandler(mediaType) {
        let message = mediaType == 'img' ? this.imgUrl : this.textMessage
        let messageObj = this.tim.createTextMessage({ 
          to: this.group.groupID, 
          conversationType: 'GROUP', 
          payload: { text: message },
          cloudCustomData: mediaType
        });
        this.tim.sendMessage(messageObj);
        this.messages.push({
          type: this.TIM.TYPES.MSG_TEXT,
          nick: '我',
          payload: { text: message },
          cloudCustomData: mediaType
        })
      },
      onMessageReceived() {
        let handler = function(event) {
          // event.data - 存储 Message 对象的数组 - [Message]
          const messageList = event.data;
          messageList.forEach((message) => {
            if (message.type === this.TIM.TYPES.MSG_TEXT) {
              console.log('======================')
              console.log(message)
              this.messages.push(message)
            }
          });
        };
        this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, handler, this);
      },
      loginHandler() {
        let userId = this.userId
        const userSig = genTestUserSig({
          SDKAppID: 1400755069,
          secretKey: '844681682a040d3b6f92c9fa903e19dc59ca0eef76c1f02b8ef1695d6b3020a6',
          userID: userId
        }).userSig;
        let promise = this.tim.login({userID: userId, userSig: userSig});
        promise.then(function(imResponse) {
          console.log(userId+'登录成功', imResponse.data); // 登录成功
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
      onSdkReady() {
        let handler = function(event) {
          console.log(event)
          this.sdkReady = true
        }
        this.tim.on(this.TIM.EVENT.SDK_READY, handler, this);
      },
      createGroup() {
        if(!this.sdkReady) {
          alert('请先登录')
        }
        // 创建好友工作群
        let promise = this.tim.createGroup({
          type: this.TIM.TYPES.GRP_WORK,
          name: '医疗咨询',
          memberList: [{
            userID: this.userId,
            // 群成员维度的自定义字段，默认情况是没有的，需要开通，详情请参阅自定义字段
            // memberCustomField: [{key: 'group_member_test', value: 'test'}]
          }, {
            userID: this.doctorId
          }, {
            userID: this.assistantId
          }] // 如果填写了 memberList，则必须填写 userID
        });
        let self = this
        promise.then(function(imResponse) { // 创建成功
          console.log(imResponse.data.group); // 创建的群的资料
          self.group = imResponse.data.group
          // 创建群时指定了成员列表，但是成员中存在超过了“单个用户可加入群组数”限制的情况
          // 一个用户 userX 最多允许加入 N 个群，如果已经加入了 N 个群，此时创建群再指定 userX 为群成员，则 userX 不能正常加群
          // SDK 将 userX 的信息放入 overLimitUserIDList，供接入侧处理
          console.log(imResponse.data.overLimitUserIDList); // 超过了“单个用户可加入群组数”限制的用户列表，v2.10.2起支持
        }).catch(function(imError) {
          console.warn('createGroup error:', imError); // 创建群组失败的相关信息
        });
      },
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  </style>
  
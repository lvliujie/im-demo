<template>
  <div class="container">
    <div class="messageArea" ref="messageArea">
      <div v-for="message in messageList" :key="message.ID">
        <span>【{{message.nick}}】:</span>
        <span v-if="message.cloudCustomData=='text'">{{message.payload.text}}</span>
        <span v-else-if="message.cloudCustomData=='img'">
          <img :src="message.payload.text" alt="" style="width: 80px; height: 80px;">
        </span>
        <span v-else-if="message.cloudCustomData=='audio'">
          <audio :src="message.payload.text" controls></audio>
        </span>
        <span v-else>
          {{message.payload}}
        </span>
        <br>
        <span>{{filterTime(message.time)}}</span>
        <el-divider></el-divider>
      </div>
    </div>
    <div class="sendArea">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入文本内容"
        v-model="textMessage">
      </el-input>
      <div class="sendButtonArea">
        <el-button type="primary" @click.native="sendMessage('text')">发送文本消息</el-button>
        <el-button type="primary" @click.native="sendMessage('img')">发送图片消息</el-button>
        <el-button type="primary" @click.native="sendMessage('audio')">发送音频消息</el-button>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'Message',
  props: ['id'],
  data() {
    return {
      messageList: [],
      nextReqMessageID: '',
      isCompleted: false,
      group: {groupID: '@TGS#15PGVAFJR', name: '医疗咨询'},
      textMessage: '',
      imgUrl: 'http://shimi-test.nos-eastchina1.126.net/tenant/1/jUle0KHy4PL9Pn0784RKcDiR.jpg',
      audioUrl: 'http://music.163.com/song/media/outer/url?id=447925558.mp3'
    }
  },
  created() {
    this.getMessages()
    this.onMessageReceived()
  },
  methods: {
    getMessages() {
      // 打开某个会话时，第一次拉取消息列表，注意！第一次拉取时不要传入 nextReqMessageID
      let promise = this.tim.getMessageList({conversationID: this.id});
      const self = this
      promise.then(function(imResponse) {
        self.messageList = imResponse.data.messageList; // 消息列表。
        console.log(self.messageList)
        self.nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
        self.isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
        if(self.messageList.length > 0) {
          self.focusOnLastMessage()
        }
      });
    },
    sendMessage(mediaType) {
      let message = this.textMessage
      if(mediaType == 'img') {
        message = this.imgUrl
      } else if(mediaType == 'audio') {
        message = this.audioUrl
      }
      let messageObj = this.tim.createTextMessage({ 
        to: this.group.groupID, 
        conversationType: 'GROUP', 
        payload: { text: message },
        cloudCustomData: mediaType
      });
      let promise = this.tim.sendMessage(messageObj);
      const self = this
      promise.then(function(imResponse) {
        console.log(imResponse.data.message)
        self.messageList.push(imResponse.data.message)
        self.textMessage = ''
        self.focusOnLastMessage()
      })
    },
    filterTime(time) {
      const date = new Date(time*1000)
      const Y = date.getFullYear()
      const M = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 
      const D = date.getDate()
      const H = date.getHours()
      const m = date.getMinutes()
      return `${Y}-${M}-${D} ${H}:${m}`
    },
    onMessageReceived() {
      let handler = function(event) {
        // event.data - 存储 Message 对象的数组 - [Message]
        const messageList = event.data;
        messageList.forEach((message) => {
          if (message.type === this.TIM.TYPES.MSG_TEXT) {
            console.log('======================')
            console.log(message)
            this.messageList.push(message)
            this.focusOnLastMessage()
          }
        });
      };
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, handler, this);
    },
    focusOnLastMessage() {
      this.$nextTick(() => {
        this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
      })
    }
  }
}
</script>
  
<style scoped>
.container{
  margin: 20px;
}
.messageArea {
  height: 600px;
  overflow-y: auto;
}
.sendArea {
  background: #FFF;
  height: 200px;
  padding: 10px;
  border-width: 2px;
}

.sendButtonArea {
  margin-top: 10px
}

</style>
  
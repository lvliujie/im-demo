<template>
  <div>
    <el-table :data="conversationList" style="width: 100%" @row-click="toMessage">
      <el-table-column
        prop="groupProfile.name"
        label="群组名"
        width="300">
      </el-table-column>
      <el-table-column
        prop="unreadCount"
        label="未读数"
        width="200">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Conversation',
  data() {
    return {
      conversationList: []
    }
  },
  created() {
    this.getConversations()
  },
  methods: {
    getConversations() {
      // 获取全量的会话列表
      let promise = this.tim.getConversationList();
      const self = this
      promise.then(function(imResponse) {
        self.conversationList = imResponse.data.conversationList.filter(c => c.type=='GROUP'); // 全量的会话列表，用该列表覆盖原有的会话列表
      }).catch(function(imError) {
        console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
      });
    },
    toMessage(row) {
      this.$router.push({
        name:'message',
        params: {
          id: row.conversationID
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div id="app">
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click.native="toHomepage">操作页面</el-menu-item>
      <el-menu-item index="2" @click.native="toGroupMessage">配置页面</el-menu-item>
    </el-menu>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  methods: {
    toHomepage() {
      this.$router.push({
        name: 'homepage'
      })
    },
    toGroupMessage() {
      this.$router.push({
        name: 'groupMessages'
      })
    }
  }
}
</script>

<style>

</style>

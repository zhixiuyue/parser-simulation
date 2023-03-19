<template>
  <div class="home">
    <el-container class="container">
      <el-header>
        <span class="title">编译器语法分析模拟系统</span>
      </el-header>
      <el-container class="content-container">
        <el-main><router-view></router-view></el-main>
        <!-- <el-main><router-view :key="$route.fullPath"></router-view></el-main> -->
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.home {
  height: 100%;
}

.container {
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
}

.el-header {
  height: 60px;
  display: flex;
  align-items: center;

  .title {
    font-size: 22px;
  }
}

.content-container {
  position: relative;
  height: 0;
}

.el-main {
  background-color: #E9EEF3;
  padding: 0;
}
</style>

<template>
  <div class="home">
    <el-container class="container">
      <el-header>
        <span class="title">编译器语法分析模拟系统</span>
      </el-header>
      <el-container class="content-container">
        <el-main>
          <div class="content">
            <router-view></router-view>
          </div>
          <RightTips type="examples" :mode="radioMode" />
        </el-main>
        <!-- <el-main><router-view :key="$route.fullPath"></router-view></el-main> -->
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
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
  // background-color: #E9EEF3;
  padding: 0;
  display: flex;
  gap: 10px;
  height: 100%;

  .content {
    flex: 1;
    width: 0;
    height: 100%;
    overflow: auto;
    padding: 20px 8%;
  }
}
</style>

<template>
  <el-header class="app-header" :class="{'fixed-header': fixed}">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">
          <img 
            :src="logo" 
            alt="网站Logo" 
            class="logo-image"
          />
        </router-link>
      </div>
      <el-menu
        :default-active="activeIndex"
        class="nav-menu"
        mode="horizontal"
        :router="true"
        @select="handleSelect"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/trade">约稿</el-menu-item>
        <el-menu-item index="/commission">委托展示</el-menu-item>
        <el-menu-item index="/about">关于我们</el-menu-item>
        <el-menu-item index="/contact">联系我们</el-menu-item>
        
      </el-menu>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import logo from '@/assets/images/logo.png'

const route = useRoute()
const activeIndex = ref(route.path)
const fixed = ref(false)

// 滚动监听函数
const handlescroll = () => {
  if (window.scrollY > 100) {
    fixed.value = true
  } else if (window.scrollY <= 1) {
    fixed.value = false
  }
}

// 组件挂载时添加滚动事件监听
onMounted(() => {
  window.addEventListener('scroll', handlescroll)
})

// 组件卸载时移除滚动事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', handlescroll)
})

const handleSelect = (key) => {
  activeIndex.value = key
}
</script>

<style scoped>
.app-header {
  padding: 0;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: auto;

  /* 吸顶 */
  transition: all 0.5s ease; /* 添加过渡效果 */
  position: relative; /* 默认相对定位 */
  z-index: 1000; /* 确保导航在最上层 */
}

.fixed-header {
  position: fixed; /* 固定定位 */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease; /* 添加下滑动画 */
}

/* 下滑动画 */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo a {
  display: flex;
  align-items: center;
  height: 100%;
  text-decoration: none;
}

.logo-image {
  height: 100px; /* 根据你的图片调整高度 */
  width: auto; /* 保持宽高比 */
  /* 或者设置固定宽度：width: 120px; */
}

/* 添加悬停效果 */
.logo-image:hover {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
.nav-menu {
  border-bottom: none;
  height: auto;
}

.nav-menu .el-menu-item {
  font-size: 17px;
  height: 80px;
  padding: 0 20px;
}
</style>
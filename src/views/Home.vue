<template>
  <div class="home-container">
    <!-- 英雄区域 -->
    <el-row class="hero-section" justify="center" align="middle">
      <el-col :xs="24" :sm="16" :md="12">
        <div class="hero-content">
          <h1 class="hero-title">欢迎来到我的项目</h1>
          <p class="hero-description">
            这是一个基于 Vue 3 + Element Plus 的现代化项目
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="getStarted">
              开始使用
            </el-button>
            <el-button size="large" @click="learnMore">
              了解更多
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 特性介绍 -->
    <div class="features-section">
      <div class="container">
        <h2 class="section-title">项目特性</h2>
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" v-for="feature in features" :key="feature.id">
            <el-card class="feature-card" shadow="hover">
              <template #header>
                <div class="feature-header">
                  <el-icon size="24" :color="feature.color">
                    <component :is="feature.icon" />
                  </el-icon>
                  <h3>{{ feature.title }}</h3>
                </div>
              </template>
              <p>{{ feature.description }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 快速导航 -->
    <div class="quick-nav-section">
      <div class="container">
        <h2 class="section-title">快速导航</h2>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" v-for="nav in quickNavs" :key="nav.name">
            <el-card class="nav-card" shadow="hover" @click="$router.push(nav.path)">
              <div class="nav-content">
                <el-icon size="32" color="#409EFF">
                  <component :is="nav.icon" />
                </el-icon>
                <span>{{ nav.name }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Monitor,
  Setting,
  User,
  Document,
  ChatDotRound,
  InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()

const features = ref([
  {
    id: 1,
    title: '现代化设计',
    description: '采用最新的 Vue 3 和 Element Plus，提供优秀的用户体验',
    icon: Monitor,
    color: '#409EFF'
  },
  {
    id: 2,
    title: '响应式布局',
    description: '完美适配各种设备，从手机到桌面电脑都能良好显示',
    icon: Setting,
    color: '#67C23A'
  },
  {
    id: 3,
    title: '易于使用',
    description: '简洁直观的界面设计，让用户轻松上手',
    icon: User,
    color: '#E6A23C'
  }
])

const quickNavs = ref([
  { name: '关于我们', path: '/about', icon: InfoFilled },
  { name: '联系我们', path: '/contact', icon: ChatDotRound },
  { name: '项目文档', path: '/docs', icon: Document },
  { name: '用户指南', path: '/guide', icon: User }
])

const getStarted = () => {
  ElMessage.success('开始使用项目！')
}

const learnMore = () => {
  router.push('/about')
}
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 120px);
  /* height: 1000000px; */
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.features-section,
.quick-nav-section {
  padding: 80px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #303133;
}

.feature-card {
  height: 100%;
  margin-bottom: 20px;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-header h3 {
  margin: 0;
  color: #303133;
}

.nav-card {
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.nav-card:hover {
  transform: translateY(-5px);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
}

.nav-content span {
  font-weight: 600;
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
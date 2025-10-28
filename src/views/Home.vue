<template>
  <div class="home-container">
    <!-- 顶部展示区域 -->
     <div class="common-layout">
      <Carousel 
        :images="carouselImages"
        :show-buttons="true"
        :primary-button-text="'立即开始'"
        :secondary-button-text="'了解更多'"
        @primary-button-click="handleGetStarted"
        @secondary-button-click="handleLearnMore"
      />
    </div>

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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Monitor,
  Setting,
  User,
  Document,
  ChatDotRound,
  InfoFilled
} from '@element-plus/icons-vue'

// 引入轮播组件
import Carousel from '@/components/common/Carousel.vue'

// 引入图片资源
import christmasImage from '@/assets/images/home/Christmas.png'
import sladeImage from '@/assets/images/home/Slade.png'
import starcatImage from '@/assets/images/home/starcat.png'

const router = useRouter()

// 轮播图数据
const carouselImages = ref([])

// 初始化轮播图数据
const initCarousel = () => {
  carouselImages.value = [christmasImage, sladeImage, starcatImage] // 用实际图片替换
}

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

onMounted(() => {
  // 可以在这里执行一些初始化操作
  initCarousel()
})

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

.common-layout {
  display: flex;
  background: linear-gradient(135deg, #f7ea92 0%, #e7bdc6 100%);
  color: white;
  /* padding: 200px 20px; */
}

.top-pics{
  flex: 1;
  justify-content: center;
  align-items: center;
  /* height: 800px; */
  /* gap: 20px; */
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
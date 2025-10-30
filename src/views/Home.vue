<template>
  <div class="home-container">
    <!-- 顶部展示区域 -->
     <div class="common-layout">
      <!-- <h1 class="hero-title">FUREST</h1> -->
      <Carousel 
        :images="carouselImages"
        :show-buttons="true"
        :show-text="true"
        title="FUREST·HOUSE"
        description="开始我们的旅程"
        :primary-button-text="'委托申请'"
        :secondary-button-text="'更多例图'"
        @primary-button-click="handleGetStarted"
        @secondary-button-click="handleLearnMore"
      />
    </div>

    <div class="features-section">
      <StyleUnion
      />
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
  StarFilled,
  Setting,
  User,
  Document,
  ChatDotRound,
  InfoFilled
} from '@element-plus/icons-vue'

// 引入轮播组件
import Carousel from '@/components/common/Carousel.vue'

// 引入画风分区组件
import StyleUnion from '@/components/home/StyleUnion.vue'

// 引入图片资源
import christmasImage from '@/assets/images/home/Christmas.png'
import sladeImage from '@/assets/images/home/Slade.png'
import starcatImage from '@/assets/images/home/starcat.png'

const router = useRouter()

// 轮播图数据
const carouselImages = ref([])

// 初始化画风分区组件
const styleFeatures = ref([])

// 初始化轮播图数据
const initCarousel = () => {
  carouselImages.value = [christmasImage, sladeImage, starcatImage] // 用实际图片替换
}


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
  .section-title {
    font-size: 2rem;
  }
}
</style>
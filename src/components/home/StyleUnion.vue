<template>
  <!-- 画风分区 -->
  <div class="features-section">
    <div class="container">
      <h2 class="section-title">画风分区</h2>
      
      <el-row :gutter="30">
        <!-- 四个分区 -->
        <el-col :xs="24" :sm="12" :md="8" v-for="category in categories" :key="category.id">
          <div class="category-card">
            <div class="category-header">
              <el-icon size="24" :color="category.color">
                <component :is="category.icon" />
              </el-icon>
              <h3>{{ category.title }}</h3>
              <span class="image-count">({{ category.images.length }}/{{ category.totalImages }}张)</span>
            </div>
            
            <!-- 分区内的图片瀑布流 -->
            <div 
              class="category-gallery" 
              ref="galleryRefs"
              @scroll="handleScroll(category.id)"
            >
              <div 
                class="image-item" 
                v-for="image in category.images" 
                :key="image.id"
                @click="handleImageClick(image)"
              >
                <div class="image-wrapper">
                  <img 
                    :src="image.url" 
                    :alt="image.title"
                    loading="lazy"
                    :style="{ height: image.displayHeight + 'px' }"
                    @load="onImageLoad(image)"
                    @error="onImageError(image)"
                  />
                  <div class="image-overlay">
                    <span class="image-author">{{ image.author }}</span>
                    <div class="image-stats">
                      <span class="stat"><el-icon><StarFilled /></el-icon> {{ image.likes }}</span>
                      <span class="stat"><el-icon><View /></el-icon> {{ image.views }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 加载指示器 -->
              <div class="loading-indicator" v-if="category.loading && category.hasMore">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>加载中...</span>
              </div>
              
              <!-- 没有更多提示 -->
              <div class="no-more" v-if="!category.hasMore && category.images.length > 0">
                <span>已显示全部图片</span>
              </div>
              
              <!-- 空状态 -->
              <div class="empty-state" v-if="category.images.length === 0 && !category.loading">
                <el-empty description="暂无图片" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      
      <!-- 图片详情弹窗 -->
      <el-dialog 
        v-model="dialogVisible" 
        :title="selectedImage?.title"
        width="70%"
        center
      >
        <div class="image-detail">
          <img :src="selectedImage?.url" :alt="selectedImage?.title" />
          <div class="image-info">
            <h4>{{ selectedImage?.title }}</h4>
            <p class="image-description">{{ selectedImage?.description }}</p>
            <div class="image-meta">
              <el-tag type="primary">{{ selectedImage?.category }}</el-tag>
              <span>作者: {{ selectedImage?.author }}</span>
              <span>尺寸: {{ selectedImage?.width }} × {{ selectedImage?.height }}</span>
            </div>
            <div class="image-tags">
              <el-tag 
                v-for="tag in selectedImage?.tags" 
                :key="tag"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="image-actions">
              <el-button type="primary" icon="Star">收藏</el-button>
              <el-button icon="Download">下载</el-button>
              <el-button icon="Share">分享</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { 
    Star,
    StarFilled, 
    Setting, 
    User, 
    Loading, 
    Download, 
    Share,
    PictureFilled,
    View
} from '@element-plus/icons-vue'

// 四个分区的定义
const categories = ref([
  {
    id: 1,
    title: '头像',
    folder: 'head', // 头像文件夹
    icon: Star,
    color: '#409EFF',
    images: [],
    loading: false,
    hasMore: true,
    page: 0,
    totalImages: 0 // 总图片数
  },
  {
    id: 2,
    title: '立绘',
    folder: 'fullbody', // 立绘文件夹
    icon: Setting,
    color: '#67C23A',
    images: [],
    loading: false,
    hasMore: true,
    page: 0,
    totalImages: 0
  },
  {
    id: 3,
    title: '插图',
    folder: 'illustration', // 插图文件夹
    icon: PictureFilled,
    color: '#E6A23C',
    images: [],
    loading: false,
    hasMore: true,
    page: 0,
    totalImages: 0
  },
  {
    id: 4,
    title: '设定图',
    folder: 'character', // 设定图文件夹
    icon: User,
    color: '#E6A23C',
    images: [],
    loading: false,
    hasMore: true,
    page: 0,
    totalImages: 0
  }
])

// 响应式数据
const dialogVisible = ref(false)
const selectedImage = ref(null)
const galleryRefs = ref([])

// 每个分区的图片文件名列表 - 根据你的实际文件更新这里
// 后端API接入
const imageFiles = {
  head: ['虾头.png'], // 头像文件夹中的图片
  fullbody: ['leo.png', '试试凡凡.png'], // 立绘文件夹中的图片
  illustration: ['圣诞节.png', 'starcat.png'], // 插图文件夹中的图片
  character: ['二凡设定图.png', '鹿希设定图.png'] // 设定图文件夹中的图片
}

// 为不同分区生成图片数据
const generateImagesForCategory = (category, startIndex, count) => {
  const categoryConfigs = {
    '头像': {
      widthRange: [150, 250],
      heightRange: [150, 250],
      tags: ['简约', '可爱', '写实', '卡通', '唯美', 'Q版', '古风', '现代'],
      authors: ['星木']
    },
    '立绘': {
      widthRange: [200, 300],
      heightRange: [400, 600],
      tags: ['全身', '半身', '动态', '静态', '背景', '战斗', '休闲', '正式'],
      authors: ['星木']
    },
    '插图': {
      widthRange: [300, 500],
      heightRange: [400, 700],
      tags: ['场景', '人物', '风景', '抽象', '故事', '幻想', '现实', '梦幻'],
      authors: ['星木']
    },
    '设定图': {
      widthRange: [200, 300],
      heightRange: [400, 600],
      tags: ['单视图','双视图', '三视图'],
      authors: ['星木']
    }
  }
  
  const config = categoryConfigs[category.title]
  const folder = category.folder
  const files = imageFiles[folder]
  
  // 计算实际可以加载的图片数量
  const actualCount = Math.min(count, files.length - startIndex)
  
  if (actualCount <= 0) {
    return [] // 没有更多图片可加载
  }
  
  return Array.from({ length: actualCount }, (_, index) => {
    const width = config.widthRange[0] + Math.floor(Math.random() * (config.widthRange[1] - config.widthRange[0]))
    const height = config.heightRange[0] + Math.floor(Math.random() * (config.heightRange[1] - config.heightRange[0]))
    const tags = [...config.tags].sort(() => 0.5 - Math.random()).slice(0, 3)
    const author = config.authors[0]
    
    // 使用实际文件名
    const filename = files[startIndex + index]
    // console.log('Generating image:', filename)
    
    return {
      id: startIndex + index,
      title: `${filename}`, //作品 ${startIndex + index + 1}`,
      category: category.title,
      filename: filename,
      url: `/images/${folder}/${filename}`,
      description: `这是一张的${category.title}`,
      author: author,
      width: width,
      height: height,
      displayHeight: Math.min(height, 500),
      tags: tags,
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 5000)
    }
  })
}

// 图片加载成功处理
const onImageLoad = (image) => {
  // 可以在这里处理图片加载成功后的逻辑
//   console.log(`图片 ${image.filename} 加载成功`)
}

// 图片加载失败处理
const onImageError = (image) => {
//   console.error(`图片 ${image.filename} 加载失败`)
  // 可以在这里设置默认图片或处理错误
}

// 初始化每个分区的总图片数
const initCategoryTotalImages = () => {
  categories.value.forEach(category => {
    category.totalImages = imageFiles[category.folder].length
  })
}

// 加载指定分区的图片
const loadCategoryImages = async (category) => {
  if (category.loading || !category.hasMore) return
  
  category.loading = true
  
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const startIndex = category.images.length
  const newImages = generateImagesForCategory(category, startIndex, 6)
  
  if (newImages.length > 0) {
    category.images.push(...newImages)
  }
  
  // 检查是否还有更多图片可加载
  if (category.images.length >= category.totalImages) {
    category.hasMore = false
  }
  
  category.loading = false
}

// 处理分区内滚动
const handleScroll = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  if (!category) return
  
  const galleryIndex = categories.value.findIndex(c => c.id === categoryId)
  const galleryElement = galleryRefs.value[galleryIndex]
  
  if (!galleryElement) return
  
  const { scrollTop, scrollHeight, clientHeight } = galleryElement
  const scrollBottom = scrollHeight - scrollTop - clientHeight
  
  // 滚动到底部100px内时加载更多
  if (scrollBottom <= 100 && !category.loading && category.hasMore) {
    loadCategoryImages(category)
  }
}

// 处理图片点击
const handleImageClick = (image) => {
  selectedImage.value = image
  dialogVisible.value = true
}

// 初始化加载
onMounted(() => {
  // 初始化总图片数
  initCategoryTotalImages()
  
  // 初始加载所有分区的图片
  categories.value.forEach(category => {
    // 如果图片数量少，直接加载全部
    if (category.totalImages <= 6) {
      loadCategoryImages(category)
    } else {
      // 否则先加载第一页
      loadCategoryImages(category)
    }
  })
})
</script>

<style scoped>
.features-section {
  padding: 80px 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #303133;
}

/* 分区卡片样式 */
.category-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  height: 600px; /* 固定分区高度 */
}

/* 分区头部样式 */
.category-header {
  /* 贴图 */
  /* background-image: url('@/assets/images/starcloseicon.png'); */
  background-color: #f6f6f6;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0; /* 防止header被压缩 */
}

.category-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #303133;
  font-weight: 600;
}

.image-count {
  color: #909399;
  font-size: 0.9rem;
  margin-left: auto;
}

/* 分区内的图片瀑布流 */
.category-gallery {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 图片项样式 */
.image-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
  flex-shrink: 0; /* 防止图片被压缩 */
}

.image-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  overflow: hidden;
}

/* 修改图片不透明度 */
.image-wrapper img {
  width: 100%;
  display: block;
  transition: transform 0.3s ease, opacity 0.3s ease; /* 添加opacity过渡 */
  object-fit: cover; /* 保持图片比例 */
  opacity: 0.7; /* 调整不透明度，0.7表示70%不透明 */
}

.image-item:hover .image-wrapper img {
  transform: scale(1.05);
  opacity: 1; /* 鼠标悬停时恢复完全不透明 */
}

/* 图片悬停效果 */
.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-author {
  font-size: 0.8rem;
  font-weight: 500;
}

.image-stats {
  display: flex;
  gap: 8px;
}

.stat {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* 加载指示器 */
.loading-indicator {
  text-align: center;
  padding: 20px;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
}

.no-more {
  text-align: center;
  padding: 16px;
  color: #c0c4cc;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 图片详情 */
.image-detail {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.image-detail img {
  max-width: 60%;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.image-info {
  flex: 1;
}

.image-info h4 {
  margin: 0 0 12px 0;
  font-size: 1.3rem;
  color: #303133;
}

.image-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 16px;
}

.image-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #909399;
}

.image-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.image-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .category-card {
    height: 550px;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .category-header {
    padding: 16px;
  }
  
  .category-header h3 {
    font-size: 1.2rem;
  }
  
  .category-card {
    height: 500px;
  }
  
  .image-detail {
    flex-direction: column;
  }
  
  .image-detail img {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .features-section {
    padding: 60px 16px;
  }
  
  .category-gallery {
    padding: 12px;
    gap: 12px;
  }
  
  .category-card {
    height: 450px;
  }
}

/* 自定义滚动条 */
.category-gallery::-webkit-scrollbar {
  width: 6px;
}

.category-gallery::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.category-gallery::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.category-gallery::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
<template>
  <div class="carousel-container">
    <div class="carousel" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div 
        class="carousel-item" 
        v-for="(image, index) in images" 
        :key="index"
      >
        <el-image :src="image" fit="cover" class="carousel-image" />
      </div>
    </div>
    
    <!-- 固定按钮区域 - 放在轮播容器内但在轮播图外部 -->
    <div class="carousel-buttons" v-if="showButtons">
      <el-button 
        type="primary" 
        size="large" 
        class="action-btn primary-btn"
        @click="handlePrimaryButtonClick"
      >
        {{ primaryButtonText }}
      </el-button>
      <el-button 
        type="success" 
        size="large" 
        class="action-btn secondary-btn"
        @click="handleSecondaryButtonClick"
      >
        {{ secondaryButtonText }}
      </el-button>
    </div>
    
    <!-- 左右切换按钮 -->
    <button class="carousel-btn prev" @click="prevSlide">
      <el-icon size="24"><ArrowLeftBold /></el-icon>
    </button>
    <button class="carousel-btn next" @click="nextSlide">
      <el-icon size="24"><ArrowRightBold /></el-icon>
    </button>
    
    <!-- 指示器 -->
    <div class="carousel-indicators">
      <span 
        v-for="(_, index) in images" 
        :key="index"
        :class="{ active: currentIndex === index }"
        @click="currentIndex = index"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

// 定义组件属性
const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 4000
  },
  height: {
    type: String,
    default: '500px'
  },
  // 按钮相关属性
  showButtons: {
    type: Boolean,
    default: false
  },
  primaryButtonText: {
    type: String,
    default: '立即开始'
  },
  secondaryButtonText: {
    type: String,
    default: '了解更多'
  }
})

// 定义事件
const emit = defineEmits([
  'primary-button-click',
  'secondary-button-click'
])

// 轮播图状态
const currentIndex = ref(0)
let autoPlayTimer = null

// 上一张
const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1
  resetAutoPlay()
}

// 下一张
const nextSlide = () => {
  currentIndex.value = currentIndex.value === props.images.length - 1 ? 0 : currentIndex.value + 1
  resetAutoPlay()
}

// 处理主要按钮点击
const handlePrimaryButtonClick = () => {
  emit('primary-button-click', {
    currentIndex: currentIndex.value,
    image: props.images[currentIndex.value]
  })
}

// 处理次要按钮点击
const handleSecondaryButtonClick = () => {
  emit('secondary-button-click', {
    currentIndex: currentIndex.value,
    image: props.images[currentIndex.value]
  })
}

// 开始自动轮播
const startAutoPlay = () => {
  if (props.autoPlay && props.images.length > 1) {
    autoPlayTimer = setInterval(() => {
      nextSlide()
    }, props.interval)
  }
}

// 重置自动轮播
const resetAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    startAutoPlay()
  }
}

// 监听 images 变化
watch(() => props.images, (newImages) => {
  if (newImages && newImages.length > 0) {
    startAutoPlay()
  }
})

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  // 清理定时器
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: v-bind(height);
  overflow: hidden;
}

.carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.carousel-item {
  flex: 0 0 100%;
  height: 100%;
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 固定按钮区域样式 - 相对于轮播容器定位 */
.carousel-buttons {
  position: absolute;
  top: 80%; /* 中间偏下位置 */
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: center;
  z-index: 5;
  width: 100%;
  pointer-events: auto; /* 确保按钮可以点击 */
}

.action-btn {
  min-width: 200px;
  height: 60px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  padding: 0 30px;
  white-space: nowrap;
  pointer-events: auto; /* 确保按钮可以点击 */
}

.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.action-btn:active {
  transform: translateY(-2px);
}

.primary-btn {
  background: linear-gradient(45deg, #409EFF, #badbff);
  border: none;
}

.secondary-btn {
  background: linear-gradient(45deg, #67C23A, #f5db7e);
  border: none;
}

/* 左右切换按钮 */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgb(255, 162, 151);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  z-index: 10;
}

.carousel-btn:hover {
  opacity: 1;
  background: rgb(255, 255, 255);
}

.carousel-btn.prev {
  left: 20px;
}

.carousel-btn.next {
  right: 20px;
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.carousel-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.carousel-indicators span.active {
  background: white;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .carousel-buttons {
    gap: 20px;
  }
  
  .action-btn {
    min-width: 180px;
    height: 55px;
    font-size: 16px;
    padding: 0 25px;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    height: 400px;
  }
  
  .carousel-buttons {
    flex-direction: row;
    gap: 15px;
    top: 65%;
    width: 90%;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .action-btn {
    min-width: 140px;
    height: 50px;
    font-size: 14px;
    padding: 0 20px;
    flex: 0 1 auto;
  }
  
  .carousel-btn .icon {
    font-size: 32px;
  }
  
  .carousel-btn.prev {
    left: 15px;
  }
  
  .carousel-btn.next {
    right: 15px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .carousel-buttons {
    gap: 12px;
    width: 95%;
  }
  
  .action-btn {
    min-width: 120px;
    height: 45px;
    font-size: 13px;
    padding: 0 15px;
  }
}

/* 超大屏幕适配 */
@media (min-width: 1600px) {
  .carousel-container {
    height: 850px;
  }
  
  .carousel-buttons {
    gap: 40px;
  }
  
  .action-btn {
    min-width: 240px;
    height: 70px;
    font-size: 20px;
    padding: 0 40px;
  }
  
  .carousel-btn .icon {
    font-size: 48px;
  }
  
  .carousel-btn {
    padding: 16px;
  }
}
</style>
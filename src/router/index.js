import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/trade',
  //   name: 'Trade',
  //   // 懒加载组件
  //   component: Trade
  // },
//   {
//     path: '/about',
//     name: 'About',
//     component: About
//   },
//   {
//     path: '/contact',
//     name: 'Contact',
//     component: Contact
//   }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
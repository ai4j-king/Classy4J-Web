import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgentView from '../views/AgentView.vue'
import WorkflowView from '../views/WorkflowView.vue'
import ChatView from '../views/ChatView.vue'
import ChatHelperView from '../views/ChatHelperView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/agent',
      name: 'agent',
      component: AgentView
    },
    {
      path: '/workflow',
      name: 'workflow',
      component: WorkflowView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/chatHelper',
      name: 'chatHelper',
      component: ChatHelperView
    }
  ]
})

export default router 
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgentView from '../views/AgentView.vue'
import WorkflowView from '../views/WorkflowView.vue'
import KnowledgeView from '@/views/KnowledgeView.vue'
import KnowledgeCreateView from '@/views/KnowledgeCreateView.vue'
import KnowledgeCreateStepTwoView from '@/views/KnowledgeCreateStepTwoView.vue'
import ChatView from '../views/ChatView.vue'
import ChatHelperView from '../views/ChatHelperView.vue'
import ChatAssistantCreate  from '@/views/ChatAssistantCreate.vue'
import AgentAssistantCreate from '@/views/AgentAssistantCreate.vue'
import WorkflowCreate from '@/views/WorkflowCreate.vue'
import KnowledgeCreateStepThridView from '@/views/KnowledgeCreateStepThridView.vue'
import DocListView from '@/views/DocListView.vue'
import KnowledgeLableView from '@/views/KnowledgeLableView.vue'


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
      path: '/knowledge',
      name: 'knowledge',
      component: KnowledgeView
    },
    {
        path: '/knowledge/create',
        name: 'knowledgeCreate',
        component: KnowledgeCreateView
    },
    {
      path: '/knowledge/create/step-two',
      name: 'KnowledgeCreateStepTwo',
      component: KnowledgeCreateStepTwoView
    },
    {
      path: '/knowledge/create/step-three',
      name: 'KnowledgeCreateStepThridView',
      component: KnowledgeCreateStepThridView      
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
    },
    {
      path: '/chat-assistant/create',
      name: 'ChatAssistantCreate',
      component: ChatAssistantCreate
    },
    {
      path: '/agent-assistant/create',
      name: 'AgentAssistantCreate',
      component: AgentAssistantCreate
    },
    {
      path: '/workflow/create',
      name: 'WorkflowCreate',
      component: WorkflowCreate
    },
    {
      path: '/knowledge/docs',
      name: 'DocListView',
      component: DocListView
    },
    {
      path: '/knowledge/label',
      name: 'KnowledgeLableView',
      component: KnowledgeLableView
    }
  ]
})

export default router 
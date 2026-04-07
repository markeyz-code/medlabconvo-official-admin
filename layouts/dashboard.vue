<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Navigation Sidebar -->
    <aside 
      class="fixed left-0 top-0 h-full w-64 bg-white text-slate-800 z-40 border-r border-slate-100 transition-all duration-300"
      :class="[
        isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <!-- Logo Section -->
      <div class="flex items-center h-20 px-6 border-b border-slate-50 mb-4">
        <div class="flex items-center space-x-3 overflow-hidden">
          <img src="@/assets/img/logo.jpeg" class="h-10 w-10 rounded-md ring-2 ring-slate-50" />
          <span class="font-medium text-lg truncate text-slate-900">MedLabConvo</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="px-3 pb-20 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
        <template v-for="item in navigationItems" :key="item.path || item.name">
          <!-- Divider -->
          <div v-if="item.type === 'divider'" class="py-4 px-4">
            <div class="h-px bg-slate-100 w-full"></div>
            <span class="text-sm font-medium text-slate-400 tracking-wider mt-3 block">Security & Access</span>
          </div>

          <!-- Nav Link -->
          <NuxtLink
            v-else
            :to="item.path"
            :class="[
              'group flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative',
              $route.path === item.path 
                ? 'bg-[#033958] text-white' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            ]"
            @click="isMobile && closeSidebar()"
          >
            <Icon :name="item.icon" :class="['w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110', $route.path === item.path ? 'text-white' : 'text-slate-400 group-hover:text-slate-900']" />
            <span class="ml-4 font-medium text-sm tracking-tight">{{ item.name }}</span>
            
            <span 
              v-if="item.badge && item.badge > 0" 
              class="ml-auto px-2 py-0.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </template>
      </nav>

      <!-- Logout Section -->
      <div class="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-100">
        <button
          @click="showLogoutModal = true"
          class="w-full flex items-center px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium text-sm group border border-red-100"
        >
          <Icon name="lucide:log-out" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span class="ml-3 font-semibold text-sm">Sign out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main :class="[
      'transition-all duration-300 min-h-screen flex flex-col',
      isMobile ? 'ml-0' : 'ml-64'
    ]">
      <!-- Top Header -->
      <header class="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center space-x-6">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-600"
          >
            <Icon name="lucide:menu" class="w-6 h-6" />
          </button>
          
          <div>
            <h1 class="text-xl font-medium text-slate-900 leading-tight">{{ currentPageTitle }}</h1>
            <div class="flex items-center text-sm text-slate-500 mt-0.5 font-medium ">
              <span>Admin</span>
              <Icon name="lucide:chevron-right" class="w-3 h-3 mx-2 opacity-50" />
              <span class="text-blue-600">{{ currentPageTitle }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Quick Action -->
          <div class="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-sm font-medium text-slate-600">System Live</span>
          </div>

          <!-- Vertical Divider -->
          <div class="w-px h-8 bg-slate-200 mx-2"></div>

          <!-- User Profile -->
          <div class="flex items-center space-x-3 pl-2">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-slate-900 leading-none mb-1">{{ user?.firstName }} {{ user?.lastName }}</p>
              <p class="text-sm font-medium text-blue-600 ">{{ user?.role?.replace('_', ' ') || 'Admin' }}</p>
            </div>
            <div class="w-10 h-10 bg-[#033958] rounded-xl flex items-center justify-center text-white font-medium ring-4 ring-slate-50 border border-white/10">
              {{ userInitials }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content Content -->
      <div class="flex-1 p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
        <!-- Page Title Description -->
        <div class="mb-10 pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 class="text-2xl font-medium text-slate-900 mb-2 leading-tight tracking-tight">{{ currentPageTitle }}</h2>
            <p class="text-slate-400 text-sm font-medium max-w-2xl leading-relaxed antialiased">{{ currentPageDescription }}</p>
          </div>
          <slot name="header-actions" />
        </div>

        <slot />
      </div>
      
      <!-- Footer -->
      <!-- <footer class="py-6 px-10 border-t border-slate-200 text-slate-400 text-sm flex justify-between items-center bg-white">
        <p>&copy; 2026 MedLabConvo Admin. All rights reserved.</p>
        <div class="flex space-x-6 font-medium text-sm">
          <a href="#" class="hover:text-blue-600 transition-colors">Support</a>
          <a href="#" class="hover:text-blue-600 transition-colors">Documentation</a>
        </div>
      </footer> -->
    </main>

    <!-- Logout Confirmation Modal -->
    <Modal v-model="showLogoutModal" title="Security Confirmation" size="sm">
      <div class="p-6">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="lucide:alert-triangle" class="w-8 h-8 text-red-600" />
        </div>
        <div class="text-center mb-10">
          <h3 class="text-xl font-medium text-slate-900 mb-2 tracking-tight">Ready to leave?</h3>
          <p class="text-slate-400 text-sm font-medium leading-relaxed">Your current session will be terminated and you'll need to re-authenticate to access the portal.</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <button
            @click="showLogoutModal = false"
            class="px-4 py-2.5 text-sm font-medium text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
          >
            Stay Active
          </button>
          <button
            @click="confirmLogout"
            :disabled="logoutLoading"
            class="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
          >
            <div v-if="logoutLoading" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
            <span>{{ logoutLoading ? 'Leaving...' : 'Confirm Signout' }}</span>
          </button>
        </div>
      </div>
    </Modal>

    <!-- Global Loading Overlay -->
    <transition name="fade">
      <div v-if="globalLoading" class="fixed inset-0 bg-[#033958]/10 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div class="bg-white rounded-[2rem] p-10 border border-slate-100 flex flex-col items-center">
          <div class="relative w-16 h-16 mb-6">
            <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-[#033958] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <span class="text-slate-900 font-medium text-sm">Loading...</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '~/components/Icon.vue'
import Modal from '~/components/Modal.vue'
import { useLogout } from '@/composables/modules/auth/useLogout'
import { useUser } from '@/composables/modules/auth/user'
import { useGetUsers } from '@/composables/modules/users/useGetUsers'
import { useGetEnquiries } from '@/composables/modules/enquires/useGetEnquiries'
import { useGetSubscriptions } from '@/composables/modules/subscriptions/useGetSubscriptions'
import { useGetBlogs } from '@/composables/modules/blogs/useGetBlogs'
import { useGetTeamMembers } from '@/composables/modules/teams/useGetTeamMembers'
import { useGetPublications } from '@/composables/modules/publications/useGetPublications'
import { useGetLabCasts } from '@/composables/modules/labcast/useGetLabCasts'
import { useGetProducts } from '@/composables/modules/products/useGetProducts'
import { useGetPrograms } from '@/composables/modules/programs/useGetPrograms'
import { useGetForms } from '@/composables/modules/forms/useGetForms'
import { useGetAuditLogs } from '@/composables/modules/audit/useGetAuditLogs'

// Composables
const { users, getUsers } = useGetUsers()
const { enquiries, getEnquiries } = useGetEnquiries()
const { subscriptions, getSubscriptions } = useGetSubscriptions()
const { blogs, getBlogs } = useGetBlogs()
const { teamMembers, getTeamMembers } = useGetTeamMembers()
const { publications, getPublications } = useGetPublications()
const { labcasts, getLabCasts } = useGetLabCasts()
const { products, getProducts } = useGetProducts()
const { programs, getPrograms } = useGetPrograms()
const { forms, getForms } = useGetForms()
const { auditLogs, getAuditLogs } = useGetAuditLogs()

const router = useRouter()
const route = useRoute()
const { logout, loading: logoutLoading } = useLogout()
const { user } = useUser()

// Reactive data
const isMobile = ref(false)
const sidebarOpen = ref(true)
const globalLoading = ref(false)
const showLogoutModal = ref(false)

// Navigation items
const navigationItems = computed(() => [
  { name: 'Dashboard', path: '/dashboard', icon: 'lucide:layout-grid', badge: null },
  { name: 'Users', path: '/dashboard/users', icon: 'lucide:users', badge: users.value?.length },
  { name: 'About Us', path: '/dashboard/teams', icon: 'lucide:users-2', badge: teamMembers.value?.length },
  { name: 'Enquiries', path: '/dashboard/enquiries', icon: 'lucide:messages-square', badge: enquiries.value?.length },
  { name: 'Subscriptions', path: '/dashboard/subscriptions', icon: 'lucide:mail', badge: subscriptions.value?.length },
  { name: 'Campaigns', path: '/dashboard/campaigns', icon: 'lucide:send', badge: null },
  { name: 'Journo / Convo Stack', path: '/dashboard/publications', icon: 'lucide:file-text', badge: publications.value?.length },
  { name: 'LabCast', path: '/dashboard/labcast', icon: 'lucide:mic', badge: labcasts.value?.length },
  { name: 'Inventory', path: '/dashboard/products', icon: 'lucide:archive', badge: products.value?.length },
  { name: 'Programs', path: '/dashboard/programs', icon: 'lucide:graduation-cap', badge: programs.value?.length },
  { name: 'Blogs', path: '/dashboard/blogs', icon: 'lucide:newspaper', badge: blogs.value?.length },
  { name: 'Forms', path: '/dashboard/forms', icon: 'lucide:clipboard-list', badge: forms.value?.length },
  { name: 'CMS', path: '/dashboard/cms', icon: 'lucide:copy', badge: null },
  
  // Separator / Section for Access Control
  { name: 'divider', path: '', icon: '', badge: null, type: 'divider' },
  { name: 'Roles', path: '/dashboard/access-control/roles', icon: 'lucide:shield-check', badge: null },
  { name: 'Permissions', path: '/dashboard/access-control/permissions', icon: 'lucide:key', badge: null },
  { name: 'Audit Logs', path: '/dashboard/audit', icon: 'lucide:fingerprint', badge: auditLogs.value?.length },
])

const currentPageTitle = computed(() => {
  const item = navigationItems.value.find(item => item.path === route.path)
  return item?.name || 'Admin Console'
})

const currentPageDescription = computed(() => {
  const descriptions = {
    '/dashboard': 'View real-time platform statistics and activity.',
    '/dashboard/users': 'Manage user accounts, roles, and access permissions.',
    '/dashboard/enquiries': 'Respond to customer support tickets and enquiries.',
    '/dashboard/subscriptions': 'Manage your newsletter subscribers and mailing lists.',
    '/dashboard/campaigns': 'Design and send email campaigns to your audience.',
    '/dashboard/teams': 'Manage your team members, leadership profiles, and organizational structure.',
    '/dashboard/labcast': 'Manage your podcast episodes and labcast content.',
    '/dashboard/publications': 'Manage research papers, academic publications, and rich content articles.',
    '/dashboard/cms': 'Manage all dynamic content and pages across your platform seamlessly.',
    '/dashboard/audit': 'View security logs and system activity history.',
    '/dashboard/access-control/roles': 'Define group-based permissions and system roles.',
    '/dashboard/access-control/permissions': 'Manage individual granular system permissions.',
    '/dashboard/style-guide': 'Developer reference for medlabconvo design components.'
  }
  return descriptions[route.path as keyof typeof descriptions] || 'Manage your MedLabConvo platform settings.'
})

const userInitials = computed(() => {
  if (!user.value) return 'U'
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
})

// Methods
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) sidebarOpen.value = false
  else sidebarOpen.value = true
}

const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value
const closeSidebar = () => { if (isMobile.value) sidebarOpen.value = false }

const confirmLogout = async () => {
  try {
    await logout()
    showLogoutModal.value = false
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
    showLogoutModal.value = false
  }
}

provide('globalLoading', globalLoading)

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  try {
    await Promise.all([
      getUsers(),
      getEnquiries(),
      getSubscriptions(),
      getBlogs(),
      getTeamMembers(),
      getPublications(),
      getLabCasts(),
      getProducts(),
      getPrograms(),
      getForms(),
      getAuditLogs()
    ])
  } catch (error) {
    console.error('Core data load failed:', error)
  }
})

onUnmounted(() => window.removeEventListener('resize', checkMobile))
</script>

<style>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.1); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
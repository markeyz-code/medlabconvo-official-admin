<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Navigation Sidebar -->
    <aside 
      :class="[
        'fixed left-0 top-0 h-full bg-white shadow-xl border-r border-slate-200 transition-all duration-300 z-40',
        // Desktop behavior
        'lg:translate-x-0',
        sidebarOpen && !isMobile ? 'lg:w-64' : 'lg:w-16',
        // Mobile behavior
        sidebarOpen && isMobile ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0'
      ]"
    >
    
      <!-- Logo Section -->
      <div class="flex items-center justify-between p-4 border-b border-slate-200">
        <div v-if="sidebarOpen || !isMobile" class="flex items-center space-x-3">
          <img src="@/assets/img/logo.jpeg" class="h-10 w-10 rounded-lg" />
          <!-- <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">O</span>
          </div> -->
          <!-- <span v-if="sidebarOpen || !isMobile" class="font-bold text-xl text-slate-800">medlabconvo</span> -->
        </div>
        
        <button 
          @click="toggleSidebar"
          class="p-2 rounded-lg lg:hidden hover:bg-slate-100 transition-colors"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
          <!-- <Icon name="heroicons:bars-3" class="w-5 h-5 text-slate-600" /> -->
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-6 px-3">
        <div v-for="item in navigationItems" :key="item.name" class="mb-2">
          <NuxtLink
            :to="item.path"
            :class="[
              'w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200',
              $route.path === item.path 
                ? 'bg-black text-white shadow-lg' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            ]"
            @click="isMobile && closeSidebar()"
          >
            <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="sidebarOpen || !isMobile" class="ml-3 font-medium">{{ item.name }}</span>
            <span 
              v-if="(sidebarOpen || !isMobile) && item.badge && item.badge > 0" 
              class="ml-auto px-2 py-1 text-xs rounded-full bg-red-100 text-red-600"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </div>
      </nav>

      <!-- Logout Button -->
      <div class="absolute bottom-4 left-3 right-3">
        <button
          @click="showLogoutModal = true"
          :class="[
            'w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50'
          ]"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 flex-shrink-0" />
          <span v-if="sidebarOpen || !isMobile" class="ml-3 font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main :class="[
      'transition-all duration-300',
      // Desktop margins
      sidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-16',
      // Mobile margins
      'ml-0'
    ]">
      <!-- Top Header -->
      <header class="bg-white shadow-sm border-b border-slate-200 px-4 lg:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Mobile Hamburger Menu -->
            <button
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Icon name="heroicons:bars-3" class="w-6 h-6 text-slate-600" />
            </button>
            
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-slate-800">{{ currentPageTitle }}</h1>
              <p class="text-slate-600 text-sm lg:text-base hidden sm:block">{{ currentPageDescription }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2 lg:space-x-4">
            <!-- Search - Hidden on small screens -->
            <!-- <div class="relative hidden md:block">
              <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="globalSearch"
                type="text"
                placeholder="Search..."
                class="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> -->
            
            <!-- Notifications -->
            <!-- <button class="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Icon name="heroicons:bell" class="w-5 h-5 text-slate-600" />
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button> -->
            
            <!-- User Menu -->
            <div class="flex items-center space-x-2 lg:space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-sm">{{ userInitials }}</span>
              </div>
              <span class="font-medium text-slate-700 hidden sm:block">{{ user?.firstName }} {{ user?.lastName }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-4 lg:p-6">
        <slot />
      </div>
    </main>

    <!-- Logout Confirmation Modal -->
    <Modal v-model="showLogoutModal" title="Confirm Logout" size="sm">
      <div class="text-center py-4">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-600" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Are you sure you want to logout?</h3>
        <p class="text-sm text-gray-500 mb-6">You will be redirected to the homepage and will need to login again to access the dashboard.</p>
        
        <div class="flex space-x-3 justify-center">
          <button
            @click="showLogoutModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmLogout"
            :disabled="logoutLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <div v-if="logoutLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{{ logoutLoading ? 'Logging out...' : 'Yes, Logout' }}</span>
          </button>
        </div>
      </div>
    </Modal>

    <!-- Global Loading Overlay -->
    <div v-if="globalLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="text-slate-700 font-medium">Loading...</span>
      </div>
    </div>
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
const { auditLogs, loading: loadingActivities, getAuditLogs } = useGetAuditLogs()

// Composables
const router = useRouter()
const route = useRoute()
const { logout, loading: logoutLoading } = useLogout()
const { user } = useUser()

// Reactive data
const isMobile = ref(false)
const sidebarOpen = ref(false) // Default closed on mobile
const globalSearch = ref('')
const globalLoading = ref(false)
const showLogoutModal = ref(false)

// Navigation items - Now as computed property to be reactive
const navigationItems = computed(() => [
  { name: 'Dashboard', path: '/dashboard', icon: 'heroicons:home', badge: null },
  { 
    name: 'Users', 
    path: '/dashboard/users', 
    icon: 'heroicons:users', 
    badge: users.value?.length || 0
  },
  { 
    name: 'Enquiries', 
    path: '/dashboard/enquiries', 
    icon: 'heroicons:envelope', 
    badge: enquiries.value?.length || 0
  },
  { 
    name: 'Subscriptions', 
    path: '/dashboard/subscriptions', 
    icon: 'heroicons:newspaper', 
    badge: subscriptions.value?.length || 0
  },
  { 
    name: 'Team Members', 
    path: '/dashboard/teams', 
    icon: 'heroicons:user-group', 
    badge: teamMembers.value?.length || 0
  },
  { 
    name: 'Publications', 
    path: '/dashboard/publications', 
    icon: 'heroicons:document-text', 
    badge: publications.value?.length || 0
  },
  { 
    name: 'LabCast', 
    path: '/dashboard/labcast', 
    icon: 'heroicons:document-text', 
    badge: labcasts.value?.length || 0
  },
  { 
    name: 'Products', 
    path: '/dashboard/products', 
    icon: 'heroicons:document-text', 
    badge: products.value?.length || 0
  },
  { 
    name: 'Programs', 
    path: '/dashboard/programs', 
    icon: 'heroicons:academic-cap', 
    badge: programs.value?.length || 0
  },
  { 
    name: 'Blogs', 
    path: '/dashboard/blogs', 
    icon: 'heroicons:pencil-square', 
    badge: blogs.value?.length || 0
  },
  { 
    name: 'Forms', 
    path: '/dashboard/forms', 
    icon: 'heroicons:clipboard-document-list', 
    badge: forms.value?.length || 0
  },
  { 
    name: 'Audit Logs', 
    path: '/dashboard/audit', 
    icon: 'heroicons:shield-check', 
    badge: auditLogs.value?.length || 0
  },
])

// Computed properties
const currentPageTitle = computed(() => {
  const item = navigationItems.value.find(item => item.path === route.path)
  return item?.name || 'Dashboard'
})

const currentPageDescription = computed(() => {
  const descriptions = {
    '/dashboard': 'Overview of your platform analytics and key metrics',
    '/dashboard/users': 'Manage user accounts, roles, and permissions',
    '/dashboard/enquiries': 'Handle customer inquiries and support requests',
    '/dashboard/subscriptions': 'Manage newsletter subscriptions and communications',
    '/dashboard/teams': 'Organize team members and their roles',
    '/dashboard/labcast': 'Overview of your LabCast episodes and analytics',
    '/dashboard/publications': 'Manage research publications and academic content',
    '/dashboard/programs': 'Create and manage educational programs',
    '/dashboard/blogs': 'Publish and manage blog content',
    '/dashboard/products': 'Manage your books, courses, and digital products.value',
    '/dashboard/forms': 'Create dynamic forms and collect responses',
    '/dashboard/audit': 'Monitor system activities and security logs'
  }
  return descriptions[route.path as keyof typeof descriptions] || ''
})

const userInitials = computed(() => {
  if (!user.value) return 'U'
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
})

// Methods
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint
  if (!isMobile.value) {
    sidebarOpen.value = true // Keep sidebar open on desktop
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

const confirmLogout = async () => {
  try {
    await logout()
    showLogoutModal.value = false
    // Redirect to homepage instead of login
    await router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
    showLogoutModal.value = false
  }
}

// Provide global loading state
provide('globalLoading', globalLoading)

// Load all data on mount
onMounted(async () => {
  // Check mobile on mount
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Load all data
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
    console.error('Failed to load data:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
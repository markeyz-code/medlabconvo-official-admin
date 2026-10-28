<template>
  <div class="auth-shell">
    <!-- Brand panel -->
    <section class="auth-brand-panel">
      <img src="@/assets/img/auth-bg.png" alt="" class="auth-brand-image" />
      <div class="auth-brand-overlay"></div>

      <div class="auth-brand-top">
        <span class="auth-logo">
          <img src="@/assets/img/logo.jpeg" alt="MedLabConvo" />
        </span>
        <span class="auth-logo-copy">
          <strong>MedLabConvo</strong>
          <small>Admin console</small>
        </span>
      </div>

      <div class="auth-brand-bottom">
        <p class="auth-brand-eyebrow">Operations · Editorial · Community</p>
        <h1 class="auth-brand-title">
          One calm place to run the
          <span>MedLabConvo</span> platform.
        </h1>
        <p class="auth-brand-copy">
          Manage people, publish research, and keep every public surface moving —
          with access scoped precisely to each role.
        </p>

        <div class="auth-brand-points">
          <div class="auth-brand-point">
            <Icon name="lucide:shield-check" class="w-4 h-4" />
            <span>Role-based access</span>
          </div>
          <div class="auth-brand-point">
            <Icon name="lucide:activity" class="w-4 h-4" />
            <span>Audited actions</span>
          </div>
          <div class="auth-brand-point">
            <Icon name="lucide:smartphone" class="w-4 h-4" />
            <span>Works on mobile</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Form panel -->
    <section class="auth-form-panel">
      <div class="auth-form-wrap">
        <div class="auth-mobile-logo">
          <span class="auth-logo">
            <img src="@/assets/img/logo.jpeg" alt="MedLabConvo" />
          </span>
          <span class="auth-logo-copy">
            <strong>MedLabConvo</strong>
            <small>Admin console</small>
          </span>
        </div>

        <div class="auth-heading">
          <p class="auth-eyebrow">Secure sign in</p>
          <h2 class="auth-title">Welcome back</h2>
          <p class="auth-subtitle">
            Enter your MedLabConvo email to receive a one-time verification code.
          </p>
        </div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <label class="auth-field">
            <span class="auth-label">Email address</span>
            <span class="auth-input-wrap">
              <Icon name="lucide:mail" class="auth-input-icon" />
              <input
                v-model="loginForm.email"
                type="email"
                autocomplete="email"
                required
                placeholder="you@medlabconvo.com"
                class="auth-input"
              />
            </span>
          </label>

          <label class="auth-field">
            <span class="auth-label">Password</span>
            <span class="auth-input-wrap">
              <Icon name="lucide:lock" class="auth-input-icon" />
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="Enter your password"
                class="auth-input pr-12"
              />
              <button
                type="button"
                class="auth-eye"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
              </button>
            </span>
          </label>

          <div class="auth-row">
            <label class="auth-remember">
              <input v-model="loginForm.rememberMe" type="checkbox" class="custom-checkbox" />
              <span>Remember this device</span>
            </label>
            <NuxtLink to="/forgot-password" class="auth-link">Forgot password?</NuxtLink>
          </div>

          <Transition name="shake">
            <div v-if="error" class="auth-error">
              <Icon name="lucide:alert-circle" class="w-4 h-4 shrink-0" />
              <span>{{ error }}</span>
            </div>
          </Transition>

          <button type="submit" :disabled="loading" class="auth-submit">
            <span v-if="loading" class="auth-spinner"></span>
            <span>{{ loading ? 'Sending your code…' : 'Continue securely' }}</span>
            <Icon v-if="!loading" name="lucide:arrow-right" class="w-4 h-4" />
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Access is invitation-only. Need an account?
            <span>Contact a super admin.</span>
          </p>
          <p class="auth-legal">
            Protected by one-time codes and role-based authorisation.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false,
})

import Icon from '@/components/Icon.vue'
import { useLogin } from '@/composables/modules/auth/useLogin'
import { useUser } from '@/composables/modules/auth/user'
import { landingRouteFor } from '@/utils/routePermissions'
import { useCustomToast } from '@/composables/core/useCustomToast'

const router = useRouter()
const { loading, error, success, login } = useLogin()
const showPassword = ref(false)

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    const { showToast } = useCustomToast()
    showToast({
      title: 'Missing details',
      message: 'Enter your email and password to continue.',
      toastType: 'error',
    })
    return
  }

  try {
    const response: any = await login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    })

    if (response?.requiresOtp) {
      router.push({ path: '/verify-login', query: { email: loginForm.value.email } })
    } else if (success.value) {
      const { hasPermission } = useUser()
      router.push(landingRouteFor(hasPermission))
    }
  } catch (err: any) {
    if (err?.response?.data?.requiresOtp) {
      router.push({ path: '/verify-login', query: { email: loginForm.value.email } })
    }
  }
}

onMounted(() => {
  const { isLoggedIn, hasPermission } = useUser()
  if (isLoggedIn.value) router.push(landingRouteFor(hasPermission))
})
</script>

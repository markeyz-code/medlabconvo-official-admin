<template>
  <div class="auth-shell">
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
        <p class="auth-brand-eyebrow">Two-step verification</p>
        <h1 class="auth-brand-title">
          A second lock on the
          <span>console door.</span>
        </h1>
        <p class="auth-brand-copy">
          Every sign-in is confirmed with a one-time code sent to your official
          MedLabConvo inbox. Nothing moves until you approve it.
        </p>

        <div class="auth-brand-points">
          <div class="auth-brand-point">
            <Icon name="lucide:key-round" class="w-4 h-4" />
            <span>One-time code</span>
          </div>
          <div class="auth-brand-point">
            <Icon name="lucide:clock-3" class="w-4 h-4" />
            <span>Expires in 10 minutes</span>
          </div>
          <div class="auth-brand-point">
            <Icon name="lucide:shield-check" class="w-4 h-4" />
            <span>Audited sign-in</span>
          </div>
        </div>
      </div>
    </section>

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
          <p class="auth-eyebrow">Check your inbox</p>
          <h2 class="auth-title">Enter your security code</h2>
          <p class="auth-subtitle">
            We sent a 6-digit code to
            <strong class="text-slate-900">{{ email }}</strong>.
            Enter it below to finish signing in.
          </p>
        </div>

        <div class="otp-shell">
          <UiVerifyEmailOtpInput
            v-model="otpCode"
            :error="otpError"
            :autoSubmit="false"
          />
        </div>

        <Transition name="shake">
          <div v-if="otpError" class="auth-error">
            <Icon name="lucide:alert-circle" class="w-4 h-4 shrink-0" />
            <span>{{ otpError }}</span>
          </div>
        </Transition>

        <button
          type="button"
          class="auth-submit"
          :disabled="isLoading || !otpCode || otpCode.length !== 6"
          @click="verify"
        >
          <span v-if="isLoading" class="auth-spinner"></span>
          <span>{{ isLoading ? 'Verifying…' : 'Verify and enter' }}</span>
          <Icon v-if="!isLoading" name="lucide:arrow-right" class="w-4 h-4" />
        </button>

        <div class="auth-footer">
          <p>
            Didn't receive the code?
            <button type="button" class="auth-link" :disabled="isLoading" @click="resendOtp">
              Send a new one
            </button>
          </p>
          <NuxtLink to="/" class="auth-link block mt-3">Back to sign in</NuxtLink>
          <p class="auth-legal">
            The code expires after 10 minutes. Never share it with anyone.
          </p>
        </div>
      </div>
    </section>

    <UiFullscreenLoader :isVisible="isLoading" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false,
})

import { useLoader } from '@/composables/core/useLoader'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useUser } from '@/composables/modules/auth/user'
import { useSession } from '@/composables/useSession'
import { landingRouteFor } from '@/utils/routePermissions'
import { auth_api } from '@/api_factory/modules/auth'

const router = useRouter()
const route = useRoute()
const { isLoading, showLoader, hideLoader } = useLoader()
const { showToast } = useCustomToast()
const { refreshUser } = useSession()

const email = ref((route.query.email as string) || '')
const otpCode = ref('')
const otpError = ref('')

onMounted(() => {
  if (!email.value) router.push('/')
})

const verify = async () => {
  if (!otpCode.value || otpCode.value.length !== 6) return

  try {
    showLoader()
    otpError.value = ''
    const response = await auth_api.$_verify_login_otp({
      email: email.value,
      otp: otpCode.value,
    })

    if (response.data?.access_token) {
      const auth = useUser()
      auth.createUser(response.data)
      await refreshUser(true)
      const canEnterAdmin = auth.isAdmin.value

      showToast({
        title: canEnterAdmin ? 'Authenticated' : 'Limited access',
        message: canEnterAdmin
          ? 'Secure login successful.'
          : 'Your account does not have admin permissions yet.',
        toastType: canEnterAdmin ? 'success' : 'warning',
      })

      setTimeout(() => {
        router.push(canEnterAdmin ? landingRouteFor(auth.hasPermission) : '/dashboard/forbidden')
      }, 400)
    }
  } catch (err: any) {
    otpError.value = err.response?.data?.message || 'Invalid verification code'
  } finally {
    hideLoader()
  }
}

const resendOtp = async () => {
  try {
    showLoader()
    showToast({
      title: 'Sign in again',
      message: 'For a new code, restart the sign-in process.',
      toastType: 'info',
    })
    router.push('/')
  } finally {
    hideLoader()
  }
}
</script>

<style scoped>
.otp-shell {
  padding: 4px 0 14px;
}
.otp-shell :deep(input) {
  font-family: var(--mc-font-heading);
}
</style>

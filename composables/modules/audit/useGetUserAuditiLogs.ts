import { ref } from 'vue'
import { audit_api, type AuditLog } from '@/api_factory/modules/audit'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetUserAuditLogs = () => {
    const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const auditLogs = ref<AuditLog[]>([])

  const getUserAuditLogs = async (userId: string, limit?: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await audit_api.$_get_user_audit_logs(userId, limit)
      if ([200, 201].includes(response?.status)) {
      auditLogs.value = response.data
      showToast({
                title: "Success",
                message: response?.data?.message || "Operation successful",
                toastType: "success",
              });
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user audit logs'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetState = () => {
    loading.value = false
    error.value = null
    auditLogs.value = []
  }

  return {
    loading,
    error,
    auditLogs,
    getUserAuditLogs,
    resetState,
  }
}
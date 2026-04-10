import { ref } from 'vue'
import { audit_api, type AuditLog, type AuditQueryParams } from '@/api_factory/modules/audit'
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetAuditLogs = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false)
  const error = ref<string | null>(null)
  const auditLogs = ref<AuditLog[]>([])

  const getAuditLogs = async (params?: AuditQueryParams) => {
    loading.value = true
    error.value = null

    try {
      const response = await audit_api.$_get_audit_logs(params)
      if ([200, 201].includes(response?.status)) {
        auditLogs.value = response.data

      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch audit logs'
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
    getAuditLogs,
    resetState,
  }
}
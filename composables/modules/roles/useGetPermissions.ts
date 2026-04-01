import { ref } from 'vue'
import { roles_api } from '@/api_factory/modules/roles'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useGetPermissions = () => {
    const permissions = ref([] as any[])
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const getPermissions = async () => {
        loading.value = true
        try {
            const res = await roles_api.$_get_permissions()
            permissions.value = res.data || []
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to fetch permissions',
                toastType: 'error'
            })
        } finally {
            loading.value = false
        }
    }

    return { getPermissions, permissions, loading }
}

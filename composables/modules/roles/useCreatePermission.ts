import { ref } from 'vue'
import { roles_api } from '@/api_factory/modules/roles'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCreatePermission = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const createPermission = async (payload: any) => {
        loading.value = true
        try {
            const res = await roles_api.$_create_permission(payload)
            showToast({
                title: 'Success',
                message: 'Permission created successfully',
                toastType: 'success'
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to create permission',
                toastType: 'error'
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { createPermission, loading }
}

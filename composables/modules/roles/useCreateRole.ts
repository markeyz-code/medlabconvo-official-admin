import { ref } from 'vue'
import { roles_api } from '@/api_factory/modules/roles'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCreateRole = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const createRole = async (payload: any) => {
        loading.value = true
        try {
            const res = await roles_api.$_create_role(payload)
            showToast({
                title: 'Success',
                message: 'Role created successfully',
                toastType: 'success'
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to create role',
                toastType: 'error'
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { createRole, loading }
}

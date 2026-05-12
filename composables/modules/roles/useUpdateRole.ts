import { ref } from 'vue'
import { roles_api } from '@/api_factory/modules/roles'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpdateRole = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const updateRole = async (id: string, payload: any) => {
        loading.value = true
        try {
            const res = await roles_api.$_update_role(id, payload)
            showToast({
                title: 'Success',
                message: 'Role updated successfully',
                toastType: 'success'
            })
            return res.data
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update role',
                toastType: 'error'
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { updateRole, loading }
}

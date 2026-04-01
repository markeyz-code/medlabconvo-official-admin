import { ref } from 'vue'
import { roles_api } from '@/api_factory/modules/roles'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useDeleteRole = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const deleteRole = async (id: string) => {
        loading.value = true
        try {
            await roles_api.$_delete_role(id)
            showToast({
                title: 'Success',
                message: 'Role deleted successfully',
                toastType: 'success'
            })
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to delete role',
                toastType: 'error'
            })
            throw error
        } finally {
            loading.value = false
        }
    }

    return { deleteRole, loading }
}

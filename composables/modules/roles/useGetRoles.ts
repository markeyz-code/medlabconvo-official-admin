import { ref } from 'vue'
import { roles_api } from '@/api_factory/modules/roles'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useGetRoles = () => {
    const roles = ref([] as any[])
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const getRoles = async () => {
        loading.value = true
        try {
            const res = await roles_api.$_get_roles()
            roles.value = res.data || []
        } catch (error: any) {
            showToast({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to fetch roles',
                toastType: 'error'
            })
        } finally {
            loading.value = false
        }
    }

    return { getRoles, roles, loading }
}

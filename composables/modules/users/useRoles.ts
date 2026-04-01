import { ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useApiFactory } from '@/api_factory'

export const useRoles = () => {
    const { showToast } = useCustomToast()
    const loading = ref(false)
    const roles = ref<any[]>([])
    const permissions = ref<any[]>([])
    const error = ref<string | null>(null)

    const fetchRoles = async () => {
        loading.value = true
        try {
            const response = await useApiFactory().roles.$_get_roles()
            roles.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch roles'
        } finally {
            loading.value = false
        }
    }

    const fetchPermissions = async () => {
        loading.value = true
        try {
            const response = await useApiFactory().roles.$_get_permissions()
            permissions.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch permissions'
        } finally {
            loading.value = false
        }
    }

    const createRole = async (payload: any) => {
        loading.value = true
        try {
            await useApiFactory().roles.$_create_role(payload)
            showToast({ title: "Role Created", message: "New security role has been provisioned.", toastType: "success" })
            await fetchRoles()
        } catch (err: any) {
            showToast({ title: "Error", message: err.response?.data?.message || "Failed to create role", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    const updateRole = async (id: string, payload: any) => {
        loading.value = true
        try {
            await useApiFactory().roles.$_update_role(id, payload)
            showToast({ title: "Role Updated", message: "Role privileges have been modified.", toastType: "success" })
            await fetchRoles()
        } catch (err: any) {
            showToast({ title: "Error", message: err.response?.data?.message || "Failed to update role", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    const deleteRole = async (id: string) => {
        loading.value = true
        try {
            await useApiFactory().roles.$_delete_role(id)
            showToast({ title: "Role Deleted", message: "Role has been removed from the system.", toastType: "success" })
            await fetchRoles()
        } catch (err: any) {
            showToast({ title: "Error", message: err.response?.data?.message || "Failed to delete role", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        roles,
        permissions,
        error,
        fetchRoles,
        fetchPermissions,
        createRole,
        updateRole,
        deleteRole
    }
}

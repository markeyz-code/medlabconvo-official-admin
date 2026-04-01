export const roles_api = {
    $_get_roles: () => {
        const { $axios } = useApiFactory()
        return $axios.get('/roles')
    },
    $_get_role: (id: string) => {
        const { $axios } = useApiFactory()
        return $axios.get(`/roles/${id}`)
    },
    $_create_role: (payload: any) => {
        const { $axios } = useApiFactory()
        return $axios.post('/roles', payload)
    },
    $_update_role: (id: string, payload: any) => {
        const { $axios } = useApiFactory()
        return $axios.put(`/roles/${id}`, payload)
    },
    $_delete_role: (id: string) => {
        const { $axios } = useApiFactory()
        return $axios.delete(`/roles/${id}`)
    },
    $_get_permissions: () => {
        const { $axios } = useApiFactory()
        return $axios.get('/roles/permissions')
    },
    $_create_permission: (payload: any) => {
        const { $axios } = useApiFactory()
        return $axios.post('/roles/permissions', payload)
    }
}

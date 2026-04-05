import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config"

export const roles_api = {
    $_get_roles: () => {
        return GATEWAY_ENDPOINT_WITH_AUTH.get('/roles')
    },
    $_get_role: (id: string) => {
        return GATEWAY_ENDPOINT_WITH_AUTH.get(`/roles/${id}`)
    },
    $_create_role: (payload: any) => {
        return GATEWAY_ENDPOINT_WITH_AUTH.post('/roles', payload)
    },
    $_update_role: (id: string, payload: any) => {
        return GATEWAY_ENDPOINT_WITH_AUTH.put(`/roles/${id}`, payload)
    },
    $_delete_role: (id: string) => {
        return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/roles/${id}`)
    },
    $_get_permissions: () => {
        return GATEWAY_ENDPOINT_WITH_AUTH.get('/roles/permissions')
    },
    $_create_permission: (payload: any) => {
        return GATEWAY_ENDPOINT_WITH_AUTH.post('/roles/permissions', payload)
    }
}


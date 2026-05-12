import { ref } from 'vue'
import { invitations_api } from '@/api_factory/modules/invitations'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useInvitations = () => {
    const { showToast } = useCustomToast()
    const loading = ref(false)
    const error = ref<string | null>(null)
    const invitationLink = ref('')

    const sendInvitation = async (payload: { email: string; role: string; departmentId?: string; teamId?: string }) => {
        loading.value = true
        error.value = null
        try {
            const response = await invitations_api.$_create_invitation(payload)
            invitationLink.value = `${window.location.origin}/register?token=${response.data.token}`
            showToast({
                title: "Invitation Sent",
                message: `An invite has been dispatched to ${payload.email}.`,
                toastType: "success"
            })
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to send invitation'
            showToast({
                title: "Invite Failed",
                message: error.value as string,
                toastType: "error"
            })
            throw err
        } finally {
            loading.value = false
        }
    }

    const getInvitation = async (token: string) => {
        loading.value = true
        try {
            const response = await invitations_api.$_get_invitation(token)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Invalid or expired invitation'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        invitationLink,
        sendInvitation,
        getInvitation
    }
}

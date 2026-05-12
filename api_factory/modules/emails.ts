import { GATEWAY_ENDPOINT } from '../axios.config'

export const emails_api = {
  $_get_campaigns: () => {
    return GATEWAY_ENDPOINT.get('/emails/campaigns')
  },
  $_create_campaign: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/emails/campaigns', payload)
  },
  $_send_campaign: (id: string) => {
    return GATEWAY_ENDPOINT.post(`/emails/campaigns/${id}/send`)
  }
}

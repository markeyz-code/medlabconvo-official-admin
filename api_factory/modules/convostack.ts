import { GATEWAY_ENDPOINT } from '../axios.config'

export const convostack_api = {
  $_create_publication: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/convostack', payload)
  },
  $_get_publications: () => {
    return GATEWAY_ENDPOINT.get('/convostack/admin')
  },
  $_get_publication_by_slug: (slug: string) => {
    return GATEWAY_ENDPOINT.get(`/convostack/admin/${slug}`)
  },
  $_update_publication: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT.patch(`/convostack/${id}`, payload)
  },
  $_delete_publication: (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/convostack/${id}`)
  },
  $_get_comments: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/convostack/${id}/comments`)
  },
  $_get_studio_stats: () => {
    return GATEWAY_ENDPOINT.get('/convostack/admin/stats')
  },
  $_get_all_comments: () => {
    return GATEWAY_ENDPOINT.get('/convostack/admin/comments')
  },
  $_delete_comment: (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/convostack/comments/${id}`)
  },
  $_set_comment_approval: (id: string, isApproved: boolean) => {
    return GATEWAY_ENDPOINT.patch(`/convostack/comments/${id}/approval`, { isApproved })
  }
}

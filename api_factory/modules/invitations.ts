import { GATEWAY_ENDPOINT_WITH_AUTH, GATEWAY_ENDPOINT } from "../axios.config";

export const invitations_api = {
  $_create_invitation: (data: { email: string; role: string; departmentId?: string; teamId?: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post("/invitations", data);
  },
  $_get_invitation: (token: string) => {
    return GATEWAY_ENDPOINT.get(`/invitations/${token}`);
  },
};

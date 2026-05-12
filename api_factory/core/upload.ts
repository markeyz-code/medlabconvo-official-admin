import { GATEWAY_ENDPOINT } from "../axios.config";

export const upload_api = {
  $_single_upload(data: any) {
    return GATEWAY_ENDPOINT.post("/images", data);
  },
  $_batch_upload(data: any) {
    return GATEWAY_ENDPOINT.post("/images/batch", data);
  }
};

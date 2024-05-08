import { BaseService } from "./BaseService";

export class HomestayService extends BaseService {
  getAll(order) {
    if (order) {
      return super.httpGet(`/homes?order=${order}`);
    }

    return super.httpGet("/homes");
  }

  // Get a homestay by id
  get(id) {
    return super.httpGet(`/homestay/${id}`);
  }

  // Find homestays
  search(query) {
    return super.httpGet(`/homes?search=${query}`);
  }

  create(data) {
    return super.httpPost("/addHome", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const homestayService = new HomestayService();

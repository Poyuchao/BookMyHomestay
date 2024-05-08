import { BaseService } from "./BaseService";

export class FavoriteService extends BaseService {
  getAll() {
    return super.httpGet("/favorite");
  }

  // Get a homestay by id
  add(id) {
    return super.httpPost(`/favorite/add`, {
      homestay_id: id,
    });
  }

  delete(id) {
    return super.httpPost(`/favorite/delete`, {
      homestay_id: id,
    });
  }
}

export const favoriteService = new FavoriteService();

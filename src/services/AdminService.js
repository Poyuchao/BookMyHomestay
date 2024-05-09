import { BaseService } from "./BaseService";

export class AdminService extends BaseService {
  getAllUsers() {
    return super.httpGet("/users");
  }

  searchUsers(query) {
    return super.httpGet(`/users?search=${query}`);
  }

  unlockAccount(userId) {
    return super.httpPost(`/admin/unlockAccount`, {
      user_id: userId,
    });
  }
}

export const adminService = new AdminService();

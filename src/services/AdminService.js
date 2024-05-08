import { BaseService } from "./BaseService";

export class AdminService extends BaseService {
  getAllUsers() {
    return super.httpGet("/users");
  }

  searchUsers(query) {
    return super.httpGet(`/users?search=${query}`);
  }
}

export const adminService = new AdminService();

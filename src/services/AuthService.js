import { BaseService } from "./BaseService";

export class AuthService extends BaseService {
  async login(data) {
    const loggedUser = await super.httpPost("/login", data);

    if (!loggedUser) {
      return null;
    }

    console.log("User logged in", JSON.stringify(loggedUser, null, 4));

    localStorage.setItem("authToken", loggedUser.data.session);
    localStorage.setItem("loginUser", JSON.stringify(loggedUser.data.user));

    return loggedUser;
  }

  register(data) {
    return super.httpPost("/register", data);
  }

  async logout(skipRequest = false) {
    if (!skipRequest) {
      await super.httpPost("/logout", {});
    }

    console.log("User logged out");
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginUser");
  }

  getLoggedUser() {
    const user = localStorage.getItem("loginUser");

    if (!user) {
      console.log("User not found in local storage");
      return null;
    }

    try {
      console.log("User found in local storage");
      return JSON.parse(user);
    } catch (e) {
      console.log("Error parsing user data from local storage: ", e);
      localStorage.removeItem("loginUser");
      return null;
    }
  }
}

export const authService = new AuthService();

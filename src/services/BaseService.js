import { httpLocal } from "../http-common";

export class BaseService {
  getHeaders(configHeaders = {}) {
    const base = {
      "Content-Type": "application/json",
    };

    const authToken = localStorage.getItem("authToken");

    if (authToken && authToken !== "undefined") {
      Reflect.set(base, "X-Token", `Bearer ${authToken}`);
    }

    return {
      ...base,
      ...configHeaders,
    };
  }

  /**
   * @param {string} path
   * @param {import('axios').AxiosRequestConfig<any> | undefined} config
   */
  httpGet(path, config = {}) {
    return httpLocal
      .get(path, {
        ...config,
        headers: this.getHeaders(config.headers),
      })
      .then((response) => {
        this.logoutIfUnauthorized({ response });

        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.logoutIfUnauthorized(error);
        throw error;
      });
  }

  /**
   * @param {string} path
   * @param {Record<string, any>} data
   * @param {import('axios').AxiosRequestConfig<any> | undefined} config
   */
  httpPost(path, data, config = {}) {
    return httpLocal
      .post(path, data, {
        ...config,
        headers: this.getHeaders(config.headers),
      })
      .then((response) => {
        this.logoutIfUnauthorized({ response });

        return response.data;
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        this.logoutIfUnauthorized(error);
        throw error;
      });
  }

  logoutIfUnauthorized(error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("loginUser");
    }
  }
}

import { httpLocal } from "../http-common";

export class BaseService {
  getHeaders(configHeaders = {}) {
    // Default headers
    const baseHeaders = {
      "Content-Type": "application/json",
    };

    // Add token to headers if it exists
    const authToken = localStorage.getItem("authToken");

    if (authToken && authToken !== "undefined") {
      // Use Reflect.set to add a new property to the object
      Reflect.set(baseHeaders, "X-Token", `Bearer ${authToken}`);
    }

    return {
      ...baseHeaders,
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

        return response;
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
      //  window.location.reload();
    }
  }
}

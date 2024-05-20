import axios from "axios";
import type { AxiosError } from "axios";
import settings from "@/config/settings";

const request = axios.create({
  baseURL: settings.baseURL,
  timeout: settings.requestTimeout,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token !== null) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }

  // config.validateStatus = (status) => status < 500;

  return config;
}, errorHandler);

request.interceptors.response.use((response) => response.data, errorHandler);

export async function errorHandler(error: AxiosError): Promise<void> {
  if (error.response !== null) {
    // server responded with a status code that falls out of the range of 2xx
    if (error.response?.status === 403) {
      //
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }

    await Promise.reject(error.response);
  }

  if (error.request !== null) {
    // no response received from server
    await Promise.reject(error.request);
  }

  // something happened in setting up the request
  console.error(error.message);

  console.log("Error config object:", error.config);

  // Using toJSON you get an object with more information about the HTTP error
  console.log("\nError object as json:", error.toJSON());

  await Promise.reject(error);
}

export default request;

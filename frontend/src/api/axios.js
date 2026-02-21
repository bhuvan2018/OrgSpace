import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (orgId) config.headers["x-org-id"] = orgId;

  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default instance;
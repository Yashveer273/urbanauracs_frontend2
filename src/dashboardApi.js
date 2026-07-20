import axios from "axios";
import { API_BASE_URL } from "./API";



/*
|--------------------------------------------------------------------------
| Dashboard Axios instance
|--------------------------------------------------------------------------
*/

const dashboardApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Remove dashboard authentication
|--------------------------------------------------------------------------
*/

export const clearDashboardAuth = () => {
  localStorage.removeItem(
    "urbanauraservicesdashauthToken",
  );

  localStorage.removeItem(
    "urbanauraservicesdashtagAccess",
  );

  /*
   * Inform the main Dashboard component that
   * authentication has been removed.
   */
  window.dispatchEvent(
    new Event("dashboard-auth-invalid"),
  );
};

/*
|--------------------------------------------------------------------------
| Add token to every protected request
|--------------------------------------------------------------------------
*/

dashboardApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "urbanauraservicesdashauthToken",
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/*
|--------------------------------------------------------------------------
| Remove token only when backend says JWT is invalid
|--------------------------------------------------------------------------
|
| Important:
| Old password incorrect can also return 401.
| Therefore, we remove the saved token only when:
|
| valid: false
|
*/

dashboardApi.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const valid = error.response?.data?.valid;

    if (status === 401 && valid === false) {
      clearDashboardAuth();
    }

    return Promise.reject(error);
  },
);

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const loginDashAuth = async (loginData) => {
  return dashboardApi.post(
    "/api/login-dashAuth",
    loginData,
  );
};

/*
|--------------------------------------------------------------------------
| Check saved token
|--------------------------------------------------------------------------
*/

export const checkDashAuthToken = async () => {
  return dashboardApi.get(
    "/api/check-dashAuth-token",
  );
};

/*
|--------------------------------------------------------------------------
| Get dashboard accounts
|--------------------------------------------------------------------------
*/

export const fetchdashAuth = async () => {
  return dashboardApi.get(
    "/api/get-dashAuth",
  );
};

/*
|--------------------------------------------------------------------------
| Create dashboard subordinate
|--------------------------------------------------------------------------
*/

export const createDashAuth = async (userData) => {
  return dashboardApi.post(
    "/api/create-dashAuth",
    userData,
  );
};

/*
|--------------------------------------------------------------------------
| Update account permissions
|--------------------------------------------------------------------------
*/

export const updateDashAuth = async (
  id,
  tags,
) => {
  return dashboardApi.put(
    `/api/update-dashAuth/${id}`,
    {
      tags,
    },
  );
};

/*
|--------------------------------------------------------------------------
| Delete dashboard account
|--------------------------------------------------------------------------
*/

export const deleteDashAuth = async (id) => {
  return dashboardApi.delete(
    `/api/delete-dashAuth/${id}`,
  );
};

/*
|--------------------------------------------------------------------------
| Change logged-in admin password
|--------------------------------------------------------------------------
*/

export const changeDashAuthPassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  return dashboardApi.put(
    "/api/change-dashAuth-password",
    {
      oldPassword,
      newPassword,
      confirmPassword,
    },
  );
};

export default dashboardApi;
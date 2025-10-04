// Backend API base URL - change this to your production URL when deploying
const DEFAULT_API_BASE_URL = "http://localhost:4000/api/v1";

export const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : DEFAULT_API_BASE_URL;

const rawMockSetting =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_USE_API_MOCKS;

// Disable mock APIs to use real backend
export const USE_API_MOCKS = rawMockSetting === "true" ? true : false;

export const MOCK_WARNING_PREFIX = "[API mock]";

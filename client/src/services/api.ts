import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
  // 1. On Web: always connect to localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }

  // 2. Explicit environment variable if configured
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 3. Expo Go on physical device: dynamically resolve computer's Wi-Fi IP from Metro hostUri
  const hostUri = Constants.expoConfig?.hostUri ?? (Constants.manifest2 as any)?.extra?.expoClient?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:5000/api`;
    }
  }

  // 4. Default fallback to local Wi-Fi IP
  return 'http://192.168.1.9:5000/api';
};

export const API_BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentAuthToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  currentAuthToken = token;
};

export const getAuthToken = (): string | null => {
  return currentAuthToken;
};

apiClient.interceptors.request.use((config) => {
  if (currentAuthToken) {
    config.headers.Authorization = `Bearer ${currentAuthToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorPayload = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network request failed. Is the server running?',
    };
    return Promise.reject(errorPayload);
  }
);

// lib/auth-utils.ts
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
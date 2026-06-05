import apiClient from "./client";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  role: string;
  driverId: string | null;
};

export type CurrentUser = {
  id: string;
  email: string;
  role: string;
  driverId: string | null;
  displayName: string;
};

export type RegisterDriverRequest = {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/Auth/login", request);

  return response.data;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get<CurrentUser>("/Auth/me");

  return response.data;
}

export async function registerDriver(
  request: RegisterDriverRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/Auth/register-driver",
    request
  );

  return response.data;
}
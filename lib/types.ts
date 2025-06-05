export interface FormDataCreate {
  name: string
  phone: string
  duration_minutes: number
}

export interface User {
  name: string;
  email: string;
  phone_number: string
}

export interface FormDataResponse {
  id: string
  name: string
  phone: string
  qr_code_data?: string
  created_at: string
  expires_at: string
  user: User
}

export interface QRValidationData {
  name: string;
  phone: string;
  created_at: string;
  expires_at: string;
  user: User;
}

export interface QRValidationResponse {
  valid: boolean;
  message: string;
  data?: QRValidationData;
}

export interface FormDataUpdate {
  name?: string
  phone?: string
  duration_minutes?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
}

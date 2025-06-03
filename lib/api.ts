import { authService } from "./auth-service";

// Définir l'URL de base de l'API
const API_BASE_URL = "https://projet-genetics-api.onrender.com";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Interfaces pour les données de formulaire
interface FormDataCreate {
  [key: string]: any;
}

interface FormDataResponse {
  id: string;
  [key: string]: any;
}

interface FormDataUpdate {
  [key: string]: any;
}

interface QRValidationResponse {
  isValid: boolean;
  message?: string;
  formData?: FormDataResponse;
}

// Fonction utilitaire pour les requêtes authentifiées
const authenticatedFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = authService.getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expiré ou invalide
    authService.logout();
    window.location.href = "/connexion";
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  return response;
};

// Classe ApiService pour gérer les appels API
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await authenticatedFetch(endpoint, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue",
      };
    }
  }

  // Créer un nouveau formulaire
  async createForm(formData: FormDataCreate): Promise<ApiResponse<FormDataResponse>> {
    return this.request<FormDataResponse>("/forms/create-form", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  }

  // Récupérer tous les formulaires
  async getAllForms(skip = 0, limit = 100): Promise<ApiResponse<FormDataResponse[]>> {
    return this.request<FormDataResponse[]>(`/forms/all?skip=${skip}&limit=${limit}`);
  }

  // Récupérer un formulaire par ID
  async getForm(formId: string): Promise<ApiResponse<FormDataResponse>> {
    return this.request<FormDataResponse>(`/forms/${formId}`);
  }

  // Mettre à jour un formulaire
  async updateForm(formId: string, formData: FormDataUpdate): Promise<ApiResponse<FormDataResponse>> {
    return this.request<FormDataResponse>(`/forms/${formId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
  }

  // Supprimer un formulaire
  async deleteForm(formId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/forms/${formId}`, {
      method: "DELETE",
    });
  }

  // Valider un QR code
  async validateQRCode(qrData: string): Promise<ApiResponse<QRValidationResponse>> {
    const encodedQrData = encodeURIComponent(qrData);
    return this.request<QRValidationResponse>(`/forms/validate-qr-code?qr_data=${encodedQrData}`);
  }

  // Renouveler un QR code
  async renewQRCode(formId: string, durationMinutes: number): Promise<ApiResponse<FormDataResponse>> {
    return this.request<FormDataResponse>(`/forms/${formId}/renew?duration_minutes=${durationMinutes}`, {
      method: "POST",
    });
  }
}

// Exporter une instance de ApiService
export const apiService = new ApiService();


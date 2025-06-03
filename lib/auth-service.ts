// Définition des URLs de base de l'API
const API_BASE_URL = "https://projet-genetics-api.onrender.com";


// Types pour les requêtes et réponses
export interface LoginRequest {
  username: string; 
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserToken {
  id: string;
  email: string;
  name: string;
}

// Service API pour l'authentification
export const authService = {
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    try {
      const formData = new FormData();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur lors de la connexion");
      }

      const data = await response.json();

      // Stocker le token dans le localStorage
      localStorage.setItem("token", data.access_token);

      return data;
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la connexion");
    }
  },


  // Récupération du token stocké
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  // Déconnexion (suppression du token)
  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  // Vérification si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") !== null;
    }
    return false;
  },
};


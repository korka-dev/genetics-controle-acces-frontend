const API_BASE_URL = "https://projet-genetics-api.onrender.com"

// Types pour les requêtes et réponses
export interface UserCreateRequest {
  name: string
  email: string
  password: string
  phone_number: string
}

export interface UserResponse {
  id: number
  name: string
  email: string
  phone_number: string
  created_at: string
}


// Service API pour les utilisateurs
export const userService = {
    
  register: async (userData: UserCreateRequest): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Gérer le cas spécifique du status 409
        if (response.status === 409) {
          throw new Error("Cet utilisateur existe déjà. Veuillez vous connecter.")
        }

        throw new Error(errorData.detail || "Erreur lors de l'inscription")
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'inscription")
    }
  },

  // Récupération de tous les utilisateurs
  getAllUsers: async (): Promise<UserResponse[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Erreur lors de la récupération des utilisateurs")
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la récupération des utilisateurs")
    }
  },

}



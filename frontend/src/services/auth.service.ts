import axios from 'axios';
import { ref } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface User {
  id: string;
  username: string;
}

interface LoginResponse {
  access_token: string;
}

class AuthService {
  private user = ref<User | null>(null);
  private token = ref<string | null>(null);

  constructor() {
    this.token.value = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.user.value = JSON.parse(userStr);
      } catch (e) {
        console.error('Erreur lors de la lecture des données utilisateur:', e);
        localStorage.removeItem('user');
      }
    }
  }

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
        username,
        password,
      });

      const { access_token } = response.data;
      this.token.value = access_token;
      localStorage.setItem('token', access_token);

      // Récupérer les informations de l'utilisateur
      await this.getCurrentUser();
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token.value) {
      return null;
    }

    try {
      const response = await axios.get<User>(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token.value}`,
        },
      });

      this.user.value = response.data;
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      this.logout();
      return null;
    }
  }

  logout(): void {
    this.token.value = null;
    this.user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.token.value;
  }

  getToken(): string | null {
    return this.token.value;
  }

  getUser(): User | null {
    return this.user.value;
  }
}

export const authService = new AuthService(); 
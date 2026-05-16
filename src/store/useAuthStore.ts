import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  subdomain: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  tenantId: string | null;
  login: (data: any) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  tenantId: null,

  login: (data) => {
    const token = data.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    localStorage.setItem("token", token);
    localStorage.setItem("tenantId", data.tenant.id);
    localStorage.setItem("tenantSubdomain", data.tenant.subdomain);
    localStorage.setItem("userName", data.tenant.name);
    localStorage.setItem("userRole", role);

    set({
      isLoggedIn: true,
      tenantId: data.tenant.id,
      user: {
        id: data.tenant.id,
        name: data.tenant.name,
        subdomain: data.tenant.subdomain,
        role: role
      }
    });
  },

  logout: () => {
    localStorage.clear();
    set({ isLoggedIn: false, user: null, tenantId: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userName = localStorage.getItem("userName");
      const userRole = localStorage.getItem("userRole");
      const tenantSubdomain = localStorage.getItem("tenantSubdomain");
      const tenantId = localStorage.getItem("tenantId");

      set({
        isLoggedIn: true,
        tenantId: tenantId,
        user: {
          id: tenantId || "",
          name: userName || "",
          subdomain: tenantSubdomain || "",
          role: userRole || ""
        }
      });
      return true;
    }
    return false;
  }
}));

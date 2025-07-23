class GatewayAuthService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    } catch (e) {
      return { success: false, error: 'Network error' };
    }
  }

  async checkRole() {
    try {
      const response = await fetch(`${this.baseUrl}/api/role`, {
        credentials: 'include'
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  }

  async logout() {
    try {
      await fetch(`${this.baseUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // ignore
    }
  }
}

export default GatewayAuthService;

/**
 * API Client for CashMag Backend
 * 
 * Handles:
 * - Authentication (JWT tokens)
 * - Idempotency keys for payments
 * - Automatic token refresh
 * - Error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiOptions extends RequestInit {
  idempotencyKey?: string;
}

class ApiClient {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage
    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('auth_refresh_token');
  }

  /**
   * Set authentication tokens
   */
  setTokens(token: string, refreshToken: string): void {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_refresh_token', refreshToken);
  }

  /**
   * Clear authentication tokens
   */
  clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Make API request
   */
  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { idempotencyKey, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    // Add authentication
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add idempotency key
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 - try to refresh token
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAuthToken();
      if (refreshed) {
        // Retry request with new token
        headers['Authorization'] = `Bearer ${this.token}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
        });
        return this.handleResponse<T>(retryResponse);
      }
    }

    return this.handleResponse<T>(response);
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(error.error || 'Request failed', response.status, error);
    }

    return response.json();
  }

  /**
   * Refresh authentication token
   */
  private async refreshAuthToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.token, data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    this.clearTokens();
    return false;
  }

  // ============================================
  // AUTH METHODS
  // ============================================

  async login(email: string, password: string) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setTokens(response.token, response.refreshToken);
    return response;
  }

  logout(): void {
    this.clearTokens();
  }

  // ============================================
  // PRODUCT METHODS
  // ============================================

  async getProducts() {
    return this.request<any[]>('/products');
  }

  async createProduct(product: any) {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  // ============================================
  // TRANSACTION METHODS
  // ============================================

  async getTransactions() {
    return this.request<any[]>('/transactions');
  }

  async createTransaction(transaction: any) {
    return this.request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  // ============================================
  // PAYMENT METHODS (with idempotency)
  // ============================================

  async processPayment(paymentData: any, idempotencyKey: string) {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
      idempotencyKey,
    });
  }

  async refundPayment(paymentId: string, idempotencyKey: string) {
    return this.request<any>(`/payments/${paymentId}/refund`, {
      method: 'POST',
      idempotencyKey,
    });
  }

  async getPayment(paymentId: string) {
    return this.request<any>(`/payments/${paymentId}`);
  }

  async getCircuitStatus() {
    return this.request<any>('/payments/circuit-status');
  }

  // ============================================
  // USER METHODS
  // ============================================

  async getUsers() {
    return this.request<any[]>('/users');
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Export singleton instance
export const api = new ApiClient();

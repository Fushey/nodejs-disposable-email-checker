/**
 * TempMailChecker Node.js SDK
 * 
 * Detect disposable email addresses using the TempMailChecker API.
 */

export interface CheckResponse {
  temp: boolean;
}

export interface UsageResponse {
  usage_today: number;
  limit: number;
  reset: string;
}

export interface TempMailCheckerOptions {
  endpoint?: string;
  timeout?: number;
}

/**
 * Regional endpoint URLs
 * All endpoints use /check and /usage directly (no /api prefix)
 */
export const ENDPOINT_EU = 'https://tempmailchecker.com';
export const ENDPOINT_US = 'https://us.tempmailchecker.com';
export const ENDPOINT_ASIA = 'https://asia.tempmailchecker.com';

/**
 * Default base API URL (EU endpoint)
 */
const DEFAULT_ENDPOINT = ENDPOINT_EU;
const DEFAULT_TIMEOUT = 10000; // 10 seconds

export class TempMailChecker {
  private apiKey: string;
  private endpoint: string;
  private timeout: number;

  /**
   * Create a new TempMailChecker instance
   * 
   * @param apiKey Your TempMailChecker API key
   * @param options Optional configuration
   */
  constructor(apiKey: string, options: TempMailCheckerOptions = {}) {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API key is required');
    }

    this.apiKey = apiKey;
    this.endpoint = options.endpoint || DEFAULT_ENDPOINT;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
  }

  /**
   * Set request timeout
   * 
   * @param milliseconds Timeout in milliseconds
   * @returns Self for chaining
   */
  setTimeout(milliseconds: number): this {
    this.timeout = milliseconds;
    return this;
  }

  /**
   * Check if an email address is disposable
   * 
   * @param email Full email address to check
   * @returns Promise<boolean> True if disposable, false if legitimate
   */
  async isDisposable(email: string): Promise<boolean> {
    const result = await this.check(email);
    return result.temp === true;
  }

  /**
   * Check if a domain is disposable
   * 
   * @param domain Domain name to check (e.g., 'tempmail.com')
   * @returns Promise<boolean> True if disposable, false if legitimate
   */
  async isDisposableDomain(domain: string): Promise<boolean> {
    const result = await this.checkDomain(domain);
    return result.temp === true;
  }

  /**
   * Check an email address and return full response
   * 
   * @param email Full email address to check
   * @returns Promise<CheckResponse> Response with 'temp' boolean
   */
  async check(email: string): Promise<CheckResponse> {
    if (!email || email.trim() === '') {
      throw new Error('Email address is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address format');
    }

    const url = this.getApiUrl('/check');
    const params = new URLSearchParams({ email });

    return this.makeRequest<CheckResponse>(url, params, true);
  }

  /**
   * Check a domain and return full response
   * 
   * @param domain Domain name to check
   * @returns Promise<CheckResponse> Response with 'temp' boolean
   */
  async checkDomain(domain: string): Promise<CheckResponse> {
    if (!domain || domain.trim() === '') {
      throw new Error('Domain is required');
    }

    // Clean domain
    let cleanDomain = domain.trim();
    // Remove protocol if present
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    // Remove path if present
    cleanDomain = cleanDomain.split('/')[0];
    // Remove port if present
    cleanDomain = cleanDomain.split(':')[0];

    const url = this.getApiUrl('/check');
    const params = new URLSearchParams({ domain: cleanDomain });

    return this.makeRequest<CheckResponse>(url, params, true);
  }

  /**
   * Get current API usage statistics
   * 
   * @returns Promise<UsageResponse> Usage stats
   */
  async getUsage(): Promise<UsageResponse> {
    const url = this.getApiUrl('/usage');
    const params = new URLSearchParams({ key: this.apiKey });

    return this.makeRequest<UsageResponse>(url, params, false);
  }

  /**
   * Get the full API URL
   * 
   * All endpoints use paths directly: /check, /usage (no /api prefix)
   * 
   * @param path API endpoint path (e.g., '/check', '/usage')
   * @returns Full URL
   */
  private getApiUrl(path: string): string {
    const base = this.endpoint.endsWith('/') 
      ? this.endpoint.slice(0, -1) 
      : this.endpoint;
    return `${base}${path}`;
  }

  /**
   * Make an API request
   * 
   * @param url Full API URL
   * @param params Query parameters
   * @param requireAuth Whether to include API key header
   * @returns Promise<T> Decoded JSON response
   */
  private async makeRequest<T>(
    url: string,
    params: URLSearchParams,
    requireAuth: boolean = true
  ): Promise<T> {
    const fullUrl = `${url}?${params.toString()}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      headers['X-API-Key'] = this.apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          `Rate limit exceeded: ${data.message || 'Daily limit reached'}`
        );
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMsg = data.error || 'API request failed';
        throw new Error(`${errorMsg} (HTTP ${response.status})`);
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(`Request failed: ${error.message || 'Unknown error'}`);
    }
  }
}

// Default export
export default TempMailChecker;


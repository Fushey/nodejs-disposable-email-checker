import TempMailChecker, { ENDPOINT_EU, ENDPOINT_US, ENDPOINT_ASIA } from './index';

describe('TempMailChecker', () => {
  const apiKey = process.env.TEMPMAILCHECKER_API_KEY || 'test_key';

  describe('Initialization', () => {
    it('should create instance with API key', () => {
      const checker = new TempMailChecker(apiKey);
      expect(checker).toBeInstanceOf(TempMailChecker);
    });

    it('should throw error if API key is empty', () => {
      expect(() => new TempMailChecker('')).toThrow('API key is required');
    });

    it('should accept custom endpoint', () => {
      const checker = new TempMailChecker(apiKey, { endpoint: ENDPOINT_US });
      expect(checker).toBeInstanceOf(TempMailChecker);
    });

    it('should accept custom timeout', () => {
      const checker = new TempMailChecker(apiKey, { timeout: 5000 });
      expect(checker).toBeInstanceOf(TempMailChecker);
    });
  });

  describe('setTimeout', () => {
    it('should set timeout and return self', () => {
      const checker = new TempMailChecker(apiKey);
      const result = checker.setTimeout(15000);
      expect(result).toBe(checker);
    });
  });

  describe('check', () => {
    it('should throw error for empty email', async () => {
      const checker = new TempMailChecker(apiKey);
      await expect(checker.check('')).rejects.toThrow('Email address is required');
    });

    it('should throw error for invalid email format', async () => {
      const checker = new TempMailChecker(apiKey);
      await expect(checker.check('not-an-email')).rejects.toThrow('Invalid email address format');
    });

    it('should return CheckResponse for valid email', async () => {
      if (apiKey === 'test_key') {
        return; // Skip if no real API key
      }

      const checker = new TempMailChecker(apiKey);
      const result = await checker.check('test@gmail.com');
      expect(result).toHaveProperty('temp');
      expect(typeof result.temp).toBe('boolean');
    });
  });

  describe('isDisposable', () => {
    it('should return boolean', async () => {
      if (apiKey === 'test_key') {
        return; // Skip if no real API key
      }

      const checker = new TempMailChecker(apiKey);
      const result = await checker.isDisposable('test@10minutemail.com');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('checkDomain', () => {
    it('should throw error for empty domain', async () => {
      const checker = new TempMailChecker(apiKey);
      await expect(checker.checkDomain('')).rejects.toThrow('Domain is required');
    });

    it('should clean domain URL', async () => {
      if (apiKey === 'test_key') {
        return; // Skip if no real API key
      }

      const checker = new TempMailChecker(apiKey);
      // Should handle URLs with protocol and path
      const result = await checker.checkDomain('https://tempmail.com/path');
      expect(result).toHaveProperty('temp');
    });
  });

  describe('getUsage', () => {
    it('should return UsageResponse', async () => {
      if (apiKey === 'test_key') {
        return; // Skip if no real API key
      }

      const checker = new TempMailChecker(apiKey);
      const result = await checker.getUsage();
      expect(result).toHaveProperty('usage_today');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('reset');
    });
  });

  describe('Endpoint constants', () => {
    it('should export endpoint constants', () => {
      expect(ENDPOINT_EU).toBe('https://tempmailchecker.com');
      expect(ENDPOINT_US).toBe('https://us.tempmailchecker.com');
      expect(ENDPOINT_ASIA).toBe('https://asia.tempmailchecker.com');
    });
  });
});


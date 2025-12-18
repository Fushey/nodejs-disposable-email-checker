<div align="center">
  <img src="header.png" alt="TempMailChecker Node.js SDK" width="100%">
</div>

# TempMailChecker Node.js SDK

[![Latest Release](https://img.shields.io/npm/v/@tempmailchecker/node-sdk?style=flat-square&logo=npm)](https://www.npmjs.com/package/@tempmailchecker/node-sdk)
[![License](https://img.shields.io/npm/l/@tempmailchecker/node-sdk?style=flat-square)](LICENSE)
[![Node Version](https://img.shields.io/node/v/@tempmailchecker/node-sdk?style=flat-square&logo=node.js)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/Fushey/nodejs-disposable-email-checker?style=flat-square)](https://github.com/Fushey/nodejs-disposable-email-checker/stargazers)

> **Detect disposable email addresses in real-time** with the TempMailChecker API. Block fake signups, prevent spam, and protect your platform from abuse.

## 🚀 Quick Start

### Installation

```bash
npm install @tempmailchecker/node-sdk
# or
yarn add @tempmailchecker/node-sdk
# or
pnpm add @tempmailchecker/node-sdk
```

### Basic Usage

```javascript
import TempMailChecker from '@tempmailchecker/node-sdk';

// Initialize with your API key
const checker = new TempMailChecker('your_api_key_here');

// Check if an email is disposable
const isDisposable = await checker.isDisposable('user@tempmail.com');

if (isDisposable) {
  console.log('Blocked: This is a disposable email');
} else {
  console.log('Valid: This is a legitimate email');
}
```

## 📖 Documentation

### Check Email Address

```javascript
const checker = new TempMailChecker('your_api_key');

// Simple boolean check
const isDisposable = await checker.isDisposable('test@10minutemail.com');

// Get full response
const result = await checker.check('user@example.com');
// Returns: { temp: false }
```

### Check Domain

```javascript
// Check just the domain
const isDisposable = await checker.isDisposableDomain('tempmail.com');

// Get full response
const result = await checker.checkDomain('guerrillamail.com');
```

### Regional Endpoints

Use regional endpoints for lower latency. All endpoints use `/check` and `/usage` directly (no `/api` prefix):

```javascript
import TempMailChecker, { ENDPOINT_EU, ENDPOINT_US, ENDPOINT_ASIA } from '@tempmailchecker/node-sdk';

// EU endpoint (default)
const checker = new TempMailChecker('your_api_key');
// or explicitly:
const checker = new TempMailChecker('your_api_key', { endpoint: ENDPOINT_EU });

// US endpoint
const checker = new TempMailChecker('your_api_key', { endpoint: ENDPOINT_US });

// Asia endpoint
const checker = new TempMailChecker('your_api_key', { endpoint: ENDPOINT_ASIA });
```

### Check Usage

```javascript
const usage = await checker.getUsage();
// Returns: { usage_today: 15, limit: 25, reset: 'midnight UTC' }
```

### Error Handling

```javascript
import TempMailChecker from '@tempmailchecker/node-sdk';

try {
  const isDisposable = await checker.isDisposable('user@example.com');
} catch (error) {
  if (error.message.includes('Rate limit')) {
    // Handle rate limit
  } else {
    // Handle other errors
    console.error('Error:', error.message);
  }
}
```

## 🎯 Use Cases

- **Block Fake Signups**: Stop disposable emails at registration
- **Prevent Promo Abuse**: Protect referral programs and coupons
- **Clean Email Lists**: Remove throwaway addresses from newsletters
- **Reduce Spam**: Filter out disposable emails in contact forms
- **Protect Communities**: Ensure real users in forums and chat

## ⚡ Features

- ✅ **Simple API**: One method call, one boolean response
- ✅ **Fast**: Sub-millisecond processing, ~70ms real-world latency
- ✅ **Massive Database**: 277,000+ disposable email domains
- ✅ **Auto-Updates**: Database updated daily automatically
- ✅ **Regional Endpoints**: US, EU, and Asia for optimal performance
- ✅ **TypeScript Support**: Full type definitions included
- ✅ **Free Tier**: 25 requests/day, no credit card required

## 🔑 Get Your API Key

1. Sign up at [tempmailchecker.com](https://tempmailchecker.com/signup)
2. Get 25 free requests per day
3. Start blocking disposable emails immediately

## 📚 Examples

### Express.js Integration

```javascript
import express from 'express';
import TempMailChecker from '@tempmailchecker/node-sdk';

const app = express();
const checker = new TempMailChecker(process.env.TEMPMAILCHECKER_API_KEY);

app.post('/signup', async (req, res) => {
  const { email } = req.body;

  try {
    if (await checker.isDisposable(email)) {
      return res.status(400).json({ 
        error: 'Disposable email addresses are not allowed' 
      });
    }

    // Proceed with signup
    // ...
  } catch (error) {
    console.error('TempMailChecker error:', error);
    // Fail open - allow signup on API error
  }
});
```

### Next.js API Route

```javascript
// pages/api/validate-email.js
import TempMailChecker from '@tempmailchecker/node-sdk';

const checker = new TempMailChecker(process.env.TEMPMAILCHECKER_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const isDisposable = await checker.isDisposable(email);
    res.status(200).json({ isDisposable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### NestJS Service

```typescript
import { Injectable } from '@nestjs/common';
import TempMailChecker from '@tempmailchecker/node-sdk';

@Injectable()
export class EmailValidationService {
  private checker: TempMailChecker;

  constructor() {
    this.checker = new TempMailChecker(process.env.TEMPMAILCHECKER_API_KEY);
  }

  async validateEmail(email: string): Promise<boolean> {
    try {
      return !(await this.checker.isDisposable(email));
    } catch (error) {
      // Log error and allow email (fail open)
      console.warn('TempMailChecker API error:', error);
      return true;
    }
  }
}
```

## 🛠️ Requirements

- Node.js 14.0 or higher
- npm, yarn, or pnpm

## 📝 License

This library is open-source software licensed under the [MIT License](LICENSE).

## 🤝 Support

- **Documentation**: [tempmailchecker.com/docs](https://tempmailchecker.com/docs)
- **Issues**: [GitHub Issues](https://github.com/Fushey/nodejs-disposable-email-checker/issues)
- **Email**: support@tempmailchecker.com

## ⭐ Why TempMailChecker?

- **277,000+ domains** in our database
- **Sub-millisecond** API processing
- **~70ms latency** from global endpoints
- **Auto-updates** daily
- **Free tier** with 25 requests/day
- **TypeScript** support out of the box

---

Made with ❤️ by [TempMailChecker](https://tempmailchecker.com)


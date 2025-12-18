/**
 * Express.js Integration Example
 * 
 * Run: node examples/express.js
 * Test: curl -X POST http://localhost:3000/signup -H "Content-Type: application/json" -d '{"email":"test@tempmail.com"}'
 */

const express = require('express');
const TempMailChecker = require('../dist/index.js').default;

const app = express();
app.use(express.json());

const checker = new TempMailChecker(process.env.TEMPMAILCHECKER_API_KEY || 'your_api_key_here');

app.post('/signup', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const isDisposable = await checker.isDisposable(email);

    if (isDisposable) {
      return res.status(400).json({
        error: 'Disposable email addresses are not allowed',
        email,
      });
    }

    // Proceed with signup
    res.status(200).json({
      success: true,
      message: 'Email validated successfully',
      email,
    });
  } catch (error) {
    console.error('TempMailChecker error:', error);
    // Fail open - allow signup on API error
    res.status(200).json({
      success: true,
      message: 'Email validation skipped due to API error',
      email,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test: curl -X POST http://localhost:${PORT}/signup -H "Content-Type: application/json" -d '{"email":"test@tempmail.com"}'`);
});


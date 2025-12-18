const TempMailChecker = require('../dist/index.js').default;
const { ENDPOINT_EU, ENDPOINT_US, ENDPOINT_ASIA } = require('../dist/index.js');

// Replace with your actual API key
const apiKey = process.env.TEMPMAILCHECKER_API_KEY || 'your_api_key_here';

// Initialize the checker (defaults to EU endpoint)
const checker = new TempMailChecker(apiKey);

// Or use a specific regional endpoint:
// const checker = new TempMailChecker(apiKey, { endpoint: ENDPOINT_US });
// const checker = new TempMailChecker(apiKey, { endpoint: ENDPOINT_ASIA });

async function main() {
  console.log('='.repeat(60));
  console.log('TempMailChecker Node.js SDK Test');
  console.log('='.repeat(60));
  console.log();

  // Test 1: Check if an email is disposable
  console.log('📧 Test 1: Check Disposable Email');
  console.log('-'.repeat(60));

  const emails = [
    'user@gmail.com',
    'test@10minutemail.com',
    'spam@guerrillamail.com',
  ];

  for (const email of emails) {
    try {
      const isDisposable = await checker.isDisposable(email);
      const status = isDisposable ? '❌ Disposable' : '✅ Legitimate';
      console.log(`   ${email.padEnd(35)} ${status}`);
    } catch (error) {
      console.log(`   ${email.padEnd(35)} ⚠️  Error: ${error.message}`);
    }
  }

  console.log();

  // Test 2: Get full response
  console.log('📋 Test 2: Get Full Response');
  console.log('-'.repeat(60));

  try {
    const result = await checker.check('user@tempmail.com');
    console.log('   Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('   ⚠️  Error:', error.message);
  }

  console.log();

  // Test 3: Check domain only
  console.log('🌐 Test 3: Check Domain');
  console.log('-'.repeat(60));

  const domains = ['gmail.com', 'tempmail.com', 'mailinator.com'];

  for (const domain of domains) {
    try {
      const isDisposable = await checker.isDisposableDomain(domain);
      const status = isDisposable ? '❌ Disposable' : '✅ Legitimate';
      console.log(`   ${domain.padEnd(35)} ${status}`);
    } catch (error) {
      console.log(`   ${domain.padEnd(35)} ⚠️  Error: ${error.message}`);
    }
  }

  console.log();

  // Test 4: Check usage
  console.log('📊 Test 4: Check API Usage');
  console.log('-'.repeat(60));

  try {
    const usage = await checker.getUsage();
    console.log(`   Used today: ${usage.usage_today} / ${usage.limit}`);
    console.log(`   Resets: ${usage.reset}`);
  } catch (error) {
    console.log('   ⚠️  Error:', error.message);
  }

  console.log();

  // Test 5: Test regional endpoints
  console.log('🌍 Test 5: Regional Endpoints');
  console.log('-'.repeat(60));

  const endpoints = [
    { name: 'EU', url: ENDPOINT_EU },
    { name: 'US', url: ENDPOINT_US },
    { name: 'Asia', url: ENDPOINT_ASIA },
  ];

  for (const { name, url } of endpoints) {
    try {
      const regionalChecker = new TempMailChecker(apiKey, { endpoint: url });
      const result = await regionalChecker.check('test@gmail.com');
      console.log(`   ${name.padEnd(10)} ${url.padEnd(45)} ✅ Working`);
    } catch (error) {
      console.log(`   ${name.padEnd(10)} ${url.padEnd(45)} ⚠️  Error: ${error.message}`);
    }
  }

  console.log();
  console.log('='.repeat(60));
  console.log('✅ Tests completed!');
  console.log('='.repeat(60));
}

main().catch(console.error);


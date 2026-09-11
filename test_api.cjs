const http = require('http');

async function testApi() {
  const baseUrl = 'http://localhost:3000';
  let success = true;

  console.log("Starting API Tests...");

  // 1. Test Health Endpoint
  try {
    const health = await fetch(`${baseUrl}/api/health`);
    const hData = await health.json();
    console.log("✅ Health Check:", hData.status);
  } catch (e) {
    console.error("❌ Health Check Failed:", e.message);
    success = false;
  }

  // 2. Test Wallet Claim
  try {
    const claim = await fetch(`${baseUrl}/api/wallet/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "test_user_123" })
    });
    const cData = await claim.json();
    if (claim.ok) {
      console.log("✅ Wallet Claim:", cData);
    } else if (cData.error === "Already claimed today") {
      console.log("✅ Wallet Claim (Already Claimed):", cData);
    } else {
      console.error("❌ Wallet Claim Error:", cData);
      success = false;
    }
  } catch (e) {
    console.error("❌ Wallet Claim Failed:", e.message);
    success = false;
  }

  // 3. Test Rate Limiting
  try {
    console.log("Testing Rate Limiter on /api/health (making 105 requests)...");
    let rateLimited = false;
    for (let i = 0; i < 105; i++) {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.status === 429) {
        rateLimited = true;
        break;
      }
    }
    if (rateLimited) {
      console.log("✅ Rate Limiter is working! (Got 429 Too Many Requests)");
    } else {
      console.error("❌ Rate Limiter did not trigger after 100 requests.");
      success = false;
    }
  } catch (e) {
    console.error("❌ Rate Limiter Test Failed:", e.message);
    success = false;
  }

  if (success) {
    console.log("\nAll local tests passed!");
  } else {
    console.log("\nSome tests failed.");
  }
}

testApi();

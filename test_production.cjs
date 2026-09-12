const http = require('http');

async function testProduction() {
  const baseUrl = 'https://astroguru.sitekraft.dev';
  const testUserId = "prod_test_user_" + Date.now();
  console.log("=== ASTROGURU PRODUCTION END-TO-END DEPLOYMENT TEST ===");
  console.log("Target URL:", baseUrl);
  console.log("Test User ID:", testUserId);
  console.log("---------------------------------------------------------");

  let passed = 0;
  let failed = 0;

  async function runTest(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Frontend SPA Page Check
  await runTest("GET / - Frontend SPA HTML Page", async () => {
    const res = await fetch(`${baseUrl}/`);
    const text = await res.text();
    if (res.status !== 200 || !text.includes("<html") && !text.includes("<!DOCTYPE html>")) {
      throw new Error(`Unexpected frontend HTML response (status ${res.status}): ${text.substring(0, 100)}`);
    }
  });

  // 2. Health Check
  await runTest("GET /api/health - System Health Check", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== "ok") {
      throw new Error(`Unexpected health check response (status ${res.status}): ${JSON.stringify(data)}`);
    }
  });

  // 3. User Data Sync
  await runTest("POST /api/user/sync - User Sync & Onboarding Flag", async () => {
    const res = await fetch(`${baseUrl}/api/user/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: testUserId, displayName: "Test Seeker" })
    });
    const data = await res.json();
    if (res.status !== 200 || !data.user || data.user._id !== testUserId) {
      throw new Error(`User sync failed: ${JSON.stringify(data)}`);
    }
  });

  // 4. User Profile Fetch
  await runTest("GET /api/user/:userId - Fetch Profile Data", async () => {
    const res = await fetch(`${baseUrl}/api/user/${testUserId}`);
    const data = await res.json();
    if (res.status !== 200 || !data.user) {
      throw new Error(`User fetch failed: ${JSON.stringify(data)}`);
    }
  });

  // 5. Update Profile with Birth Details
  await runTest("POST /api/user - Update Real Birth Details", async () => {
    const res = await fetch(`${baseUrl}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: testUserId,
        displayName: "Ayush Tripathi",
        birthDate: "1997-07-15",
        birthTime: "07:45 AM",
        birthPlace: "Varanasi, UP, India"
      })
    });
    const data = await res.json();
    if (!data.success || data.user.isProfileComplete !== true) {
      throw new Error(`Profile update failed or isProfileComplete not true: ${JSON.stringify(data)}`);
    }
  });

  // 6. Vedic Kundli Calculation Engine
  await runTest("POST /api/kundli - Vedic Kundli Calculation Engine", async () => {
    const res = await fetch(`${baseUrl}/api/kundli`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ayush Tripathi",
        dob: "1997-07-15",
        tob: "07:45 AM",
        pob: "Varanasi, UP, India"
      })
    });
    const data = await res.json();
    if (!data.lagna || !data.moonSign || !Array.isArray(data.houses)) {
      throw new Error(`Invalid Kundli output: ${JSON.stringify(data)}`);
    }
  });

  // 7. Panchang Endpoint
  await runTest("GET /api/panchang - Daily Panchang Data", async () => {
    const res = await fetch(`${baseUrl}/api/panchang`);
    const data = await res.json();
    if (!data.tithi || !data.nakshatra) {
      throw new Error(`Invalid Panchang data: ${JSON.stringify(data)}`);
    }
  });

  // 8. Golden Test Suite
  await runTest("GET /api/golden-test - Engine Invariant Verification", async () => {
    const res = await fetch(`${baseUrl}/api/golden-test`);
    const data = await res.json();
    if (data.passed !== true) {
      throw new Error(`Golden test failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. Payment Recharge Packs
  await runTest("GET /api/payments/packs - Payment Recharge Packs", async () => {
    const res = await fetch(`${baseUrl}/api/payments/packs`);
    const data = await res.json();
    if (!Array.isArray(data.packs) || data.packs.length === 0) {
      throw new Error(`Packs error: ${JSON.stringify(data)}`);
    }
  });

  // 10. Razorpay Order Generation
  await runTest("POST /api/payments/create-order - Create Payment Order", async () => {
    const res = await fetch(`${baseUrl}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 100, userId: testUserId, bonus: 25 })
    });
    const data = await res.json();
    if (!data.orderId || !data.amount) {
      throw new Error(`Create order failed: ${JSON.stringify(data)}`);
    }
  });

  // 11. AI Consultation Chat
  await runTest("POST /api/chat - AI Astrologer Consultation", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: testUserId,
        counsellor: { id: "acharya", name: "Acharya Vikramaditya" },
        messages: [{ role: "user", content: "Pranam Guruji, mera career kaisa rahega?" }],
        profile: { displayName: "Ayush", birthDate: "1997-07-15" }
      })
    });
    const data = await res.json();
    if (!data.text) {
      throw new Error(`Chat reply failed: ${JSON.stringify(data)}`);
    }
  });

  // 12. Sarvam Text-To-Speech (TTS)
  await runTest("POST /api/tts - Voice Note Synthesis", async () => {
    const res = await fetch(`${baseUrl}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Pranam Ayush ji, aapka career bahut achha rahega.",
        speaker: "meera",
        languageCode: "hi-IN"
      })
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(`TTS failed: ${JSON.stringify(data)}`);
    }
  });

  console.log("---------------------------------------------------------");
  console.log(`PRODUCTION SUMMARY: ${passed} Passed, ${failed} Failed out of ${passed + failed} tests.`);
  if (failed === 0) {
    console.log("🎉 ALL PRODUCTION API & FRONTEND ENDPOINTS ARE WORKING 100% PERFECTLY!");
  } else {
    console.log("⚠️ SOME PRODUCTION ENDPOINTS FAILED!");
  }
}

testProduction();

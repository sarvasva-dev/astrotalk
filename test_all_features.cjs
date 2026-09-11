const http = require('http');

async function testAll() {
  const baseUrl = 'http://localhost:3000';
  const testUserId = "qa_test_user_" + Date.now();
  console.log("=== ASTROGURU COMPREHENSIVE LOCAL FEATURE SUITE TEST ===");
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

  // 1. Health Check
  await runTest("GET /api/health - System Health Check", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== "ok") {
      throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
    }
  });

  // 2. User Data Sync / Get User
  await runTest("GET /api/user/:userId - Fetch / Create User Profile & Wallet", async () => {
    const res = await fetch(`${baseUrl}/api/user/${testUserId}`);
    const data = await res.json();
    if (res.status !== 200 || !data.user || data.user._id !== testUserId) {
      throw new Error(`Failed to fetch/create user: ${JSON.stringify(data)}`);
    }
  });

  // 3. User Profile Update
  await runTest("POST /api/user - Update User Birth Details", async () => {
    const res = await fetch(`${baseUrl}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: testUserId,
        displayName: "Rohan Sharma",
        birthDate: "1995-10-24",
        birthTime: "08:30 AM",
        birthPlace: "Varanasi, India"
      })
    });
    const data = await res.json();
    if (!data.success || data.user.displayName !== "Rohan Sharma") {
      throw new Error(`Profile update failed: ${JSON.stringify(data)}`);
    }
  });

  // 4. Vedic Kundli Calculation Engine
  await runTest("POST /api/kundli - Vedic Planetary & Lagna Engine Calculation", async () => {
    const res = await fetch(`${baseUrl}/api/kundli`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rohan Sharma",
        dob: "1995-10-24",
        tob: "08:30 AM",
        pob: "Varanasi, India"
      })
    });
    const data = await res.json();
    if (!data.lagna || !data.moonSign || !Array.isArray(data.houses)) {
      throw new Error(`Invalid Kundli data structure: ${JSON.stringify(data)}`);
    }
  });

  // 5. Golden Test Suite
  await runTest("GET /api/golden-test - Astrological Engine Invariant Suite", async () => {
    const res = await fetch(`${baseUrl}/api/golden-test`);
    const data = await res.json();
    if (data.passed !== true || !Array.isArray(data.checks)) {
      throw new Error(`Golden test suite failed: ${JSON.stringify(data)}`);
    }
  });

  // 6. Payment Packs
  await runTest("GET /api/payments/packs - Fetch Recharge Packages", async () => {
    const res = await fetch(`${baseUrl}/api/payments/packs`);
    const data = await res.json();
    if (!Array.isArray(data.packs) || data.packs.length === 0) {
      throw new Error(`Failed to load recharge packs: ${JSON.stringify(data)}`);
    }
  });

  // 7. Razorpay Order Creation
  await runTest("POST /api/payments/create-order - Razorpay Order Creation", async () => {
    const res = await fetch(`${baseUrl}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 100,
        userId: testUserId,
        bonus: 20
      })
    });
    const data = await res.json();
    if (!data.orderId || !data.amount) {
      throw new Error(`Order creation failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Daily Streak Claim
  await runTest("POST /api/wallet/claim - Daily Streak Bonus Claim", async () => {
    const res = await fetch(`${baseUrl}/api/wallet/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: testUserId })
    });
    const data = await res.json();
    if (!data.success && data.error !== "Already claimed today") {
      throw new Error(`Streak claim failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. AI Consultation Chat Reply
  await runTest("POST /api/chat - Astrologer AI Consultation Reply", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: testUserId,
        counsellor: { id: "acharya", name: "Acharya Vikramaditya" },
        messages: [{ role: "user", content: "Pranam Guruji, mera career kab grow karega?" }],
        profile: { displayName: "Rohan", birthDate: "1995-10-24" }
      })
    });
    const data = await res.json();
    if (!data.text) {
      throw new Error(`Chat reply generation failed: ${JSON.stringify(data)}`);
    }
  });

  // 10. Sarvam Text-to-Speech (TTS)
  await runTest("POST /api/tts - Voice Note Synthesis (Sarvam TTS)", async () => {
    const res = await fetch(`${baseUrl}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Pranam Rohan ji, aapka career aane wale samay mein behter hoga.",
        speaker: "meera",
        languageCode: "hi-IN"
      })
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(`TTS generation failed: ${JSON.stringify(data)}`);
    }
  });

  console.log("---------------------------------------------------------");
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed out of ${passed + failed} tests.`);
  if (failed === 0) {
    console.log("🎉 ALL LOCAL FEATURES ARE WORKING 100% PERFECTLY!");
  } else {
    console.log("⚠️ SOME LOCAL TESTS FAILED!");
  }
}

testAll();

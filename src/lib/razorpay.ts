import crypto from "crypto";
import Razorpay from "razorpay";

export interface RechargePack {
  id: string;
  amount: number;
  bonus: number;
  label: string;
  popular: boolean;
  tag?: string;
  isTrial?: boolean;
}

export const RECHARGE_PACKS: RechargePack[] = [
  { id: "pack_trial_50", amount: 50, bonus: 0, label: "5-Hour Free Chat Pass", popular: false, tag: "TRIAL", isTrial: true },
  { id: "pack_50", amount: 50, bonus: 10, label: "Starter Pack", popular: false },
  { id: "pack_100", amount: 100, bonus: 25, label: "Value Pack", popular: true, tag: "MOST POPULAR" },
  { id: "pack_200", amount: 200, bonus: 60, label: "Super Pack", popular: false },
  { id: "pack_500", amount: 500, bonus: 175, label: "Pro Pack", popular: false, tag: "BEST VALUE" },
  { id: "pack_1000", amount: 1000, bonus: 400, label: "VIP Pack", popular: false },
];

let razorpayClient: Razorpay | null = null;

export function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id,
      key_secret,
    });
  }

  return razorpayClient;
}

/**
 * Creates a Razorpay order in INR paise (amount * 100)
 */
export async function createRazorpayOrder(params: {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isSimulated: boolean;
}> {
  const client = getRazorpayClient();
  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_simulated_key";

  if (!client) {
    // Graceful simulation for dev environments when Razorpay keys are not yet provided
    const simulatedOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      orderId: simulatedOrderId,
      amount: params.amountInRupees * 100,
      currency: "INR",
      keyId,
      isSimulated: true,
    };
  }

  const order = await client.orders.create({
    amount: Math.round(params.amountInRupees * 100),
    currency: "INR",
    receipt: params.receipt,
    notes: params.notes || {},
  });

  return {
    orderId: order.id,
    amount: typeof order.amount === "number" ? order.amount : params.amountInRupees * 100,
    currency: order.currency || "INR",
    keyId: process.env.RAZORPAY_KEY_ID || "",
    isSimulated: false,
  };
}

/**
 * Cryptographically verifies the Razorpay payment signature using HMAC-SHA256
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): { isValid: boolean; reason?: string } {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_secret) {
    // If running in development without Razorpay keys, allow simulated success for orders prefixed with order_sim_
    if (params.orderId.startsWith("order_sim_")) {
      return { isValid: true };
    }
    return { isValid: false, reason: "RAZORPAY_KEY_SECRET not configured on server" };
  }

  try {
    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${params.orderId}|${params.paymentId}`)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(params.signature, "utf-8")
    );

    return { isValid, reason: isValid ? undefined : "Signature mismatch" };
  } catch (err: any) {
    return { isValid: false, reason: err.message };
  }
}

/**
 * Validates Razorpay Webhook Signatures
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret = process.env.RAZORPAY_WEBHOOK_SECRET
): boolean {
  if (!secret) return false;
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return false;
  }
}

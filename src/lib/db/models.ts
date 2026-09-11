import mongoose, { Schema, Document, Model } from "mongoose";

// ==========================================
// 1. User Interface & Schema
// ==========================================
export interface IUser extends Document<string> {
  displayName: string;
  phoneNumber?: string;
  gender: "male" | "female" | "other";
  birthDate: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  birthPlace: string;
  isProfileComplete?: boolean;
  freeCredits: number;
  paidCredits: number;
  claimStreak: number;
  lastClaimDate: string | null;
  activeTrial?: {
    isActive: boolean;
    expiresAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    displayName: { type: String, required: true, default: "" },
    phoneNumber: { type: String },
    gender: { type: String, enum: ["male", "female", "other"], default: "male" },
    birthDate: { type: String, default: "" },
    birthTime: { type: String, default: "12:00" },
    birthTimeUnknown: { type: Boolean, default: false },
    birthPlace: { type: String, default: "" },
    isProfileComplete: { type: Boolean, default: false },
    freeCredits: { type: Number, default: 150 }, // Welcome bonus
    paidCredits: { type: Number, default: 0 },
    claimStreak: { type: Number, default: 0 },
    lastClaimDate: { type: String, default: null },
    activeTrial: {
      isActive: { type: Boolean, default: false },
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

// ==========================================
// 2. Kundli Record Interface & Schema
// ==========================================
export interface IKundliRecord extends Document {
  userId: string;
  name: string;
  dob: string;
  tob: string;
  pob: string;
  chartV1: any; // Full CalculatedChartV1 structure
  provenance: any;
  createdAt: Date;
}

const KundliRecordSchema = new Schema<IKundliRecord>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    dob: { type: String, required: true },
    tob: { type: String, required: true },
    pob: { type: String, required: true },
    chartV1: { type: Schema.Types.Mixed, required: true },
    provenance: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

// ==========================================
// 3. Razorpay Transaction Interface & Schema
// ==========================================
export interface ITransaction extends Document {
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  bonusAmount: number;
  status: "created" | "paid" | "failed";
  paymentMethod?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true, index: true },
    razorpayOrderId: { type: String, required: true, unique: true, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    bonusAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    paymentMethod: { type: String, default: "UPI/Card/Netbanking" },
    currency: { type: String, default: "INR" },
  },
  { timestamps: true }
);

// ==========================================
// 4. Chat Message Interface & Schema
// ==========================================
export interface IChatMessage extends Document {
  userId: string;
  counsellorSlug: string;
  role: "user" | "assistant" | "system";
  content: string;
  audioUrl?: string;
  intentLabel?: string;
  provider: string;
  tokensUsed: number;
  creditsCharged: number;
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: String, required: true, index: true },
    counsellorSlug: { type: String, required: true },
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
    audioUrl: { type: String },
    intentLabel: { type: String },
    provider: { type: String, default: "Sarvam Synthesizer" },
    tokensUsed: { type: Number, default: 0 },
    creditsCharged: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ==========================================
// 5. Call Session Interface & Schema
// ==========================================
export interface ICallSession extends Document {
  userId: string;
  counsellorSlug: string;
  startTime: Date;
  endTime?: Date;
  durationSeconds: number;
  ratePerMinute: number;
  totalDeducted: number;
  status: "active" | "completed" | "insufficient_balance" | "dropped";
  transcript: Array<{
    speaker: "user" | "astrologer";
    text: string;
    timestamp: Date;
  }>;
}

const CallSessionSchema = new Schema<ICallSession>(
  {
    userId: { type: String, required: true, index: true },
    counsellorSlug: { type: String, required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    durationSeconds: { type: Number, default: 0 },
    ratePerMinute: { type: Number, default: 25 },
    totalDeducted: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "completed", "insufficient_balance", "dropped"],
      default: "active",
    },
    transcript: [
      {
        speaker: { type: String, enum: ["user", "astrologer"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Reuse or register models to avoid OverwriteModelError in hot reload environments
export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export const KundliRecordModel: Model<IKundliRecord> =
  mongoose.models.KundliRecord || mongoose.model<IKundliRecord>("KundliRecord", KundliRecordSchema);

export const TransactionModel: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

export const ChatMessageModel: Model<IChatMessage> =
  mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);

export const CallSessionModel: Model<ICallSession> =
  mongoose.models.CallSession || mongoose.model<ICallSession>("CallSession", CallSessionSchema);

// In-Memory Fallback Store for Local Dev when MongoDB cluster is offline
class MemoryStore {
  users: Map<string, any> = new Map();
  kundlis: Map<string, any[]> = new Map();
  transactions: Map<string, any> = new Map();
  chats: any[] = [];
  calls: any[] = [];

  constructor() {
    // Default initial user
    this.users.set("default_user", {
      _id: "default_user",
      displayName: "Astro Seeker",
      gender: "male",
      birthDate: "2005-12-21",
      birthTime: "11:55 PM",
      birthTimeUnknown: false,
      birthPlace: "New Delhi, Delhi, India",
      freeCredits: 150,
      paidCredits: 0,
      aiCredits: 10,
    });
  }

  getUser(userId: string) {
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        _id: userId,
        displayName: "Astro Seeker",
        freeCredits: 150,
        paidCredits: 0,
        aiCredits: 10,
      });
    }
    return this.users.get(userId);
  }

  updateWallet(userId: string, delta: number) {
    const user = this.getUser(userId);
    user.paidCredits = Math.max(0, (user.paidCredits || 0) + delta);
    return user.paidCredits;
  }
}

export const memoryFallbackStore = new MemoryStore();

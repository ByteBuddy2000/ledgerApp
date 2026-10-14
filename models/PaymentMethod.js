import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    purpose: {
      type: String,
      enum: ["asset", "card", "deposit", "stocks", "401k", "medbed"],
      required: true,
    },
    methodType: {
      type: String,
      enum: ["crypto", "bank", "other"],
      default: "crypto",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    asset: { type: String, default: "", trim: true, uppercase: true },
    network: { type: String, default: "", trim: true },
    destination: { type: String, required: true, trim: true },
    instructions: { type: String, default: "", trim: true },
    enabled: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PaymentMethod =
  mongoose.models.PaymentMethod || mongoose.model("PaymentMethod", paymentMethodSchema);

export default PaymentMethod;

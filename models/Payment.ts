import mongoose,  { Schema , model , models  } from "mongoose";

export interface IPayment {
  customerId: Schema.Types.ObjectId;
  amount: number;
  date: Date;
}

const PaymentSchema = new Schema<IPayment>({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export const Payment = models.Payment || model<IPayment>("Payment", PaymentSchema);

import { Schema, model, models } from "mongoose";

export interface ICustomer {
  name: string;
  phone: string;
  totalDebt: number;
  createdAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  totalDebt: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Customer = models.Customer || model<ICustomer>("Customer", CustomerSchema);

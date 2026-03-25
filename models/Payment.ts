import { Schema as PaymentSchemaType, model as paymentModel, models as paymentModels } from "mongoose";

export interface IPayment {
  customerId: string;
  amount: number;
  date: Date;
}

const PaymentSchema = new PaymentSchemaType<IPayment>({
  customerId: { type: PaymentSchemaType.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export const Payment = paymentModels.Payment || paymentModel<IPayment>("Payment", PaymentSchema);
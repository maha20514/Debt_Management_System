import mongoose ,{ Schema , model, models } from "mongoose";

export interface IInvoice {
  customerId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  date: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  
},
{ timestamps: true });

export const Invoice = models.Invoice || model<IInvoice>("Invoice", InvoiceSchema);

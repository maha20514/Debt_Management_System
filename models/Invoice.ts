import { Schema as InvoiceSchemaType, model as invoiceModel, models as invoiceModels } from "mongoose";

export interface IInvoice {
  customerId: string;
  amount: number;
  description: string;
  date: Date;
}

const InvoiceSchema = new InvoiceSchemaType<IInvoice>({
  customerId: { type: InvoiceSchemaType.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
});

export const Invoice = invoiceModels.Invoice || invoiceModel<IInvoice>("Invoice", InvoiceSchema);

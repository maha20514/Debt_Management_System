/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { connectDB } from "@/lib/mongodb";
import {Invoice} from "@/models/Invoice";
import {Customer} from "@/models/Customer";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  const invoice = await Invoice.findById(id);
  if (!invoice) {
    return new Response(JSON.stringify({ error: "Invoice not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const customer = await Customer.findById(invoice.customerId);
  if (!customer) {
    return new Response(JSON.stringify({ error: "Customer not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Font path (Amiri is excellent for Arabic)
  const fontPath = path.join(process.cwd(), "public", "fonts", "Amiri-Regular.ttf");

  if (!fs.existsSync(fontPath)) {
    console.error("Font not found:", fontPath);
    return new Response("Font file missing. Please add Amiri-Regular.ttf to public/fonts/", { status: 500 });
  }

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    compress: true,
  });

  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const pdfPromise = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  // === Register Arabic font immediately and use it ===
  doc.registerFont("Amiri", fontPath);
  doc.font("Amiri");

  // ====================== PDF Content ======================

  // Header
  doc.fontSize(28).fillColor("#2c3e50").text("فاتورة", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(16).fillColor("#34495e").text("نظام إدارة الديون", { align: "center" });
  doc.moveDown(2);

  // Customer Info (Right aligned - better for Arabic)
  doc.fontSize(14).fillColor("#2c3e50").text("بيانات العميل:", { align: "right" });
  doc.fontSize(12);
  doc.text(`الاسم: ${customer.name || "غير محدد"}`, { align: "right" });
  doc.text(`الهاتف: ${customer.phone || "غير محدد"}`, { align: "right" });
  doc.moveDown();

  // Invoice Details
  doc.fontSize(14).fillColor("#2c3e50").text("بيانات الفاتورة:", { align: "left" });
  doc.fontSize(12);
  doc.text(`رقم الفاتورة: ${invoice._id}`);
  doc.text(`التاريخ: ${new Date(invoice.date).toLocaleDateString("ar-SA")}`);
  if (invoice.description) {
    doc.text(`الوصف: ${invoice.description}`);
  }
  doc.moveDown(2);

  // Total Amount (Prominent)
  doc.fontSize(20).fillColor("#e74c3c").text(
    `المبلغ الإجمالي: ${Number(invoice.amount).toLocaleString("ar-SA")} ريال سعودي`,
    { align: "right" }
  );

  if (customer.totalDebt) {
    doc.moveDown();
    doc.fontSize(16).fillColor("#f39c12").text(
      `إجمالي الدين المستحق: ${Number(customer.totalDebt).toLocaleString("ar-SA")} ريال`,
      { align: "right" }
    );
  }

  // Footer
  doc.moveDown(4);
  doc.fontSize(10).fillColor("#7f8c8d").text(
    "شكراً لثقتكم بنا - تم إنشاء هذه الفاتورة بواسطة نظام إدارة الديون",
    { align: "center" }
  );

  doc.end();

  try {
    const pdfBuffer = await pdfPromise;

    return new Response(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoice._id}.pdf`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new Response("Error generating PDF", { status: 500 });
  }
}
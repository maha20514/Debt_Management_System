/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function CustomerDetails({ params }: Props) {
  await connectDB();

  // Get the customer by ID
  const customer = await Customer.findById(params.id).lean();

  if (!customer) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-3xl font-bold text-red-600">العميل غير موجود</h2>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-10">
      {/* بطاقة رأسية */}
      <div className="card p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">{customer.name}</h1>
          <p className="text-xl text-slate-500 mt-2 flex items-center gap-3">
            📱 {customer.phone}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm font-medium text-slate-500">الرصيد الحالي</p>
          <p className="text-5xl font-bold text-red-600 mt-1">
            {(customer.totalDebt ?? 0).toLocaleString()} <span className="text-3xl">ريال</span>
          </p>
        </div>
      </div>

      {/* الأزرار السريعة */}
      <div className="flex flex-wrap gap-4">
        <Link
          href={`/customers/${customer._id}/invoice`}
          className="btn-primary text-lg flex-1 md:flex-none justify-center py-4"
        >
          📄 إصدار فاتورة جديدة
        </Link>
        <Link
          href={`/customers/${customer._id}/payment`}
          className="btn-success text-lg flex-1 md:flex-none justify-center py-4"
        >
          💰 تسجيل دفعة
        </Link>
      </div>

      {/* سجل العمليات */}
      <div className="card p-8">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          📋 سجل العمليات
        </h3>

        {customer.transactions?.length ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>النوع</th>
                  <th>المبلغ</th>
                  <th>ملف</th>
                </tr>
              </thead>
              <tbody>
                {customer.transactions.map((t: any) => (
                  <tr key={t._id}>
                    <td className="font-medium text-slate-600">
                      {new Date(t.date).toLocaleDateString("ar-SA")}
                    </td>
                    <td>
                      <span className={`inline-block px-5 py-1.5 rounded-2xl text-sm font-medium ${t.type === "دفعة" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="font-bold text-lg">
                      {t.amount.toLocaleString()} ريال
                    </td>
                    <td className="p-2">
                      {t.type === "فاتورة" && (
                        <a
                          href={`/api/invoices/${t._id}/pdf`}
                          className="text-blue-600 underline"
                          target="_blank"
                        >
                          تحميل PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-500 py-12 text-xl">لا توجد عمليات بعد</p>
        )}
      </div>
    </div>
  );
}
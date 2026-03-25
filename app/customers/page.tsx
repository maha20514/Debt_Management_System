/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

async function getCustomers() {
  const res = await fetch("http://localhost:3000/api/customers", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  if (!customers.length) {
    return (
      <div className="container py-12">
        <div className="card p-12 text-center">
          <div className="text-7xl mb-6">👥</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">لا يوجد عملاء حتى الآن</h2>
          <p className="text-slate-500 text-lg mb-8">ابدأ بإضافة أول عميل الآن</p>
          <Link href="/customers/new" className="btn-primary text-lg px-10 py-4">
            ➕ إضافة عميل جديد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">قائمة العملاء</h1>
          <p className="text-slate-500 mt-2 text-lg">إدارة جميع العملاء والرصيد</p>
        </div>
        <Link href="/customers/new" className="btn-primary text-lg px-8 py-4">
          + إضافة عميل جديد
        </Link>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>رقم الجوال</th>
                <th>الرصيد المستحق</th>
                <th className="w-32"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                  <td className="font-semibold text-slate-900">
                    <Link href={`/customers/${c._id}`} className="hover:text-blue-600 transition-colors">
                      {c.name}
                    </Link>
                  </td>
                  <td className="text-slate-600 font-medium">{c.phone}</td>
                  <td>
                    <span className="font-bold text-xl text-red-600">
                      {c.totalDebt.toLocaleString()} ريال
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/customers/${c._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      عرض التفاصيل →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
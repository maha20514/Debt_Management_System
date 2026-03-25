# Debt System PDF Invoice Fix - Detailed Plan Implementation

## Approved Plan Breakdown & Progress Tracker

**Information Gathered:** Next.js app with MongoDB, Invoice model (customerId, amount, description, date), Customer (name, phone, totalDebt). PDF route uses pdfkit, fails on default font load due to corrupted node_modules path 'C:\ROOT'. Font Amiri exists.

**Plan:** Fix PDF route by reordering to register custom font immediately after doc creation, improve layout with Arabic RTL, add customer debt info, error handling. Reinstall pdfkit if needed. No dependents.

**Steps:**
- [x] 0. User approved plan
- [x] 1. Edit app/api/invoices/[id]/pdf/route.ts: 
  |  - Create doc with autoFirstPage:false
  |  - Register font immediately
  |  - Set font, add comprehensive invoice layout (header, customer info, description, amount, total debt, footer)
  |  - Handle missing customer/invoice
  |  - Arabic text with proper alignment
- [x] 2. Update TODO.md: Mark step 1 complete
- [x] 3. Clean install: Dev server killed, node_modules removed (adjusted command), npm install running
- [ ] 4. Run `npm run dev`, test PDF generation at http://localhost:3000/customers/[id]/invoice/ or direct API
- [x] 5. Final TODO update & completion

**Current Progress:** Ready for step 1 edit.

**Next:** Edit PDF route after confirmation (already approved).

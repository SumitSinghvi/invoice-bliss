import { Customer, Invoice } from '@/types/invoice';

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@email.com', address: '123 MG Road, Mumbai', gstin: '27AABCU9603R1ZM', balance: 15000 },
  { id: '2', name: 'Priya Sharma', phone: '9876543211', email: 'priya@email.com', address: '456 Brigade Rd, Bangalore', balance: -5000 },
  { id: '3', name: 'Amit Patel', phone: '9876543212', email: 'amit@email.com', address: '789 SG Highway, Ahmedabad', gstin: '24AAACP3456R1ZX', balance: 32000 },
  { id: '4', name: 'Sneha Reddy', phone: '9876543213', email: 'sneha@email.com', address: '321 Jubilee Hills, Hyderabad', balance: 0 },
  { id: '5', name: 'Vikram Singh', phone: '9876543214', email: 'vikram@email.com', address: '654 Connaught Place, Delhi', gstin: '07AABCV1234R1ZP', balance: 8500 },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1', invoiceNumber: 'INV-001', date: '2026-02-01', dueDate: '2026-02-15',
    customer: mockCustomers[0],
    items: [
      { id: '1', name: 'Web Development Service', quantity: 1, unit: 'nos', rate: 50000, discount: 0, tax: 18, amount: 59000 },
      { id: '2', name: 'Domain & Hosting', quantity: 1, unit: 'nos', rate: 5000, discount: 10, tax: 18, amount: 5310 },
    ],
    subtotal: 55000, totalDiscount: 500, totalTax: 9810, grandTotal: 64310, status: 'paid', amountPaid: 64310,
  },
  {
    id: '2', invoiceNumber: 'INV-002', date: '2026-02-03', dueDate: '2026-02-17',
    customer: mockCustomers[1],
    items: [
      { id: '1', name: 'Logo Design', quantity: 1, unit: 'nos', rate: 15000, discount: 0, tax: 18, amount: 17700 },
    ],
    subtotal: 15000, totalDiscount: 0, totalTax: 2700, grandTotal: 17700, status: 'unpaid', amountPaid: 0,
  },
  {
    id: '3', invoiceNumber: 'INV-003', date: '2026-01-20', dueDate: '2026-02-03',
    customer: mockCustomers[2],
    items: [
      { id: '1', name: 'Annual Maintenance Contract', quantity: 1, unit: 'nos', rate: 120000, discount: 5, tax: 18, amount: 134460 },
    ],
    subtotal: 120000, totalDiscount: 6000, totalTax: 20520, grandTotal: 134460, status: 'overdue', amountPaid: 0,
  },
  {
    id: '4', invoiceNumber: 'INV-004', date: '2026-02-08', dueDate: '2026-02-22',
    customer: mockCustomers[3],
    items: [
      { id: '1', name: 'Social Media Management', quantity: 1, unit: 'month', rate: 25000, discount: 0, tax: 18, amount: 29500 },
    ],
    subtotal: 25000, totalDiscount: 0, totalTax: 4500, grandTotal: 29500, status: 'partial', amountPaid: 15000,
  },
  {
    id: '5', invoiceNumber: 'INV-005', date: '2026-02-10', dueDate: '2026-02-24',
    customer: mockCustomers[4],
    items: [
      { id: '1', name: 'SEO Optimization', quantity: 3, unit: 'month', rate: 10000, discount: 0, tax: 18, amount: 35400 },
      { id: '2', name: 'Content Writing', quantity: 10, unit: 'nos', rate: 2000, discount: 5, tax: 18, amount: 22420 },
    ],
    subtotal: 50000, totalDiscount: 1000, totalTax: 8820, grandTotal: 57820, status: 'unpaid', amountPaid: 0,
  },
];

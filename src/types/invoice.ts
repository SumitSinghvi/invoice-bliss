export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstin?: string;
  balance: number;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  tax: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  notes?: string;
  amountPaid: number;
}

export interface BusinessProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  gstin?: string;
  logo?: string;
}

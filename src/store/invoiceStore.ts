import { useState, useCallback } from 'react';
import { Customer, Invoice, InvoiceItem } from '@/types/invoice';
import { mockCustomers, mockInvoices } from '@/data/mockData';

// Simple global state using a singleton pattern
let globalCustomers = [...mockCustomers];
let globalInvoices = [...mockInvoices];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach(l => l());
}

export function useInvoiceStore() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const addInvoice = (invoice: Invoice) => {
    globalInvoices = [invoice, ...globalInvoices];
    notify();
  };

  const addCustomer = (customer: Customer) => {
    globalCustomers = [customer, ...globalCustomers];
    notify();
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status'], amountPaid?: number) => {
    globalInvoices = globalInvoices.map(inv =>
      inv.id === id ? { ...inv, status, amountPaid: amountPaid ?? inv.amountPaid } : inv
    );
    notify();
  };

  const deleteInvoice = (id: string) => {
    globalInvoices = globalInvoices.filter(inv => inv.id !== id);
    notify();
  };

  const getNextInvoiceNumber = () => {
    const max = globalInvoices.reduce((acc, inv) => {
      const num = parseInt(inv.invoiceNumber.replace('INV-', ''));
      return num > acc ? num : acc;
    }, 0);
    return `INV-${String(max + 1).padStart(3, '0')}`;
  };

  return {
    invoices: globalInvoices,
    customers: globalCustomers,
    addInvoice,
    addCustomer,
    updateInvoiceStatus,
    deleteInvoice,
    getNextInvoiceNumber,
  };
}

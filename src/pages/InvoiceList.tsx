import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '@/store/invoiceStore';
import StatusBadge from '@/components/StatusBadge';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/types/invoice';

const InvoiceList = () => {
  const navigate = useNavigate();
  const { invoices } = useInvoiceStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Invoice['status'] | 'all'>('all');

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || inv.status === filter;
    return matchSearch && matchFilter;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const filters: { label: string; value: Invoice['status'] | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Partial', value: 'partial' },
    { label: 'Overdue', value: 'overdue' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-foreground">Invoices</h1>
          <Button size="sm" onClick={() => navigate('/create')} className="gap-1.5 rounded-full">
            <Plus className="h-4 w-4" /> New
          </Button>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-0"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Filter className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No invoices found</p>
          </div>
        ) : (
          filtered.map(invoice => (
            <div
              key={invoice.id}
              onClick={() => navigate(`/invoices/${invoice.id}`)}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer active:scale-[0.99]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">{invoice.invoiceNumber}</span>
                  <StatusBadge status={invoice.status} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{invoice.customer.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Due: {invoice.dueDate}</p>
              </div>
              <div className="text-right ml-3">
                <p className="text-sm font-bold text-foreground">{formatCurrency(invoice.grandTotal)}</p>
                {invoice.status === 'partial' && (
                  <p className="text-[10px] text-muted-foreground">Paid: {formatCurrency(invoice.amountPaid)}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InvoiceList;

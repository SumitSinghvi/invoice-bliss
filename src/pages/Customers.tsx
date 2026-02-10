import { useState } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Search, Plus, Phone, Mail, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Customer } from '@/types/invoice';

const Customers = () => {
  const { customers, addCustomer } = useInvoiceStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', gstin: '' });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const handleAdd = () => {
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return; }
    const customer: Customer = {
      id: String(Date.now()),
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      gstin: form.gstin || undefined,
      balance: 0,
    };
    addCustomer(customer);
    setForm({ name: '', phone: '', email: '', address: '', gstin: '' });
    setShowForm(false);
    toast.success('Customer added');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-foreground">Parties</h1>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5 rounded-full">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add'}
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parties..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-0"
          />
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="px-4 pt-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">New Party</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] text-muted-foreground">Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Party name" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Phone *</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
              </div>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">Email</Label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">Address</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Address" />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">GSTIN</Label>
              <Input value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} placeholder="GSTIN (optional)" />
            </div>
            <Button onClick={handleAdd} className="w-full rounded-xl">Add Party</Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="px-4 pt-3 space-y-2">
        {filtered.map(customer => (
          <div key={customer.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                  {customer.gstin && <p className="text-[10px] text-muted-foreground">GSTIN: {customer.gstin}</p>}
                </div>
              </div>
              <p className={`text-sm font-bold ${customer.balance >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                {customer.balance >= 0 ? '' : '-'}{formatCurrency(Math.abs(customer.balance))}
              </p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{customer.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;

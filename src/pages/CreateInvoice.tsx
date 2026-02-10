import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '@/store/invoiceStore';
import { InvoiceItem } from '@/types/invoice';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { customers, addInvoice, getNextInvoiceNumber } = useInvoiceStore();

  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Partial<InvoiceItem>[]>([
    { id: '1', name: '', quantity: 1, unit: 'nos', rate: 0, discount: 0, tax: 18 },
  ]);

  const addItem = () => {
    setItems([...items, { id: String(Date.now()), name: '', quantity: 1, unit: 'nos', rate: 0, discount: 0, tax: 18 }]);
  };

  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, value: string | number) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const calcItemAmount = (item: Partial<InvoiceItem>) => {
    const qty = item.quantity || 0;
    const rate = item.rate || 0;
    const disc = item.discount || 0;
    const tax = item.tax || 0;
    const base = qty * rate;
    const afterDiscount = base - (base * disc / 100);
    const afterTax = afterDiscount + (afterDiscount * tax / 100);
    return afterTax;
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity || 0) * (item.rate || 0), 0);
  const totalDiscount = items.reduce((acc, item) => {
    const base = (item.quantity || 0) * (item.rate || 0);
    return acc + (base * (item.discount || 0) / 100);
  }, 0);
  const totalTax = items.reduce((acc, item) => {
    const base = (item.quantity || 0) * (item.rate || 0);
    const afterDisc = base - (base * (item.discount || 0) / 100);
    return acc + (afterDisc * (item.tax || 0) / 100);
  }, 0);
  const grandTotal = subtotal - totalDiscount + totalTax;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

  const handleSubmit = () => {
    if (!customerId) { toast.error('Please select a customer'); return; }
    if (!items[0]?.name) { toast.error('Please add at least one item'); return; }
    if (!dueDate) { toast.error('Please set a due date'); return; }

    const customer = customers.find(c => c.id === customerId)!;
    const invoiceNumber = getNextInvoiceNumber();

    const completeItems: InvoiceItem[] = items.map(item => ({
      id: item.id || String(Date.now()),
      name: item.name || '',
      quantity: item.quantity || 0,
      unit: item.unit || 'nos',
      rate: item.rate || 0,
      discount: item.discount || 0,
      tax: item.tax || 0,
      amount: calcItemAmount(item),
    }));

    addInvoice({
      id: String(Date.now()),
      invoiceNumber,
      date,
      dueDate,
      customer,
      items: completeItems,
      subtotal,
      totalDiscount,
      totalTax,
      grandTotal,
      status: 'unpaid',
      notes,
      amountPaid: 0,
    });

    toast.success(`Invoice ${invoiceNumber} created!`);
    navigate('/invoices');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">New Invoice</span>
        </button>
        <Button size="sm" onClick={handleSubmit} className="rounded-full">
          Save
        </Button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Customer */}
        <div className="rounded-xl border border-border bg-card p-4">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Customer</Label>
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name} - {c.phone}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Invoice Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1.5" />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</Label>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1.5" />
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Items</h3>
            <button onClick={addItem} className="flex items-center gap-1 text-xs font-medium text-primary">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </button>
          </div>
          {items.map((item, idx) => (
            <div key={item.id} className={`p-4 space-y-3 ${idx < items.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={e => updateItem(idx, 'name', e.target.value)}
                  />
                </div>
                {items.length > 1 && (
                  <Button size="icon" variant="ghost" onClick={() => removeItem(idx)} className="shrink-0 mt-0.5">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Qty</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                    min={1}
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Rate (₹)</Label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={e => updateItem(idx, 'rate', Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Disc %</Label>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={e => updateItem(idx, 'discount', Number(e.target.value))}
                    min={0} max={100}
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Tax %</Label>
                  <Input
                    type="number"
                    value={item.tax}
                    onChange={e => updateItem(idx, 'tax', Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              <div className="text-right text-sm font-semibold text-foreground">
                Amount: {formatCurrency(calcItemAmount(item))}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-border bg-card p-4">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Notes</Label>
          <Textarea
            placeholder="Add any notes or terms..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="mt-1.5 min-h-[60px]"
          />
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-emerald-600">-{formatCurrency(totalDiscount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">{formatCurrency(totalTax)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold text-foreground">Grand Total</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full rounded-xl" size="lg">
          Create Invoice
        </Button>
      </div>
    </div>
  );
};

export default CreateInvoice;

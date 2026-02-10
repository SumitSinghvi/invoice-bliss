import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '@/store/invoiceStore';
import StatusBadge from '@/components/StatusBadge';
import { ArrowLeft, Share2, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, updateInvoiceStatus, deleteInvoice } = useInvoiceStore();

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Invoice not found</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

  const handleMarkPaid = () => {
    updateInvoiceStatus(invoice.id, 'paid', invoice.grandTotal);
    toast.success('Invoice marked as paid');
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    toast.success('Invoice deleted');
    navigate('/invoices');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">{invoice.invoiceNumber}</span>
        </button>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          <Button size="icon" variant="ghost">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Status & Customer */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <StatusBadge status={invoice.status} />
            <span className="text-xs text-muted-foreground">{invoice.date}</span>
          </div>
          <h2 className="text-base font-semibold text-foreground">{invoice.customer.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">{invoice.customer.address}</p>
          {invoice.customer.gstin && (
            <p className="text-xs text-muted-foreground mt-0.5">GSTIN: {invoice.customer.gstin}</p>
          )}
        </div>

        {/* Items */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Items</h3>
          </div>
          {invoice.items.map((item, idx) => (
            <div key={item.id} className={`px-4 py-3 ${idx < invoice.items.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</span>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>{item.quantity} {item.unit} × {formatCurrency(item.rate)}</span>
                {item.discount > 0 && <span>Disc: {item.discount}%</span>}
                <span>Tax: {item.tax}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.totalDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-emerald-600">-{formatCurrency(invoice.totalDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">{formatCurrency(invoice.totalTax)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-sm font-bold text-foreground">Grand Total</span>
            <span className="text-base font-bold text-primary">{formatCurrency(invoice.grandTotal)}</span>
          </div>
          {invoice.status !== 'paid' && (
            <div className="flex justify-between text-sm pt-1">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="text-foreground">{formatCurrency(invoice.amountPaid)}</span>
            </div>
          )}
          {invoice.status !== 'paid' && (
            <div className="flex justify-between text-sm">
              <span className="font-medium text-destructive">Balance Due</span>
              <span className="font-bold text-destructive">{formatCurrency(invoice.grandTotal - invoice.amountPaid)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {invoice.status !== 'paid' && (
          <Button onClick={handleMarkPaid} className="w-full rounded-xl" size="lg">
            Mark as Paid
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;

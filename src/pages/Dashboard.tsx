import { useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '@/store/invoiceStore';
import StatusBadge from '@/components/StatusBadge';
import { IndianRupee, TrendingUp, TrendingDown, Clock, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { invoices, customers } = useInvoiceStore();

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const totalPending = invoices.reduce((acc, inv) => acc + (inv.grandTotal - inv.amountPaid), 0);
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const recentInvoices = invoices.slice(0, 4);

  const stats = [
    { label: 'Total Revenue', value: totalRevenue, icon: TrendingUp, variant: 'stat-card-green' as const, iconColor: 'text-emerald-600' },
    { label: 'Pending Amount', value: totalPending, icon: Clock, variant: 'stat-card-orange' as const, iconColor: 'text-orange-600' },
    { label: 'Overdue', value: overdueInvoices.reduce((a, i) => a + i.grandTotal, 0), icon: TrendingDown, variant: 'stat-card-red' as const, iconColor: 'text-red-600' },
    { label: 'Total Invoices', value: invoices.length, icon: IndianRupee, variant: 'stat-card-blue' as const, iconColor: 'text-blue-600', isCurrency: false },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-foreground/70">Welcome back</p>
            <h1 className="text-xl font-bold text-primary-foreground">My Business</h1>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate('/create')}
            className="gap-1.5 rounded-full"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border p-4 ${stat.variant}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {stat.isCurrency === false ? stat.value : formatCurrency(stat.value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { label: 'Sale Invoice', path: '/create', emoji: '🧾' },
            { label: 'Add Party', path: '/customers', emoji: '👤' },
            { label: 'Reports', path: '/reports', emoji: '📊' },
            { label: 'All Invoices', path: '/invoices', emoji: '📋' },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-5 py-3 min-w-[80px] hover:bg-muted transition-colors"
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs font-medium text-foreground whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Invoices</h2>
          <button onClick={() => navigate('/invoices')} className="flex items-center gap-1 text-xs font-medium text-primary">
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recentInvoices.map(invoice => (
            <div
              key={invoice.id}
              onClick={() => navigate(`/invoices/${invoice.id}`)}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">{invoice.invoiceNumber}</span>
                  <StatusBadge status={invoice.status} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{invoice.customer.name}</p>
              </div>
              <div className="text-right ml-3">
                <p className="text-sm font-bold text-foreground">{formatCurrency(invoice.grandTotal)}</p>
                <p className="text-[10px] text-muted-foreground">{invoice.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Customers */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Parties</h2>
        <div className="space-y-2">
          {customers.slice(0, 3).map(customer => (
            <div
              key={customer.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.phone}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${customer.balance >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                {formatCurrency(Math.abs(customer.balance))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

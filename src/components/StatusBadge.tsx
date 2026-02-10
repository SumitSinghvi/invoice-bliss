import { Invoice } from '@/types/invoice';

const statusConfig: Record<Invoice['status'], { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-success/15 text-success border-success/30' },
  unpaid: { label: 'Unpaid', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  partial: { label: 'Partial', className: 'bg-warning/15 text-warning border-warning/30' },
  overdue: { label: 'Overdue', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

const StatusBadge = ({ status }: { status: Invoice['status'] }) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;

import { EventData } from '../types/event';

export function exportBudgetToCSV(event: EventData): void {
  const headers = ['Category', 'Item Name', 'Estimated Cost', 'Actual Cost', 'Paid Status', 'Due Date', 'Notes'];
  const rows = event.budgetItems.map(item => [
    `"${item.category}"`,
    `"${item.name.replace(/"/g, '""')}"`,
    item.estimatedCost,
    item.actualCost,
    item.paid ? 'PAID' : 'PENDING',
    `"${item.dueDate || ''}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_budget.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportVendorsToCSV(event: EventData): void {
  const headers = ['Vendor Name', 'Category', 'Status', 'Contact Person', 'Email', 'Phone', 'Estimated Cost', 'Quote Amount', 'Deposit Paid', 'Rating', 'Notes'];
  const rows = event.vendors.map(v => [
    `"${v.name.replace(/"/g, '""')}"`,
    `"${v.category}"`,
    `"${v.status}"`,
    `"${(v.contactPerson || '').replace(/"/g, '""')}"`,
    `"${v.email || ''}"`,
    `"${v.phone || ''}"`,
    v.estimatedCost,
    v.quoteAmount,
    v.depositPaid,
    v.rating || '',
    `"${(v.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_vendors.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function triggerPrintDossier(): void {
  window.print();
}

export class BudgetItem {
  constructor({ label, amount, date }: { label: string, amount: number, date: Date }) {
    this.label = label;
    this.amount = amount;
    this.date = date;
  }
}

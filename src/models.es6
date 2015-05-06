export class BudgetItem {
  id: number;
  label: string;
  amount: number;
  date: Date;

  constructor(initial = {}) {
    Object.assign(this, initial);
  }

  static deserialize(obj) {
    const item = new BudgetItem(obj);
    if (typeof item.date === 'string') {
      item.date = new Date(item.date);
    }
    return item;
  }
}

export class Budget {
  id: number;
  label: string;

  constructor(initial = {}) {
    Object.assign(this, initial);
  }
}

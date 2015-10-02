import React, { Component } from 'react';
import classnames from 'classnames';

import BudgetItem from '../components/BudgetItem';

export default class BudgetItemList extends Component {
  total(items): number {
    return items.reduce((acc: number, { amount }) => {
      return acc + amount;
    }, 0);
  }

  totalUntil(index: number, items): number {
    return items.reduce((acc: number, { amount }, i: number) => {
      if (i <= index) {
        return acc + amount;
      } else {
        return acc;
      }
    }, 0);
  }

  render() {
    const { items, newItem, editItem, deleteItem } = this.props;
    return (
      <div>
        <p>
          <button className="button button--small" onClick={newItem}>New</button>
        </p>
        <div className="budget-item-list">
          {items.map((item, i) => <BudgetItem key={item.uid} item={item} subtotal={this.totalUntil(i, items)} editItem={editItem} deleteItem={deleteItem} />)}
        </div>
        <div className="grid-row budget-total">
          <div className="grid-1-6">Total</div>
          <div className="grid-1-3 budget-item__amount">{this.total(items)}</div>
          <div className="grid-1-2"></div>
        </div>
      </div>
    );
  }
}

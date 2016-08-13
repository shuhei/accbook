/* @flow */
import React from 'react';

import BudgetItem from '../components/BudgetItem';
import { formatNumber } from '../formatters';

import type {
  Budget,
  BudgetItem as BudgetItemType,
} from '../types';

function totalAmount(items): number {
  return items.reduce((acc: number, { amount }) => acc + amount, 0);
}

function totalUntil(index: number, items): number {
  return items.reduce(
    (acc: number, { amount }, i: number) => (i <= index ? acc + amount : acc),
    0
  );
}

type Props = {
  selectedBudget: Budget,
  items: BudgetItemType[],
  editBudget: Function,
  newItem: Function,
  editItem: Function
};

export default function BudgetItemList(
  { selectedBudget, items, editBudget, newItem, editItem }: Props
) {
  return (
    <div>
      <div className="budget-header">
        <h1>{selectedBudget.label}</h1>
        <div className="budget-header__buttons">
          <button className="button button--small" onClick={editBudget}>
            <i className="fa fa-gear" />
          </button>
          <button className="button button--small" onClick={newItem}>
            <i className="fa fa-plus" />
          </button>
        </div>
      </div>
      <div className="budget-item-list">
        {items.map((item, i) =>
          <BudgetItem
            key={item.id}
            item={item}
            subtotal={totalUntil(i, items)}
            editItem={editItem}
          />
        )}
      </div>
      <div className="grid-row budget-total">
        <div className="grid-1-6">Total</div>
        <div className="grid-1-2 budget-item__amount">{formatNumber(totalAmount(items))}</div>
        <div className="grid-1-3"></div>
      </div>
    </div>
  );
}
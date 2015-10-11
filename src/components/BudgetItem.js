import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { budgetItemProps } from '../props';
import { formatDate, formatNumber } from '../formatters';

export default function BudgetItem({ item, subtotal, editItem }) {
  const className = classnames('grid-row', 'budget-item', {
    'budget-item--spending': item.amount < 0,
    'budget-item--income': item.amount > 0,
    'budget-item--deficit': subtotal < 0
  });
  return (
    <div className={className} onClick={() => editItem(item)}>
      <div className="grid-1-6 budget-item__date">{formatDate(item.date)}</div>
      <div className="grid-1-4 budget-item__amount">{formatNumber(item.amount)}</div>
      <div className="grid-1-4 budget-item__total">{formatNumber(subtotal)}</div>
      <div className="grid-1-3 budget-item__label">{item.label}</div>
    </div>
  );
}

BudgetItem.propTypes = {
  item: budgetItemProps.isRequired,
  subtotal: PropTypes.number.isRequired,
  editItem: PropTypes.func.isRequired
};

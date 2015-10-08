import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { budgetItemProps } from '../props';
import { formatDate, formatNumber } from '../formatters';

export default function BudgetItem({ item, subtotal, editItem, deleteItem }) {
  const className = classnames('grid-row', 'budget-item', {
    'budget-item--spending': item.amount < 0,
    'budget-item--income': item.amount > 0,
    'budget-item--deficit': subtotal < 0
  });
  return (
    <div className={className}>
      <div className="grid-1-6 budget-item__date">{formatDate(item.date)}</div>
      <div className="grid-1-6 budget-item__amount">{formatNumber(item.amount)}</div>
      <div className="grid-1-6 budget-item__total">{formatNumber(subtotal)}</div>
      <div className="grid-1-4 budget-item__label">{item.label}</div>
      <div className="grid-1-4 budget-item__tools">
        <button className="button button--small" onClick={() => editItem(item)}>
          <i className="fa fa-pencil" />
        </button>
        <button className="button button--danger button--small" onClick={() => deleteItem(item)}>
          <i className="fa fa-remove" />
        </button>
      </div>
    </div>
  );
}

BudgetItem.propTypes = {
  item: budgetItemProps.isRequired,
  subtotal: PropTypes.number.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
};

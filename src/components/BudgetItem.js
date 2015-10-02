import React from 'react';
import classnames from 'classnames';

const formatDate = (date) => {
  if (!date) {
    return '';
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

export default function BudgetItem({ item, subtotal, editItem, deleteItem }) {
  const className = classnames('grid-row', 'budget-item', {
    'budget-item--spending': item.amount < 0,
    'budget-item--income': item.amount > 0,
    'budget-item--deficit': subtotal < 0
  });
  return (
    <div key={item.uid} className={className}>
      <div className="grid-1-6 budget-item__date">{formatDate(item.date)}</div>
      <div className="grid-1-6 budget-item__amount">{item.amount}</div>
      <div className="grid-1-6 budget-item__total">{subtotal}</div>
      <div className="grid-1-4">{item.label}</div>
      <div className="grid-1-4 budget-item__tools">
        <button className="button button--small" onClick={() => editItem(item)}>
          <i className="fa fa-pencil">Edit</i>
        </button>
        <button className="button button--danger button--small" onClick={() => deleteItem(item)}>
          <i className="fa fa-remove">Delete</i>
        </button>
      </div>
    </div>
  );
}

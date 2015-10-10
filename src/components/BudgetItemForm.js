import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';

import { unsavedBudgetItemProps, errorProps } from '../props';
import { formatFullDate } from '../formatters';

function invalidClassName(name, errors) {
  return classnames({
    invalid: errors[name] && errors[name].length > 0
  });
}

export default class BudgetItemForm extends Component {
  setToday() {
    const field = findDOMNode(this.refs.date);
    field.value = formatFullDate(new Date());
  }

  handleSave() {
    const { item, save } = this.props;

    const isIncome = findDOMNode(this.refs.isIncome).checked;
    const label = findDOMNode(this.refs.label).value.trim();
    const dateString = findDOMNode(this.refs.date).value;
    const amountString = findDOMNode(this.refs.amount).value.trim();

    const date = dateString ? new Date(dateString) : null;
    const amount = parseInt(amountString || '0', 10) * (isIncome ? 1 : -1);

    save({ ...item, label, amount, date });
  }

  render() {
    const { item, errors, cancel, deleteItem } = this.props;
    const defaultItem = {
      ...item,
      isIncome: item.amount > 0,
      amount: Math.abs(item.amount),
      date: formatFullDate(item.date)
    };
    return (
      <form className="budget-item-form">
        <p>
          <label>
            <input type="checkbox" ref="isIncome" defaultChecked={defaultItem.isIncome} /> Income
          </label>
        </p>
        <p>
          <label className={invalidClassName('label', errors)}>Label</label>
          <input type="text" ref="label" defaultValue={defaultItem.label} />
        </p>
        <p>
          <label className={invalidClassName('amount', errors)}>Amount</label>
          <input type="number" ref="amount" defaultValue={defaultItem.amount} />
        </p>
        <p>
          <label className={invalidClassName('date', errors)}>Date</label>
          <input type="date" ref="date" defaultValue={defaultItem.date} />
        </p>
        <p>
          <button className="button button--small" type="button" onClick={cancel}>Cancel</button>
          <button className="button button--small" type="button" onClick={::this.setToday}>Today</button>
          { item.id &&
            <button className="button button--danger button--small" type="button" onClick={() => deleteItem(item)}>
              Delete
            </button>
          }
          <button className="button button--small button--primary" type="button" onClick={::this.handleSave}>Save</button>
        </p>
      </form>
    );
  }
}

BudgetItemForm.propTypes = {
  item: unsavedBudgetItemProps,
  errors: PropTypes.shape({
    label: errorProps,
    amount: errorProps,
    date: errorProps
  }).isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
};

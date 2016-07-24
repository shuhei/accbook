import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import { unsavedBudgetItemProps, errorProps } from '../props';
import { formatFullDate } from '../formatters';

function invalidClassName(name, errors) {
  return classnames({
    invalid: errors[name] && errors[name].length > 0,
  });
}

export default class BudgetItemForm extends Component {
  setToday() {
    const field = this.refs.date;
    field.value = formatFullDate(new Date());
  }

  handleSave() {
    const { item, save } = this.props;

    const isIncome = this.refs.isIncome.checked;
    const label = this.refs.label.value.trim();
    const dateString = this.refs.date.value;
    const amountString = this.refs.amount.value.trim();

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
      date: formatFullDate(item.date),
    };
    return (
      <form className="budget-item-form">
        <legend>Budget Item</legend>
        <div className="input-group">
          <label>
            <input type="checkbox" ref="isIncome" defaultChecked={defaultItem.isIncome} /> Income
          </label>
        </div>
        <div className="input-group">
          <label className={invalidClassName('label', errors)}>Label</label>
          <input type="text" ref="label" defaultValue={defaultItem.label} />
        </div>
        <div className="input-group">
          <label className={invalidClassName('amount', errors)}>Amount</label>
          <input type="number" ref="amount" defaultValue={defaultItem.amount} />
        </div>
        <div className="input-group">
          <label className={invalidClassName('date', errors)}>Date</label>
          <div className="grid-row">
            <div className="grid-2-3">
              <input type="date" ref="date" defaultValue={defaultItem.date} />
            </div>
            <div className="grid-1-3 text-right">
              <button
                className="button button--small"
                type="button"
                onClick={::this.setToday}
              >Today</button>
            </div>
          </div>
        </div>
        <p>
          <button className="button button--small" type="button" onClick={cancel}>Cancel</button>
          {item.id &&
            <button
              className="button button--danger button--small"
              type="button"
              onClick={() => deleteItem(item)}
            >Delete</button>
          }
          <button
            className="button button--small button--primary"
            type="button"
            onClick={::this.handleSave}
          >Save</button>
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
    date: errorProps,
  }).isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};

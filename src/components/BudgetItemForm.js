import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';

import { budgetItemProps, errorProps } from '../props';
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
    const { item, errors, cancel } = this.props;
    const defaultItem = {
      ...item,
      isIncome: item.amount > 0,
      amount: Math.abs(item.amount),
      date: formatFullDate(item.date)
    };
    return (
      <form className="budget-item-form">
        <div className="grid-row">
          <div className="grid-1-4"></div>
          <div className="grid-3-4">
            <label>
              <input type="checkbox" ref="isIncome" defaultChecked={defaultItem.isIncome} /> Income
            </label>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-1-4">
            <label className={invalidClassName('label', errors)}>Label</label>
          </div>
          <div className="grid-3-4">
            <input type="text" ref="label" defaultValue={defaultItem.label} />
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-1-4">
            <label className={invalidClassName('amount', errors)}>Amount</label>
          </div>
          <div className="grid-3-4">
            <input type="number" ref="amount" defaultValue={defaultItem.amount} />
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-1-4">
            <label className={invalidClassName('date', errors)}>Date</label>
          </div>
          <div className="grid-3-4">
            <input type="date" ref="date" defaultValue={defaultItem.date} />
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-1-4"></div>
          <div className="grid-3-4">
            <button className="button button--small" type="button" onClick={cancel}>Cancel</button>
            <button className="button button--small" type="button" onClick={::this.setToday}>Today</button>
            <button className="button button--small button--primary" type="button" onClick={::this.handleSave}>Save</button>
          </div>
        </div>
      </form>
    );
  }
}

BudgetItemForm.propTypes = {
  item: budgetItemProps,
  errors: PropTypes.shape({
    label: errorProps,
    amount: errorProps,
    date: errorProps
  }).isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};
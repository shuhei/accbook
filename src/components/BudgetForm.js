import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';

function invalidClassName(name, errors) {
  return classnames({
    invalid: errors[name] && errors[name].length > 0
  });
}

function pad(num, size = 2) {
  let s = num.toString();
  if (s.length < size) {
    s = '0' + s;
  }
  return s;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${pad(y, 4)}-${pad(m, 2)}-${pad(d, 2)}`;
}

export default class BudgetForm extends Component {
  setToday() {
    const field = findDOMNode(this.refs.date);
    field.value = formatDate(new Date());
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
      date: formatDate(item.date)
    };
    return (
      <form>
        <p>
          <label>
            <input type="checkbox" ref="isIncome" defaultChecked={defaultItem.isIncome} /> Income
          </label>
        </p>
        <p>
          <label className={invalidClassName('label', errors)}>
            Label <input type="text" ref="label" defaultValue={defaultItem.label} />
          </label>
        </p>
        <p>
          <label className={invalidClassName('amount', errors)}>
            Amount <input type="number" ref="amount" defaultValue={defaultItem.amount} />
          </label>
        </p>
        <p>
          <label className={invalidClassName('date', errors)}>
            Date <input type="date" ref="date" defaultValue={defaultItem.date} />
          </label>
        </p>
        <p>
          <button className="button button--small" type="button" onClick={cancel}>Cancel</button>
          <button className="button button--small" type="button" onClick={this.setToday.bind(this)}>Today</button>
          <button className="button button--small button--primary" type="button" onClick={this.handleSave.bind(this)}>Save</button>
        </p>
      </form>
    );
  }
}

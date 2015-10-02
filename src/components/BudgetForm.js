import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';

function invalidClassName(name, validation) {
  return classnames({
    invalid: !validation[name]
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
  handleSave() {
    const { item, save } = this.props;
    const isIncome = findDOMNode(this.refs.isIncome).checked;
    const label = findDOMNode(this.refs.label).value.trim();
    const dateString = findDOMNode(this.refs.date).value;
    const date = dateString ? new Date(dateString) : null;
    const amount = findDOMNode(this.refs.amount).value.trim();
    // TODO: isIncome + amount -> amount
    save({ uid: item.uid, isIncome, label, date, amount });
  }

  render() {
    const { item, cancel } = this.props;
    // TODO: Errors?
    const validation = {
      label: true,
      amount: true,
      date: true
    };
    return (
      <form>
        <p>
          <label>
            <input type="checkbox" ref="isIncome" defaultChecked={item.isChecked} /> Income
          </label>
        </p>
        <p>
          <label className={invalidClassName('label', validation)}>
            Label <input type="text" ref="label" defaultValue={item.label} />
          </label>
        </p>
        <p>
          <label className={invalidClassName('amount', validation)}>
            Amount <input type="number" ref="amount" defaultValue={item.amount} />
          </label>
        </p>
        <p>
          <label className={invalidClassName('date', validation)}>
            Date <input type="date" ref="date" defaultValue={formatDate(item.date)} />
          </label>
        </p>
        <p>
          <button className="button button--small" type="button" onClick={cancel}>Cancel</button>
          <button className="button button--small" type="button" onClick={this.handleSave.bind(this)}>Save</button>
        </p>
      </form>
    );
  }
}

/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { compose } from 'redux';
import { Field, reduxForm, change } from 'redux-form';

import type { BudgetItem } from '../types';
import { formatFullDate } from '../formatters';
import { hideModal } from '../modules/modal';
import { saveBudgetItem, deleteBudgetItem } from '../modules/budgetItems';

export const FORM_NAME = 'budgetItem';

const invalidClassName = (meta) =>
  classNames({ invalid: meta.touched && meta.error });

type CheckboxGroupProps = {
  input: Object,
  meta: Object,
  label: string,
};
const CheckboxGroup = ({ input, meta, label }: CheckboxGroupProps) => (
  <div className="input-group">
    <label className={invalidClassName(meta)}>
      <input type="checkbox" checked={input.value} {...input} />
      {label}
    </label>
  </div>
);

type InputGroupProps = {
  input: Object,
  meta: Object,
  label: string,
  type: string,
};
const InputGroup = ({ input, meta, label, type }: InputGroupProps) => (
  <div className="input-group">
    <label className={invalidClassName(meta)}>{label}</label>
    <input type={type} {...input} />
  </div>
);

type DateGroupProps = {
  input: Object,
  meta: Object,
  label: string,
  setToday: Function,
};
const DateGroup = ({ input, meta, label, setToday }: DateGroupProps) => (
  <div className="input-group">
    <label className={invalidClassName(meta)}>{label}</label>
    <div className="grid-row">
      <div className="grid-2-3">
        <input type="date" {...input} />
      </div>
      <div className="grid-1-3 text-right">
        <button className="button button--small" type="button" onClick={setToday}>
          Today
        </button>
      </div>
    </div>
  </div>
);

type Props = {
  item: ?BudgetItem,
  handleSubmit: Function,
  cancel: Function,
  deleteItem: Function,
  setToday: Function,
};
const BudgetItemForm = ({ item, handleSubmit, cancel, deleteItem, setToday }: Props) => (
  <form className="budget-item-form" onSubmit={handleSubmit}>
    <legend>Budget Item</legend>

    <Field name="isIncome" component={CheckboxGroup} label="Income" />
    <Field name="label" component={InputGroup} label="Label" type="text" />
    <Field name="amount" component={InputGroup} label="Amount" type="number" />
    <Field name="date" component={DateGroup} label="Date" setToday={setToday} />

    <p>
      <button className="button button--small" type="button" onClick={cancel}>
        Cancel
      </button>
      {item && (
        <button
          className="button button--danger button--small"
          type="button"
          onClick={() => deleteItem(item)}
        >Delete</button>
      )}
      <button type="submit" className="button button--small button--primary">
        Save
      </button>
    </p>
  </form>
);

const mapStateToProps = (state, { itemId }) => {
  const item = state.budgetItems.find(it => it.id === itemId);
  if (!item) {
    return {
      initialValues: {
        amount: 0,
        date: formatFullDate(new Date()),
      },
    };
  }
  return {
    item,
    initialValues: {
      itemId,
      budgetId: item.budgetId,
      label: item.label,
      isIncome: item.amount > 0,
      amount: Math.abs(item.amount),
      date: formatFullDate(item.date),
    },
  };
};

const mapDispatchToProps = {
  cancel() {
    return hideModal();
  },
  // TODO: Use itemId.
  deleteItem(budgetItem) {
    return deleteBudgetItem(budgetItem);
  },
  setToday() {
    return change(FORM_NAME, 'date', formatFullDate(new Date()));
  },
};

const decorate = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: FORM_NAME,
    onSubmit({ itemId, budgetId, label, isIncome, amount, date }, dispatch) {
      const budgetItem = {
        id: itemId,
        budgetId,
        label: label.trim(),
        amount: (isIncome ? 1 : -1) * amount,
        date: date && new Date(date),
      };
      dispatch(saveBudgetItem(budgetItem));
    },
  }),
);

export default decorate(BudgetItemForm);

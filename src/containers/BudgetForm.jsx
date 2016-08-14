/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';

import { hideModal } from '../modules/modal';
import { saveBudget } from '../modules/budgets';

export const FORM_NAME = 'budget';

type Props = {
  handleSubmit: Function,
  cancel: Function,
};
const BudgetForm = ({ handleSubmit, cancel }: Props) => (
  <form className="budget-form" onSubmit={handleSubmit}>
    <legend>Budget</legend>
    <div className="input-group">
      <label>Label</label>
      <Field name="label" component="input" type="text" />
    </div>
    <p>
      <button
        className="button button--small"
        type="button"
        onClick={cancel}
      >Cancel</button>
      <button
        className="button button--small button--primary"
        type="submit"
      >Save</button>
    </p>
  </form>
);

const mapStateToProps = (state, { budgetId }) => {
  const budget = state.budgets.find(b => b.id === budgetId);
  if (!budget) {
    return {};
  }
  return {
    budget,
    initialValues: {
      budgetId,
      label: budget.label,
    },
  };
};

const mapDispatchToProps = {
  cancel() {
    return hideModal();
  },
};

const decorate = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: FORM_NAME,
    onSubmit({ budgetId, label }, dispatch) {
      const budget = {
        id: budgetId,
        label,
      };
      dispatch(saveBudget(budget));
    },
  }),
);

export default decorate(BudgetForm);

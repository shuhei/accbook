/* @flow */
import React, { Component, PropTypes } from 'react';

import { unsavedBudgetProps, errorProps } from '../props';

export default class BudgetForm extends Component {
  handleSave() {
    const { budget, save } = this.props;

    const label = this.refs.label.value;

    save({ ...budget, label });
  }

  render() {
    const { budget, cancel } = this.props;
    const defaultBudget = { ...budget };

    return (
      <form className="budget-form">
        <legend>Budget</legend>
        <div className="input-group">
          <label>Label</label>
          <input type="text" ref="label" defaultValue={defaultBudget.label} />
        </div>
        <p>
          <button
            className="button button--small"
            type="button"
            onClick={cancel}
          >Cancel</button>
          <button
            className="button button--small button--primary"
            type="button"
            onClick={() => this.handleSave()}
          >Save</button>
        </p>
      </form>
    );
  }
}

BudgetForm.propTypes = {
  budget: unsavedBudgetProps,
  errors: PropTypes.shape({
    label: errorProps,
  }).isRequired,
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

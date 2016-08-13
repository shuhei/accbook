import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import {
  closeBudgetForm,
} from '../actions';
import BudgetForm from '../components/BudgetForm';

import type { Budget } from '../types';

type Props = {
  budget: ?Budget,
  errors: Object,
  close: Function,
  save: Function
};

function BudgetFormModal(
  { budget, errors, close, save }: Props
) {
  return (
    <Modal isOpen={!!budget} onReqeustClose={close}>
      <BudgetForm
        budget={budget}
        errors={errors}
        save={save}
        cancel={close}
      />
    </Modal>
  );
}

const mapStateToProps = state => ({
  budget: state.budgetForm.budget,
  errors: state.budgetForm.errors,
});

const mapDispatchToProps = dispatch => ({
  close() {
    dispatch(closeBudgetForm());
  },
  save(budget) {
    dispatch({ type: 'BUDGET_SAVE_REQUESTED', budget });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BudgetFormModal);

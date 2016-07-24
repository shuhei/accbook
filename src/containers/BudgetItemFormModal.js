/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import BudgetItemForm from '../components/BudgetItemForm';
import type { BudgetItem } from '../types';

type Props = {
  item: ?BudgetItem,
  errors: ?Object,
  close: Function,
  save: Function,
  deleteItem: Function,
};

function BudgetItemFormModal(
  { item, errors, close, save, deleteItem }: Props
) {
  return (
    <Modal
      isOpen={!!item}
      onReqeustClose={close}
    >
      <BudgetItemForm
        item={item}
        errors={errors}
        save={save}
        cancel={close}
        deleteItem={deleteItem}
      />
    </Modal>
  );
}

const mapStateToProps = state => ({
  item: state.budgetItemForm.item,
  errors: state.budgetItemForm.errors,
});

const mapDispatchToProps = dispatch => ({
  close() {
    dispatch({ type: 'CLOSE_ITEM_FORM' });
  },
  save(budgetItem) {
    dispatch({ type: 'BUDGET_ITEM_SAVE_REQUESTED', budgetItem });
  },
  deleteItem(budgetItem) {
    dispatch({ type: 'BUDGET_ITEM_DELETE_REQUESTED', budgetItem });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BudgetItemFormModal);

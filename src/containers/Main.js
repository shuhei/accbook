/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import {
  toggleMenu,
  logout,
  editBudget,
  newItem, editItem,
  closeForm, closeBudgetForm,
} from '../actions';
import Wrapper from '../components/Wrapper';
import MenuBar from '../components/MenuBar';
import BudgetItemList from '../components/BudgetItemList';
import BudgetForm from '../components/BudgetForm';
import BudgetItemForm from '../components/BudgetItemForm';

class Main extends Component {
  // TODO: Move to somewhere.
  componentWillMount() {
    this.props.fetchBudgets();
  }

  render() {
    const {
      dispatch,
      selectedBudget, budgets,
      budgetItems,
      menuOpen,
      budgetForm,
      budgetItemForm,
      selectBudget,
      deleteItem,
    } = this.props;

    const sidebar = (
      <MenuBar
        budgets={budgets}
        selectBudget={selectBudget}
        logout={() => dispatch(logout())}
      />
    );

    return (
      <Wrapper
        menuOpen={menuOpen}
        toggleMenu={() => dispatch(toggleMenu())}
        logout={() => dispatch(logout())}
        sidebar={sidebar}
      >
        {selectedBudget &&
          <BudgetItemList
            selectedBudget={selectedBudget}
            items={budgetItems}
            editBudget={() => dispatch(editBudget(selectedBudget))}
            newItem={() => dispatch(newItem())}
            editItem={item => dispatch(editItem(item))}
          />
        }

        <Modal
          key="budget-item-form"
          isOpen={!!budgetItemForm.item}
          onReqeustClose={() => dispatch(closeForm())}
        >
          <BudgetItemForm
            item={budgetItemForm.item}
            errors={budgetItemForm.errors}
            save={budgetItem => dispatch({ type: 'BUDGET_ITEM_SAVE_REQUESTED', budgetItem })}
            cancel={() => dispatch(closeForm())}
            deleteItem={deleteItem}
          />
        </Modal>
        <Modal
          key="budget-form"
          isOpen={!!budgetForm.budget}
          onReqeustClose={() => dispatch(closeBudgetForm())}
        >
          <BudgetForm
            budget={budgetForm.budget}
            errors={budgetForm.errors}
            save={budget => dispatch({ type: 'BUDGET_SAVE_REQUESTED', budget })}
            cancel={() => dispatch(closeBudgetForm())}
          />
        </Modal>
      </Wrapper>
    );
  }
}

// FIXME: Click on overlay doesn't close the modal.
// Because of using exenv instead of fbjs?
// FIXME: We shouldn't need this.
Modal.setAppElement(document.getElementsByTagName('body')[0]);
Modal.injectCSS();

const mapStateToProps = state => {
  const { selectedBudgetId, budgets, budgetItems } = state;
  const selectedBudget = budgets
    .find(budget => selectedBudgetId && budget.id === selectedBudgetId);
  const selectedItems = budgetItems
    .filter(item => selectedBudgetId && item.budgetId === selectedBudgetId)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return {
    ...state,
    selectedBudget,
    budgetItems: selectedItems,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchBudgets() {
    dispatch({ type: 'BUDGETS_FETCH_REQUESTED' });
  },
  selectBudget(budget) {
    dispatch({ type: 'BUDGET_SELECTED', budget });
    dispatch(toggleMenu());
  },
  deleteItem(budgetItem) {
    dispatch({ type: 'BUDGET_ITEM_DELETE_REQUESTED', budgetItem });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

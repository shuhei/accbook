import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import {
  toggleMenu,
  logout,
  fetchBudgetsIfNeeded, selectBudget,
  fetchItemsIfNeeded, newItem, editItem, deleteItem, saveItem,
  closeForm
} from '../actions';
import Wrapper from '../components/Wrapper';
import BudgetItemList from '../components/BudgetItemList';
import BudgetItemForm from '../components/BudgetItemForm';

class Main extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchBudgetsIfNeeded());
    dispatch(fetchItemsIfNeeded());
  }

  render() {
    const {
      dispatch,
      selectedBudget, budgets, budgetItems, menuOpen, form
    } = this.props;

    return (
      <Wrapper
        budgets={budgets}
        menuOpen={menuOpen}
        selectBudget={(budget) => dispatch(selectBudget(budget))}
        toggleMenu={() => dispatch(toggleMenu())}
        logout={() => dispatch(logout())}>

        { selectedBudget &&
          <BudgetItemList
            selectedBudget={selectedBudget}
            items={budgetItems}
            newItem={() => dispatch(newItem())}
            editItem={(item) => dispatch(editItem(item))}
            deleteItem={(item) => dispatch(deleteItem(item))} />
        }

        <Modal
          isOpen={!!form.item}
          onReqeustClose={() => dispatch(closeForm())}>
          <BudgetItemForm
            item={form.item}
            errors={form.errors}
            save={(item) => dispatch(saveItem(item))}
            cancel={() => dispatch(closeForm())} />
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

function select(state) {
  const { selectedBudget, budgetItems } = state;
  const selectedItems = state.budgetItems.filter((item) => {
    return selectedBudget && item.budgetId === selectedBudget.id;
  });
  return {
    ...state,
    budgetItems: selectedItems
  };
}

export default connect(select)(Main);

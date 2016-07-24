/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { lifecycle } from 'recompose';

import * as actions from '../actions';
import Wrapper from '../components/Wrapper';
import MenuBar from '../components/MenuBar';
import BudgetItemList from '../components/BudgetItemList';
import BudgetFormModal from './BudgetFormModal';
import BudgetItemFormModal from './BudgetItemFormModal';

import type { Budget, BudgetItem } from '../types';

// TODO: Move to somewhere. Saga after login?
const fetchOnMount = lifecycle({
  componentWillMount() {
    this.props.fetchBudgets();
  },
});

type Props = {
  selectedBudget: Budget,
  budgets: Budget[],
  budgetItems: BudgetItem[],
  menuOpen: boolean,
  selectBudget: Function,
  logout: Function,
  toggleMenu: Function,
  editBudget: Function,
  newItem: Function,
  editItem: Function
};

function Main(
  {
    selectedBudget, budgets, budgetItems, menuOpen,
    selectBudget, logout, toggleMenu, editBudget, newItem, editItem,
  }: Props
) {
  const sidebar = (
    <MenuBar budgets={budgets} selectBudget={selectBudget} logout={logout} />
  );

  return (
    <Wrapper menuOpen={menuOpen} toggleMenu={toggleMenu} logout={logout} sidebar={sidebar}>
      {selectedBudget &&
        <BudgetItemList
          selectedBudget={selectedBudget}
          items={budgetItems}
          // TODO: Don't create a function on the fly.
          editBudget={() => editBudget(selectedBudget)}
          newItem={newItem}
          editItem={editItem}
        />
      }
      <BudgetFormModal />
      <BudgetItemFormModal />
    </Wrapper>
  );
}

const mapStateToProps = state => {
  const { selectedBudgetId, budgets, budgetItems } = state;
  // TODO: Extract selectors to reducer files.
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
    // TODO: Handle an action in a reducer or saga so that we can omit dispatches here.
    dispatch({ type: 'BUDGET_SELECTED', budget });
    dispatch({ type: 'TOGGLE_MENU' });
  },
  logout() {
    dispatch(actions.logout());
  },
  toggleMenu() {
    dispatch({ type: 'TOGGLE_MENU' });
  },
  editBudget(budget) {
    // FIXME
    dispatch(actions.editBudget(budget));
  },
  newItem() {
    // FIXME
    dispatch(actions.newItem());
  },
  editItem(item) {
    // FIXME
    dispatch(actions.editItem(item));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(fetchOnMount(Main));

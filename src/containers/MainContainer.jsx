/* @flow */
import { connect } from 'react-redux';
import { lifecycle } from 'recompose';

import Main from '../components/Main';
import * as actions from '../actions';
import { editBudget, newBudgetItem, editBudgetItem } from '../modules/modal';

// TODO: Move to somewhere. Saga after login?
const fetchOnMount = lifecycle({
  componentWillMount() {
    this.props.fetchBudgets();
  },
});

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
    dispatch(editBudget(budget.id));
  },
  newItem() {
    dispatch(newBudgetItem());
  },
  editItem(item) {
    dispatch(editBudgetItem(item.id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(fetchOnMount(Main));

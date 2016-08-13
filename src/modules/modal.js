/* @flow */
import type { Action } from '../types';

import BudgetItemForm from '../containers/BudgetItemForm';
import BudgetForm from '../components/BudgetForm';

// Constants

const SHOW_MODAL = 'modal/SHOW';
const HIDE_MODAL = 'modal/HIDE';

const BUDGET_ITEM_FORM_MODAL = 'BUDGET_ITEM_FORM_MODAL';
const BUDGET_FORM_MODAL = 'BUDGET_FORM_MODAL';

type ModalType
  = typeof BUDGET_ITEM_FORM_MODAL
  | typeof BUDGET_FORM_MODAL;

const MODALS = {
  [BUDGET_ITEM_FORM_MODAL]: BudgetItemForm,
  [BUDGET_FORM_MODAL]: BudgetForm,
};

// Action creators

export const showModal = (type: ModalType, props: Object) => ({
  type: SHOW_MODAL,
  payload: { type, props },
});
export const hideModal = () => ({
  type: HIDE_MODAL,
});

// Modals

export const modalForType = (type: ModalType) =>
  MODALS[type] || null;

export const editBudgetItem = (itemId: string) =>
  showModal(BUDGET_ITEM_FORM_MODAL, { itemId });

export const newBudgetItem = () =>
  showModal(BUDGET_ITEM_FORM_MODAL, { itemId: null });

export const showBudgetFormModal = (budgetId: string) =>
  showModal(BUDGET_FORM_MODAL, { budgetId });

// Reducer

type State = {
  type: ModalType | null,
  props: Object,
};

const initialState = {
  type: null,
  props: {},
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        type: action.payload.type,
        props: action.payload.props,
      };
    case HIDE_MODAL:
      return initialState;
    default:
      return state;
  }
};

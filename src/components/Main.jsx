/* @flow */
import React from 'react';

import Wrapper from '../components/Wrapper';
import MenuBar from '../components/MenuBar';
import BudgetItemList from '../components/BudgetItemList';
import Modal from '../containers/Modal';

import type { Budget, BudgetItem } from '../types';

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

const Main = (
  {
    selectedBudget, budgets, budgetItems, menuOpen,
    selectBudget, logout, toggleMenu, editBudget, newItem, editItem,
  }: Props
) => {
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
      <Modal />
    </Wrapper>
  );
};
export default Main;

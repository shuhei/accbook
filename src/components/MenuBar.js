/* @flow */
import React from 'react';

import type { Budget } from '../types';

type Props = {
  budgets: Budget[],
  selectBudget: (budget: Budget) => void,
  logout: () => void
};

export default function MenuBar({ budgets, selectBudget, logout }: Props) {
  const budgetList = budgets.map(budget => (
    <li
      key={budget.id}
      className="menu-bar__item"
      onClick={() => selectBudget(budget)}
    >{budget.label}</li>
  ));

  return (
    <div className="menu-bar">
      <ul className="menu-bar__list">
        <li className="menu-bar__item">accbook</li>
      </ul>
      <ul className="menu-bar__list">
        {budgetList}
      </ul>
      <ul className="menu-bar__list">
        <li className="menu-bar__item" onClick={logout}>Log out</li>
      </ul>
    </div>
  );
}

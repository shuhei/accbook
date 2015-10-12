import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { budgetProps } from '../props';

export default function MenuBar({ budgets, selectBudget, logout }) {
  const budgetList = budgets.map((budget) => {
    return <li key={budget.id} className="menu-bar__item" onClick={() => selectBudget(budget)}>{budget.label}</li>;
  });

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

MenuBar.propTypes = {
  budgets: PropTypes.arrayOf(budgetProps),
  selectBudget: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

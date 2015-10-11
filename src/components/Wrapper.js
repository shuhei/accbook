import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { budgetProps } from '../props';

const MenuLink = ({ toggleMenu, menuOpen }) => {
  const className = classnames('menu-link', {
    'menu-link--open': menuOpen });
  return (
    <div className={className} onClick={toggleMenu}>
      <span></span>
    </div>
  );
};

MenuLink.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired
};

const MenuBar = ({ budgets, selectBudget, logout }) => {
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
};

MenuBar.propTypes = {
  selectBudget: PropTypes.func.isRequired,
  budgets: PropTypes.arrayOf(budgetProps),
  logout: PropTypes.func.isRequired
};

export default function Wrapper({ children, budgets, menuOpen, selectBudget, toggleMenu, logout }) {
  const className = classnames('wrapper', {
    'wrapper--open': menuOpen
  });
  return (
    <div className={className}>
      <MenuLink toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <MenuBar budgets={budgets} selectBudget={selectBudget} toggleMenu={toggleMenu} logout={logout} />

      <div className="main">
        {children}
      </div>
    </div>
  );
}

Wrapper.propTypes = {
  budgets: PropTypes.arrayOf(budgetProps).isRequired,
  menuOpen: PropTypes.bool.isRequired,
  selectBudget: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

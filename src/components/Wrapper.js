import React from 'react';
import classnames from 'classnames';

const MenuLink = ({ toggleMenu, menuOpen }) => {
  const className = classnames('menu-link', {
    'menu-link--open': menuOpen });
  return (
    <div className={className} onClick={toggleMenu}>
      <span></span>
    </div>
  );
};

const MenuBar = ({ logout }) => (
  <div className="menu-bar">
    <ul className="menu-bar__list">
      <li>Budget 1</li>
      <li>Budget 2</li>
      <li onClick={logout}>Log out</li>
    </ul>
  </div>
);

export default function Wrapper({ children, logout, menuOpen, toggleMenu }) {
  const className = classnames('wrapper', {
    'wrapper--open': menuOpen
  });
  return (
    <div className={className}>
      <MenuLink toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <MenuBar logout={logout} />

      <div className="main">
        <h1>Accbook</h1>
        {children}
      </div>
    </div>
  );
}

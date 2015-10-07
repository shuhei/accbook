import React, { PropTypes } from 'react';
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

MenuLink.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired
};

const MenuBar = ({ logout }) => (
  <div className="menu-bar">
    <ul className="menu-bar__list">
      <li className="menu-bar__item">accbook</li>
    </ul>
    <ul className="menu-bar__list">
      <li className="menu-bar__item" onClick={logout}>Log out</li>
    </ul>
  </div>
);

MenuBar.propTypes = {
  logout: PropTypes.func.isRequired
};

export default function Wrapper({ children, menuOpen, toggleMenu, logout }) {
  const className = classnames('wrapper', {
    'wrapper--open': menuOpen
  });
  return (
    <div className={className}>
      <MenuLink toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <MenuBar logout={logout} />

      <div className="main">
        {children}
      </div>
    </div>
  );
}

Wrapper.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

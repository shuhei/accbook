/* @flow */
/* global ReactClass */
import React from 'react';
import classnames from 'classnames';

type MenuLinkProps = {
  menuOpen: boolean,
  toggleMenu: Function,
};

const MenuLink = ({ toggleMenu, menuOpen }: MenuLinkProps) => {
  const className = classnames('menu-link', {
    'menu-link--open': menuOpen });
  return (
    <div className={className} onClick={toggleMenu}>
      <span></span>
    </div>
  );
};

type Props = {
  children: ReactClass[],
  menuOpen: boolean,
  toggleMenu: Function,
  sidebar: ReactClass
};

export default function Wrapper({ children, menuOpen, toggleMenu, sidebar }: Props) {
  const className = classnames('wrapper', {
    'wrapper--open': menuOpen,
  });
  return (
    <div className={className}>
      <MenuLink toggleMenu={toggleMenu} menuOpen={menuOpen} />
      {sidebar}

      <div className="main">
        {children}
      </div>
    </div>
  );
}

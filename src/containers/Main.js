import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import {
  toggleMenu,
  logout,
  fetchItemsIfNeeded, newItem, editItem, deleteItem, saveItem,
  closeForm
} from '../actions';
import Wrapper from '../components/Wrapper';
import BudgetItemList from '../components/BudgetItemList';
import BudgetForm from '../components/BudgetForm';

class Main extends Component {
  componentWillMount() {
    this.props.dispatch(fetchItemsIfNeeded());
  }

  render() {
    const {
      dispatch,
      budgetItems, menuOpen, form
    } = this.props;

    return (
      <Wrapper
        menuOpen={menuOpen}
        toggleMenu={() => dispatch(toggleMenu())}
        logout={() => dispatch(logout())}>
        <BudgetItemList
          items={budgetItems}
          newItem={() => dispatch(newItem())}
          editItem={(item) => dispatch(editItem(item))}
          deleteItem={(item) => dispatch(deleteItem(item))} />

        <Modal
          isOpen={!!form.item}
          onReqeustClose={() => dispatch(closeForm())}>
          <BudgetForm
            item={form.item}
            errors={form.errors}
            save={(item) => dispatch(saveItem(item))}
            cancel={() => dispatch(closeForm())} />
        </Modal>
      </Wrapper>
    );
  }
}

// FIXME: Click on overlay doesn't close the modal.
// Because of using exenv instead of fbjs?
// FIXME: We shouldn't need this.
Modal.setAppElement(document.getElementsByTagName('body')[0]);
Modal.injectCSS();

function select(state) {
  return state;
}

export default connect(select)(Main);

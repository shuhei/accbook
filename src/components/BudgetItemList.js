import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import BudgetItem from '../components/BudgetItem';
import { budgetProps, budgetItemProps } from '../props';
import { formatNumber } from '../formatters';

export default class BudgetItemList extends Component {
  total(items): number {
    return items.reduce((acc: number, { amount }) => {
      return acc + amount;
    }, 0);
  }

  totalUntil(index: number, items): number {
    return items.reduce((acc: number, { amount }, i: number) => {
      if (i <= index) {
        return acc + amount;
      } else {
        return acc;
      }
    }, 0);
  }

  render() {
    const { selectedBudget, items, newItem, editItem, deleteItem } = this.props;
    return (
      <div>
        <div className="budget-header">
          <h1>{selectedBudget.label}</h1>
          <div className="budget-header__buttons">
            <button className="button button--small" onClick={newItem}>
              <i className="fa fa-plus" />
            </button>
          </div>
        </div>
        <div className="budget-item-list">
          {items.map((item, i) => <BudgetItem key={item.id} item={item} subtotal={this.totalUntil(i, items)} editItem={editItem} deleteItem={deleteItem} />)}
        </div>
        <div className="grid-row budget-total">
          <div className="grid-1-6">Total</div>
          <div className="grid-1-3 budget-item__amount">{formatNumber(this.total(items))}</div>
          <div className="grid-1-2"></div>
        </div>
      </div>
    );
  }
}

BudgetItemList.propTypes = {
  selectedBudget: budgetProps.isRequired,
  items: PropTypes.arrayOf(budgetItemProps.isRequired).isRequired,
  newItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
};

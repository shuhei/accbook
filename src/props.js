/* @flow */
import { PropTypes } from 'react';

const budgetBareProps = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export const budgetProps = PropTypes.shape(budgetBareProps);
export const unsavedBudgetProps = PropTypes.shape({
  ...budgetBareProps,
  id: PropTypes.string,
});

const itemProps = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
};

export const budgetItemProps = PropTypes.shape(itemProps);
export const unsavedBudgetItemProps = PropTypes.shape({
  ...itemProps,
  id: PropTypes.string,
});

export const errorProps = PropTypes.arrayOf(PropTypes.string);

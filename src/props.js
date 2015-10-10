import { PropTypes } from 'react';

export const budgetProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
});

const itemProps = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date).isRequired
};

export const budgetItemProps = PropTypes.shape(itemProps);
export const unsavedBudgetItemProps = PropTypes.shape({
  ...itemProps,
  id: PropTypes.string
});

export const errorProps = PropTypes.arrayOf(PropTypes.string);

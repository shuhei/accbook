import { PropTypes } from 'react';


export const budgetItemProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date).isRequired
});

export const errorProps = PropTypes.arrayOf(PropTypes.string);

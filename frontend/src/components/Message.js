import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ type = 'info', children }) => {
  let classes;
  switch (type) {
    case 'danger':
      classes = 'bg-red-100 text-red-900';
      break;
    case 'success':
      classes = 'bg-green-100 text-green-900';
      break;
    case 'warning':
      classes = 'bg-yellow-100 text-yellow-900';
      break;
    default:
      classes = 'bg-blue-100 text-blue-900';
      break;
  }
  return (
    <div className={`${classes} tracking-wider p-4 my-4 font-semibold`}>
      {children}
    </div>
  );
};

Message.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'danger', 'success']).isRequired,
};

export default Message;

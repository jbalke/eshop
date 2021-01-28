import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ type = 'info', children }) => {
  return <div className={`message-box ${type}`}>{children}</div>;
};

Message.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'danger', 'success']).isRequired,
};

export default Message;

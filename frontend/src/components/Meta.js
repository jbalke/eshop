import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({
  title = 'Welcome to E-Shop',
  description = 'The best shop on the Internet',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
    </Helmet>
  );
};

export default Meta;

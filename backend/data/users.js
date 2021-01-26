import argon2 from 'argon2';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: await argon2.hash('123456'),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: await argon2.hash('123456'),
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: await argon2.hash('123456'),
  },
];

export default users;

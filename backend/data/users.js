import argon2 from 'argon2';

const users = async () => [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: await argon2.hash('123456'),
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: await argon2.hash('123456'),
    role: 'user',
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: await argon2.hash('123456'),
    role: 'user',
  },
];

export default users;

import React from 'react';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { FaCheckSquare, FaEdit, FaTrash } from 'react-icons/fa';

const UserList = () => {
  const { data, isLoading, isError, error } = useQuery(
    'users',
    ApiService.admin.getUsers
  );

  return (
    <div className=''>
      <h1>Users</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <table className='user-table table-auto divide-y text-left w-full'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {data.map((user) => (
              <tr key={user._id}>
                <td>
                  <Link to={`/user/${user._id}`}>{user._id}</Link>
                </td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>{user.isAdmin && <FaCheckSquare fill='green' />}</td>
                <td className='flex items-center justify-around'>
                  <Link
                    to={`/user/${user._id}`}
                    className='btn small bg-blue-700'
                    title='Edit'
                  >
                    <FaEdit fill='white' />
                  </Link>
                  <button
                    type='button'
                    className='btn small bg-red-700'
                    title='Delete'
                  >
                    <FaTrash fill='white' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;

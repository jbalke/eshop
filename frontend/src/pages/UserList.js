import React, { useState, useEffect } from 'react';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { FaCheckSquare, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

const UserList = () => {
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const modalRoot = document.getElementById('modal');

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery(
    'users',
    ApiService.admin.getUsers
  );

  const userDeleteInfo = useMutation(ApiService.admin.deleteUser, {
    onSuccess: (data) => {
      toast.success(`${data.email} deleted`);
      queryClient.setQueryData('users', (oldData) =>
        oldData.filter((user) => user._id !== data._id)
      );
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 5000 });
    },
  });

  useEffect(() => {
    if (isDeleteConfirmed) {
      setIsDeleteConfirmed(false);
      userDeleteInfo.mutate({ id: selectedUser._id });
    }
  }, [isDeleteConfirmed, selectedUser, userDeleteInfo]);

  return (
    <>
      <Modal
        modalRoot={modalRoot}
        onConfirm={() => {
          setIsDeleteConfirmed(true);
          setShowConfirmation(false);
        }}
        onCancel={() => setShowConfirmation(false)}
        isShow={showConfirmation}
      >
        <span>
          Are you sure you want to <strong>DELETE</strong> user{' '}
          {selectedUser?.email}?
        </span>
      </Modal>
      <div className=''>
        <h1>Users</h1>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message type='danger'>{error.message}</Message>
        ) : (
          <div className='overflow-x-scroll md:overflow-hidden'>
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
                        className='btn primary'
                        title='Edit'
                      >
                        <FaEdit fill='white' />
                      </Link>
                      <button
                        type='button'
                        className='btn primary'
                        title='Delete'
                        onClick={() => {
                          setSelectedUser(user);
                          setShowConfirmation(true);
                        }}
                      >
                        <FaTrash fill='white' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default UserList;

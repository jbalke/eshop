import React, { useState, useEffect } from 'react';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { FaCheckSquare, FaEdit, FaTrash } from 'react-icons/fa';
import { useModal } from '../hooks/useModal';
import { toast } from 'react-toastify';

const UserList = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const modalRoot = document.getElementById('modal');
  const {
    Modal,
    setShowModal,
    isActionConfirmed,
    setIsActionConfirmed,
  } = useModal(modalRoot);

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
    if (isActionConfirmed) {
      setIsActionConfirmed(false);
      userDeleteInfo.mutate({ id: selectedUser._id });
    }
  }, [isActionConfirmed, setIsActionConfirmed, selectedUser, userDeleteInfo]);

  return (
    <>
      <Modal>
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
            <table className='user-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <Link to={`/admin/user/${user._id}`}>{user._id}</Link>
                    </td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>{user.isAdmin && <FaCheckSquare fill='green' />}</td>
                    <td className='flex items-center justify-around'>
                      <Link
                        to={`/admin/user/${user._id}`}
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
                          setShowModal(true);
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {FaCheck , FaTimes} from "react-icons/fa"
export default function DashBoardUsers() {
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModel,setShowModel] = useState(false)
  const [userId,setuserId] = useState("")
  const { currentUser } = useSelector((state) => state.user);

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`/api/user/allUser`);
      setUsers(res.data.users);
      if (res.data.users.totalUsers < 10) {
        setShowMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleShowMore = async () => {
    const startingIndex = users.length;
    try {
      const res = await axios.get(`/api/user/allUser?startingIndex=${startingIndex}`);
      if (res.status === 200) {
        setUsers((prev) => [...prev, ...res.data.users]);
        if (res.data.users.totalUsers < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading more posts", error);
    }
  };
 const handleUserDelete = async ()=>{
   try {
     const res = await axios.delete(`/api/user/delete/${userId}`)
     if(res.status === 200){
       setUsers((prevPostData) => prevPostData.filter((users) => users._id !== userId))
       setShowModel(false)
     }
   } catch (error) {
     console.error("Error deleting post", error)
   }
 }
  useEffect(() => {
    if (currentUser.isAdmin) {
      getAllUsers();
    }
  }, []);

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {users.map((user) => (
                <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(user.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                      <img
                        src={user.profileImg}
                        alt={"User Image"}
                        className="w-10 h-10 rounded-full object-cover bg-gray-500"
                      />
                  </Table.Cell>
                  <Table.Cell className='font-medium text-red-900 dark:text-white'>
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? <FaCheck className="text-green-500"/> : <FaTimes className="text-red-500"/>}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={()=>{
                      setShowModel(true)
                      setuserId(user._id) 
                    }}>Delete</span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button className='w-full self-center text-teal-500 text-sm py-7' onClick={handleShowMore}>Show more</button>
          )}
        </>
      ) : (
        <p>No User available</p>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size={"md"}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 m-auto" />
            <h3 className="mb-5 text-gray-500 text-lg dark:text-gray-400">Are you sure that you want to delete this account?</h3>
            <div className="flex justify-center gap-5">
              <Button color={"failure"} onClick={() => handleUserDelete()} >Yes,I'm sure</Button>
              <Button onClick={() => setShowModel(false)} color={"gray"}>No,cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

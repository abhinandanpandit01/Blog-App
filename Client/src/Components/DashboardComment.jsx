import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {FaCheck , FaTimes} from "react-icons/fa"
export default function DashboardComment() {
  const [comments, setcomments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModel,setShowModel] = useState(false)
  const [commentId,setcommentId] = useState("")
  const { currentUser } = useSelector((state) => state.user);

  const getAllComments = async () => {
    try {
      const res = await axios.get(`/api/comment/allComments`);
      setcomments(res.data.comments);
      console.log(res.data)
      if (res.data.users.totalUsers < 10) {
        setShowMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleShowMore = async () => {
    const startingIndex = comments.length;
    try {
      const res = await axios.get(`/api/comment/allComments?startingIndex=${startingIndex}`);
      if (res.status === 200) {
        setcomments((prev) => [...prev, ...res.data.comments]);
        if (res.data.totalNumbersOfComments < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading more posts", error);
    }
  };
 const handleDeleteComment = async ()=>{
   try {
     const res = await axios.delete(`/api/comment/deleteComment/${commentId}`)
     if(res.status === 200){
       setcomments((prevComment) => prevComment.filter((comment) => comment._id !== commentId))
       setShowModel(false)
     }
   } catch (error) {
     console.error("Error deleting comment", error)
   }
 }
  useEffect(() => {
    if (currentUser.isAdmin) {
      getAllComments();
    }
  }, []);

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Numbers of Likes</Table.HeadCell>
              <Table.HeadCell>Post Id</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {comments.map((comment) => (
                <Table.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell className='truncate'>
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell className='font-medium text-red-900 dark:text-white'>
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{comment._id}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={()=>{
                      setShowModel(true)
                      setcommentId(comment._id) 
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
        <p>No Comment available</p>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size={"md"}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 m-auto" />
            <h3 className="mb-5 text-gray-500 text-lg dark:text-gray-400">Are you sure that you want to delete this account?</h3>
            <div className="flex justify-center gap-5">
              <Button color={"failure"} onClick={() => handleDeleteComment()} >Yes,I'm sure</Button>
              <Button onClick={() => setShowModel(false)} color={"gray"}>No,cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

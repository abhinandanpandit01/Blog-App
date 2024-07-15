import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashBoardPost() {
  const [allPostsData, setAllPostsData] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel,setShowModel] = useState(false)
  const [postId,setPostId] = useState("")
  const { currentUser } = useSelector((state) => state.user);

  const getAllPosts = async () => {
    try {
      const res = await axios.get(`/api/post/get-all-posts?author=${currentUser._id}`);
      setAllPostsData(res.data.posts);
      if (res.data.posts.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleShowMore = async () => {
    const startingIndex = allPostsData.length;
    try {
      const res = await axios.get(`/api/post/get-all-posts?author=${currentUser._id}&startingIndex=${startingIndex}`);
      if (res.status === 200) {
        setAllPostsData((prevPostData) => [...prevPostData, ...res.data.posts]);
        console.log(res.data.posts.length)
        if (res.data.posts.length < 10) {
          setShowMore(false);
        }
        console.log(showMore)
      }
    } catch (error) {
      console.error("Error loading more posts", error);
    }
  };
  const handlePostDelete = async ()=>{
    try {
      const res = await axios.delete(`/api/post/delete-post/${postId}/${currentUser._id}`)
      if(res.status === 200){
        setAllPostsData((prevPostData) => prevPostData.filter((post) => post._id !== postId))
        setShowModel(false)
      }
    } catch (error) {
      console.error("Error deleting post", error)
    }
  }
  useEffect(() => {
    if (currentUser.isAdmin) {
      getAllPosts();
    }
  }, []);

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && allPostsData.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {allPostsData.map((post) => (
                <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell className='font-medium text-red-900 dark:text-white'>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={()=>{
                      setShowModel(true)
                      setPostId(post._id)
                    }}>Delete</span>
                  </Table.Cell>
                  <Table.Cell className='text-teal-500 hover:underline'>
                    <Link to={`/edit-post/${post._id}`}><span>Edit</span></Link>
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
        <p>No posts available</p>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size={"md"}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 m-auto" />
            <h3 className="mb-5 text-gray-500 text-lg dark:text-gray-400">Are you sure that you want to delete this account?</h3>
            <div className="flex justify-center gap-5">
              <Button color={"failure"} onClick={() => handlePostDelete()} >Yes,I'm sure</Button>
              <Button onClick={() => setShowModel(false)} color={"gray"}>No,cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

import axios from 'axios';
import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import likeSound from "../assets/likeSound.mp3"
export default function CommentSection({ postId })
{
  const likeSoundAudio = new Audio(likeSound)
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState("");
  const [comment, setComment] = useState("");
  const [showModel, setShowModel] = useState(false)
  const [commentId, setCommentId] = useState("")
  const navigate = useNavigate();
  const handleSubmit = async (e) =>
  {
    e.preventDefault();

    try
    {
      const response = await axios.post("/api/comment/addComment", {
        postId,
        content: comment,
        userId: currentUser._id,
      });

      if (response.status === 200)
      {
        setComment("");
        setComments((prevComments) => [response.data.newComment, ...prevComments]);
        setCommentError(null);
      }
    } catch (err)
    {
      setCommentError(err.response.data.message);
    }
  };

  useEffect(() =>
  {
    const fetchComments = async () =>
    {
      try
      {
        const response = await axios.get(`/api/comment/getAllComments/${postId}`);
        setComments(response.data.comments);
      } catch (err)
      {
        console.log(err);
      }
    };

    fetchComments();
  }, [postId]);
  const handleLike = async (commentId) =>
  {
    if (!currentUser)
    {
      navigate("/signIn");
      return;
    }

    try
    {
      const response = await axios.put(`/api/comment/likeComment/${commentId}`);
      if (response.status === 200)
      {
        likeSoundAudio.play();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? {
                ...comment,
                likes: response.data.likes,
                numberOfLikes: response.data.numberOfLikes,
              }
              : comment

          )
        );
        setCommentError(null);
      }
    } catch (err)
    {
      console.log(err);
    }
  };

  const handleEdit = async (comment, editedContent) =>
  {
    setComments(
      comments.map((c) => (c._id === comment._id ? { ...c, content: editedContent } : c))
    )
  }
  const handleDelete = async (Id) =>
  {
    try
    {
      const response = await axios.delete(`/api/comment/deleteComment/${Id}`);
      if (response.status === 200)
      {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== Id)
        );
        setShowModel(false)
        setCommentError(null);
      }
    } catch (err)
    {
      console.log(err);
    }
  };
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img src={currentUser.profileImg} alt="" className='h-5 w-5 object-cover rounded-full' />
          <Link to={`/dashboard?tab=profile`} className='text-xs text-cyan-600 hover:underline'>
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be logged in to comment
          <Link to="/signIn" className='text-blue-500 hover:underline'>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
          <Textarea
            placeholder='Add a comment...'
            id="comment"
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className='text-gray-500 text-xs'>{200 - comment.length} characters left</p>
            <Button outline gradientDuoTone="purpleToBlue" type='submit'>Submit</Button>
          </div>
          {commentError && (
            <Alert color="failure" className='mt-5'>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className='text-gray-500 text-sm'>No comments yet</p>
      ) : (
        <>
          <div className="flex gap-1 items-center text-sm my-5">
            <p>Comments</p>
            <div className="border border-gray-400 px-2 py-1 rounded-sm">
              {comments.length}
            </div>
          </div>
          {comments.map((subcomment, index) => (
            <Comment key={index} comment={subcomment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentID) => { setShowModel(true); setCommentId(commentID) }} />
          ))}
        </>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size={"md"}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 m-auto" />
            <h3 className="mb-5 text-gray-500 text-lg dark:text-gray-400">Are you sure that you want to delete this account?</h3>
            <div className="flex justify-center gap-5">
              <Button color={"failure"} onClick={() => handleDelete(commentId)} >Yes,I'm sure</Button>
              <Button onClick={() => setShowModel(false)} color={"gray"}>No,cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
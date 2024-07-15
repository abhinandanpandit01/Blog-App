import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import CallToAction from '../Components/CallToAction';
import CommentSection from '../Components/CommentSection';
import PostCard from '../Components/PostCard';

export default function PostPage()
{
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { postSlug } = useParams();
  const [recentPosts, setRecentPosts] = useState([]);
  useEffect(() =>
  {
    const getPost = async () =>
    {
      if (postSlug)
      {
        try
        {
          setLoading(true);
          setError(false);
          const response = await axios.get(`/api/post/get-all-posts?slug=${postSlug}`);
          if (response.status !== 200 || !response.data.posts || response.data.posts.length === 0)
          {
            setError(true);
            setLoading(false);
            return;
          }
          setPost(response.data.posts[0]);
          setLoading(false);
        } catch (err)
        {
          setError(true);
          setLoading(false);
        }
      }
    };
    getPost();
  }, [postSlug]);
  useEffect(() =>
  {
    const getRecentPosts = async () =>{
      try{
        await axios.get("/api/post/get-all-posts?limit=3").then((res) => {if (res.status === 200) {setRecentPosts(res.data.posts);console.log(res.data.posts) }

        })
      }catch(err){
        console.log(err);
      }
    }
    getRecentPosts();
  }, []);
  if (loading)
  {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size={"xl"} />
      </div>
    );
  }

  if (error)
  {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p>Error loading post.</p>
      </div>
    );
  }

  return (
    <div className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post?.title}
      </h1>
      {post?.category && (
        <Link to={`/search?category=${post?.category}`} className='self-center mt-5'>
          <Button color={"gray"} size={"xs"} pill>
            {post?.category}
          </Button>
        </Link>
      )}
      <img src={post?.image} alt={post?.title || "Post Image"} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
      <div className="flex justify-between p-3 border-b border-b-slate-500 mx-auto w-full max-w-2xl text-sm">
        <span>{new Date(post?.createdAt).toDateString()}</span>
        <span className='italic'>{Math.ceil(post?.content?.length / 500)} mins read</span>
      </div>
      {/* post-content is a dynamic class that is used to set the content of the post which is created , this is not a built in one */}
      <div dangerouslySetInnerHTML={{ __html: post?.content }} className='p-3 mx-auto max-w-2xl w-full post-content'></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post?._id} />
      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className='text-xl mt-5'>Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
          ):null}
        </div>
      </div>
    </div>
  );
}

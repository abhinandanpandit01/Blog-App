import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CallToAction from "../Components/CallToAction";
import PostCard from "../Components/PostCard";
export default function Home()
{
  const [posts,setposts] = useState([])
  useEffect(()=>{
    const getPosts = async ()=>{
      const response = await axios.get("/api/post/get-all-posts?limit=9")
      setposts(response.data.posts)
    }
    getPosts()
  },[])
  return (
  <div>
    <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
      <p className="text-gray-500 text-xs sm:text-sm">Hello you'll find numerous articles , tutorials on various topics such as Web development , software development and many more</p>
      <Link to="/search" className="text-xs sm:text-sm text-teal-500 font-bold hover:underline">View All Posts</Link>
    </div>
    <div className="p-3 bg-amber-100 dark:bg-slate-700">
      <CallToAction/>
    </div>
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
      {
        posts && posts.length ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl text-center font-semibold">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {
                posts.map((post, index) => (
                  <PostCard key={index} post={post} />
                ))
              }
            </div>
            <Link to={"/search"} className="text-lg text-teal-500 hover:underline text-center">View All Posts</Link>
          </div>
        ) : null
      }
    </div>
  </div>
  )
}

import { Link } from "react-router-dom"
export default function PostCard({post}) {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[380px] overflow-hidden rounded-lg sm:w-[350px] transition-all">
      <Link to={`/post/${post.slug}`}>
        <img src={post?.image} alt="post image" className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"/>
        <div className="flex flex-col p-3">
            <p className="text-lg font-semibold line-clamp-2">{post?.title}</p>
            <span className="text-sm text-gray-500 italic">{post?.category}</span>
            <Link to={`/post/${post.slug}`} className="z-10 group-hover:bottom-0 absolute bottom-[-150px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md">Read Article</Link>
        </div>
      </Link>
    </div>
  )
}

import axios from 'axios'
import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../Components/PostCard'

export default function Search()
{
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        sort: "desc",
        category: "uncategorized",

    })
    const [posts, setPosts] = useState([])
    const [loading, setLoaing] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() =>
    {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get("searchTerm")
        const sortFromUrl = urlParams.get("sort")
        const categoryFromUrl = urlParams.get("category")
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl)
        {
            setSidebarData({
                searchTerm: searchTermFromUrl || "",
                sort: sortFromUrl || "desc",
                category: categoryFromUrl || "uncategorized",
            })
        }
        const fetchPosts = async () =>
        {
            setLoaing(true)
            const searchQuery = urlParams.toString()
            const res = await axios.get(`/api/post/get-all-posts?${searchQuery}`)
            if (res.status === 200)
            {
                setPosts(res.data.posts)
                setLoaing(false)
                if (res.data.posts.length === 9)
                {
                    setShowMore(true);
                }
                else
                {
                    setShowMore(false);
                }
            } else
            {
                setLoaing(false)
                return;
            }
        }
        fetchPosts()
    }, [])
    const handleSubmit = (e) =>{
        e.preventDefault()
        const urlParam = new URLSearchParams(location.search)
        urlParam.set("searchTerm",sidebarData.searchTerm)
        urlParam.set("sort",sidebarData.sort)
        urlParam.set("category",sidebarData.category)
        navigate(`${location.pathname}?${urlParam.toString()}`)
    }
    const handleShowMore = async() => {
        const numOfPosts = posts.length
        const startIndex = numOfPosts
        const urlParams = new URLSearchParams(location.search)
        urlParams.set("startIndex", startIndex)
        const searchQuery = urlParams.toString()
        const res = await axios.get(`/api/post/get-all-posts?${searchQuery}`)
        if (res.status === 200)
        {
            setPosts([...posts, ...res.data.posts])
            if (res.data.posts.length === 9)
            {
                setShowMore(true);
            }
            else
            {
                setShowMore(false);
            }
        }
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2 ">
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <TextInput placeholder='Search....' id='search' type='text' value={sidebarData.searchTerm} onChange={(e) => setSidebarData({ ...sidebarData, searchTerm: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>Sort:</label>
                        <Select onChange={(e) => setSidebarData({ ...sidebarData, sort: e.target.value })} value={sidebarData.sort} id='sort'>
                                                           
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>

                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>Category:</label>
                        <Select onChange={(e) => setSidebarData({ ...sidebarData, category: e.target.value })} value={sidebarData.category} id='category'>
                            <option value="uncategorized">Uncategorized</option>
                            <option value="javascript">JavaScript</option>
                            <option value="reactjs">Reactjs</option>
                            <option value="nextjs">Nextjs</option>
                        </Select>
                    </div>
                    <Button type='submit' gradientDuoTone={"purpleToPink"} outline>Apply Filter</Button>
                </form>
            </div>
            <div className="w-full">
                <h1 className='text-3xl font-semibold sm:border-b border-b-gray-500 p-3 mt-4'>Posts Result</h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {
                        !loading && posts.length === 0 && <p className='text-xl text-gray-500'>No posts found</p>
                    }
                    {
                        loading && <p className='text-xl text-gray-500'>Loading...</p>
                    }
                    {
                        !loading && posts.length && posts.map((post) => <PostCard key={post._id} post={post} />)
                    }
                    {
                        showMore && <button className='text-teal-500 text-lg hover:underline p-7 w-full' onClick={handleShowMore}>Show More</button>
                    }
                </div>
            </div>
        </div>
    )
}

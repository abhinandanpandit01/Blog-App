import axios from "axios"
import { Button, Table } from "flowbite-react"
import { useState, useEffect } from "react"
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
export default function DashDashboard()
{
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [lastMonthsUsers, setLastMonthsUsers] = useState(0)
    const [lastMonthsPosts, setLastMonthsPosts] = useState(0)
    const [lastMonthsComments, setLastMonthsComments] = useState(0)
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() =>
    {
        const fetchUsers = async () =>
        {
            try
            {
                await axios.get("/api/user/allUser?limit=5").then((res) =>
                {
                    setUsers(res.data.users)
                    setTotalUsers(res.data.totalUsers)
                    setLastMonthsUsers(res.data.lastMonthUser)
                })
            } catch (err)
            {
                console.log(err)
            }
        }
        const fetchPosts = async () =>
        {
            try
            {
                await axios.get("/api/post/get-all-posts?limit=5").then((res) =>
                {
                    setPosts(res.data.posts)
                    setTotalPosts(res.data.totalPosts)
                    setLastMonthsPosts(res.data.oneMonthAgoTotalPostNumber)
                })
            }
            catch (err)
            {
                console.log(err)
            }
        }
        const fetchComments = async () =>
        {
            try
            {
                await axios.get("/api/comment/allComments?limit=5").then((res) =>
                {
                    setComments(res.data.comments)
                    setLastMonthsComments(res.data.commentsWithinOneMonth)
                    setTotalComments(res.data.totalNumbersOfComments)
                })
            }
            catch (err)
            {
                console.log(err)
            }
        }

        if (currentUser.isAdmin)
        {
            fetchUsers()
            fetchPosts()
            fetchComments()
        }
    }, [currentUser])
    return (
        <div className="p-3 md:mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className="text-gray-500 font-md uppercase">Total Users</h3>
                        <p className="text-2xl">{totalUsers}</p>
                    </div>
                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center"><HiArrowNarrowUp />{lastMonthsUsers}</span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className="text-gray-500 font-md uppercase">Total Comments</h3>
                        <p className="text-2xl">{totalPosts}</p>
                    </div>
                        <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center"><HiArrowNarrowUp />{lastMonthsComments}</span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className="text-gray-500 font-md uppercase">Total Posts</h3>
                        <p className="text-2xl">{totalPosts}</p>
                    </div>
                        <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                </div>
                <div className="flex gap-2 text-sm">
                    <span className="text-green-500 flex items-center"><HiArrowNarrowUp />{lastMonthsPosts}</span>
                    <div className="text-gray-500">Last month</div>
                </div>
            </div>
            </div>
            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Users</h1>
                        <Button outline gradientDuoTone={"purpleToPink"}>
                            <Link to="/dashboard?tab=users">View All</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Profile Picuter</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {
                            users && users.map((user) =>
                                <Table.Body key={user._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img src={user.profileImg} className="w-10 h-10 rounded-full bg-gray-500" alt="ProfileImg"/>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {user.username}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            )
                        }
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Comments</h1>
                        <Button outline gradientDuoTone={"purpleToPink"}>
                            <Link to="/dashboard?tab=comments">View All</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {
                            comments && comments.map((comment) =>
                                <Table.Body key={comment._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="w-[26rem]">
                                           <p className="line-clamp-2">{comment.content}</p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.numberOfLikes}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            )
                        }
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Posts</h1>
                        <Button outline gradientDuoTone={"purpleToPink"}>
                            <Link to="/dashboard?tab=posts">View All</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Post Picuter</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        {
                            posts && posts.map((post) =>
                                <Table.Body key={post._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img src={post.image} className="w-14 h-10 rounded-md bg-gray-500" alt="ProfileImg"/>
                                        </Table.Cell>
                                        <Table.Cell className="w-96">
                                            {post.title}
                                        </Table.Cell>
                                        <Table.Cell className="w-5">
                                            {post.category}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            )
                        }
                    </Table>
                </div>
            </div>
        </div>
    )
}

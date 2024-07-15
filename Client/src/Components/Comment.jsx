import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from "react-icons/fa"
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
export default function Comment({ comment, onLike , onEdit , onDelete})
{
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [commentContent, setCommentContent] = useState(comment.content);
    let isLikedByCurrentUser = comment.likes.includes(currentUser._id)
    useEffect(() =>
    {
        const getUser = async () =>
        {
            try
            {
                const response = await axios.get(`/api/user/${comment.userId}`);
                if (response.status === 200)
                {
                    setUser(response.data);
                }
            } catch (err)
            {
                console.log(err);
            }
        };
        getUser();
    }, [comment.userId]);

    const handleSave = async () =>{
            await axios.put(`/api/comment/editComment/${comment._id}`, {content: commentContent}).then((res)=>{
                setIsEditing(false);
                onEdit(comment, commentContent);
            }).catch((err)=>{
                console.log(err);
            })
        
    }
    const handleEdit = () =>
    {
        setIsEditing(true);
    }
    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className="flex-shrink-0 mr-3">
                <img src={user.profileImg} className="w-10 h-10 object-cover bg-gray-200 rounded-full" alt="" />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : "anonymous user"}</span>
                    <span className='text-xs text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                {isEditing ? (<>
                    <Textarea className='mb-2' value={commentContent} onChange={(e)=>{setCommentContent(e.target.value)}}/>
                    <div className="flex justify-end gap-2 text-sm">
                        <Button type='submit' size={"sm"} gradientDuoTone={"purpleToBlue"} onClick={handleSave}>Save</Button>
                        <Button type='cancel' size={"sm"} gradientDuoTone={"purpleToBlue"} outline onClick={()=>setIsEditing(false)}>Cancel</Button>
                    </div>
                </>) :
                    <>
                        <p className='text-gray-500 mb-2'>{comment.content}</p>
                        <div className="flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit">
                            <button className={`text-sm hover:text-blue-500`} type='button' onClick={() => onLike(comment._id)}><FaThumbsUp className={currentUser && isLikedByCurrentUser ?"text-blue-500" : "text-gray-400"}/></button>
                            <p className='text-gray-400'>
                                {comment.numberOfLikes > 0 ? comment.numberOfLikes + (comment.numberOfLikes > 1 ? " likes" : " like") : ""}
                            </p>
                            {
                                currentUser && (currentUser._id === comment.userId) || (currentUser.isAdmin) ?(
                                    <>
                                    <button className='text-gray-400 hover:text-blue-500' onClick={handleEdit}>Edit</button>
                                    <button className='text-gray-400 hover:text-red-500' onClick={()=>{onDelete(comment._id)}}>Delete</button>
                                    </>
                                )
                                    : null
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../Firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost()
{
    const { currentUser } = useSelector((state) => state.user)
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [imageUploadingProgress, setImageUploadingProgress] = useState(0);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(() =>
    {
        try
        {
            axios.get(`/api/post/get-all-posts?postId=${postId}`).then((res) =>
            {
                if (res.status !== 200)
                {
                    publishError(res.message)
                }
                // console.log(res.data.posts)
                setFormData(res.data.posts[0]);
                setTitle(res.data.posts[0].title);
                setContent(res.data.posts[0].content);
                setCategory(res.data.posts[0].category);
                setImageUrl(res.data.posts[0].imageUrl);
            })
        }
        catch (err)
        {
            console.log(err);
        }
    }, [postId])
    const handleSendImg = async () =>
    {
        if (!file)
        {
            setImageUploadError("Please select an image");
            return;
        }
        setImageUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) =>
            {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadingProgress(progress.toFixed(0));
                console.log('Upload is ' + progress + '% done');
            },
            (error) =>
            {
                setImageUploadError(error.message);
                setImageUploadingProgress(0);
            },
            async () =>
            {
                try
                {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setImageUrl(url);
                    setFormData((prevData) => ({ ...prevData, imageUrl: url }));
                    setImageUploadingProgress(0);
                    setImageUploadError(null);
                } catch (error)
                {
                    setImageUploadError("Image uploading failed");
                    setImageUploadingProgress(0);
                }
            }
        );
    };

    const handleSubmit = async (e) =>
    {
        console.log(formData)
        e.preventDefault();
        try
        {

            await axios.put(`/api/post/update-post/${formData._id}/${currentUser._id}`, formData).then((res) =>
            {

                if (!res.data.success)
                {
                    setPublishError(res.data.message);
                    return;
                }
                else
                {
                    setPublishError(null);
                    // Reset the form
                    setTitle("");
                    setContent("");
                    setCategory("");
                    setImageUrl("");
                    setFile(null);
                    navigate(`/post/${res.data.updatedPost.slug}`);
                }
            })
        } catch (err)
        {
            setPublishError("Something went wrong");
        }
    };

    useEffect(() =>
    {
        setFormData({
            _id: postId,
            title,
            content,
            category,
            imageUrl
        });
    }, [title, content, category, imageUrl, postId]);
    return (
        <div>
            <div className="p-3 max-w-3xl mx-auto min-h-screen">
                <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <TextInput
                            type='text'
                            placeholder='Title'
                            required
                            id='title'
                            className="flex-1"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}

                        />
                        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="uncategorized">Select a category</option>
                            <option value="javascript">JavaScript</option>
                            <option value="reactjs">React.js</option>
                            <option value="nextjs">Next.js</option>
                        </Select>
                    </div>
                    <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                        <FileInput
                            type="file"
                            accept='image/*'
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <Button
                            type='button'
                            gradientDuoTone={"purpleToBlue"}
                            size={"sm"}
                            outline
                            onClick={handleSendImg}
                            disabled={imageUploadingProgress > 0}
                        >
                            {imageUploadingProgress ? (
                                <div className="w-16 h-16">
                                    <CircularProgressbar value={imageUploadingProgress} text={`${imageUploadingProgress || 0}%`} />
                                </div>
                            ) : (
                                "Upload Image"
                            )}
                        </Button>
                    </div>
                    {imageUploadError && (
                        <Alert color='failure'>{imageUploadError}</Alert>
                    )}
                    {imageUrl && (
                        <img src={imageUrl} alt="upload" className='w-full h-72 object-cover' />
                    )}
                    <ReactQuill
                        theme='snow'
                        placeholder='Write something.....'
                        className='h-72 mb-12'
                        required
                        value={content}
                        onChange={setContent}
                    />
                    <Button type='submit' gradientDuoTone={"purpleToPink"}>Update Post</Button>
                    {publishError && <Alert color='failure'>{publishError}</Alert>}
                </form>
            </div>
        </div>
    );
}

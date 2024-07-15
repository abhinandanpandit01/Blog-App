import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../Firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function CreatePost()
{
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
        e.preventDefault();
        try
        {
            await axios.post("/api/post/create-post", formData).then((res) =>
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
                    // Navigate to the new post page
                    // setTimeout(() => navigate(`/post/${res.data.slug}`), 1000);
                    navigate(`/posts/${res.data.post.slug}`);
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
            title,
            content,
            category,
            imageUrl
        });
    }, [title, content, category, imageUrl]);
    return (
        <div>
            <div className="p-3 max-w-3xl mx-auto min-h-screen">
                <h1 className='text-center text-3xl my-7 font-semibold'>Create Post</h1>
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
                            <option value="reactjs">Reactjs</option>
                            <option value="nextjs">Nextjs</option>
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
                    <Button type='submit' gradientDuoTone={"purpleToPink"}>Publish</Button>
                    {publishError && <Alert color='failure'>{publishError}</Alert>}
                </form>
            </div>
        </div>
    );
}

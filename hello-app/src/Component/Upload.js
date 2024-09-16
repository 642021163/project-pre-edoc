import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Validation from './UploadValidation';

function Upload() {
    const [values, setValues] = useState({
        full_name: "",
        subject: "",
        from_sender: "",
        to_recipient: "",
        file_url: null, // เริ่มต้นเป็น null
        notes: ""
    });

    const [errors, setErrors] = useState({});

    const handleInput = e => {
        setValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFileChange = e => {
        setValues(prev => ({
            ...prev,
            file_url: e.target.files[0] // เก็บไฟล์ที่เลือก
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const formData = new FormData();
                formData.append('full_name', values.full_name);
                formData.append('subject', values.subject);
                formData.append('from_sender', values.from_sender);
                formData.append('to_recipient', values.to_recipient);
                formData.append('notes', values.notes);

                if (values.file_url) {
                    formData.append('file_url', values.file_url); // ส่งไฟล์ที่เลือกมา
                }

                await axios.post('http://localhost:3000/documents', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                toast.success('บันทึกสำเร็จ!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                resetForm();
            } catch (error) {
                console.error("Error during registration", error);
                toast.error('เกิดข้อผิดพลาดในการบันทึก', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    const resetForm = () => {
        setValues({
            full_name: "",
            subject: "",
            from_sender: "",
            to_recipient: "",
            file_url: null,
            notes: ""
        });
    };

    return (
        <div className='css-upload'>
            <div className='upload1'>
                <form onSubmit={handleSubmit}>

                    <div className='upload2'>
                        <label>เรื่อง :</label>
                        <input
                            type='text'
                            name='subject'
                            value={values.subject}
                            onChange={handleInput}
                        />
                        {errors.subject && <span className='text-danger'>{errors.subject}</span>}
                    </div>
                    <div className='upload2'>
                        <label>เจ้าของเรื่อง :</label>
                        <input
                            type='text'
                            name='full_name'
                            value={values.full_name}
                            onChange={handleInput}
                        />
                        {errors.full_name && <span className='text-danger'>{errors.full_name}</span>}
                    </div>
                    <div className='upload2'>
                        <label>จาก :</label>
                        <input
                            type='text'
                            name='from_sender'
                            value={values.from_sender}
                            onChange={handleInput}
                        />
                        {errors.from_sender && <span className='text-danger'>{errors.from_sender}</span>}
                    </div>
                    <div className='upload2'>
                        <label>ถึง :</label>
                        <input
                            type='text'
                            name='to_recipient'
                            value={values.to_recipient}
                            onChange={handleInput}
                        />
                        {errors.to_recipient && <span className='text-danger'>{errors.to_recipient}</span>}
                    </div>
                    <div className='upload2'>
                        <label>File submissions :</label>
                        <input
                            type='file'
                            name='file_url'
                            onChange={handleFileChange}
                        />
                        {errors.file_url && <span className='text-danger'>{errors.file_url}</span>}
                    </div>
                    <div className='upload2'>
                        <label>หมายเหตุ :</label>
                        <textarea
                            name='notes'
                            value={values.notes}
                            onChange={handleInput}
                        />
                    </div>
                    <div className='button-upload'>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Upload;

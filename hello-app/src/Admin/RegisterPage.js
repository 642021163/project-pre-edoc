// RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import Swal from 'sweetalert2';



const RegisterPage = () => {
    const [registerForm, setRegisterForm] = useState({
        user_fname: '',
        user_lname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });


    const [changePasswordForm, setChangePasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });


    const handleChangePasswordChange = (e) => {
        const { name, value } = e.target;
        setChangePasswordForm({ ...changePasswordForm, [name]: value });
    };

    const handleRegisterSubmit = async () => {
        const { user_fname, user_lname, email, password, confirmPassword } = registerForm;

        console.log('Password:', password);  // ตรวจสอบค่าของ password
        console.log('Confirm Password:', confirmPassword);  // ตรวจสอบค่าของ confirmPassword

        // ตรวจสอบว่า password และ confirmPassword ตรงกันหลังจากลบช่องว่าง
        if (password.trim() !== confirmPassword.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match',
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/register', {
                user_fname,
                user_lname,
                email,
                username: registerForm.username,  // ใช้ข้อมูลจากฟอร์ม
                password,
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'User registered successfully!',
            });
            console.log(response.data);  // แสดงข้อมูลที่ได้จาก API
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || 'An error occurred while registering',
            });
            console.error('Error registering user:', error.response.data.message);
        }
    };




    const handleChangePasswordSubmit = async () => {
        const { oldPassword, newPassword, confirmNewPassword } = changePasswordForm;
        if (newPassword !== confirmNewPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'New passwords do not match',
            });
            return;
        }

        try {
            // เรียก API สำหรับการเปลี่ยนรหัสผ่าน
            const response = await axios.post('http://localhost:3000/change-password', {
                email: registerForm.email,  // ใช้ email จากฟอร์มที่กรอกตอนสมัครสมาชิก
                oldPassword,
                newPassword,
                confirmNewPassword,  // ส่ง confirmNewPassword เพื่อให้ตรงตาม API
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Password changed successfully!',
            });
            console.log(response.data);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || 'An error occurred while changing the password',
            });
            console.error('Error changing password:', error.response.data.message);
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm((prevForm) => ({
            ...prevForm,
            [name]: value, // ทำให้ค่าใน form อัปเดตตาม input ที่กรอก
        }));
    };

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Typography variant="h5">Register</Typography>
                    <TextField
                        label="First Name"
                        name="user_fname"
                        value={registerForm.user_fname}
                        onChange={handleRegisterChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Last Name"
                        name="user_lname"
                        value={registerForm.user_lname}
                        onChange={handleRegisterChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Username"
                        name="username"
                        value={registerForm.username}
                        onChange={handleRegisterChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        fullWidth
                        required
                    />
                    <Button onClick={handleRegisterSubmit} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                        Register
                    </Button>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Typography variant="h5">Change Password</Typography>
                    <TextField
                        label="Old Password"
                        type="password"
                        name="oldPassword"
                        value={changePasswordForm.oldPassword}
                        onChange={handleChangePasswordChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={changePasswordForm.newPassword}
                        onChange={handleChangePasswordChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        name="confirmNewPassword"
                        value={changePasswordForm.confirmNewPassword}
                        onChange={handleChangePasswordChange}
                        fullWidth
                        required
                    />
                    <Button
                        onClick={handleChangePasswordSubmit}
                        variant="contained"
                        color="secondary"
                        style={{ marginTop: '10px' }}
                    >
                        Change Password
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default RegisterPage;

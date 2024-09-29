import React, { useState } from 'react';
import { Container, TextField, Button, MenuItem, Box, Typography, Paper, Toolbar, Grid, Snackbar, CssBaseline, DialogActions } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../LayoutAdmin/Layout';
import Swal from 'sweetalert2';

// // ส่วนของ Alert สำหรับ Snackbar
// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

function AddUser() {
    // สถานะของฟอร์มข้อมูล
    const [formData, setFormData] = useState({
        prefix: '',
        user_fname: '',
        user_lname: '',
        username: '',
        password: '',
        phone_number: '',
        affiliation: '',
        role: '',
    });

    // สถานะของข้อผิดพลาด
    const [errors, setErrors] = useState({});

    // สถานะของ Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // ใช้สำหรับการนำทาง
    const navigate = useNavigate();

    // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของฟอร์ม
    const validateForm = () => {
        let tempErrors = {};
        if (!formData.prefix) tempErrors.prefix = 'ต้องระบุคำนำหน้า';
        if (!formData.user_fname) tempErrors.user_fname = 'ต้องระบุชื่อจริง';
        if (!formData.user_lname) tempErrors.user_lname = 'ต้องระบุนามสกุล';
        if (!formData.username) tempErrors.username = 'ต้องระบุชื่อผู้ใช้';
        if (!formData.password) tempErrors.password = 'ต้องระบุรหัสผ่าน';
        if (!formData.phone_number) tempErrors.phone_number = 'ต้องระบุหมายเลขโทรศัพท์';
        if (!formData.affiliation) tempErrors.affiliation = 'ต้องระบุสังกัด';
        if (!formData.role) tempErrors.role = 'ต้องระบุบทบาท';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // ฟังก์ชันจัดการการส่งฟอร์ม
    const handleSubmit = async (e) => {
        e.preventDefault();      

        try {
            const response = await axios.post('https://test-db-app-mysql-4cc2e0748b1a.herokuapp.com/users', formData);
            console.log('เพิ่มผู้ใช้สำเร็จ:', response.data);

            // ใช้ SweetAlert แสดงแจ้งเตือนความสำเร็จ
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'เพิ่มผู้ใช้สำเร็จ',
                timer: 2000, // กำหนดเวลาแสดง SweetAlert 2 วินาที
                showConfirmButton: false // ไม่ต้องแสดงปุ่ม Confirm
            }).then(() => {
                navigate('/list'); // นำผู้ใช้ไปยังหน้ารายชื่อผู้ใช้
            });

        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:', error);

            // แสดง SweetAlert ข้อผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้',
            });
        }
    };

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลฟอร์ม
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ฟังก์ชันจัดการการปิด Snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleCancel = () => {
        navigate('/list');
    };


    return (
        <Layout>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: '#1976d2' }}>เพิ่มผู้ใช้ใหม่</Typography>
                    <Toolbar />
                    <Container component={Paper} elevation={3} maxWidth="sm" sx={{ padding: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={3}>
                                    <TextField
                                        select
                                        label="คำนำหน้า"
                                        name="prefix"
                                        value={formData.prefix}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={Boolean(errors.prefix)}
                                        helperText={errors.prefix}
                                    >
                                        <MenuItem value="Mr.">นาย</MenuItem>
                                        <MenuItem value="Ms.">นาง</MenuItem>
                                        <MenuItem value="Ms.">นางสาว</MenuItem>
                                        <MenuItem value="Mrs.">ผศ.ดร.</MenuItem>
                                        <MenuItem value="Mrs.">ดร.</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="ชื่อจริง"
                                        name="user_fname"
                                        value={formData.user_fname}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={Boolean(errors.user_fname)}
                                        helperText={errors.user_fname}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        label="นามสกุล"
                                        name="user_lname"
                                        value={formData.user_lname}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={Boolean(errors.user_lname)}
                                        helperText={errors.user_lname}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={Boolean(errors.username)}
                                    helperText={errors.username}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="หมายเลขโทรศัพท์"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={Boolean(errors.phone_number)}
                                    helperText={errors.phone_number}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    label="สังกัด"
                                    name="affiliation"
                                    value={formData.affiliation}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={Boolean(errors.affiliation)}
                                    helperText={errors.affiliation}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    select
                                    label="บทบาท"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    error={Boolean(errors.role)}
                                    helperText={errors.role}
                                >
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                </TextField>
                            </Box>

                            <DialogActions style={{ justifyContent: 'center' }}>
                                <Button type="submit" variant="contained" color="primary">
                                    เพิ่มผู้ใช้
                                </Button>
                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={handleCancel}
                                >
                                    ยกเลิก
                                </Button>
                            </DialogActions>
                        </form>
                    </Container>
                </Box>

                {/* <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        textAlign: 'center',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success">
                        เพิ่มผู้ใช้สำเร็จ!
                    </Alert>
                </Snackbar> */}
            </Box>
        </Layout>
    );
}

export default AddUser;

import React, { useState } from 'react';
import { Container, TextField, Button, MenuItem, Box, Typography, Paper, Toolbar, Grid, Snackbar, CssBaseline, DialogActions, CircularProgress } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../LayoutAdmin/Layout';
import Swal from 'sweetalert2';

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
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({}); // ใช้เพื่อตรวจสอบว่าช่องกรอกถูกเลือกหรือยัง

    // สถานะของ Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // ใช้สำหรับการนำทาง
    const navigate = useNavigate();

    // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของฟอร์ม
    const validateForm = () => {
        let tempErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // รูปแบบอีเมล
        const phonePattern = /^[0-9]{3,10}$/; // อนุญาตให้มี 4 ถึง 10 หลัก

        if (!formData.prefix) tempErrors.prefix = 'ต้องระบุคำนำหน้า';
        if (!formData.user_fname) tempErrors.user_fname = 'ต้องระบุชื่อจริง';
        if (!formData.user_lname) tempErrors.user_lname = 'ต้องระบุนามสกุล';

        // ตรวจสอบ username ต้องเป็นอีเมล
        if (!formData.username) {
            tempErrors.username = 'กรุณากรอกอีเมล';
        } else if (!emailPattern.test(formData.username)) {
            tempErrors.username = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }

        // ตรวจสอบรหัสผ่าน อย่างน้อย 8 ตัวอักษร
        if (!formData.password) {
            tempErrors.password = 'กรุณาใส่รหัสผ่าน';
        } else if (formData.password.length < 8) {
            tempErrors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
        }

        // ตรวจสอบเบอร์โทรศัพท์
        if (!formData.phone_number) {
            tempErrors.phone_number = 'กรุณากรอกเบอร์โทรศัพท์';
        } else if (!phonePattern.test(formData.phone_number)) {
            tempErrors.phone_number = 'เบอร์โทรศัพท์ต้องมีระหว่าง 4 ถึง 10 หลัก';
        }

        if (!formData.affiliation) tempErrors.affiliation = 'ต้องระบุสังกัด';
        if (!formData.role) tempErrors.role = 'ต้องระบุบทบาท';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };


    // ฟังก์ชันจัดการการส่งฟอร์ม
    const handleSubmit = async (e) => {
        e.preventDefault();

        // เรียกใช้การ validateForm และตรวจสอบว่าผ่านหรือไม่
        if (!validateForm()) return; // หยุดการทำงานถ้า validateForm คืนค่า false

        try {
            const response = await axios.post('http://localhost:3000/users', formData);
            console.log('เพิ่มผู้ใช้สำเร็จ:', response.data);

            // ใช้ SweetAlert แสดงแจ้งเตือนความสำเร็จ
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'เพิ่มผู้ใช้สำเร็จ',
                timer: 1500, // กำหนดเวลาแสดง SweetAlert 2 วินาที
                showConfirmButton: false // ไม่ต้องแสดงปุ่ม Confirm
            });

            setTimeout(() => {
                navigate('/list');
            }, 1500);

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

    // ฟังก์ชันจัดการการสัมผัสช่องกรอก
    const handleFocus = (name) => {
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // ซ่อนข้อความข้อผิดพลาดเมื่อผู้ใช้คลิก
    };
    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลฟอร์ม
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // เรียกใช้การ validation ทุกครั้งที่มีการเปลี่ยนแปลง
        validateForm({ ...formData, [name]: value });
    };

    // ฟังก์ชันจัดการการปิด Snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleCancel = () => {
        setLoading(true); // เริ่มการโหลด
        setTimeout(() => {
            navigate('/list');
            setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
        }, 400); // หน่วงเวลา 400ms
    };


    return (
        <Layout>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                {/* สถานะการโหลด */}
                {loading && (
                    <Box style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 9999
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography sx={{ mt: 2 }}>Loading...</Typography>
                        </Box>
                    </Box>
                )}
                <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: '#1976d2' }}>เพิ่มผู้ใช้ใหม่</Typography>
                    <Toolbar />
                    <Container component={Paper} elevation={3} maxWidth="sm" sx={{ padding: 3 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', p: 3 }}>
                            ลงทะเบียน
                        </Typography>
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
                                        <MenuItem value="นาย">นาย</MenuItem>
                                        <MenuItem value="นาง">นาง</MenuItem>
                                        <MenuItem value="นางสาว">นางสาว</MenuItem>
                                        <MenuItem value="อาจารย์">อาจารย์</MenuItem>
                                        <MenuItem value="ดร.">ดร.</MenuItem>
                                        <MenuItem value="ผศ.ดร">ผศ.ดร</MenuItem>
                                        <MenuItem value="ศาสตราจารย์.ดร">ศาสตราจารย์.ดร</MenuItem>
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
                                        style={{ borderColor: errors.user_fname ? 'red' : (touched.user_fname && formData.user_fname ? 'green' : 'black') }}
                                    />
                                    {touched.user_fname && errors.user_fname && <span style={{ color: 'red' }}>{errors.user_fname}</span>}

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
                                        style={{ borderColor: errors.user_lname ? 'red' : (touched.user_lname && formData.user_lname ? 'green' : 'black') }}
                                    />
                                    {touched.user_lname && errors.user_lname && <span style={{ color: 'red' }}>{errors.user_lname}</span>}

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
                                    style={{ borderColor: errors.username ? 'red' : (touched.username && formData.username ? 'green' : 'black') }}
                                />
                                {touched.affiliation && errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}

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
                                    style={{ borderColor: errors.password ? 'red' : (touched.password && formData.password ? 'green' : 'black') }}
                                />
                                {touched.affiliation && errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}

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
                                    style={{ borderColor: errors.phone_number ? 'red' : (touched.phone_number && formData.phone_number ? 'green' : 'black') }}
                                />
                                {touched.affiliation && errors.phone_number && <span style={{ color: 'red' }}>{errors.phone_number}</span>}


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
                                    style={{ borderColor: errors.affiliation ? 'red' : (touched.affiliation && formData.affiliation ? 'green' : 'black') }}
                                />
                                {touched.affiliation && errors.affiliation && <span style={{ color: 'red' }}>{errors.affiliation}</span>}

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
            </Box>
        </Layout>
    );
}

export default AddUser;

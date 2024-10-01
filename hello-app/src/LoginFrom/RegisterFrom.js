import React, { useState } from 'react';
import axios from 'axios'; // นำเข้า axios
import { CssBaseline, Container, Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, IconButton, InputAdornment, FormHelperText, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import Navbar from '../AppBar/Navbar';
import AppBar from '../AppBar/Appbar';
import Swal from 'sweetalert2';

const Logo = styled('img')(({ theme }) => ({
    height: '60px', // ปรับขนาดโลโก้ตามต้องการ
    marginBottom: theme.spacing(2), // เพิ่มระยะห่างระหว่างโลโก้กับข้อความ
}));

function RegisterFrom() {
    const [dialogOpen, setDialogOpen] = useState(false); // State สำหรับ Dialog
    const [successMessage, setSuccessMessage] = useState(''); // ข้อความสำเร็จ
    const navigate = useNavigate(); // ประกาศ navigate
    const [showPassword, setShowPassword] = useState(false);
    const [touchedFields, setTouchedFields] = useState({}); // ใช้เก็บว่าฟิลล์ไหนถูกสัมผัส
    const [formSubmitted, setFormSubmitted] = useState(false); // สถานะสำหรับการส่งฟอร์ม
    const [formValues, setFormValues] = useState({
        prefix: '',
        user_fname: '',
        user_lname: '',
        username: '',
        password: '',
        phone_number: '',
        affiliation: '',
        role: 'user' // ตรวจสอบว่า field นี้ส่งข้อมูลไปด้วย
    });

    const [errors, setErrors] = useState({
        prefix: '',
        user_fname: '',
        user_lname: '',
        username: '',
        password: '',
        phone_number: '',
        affiliation: '',
        role: ''
    });

    const [success, setSuccess] = useState({
        prefix: false,
        user_fname: false,
        user_lname: false,
        username: false,
        password: false,
        phone_number: false,
        affiliation: false,
        role: false
    });


    const handleChange = (event) => {
        const { name, value } = event.target;

        // อัปเดตค่าใน formValues
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));

        // บันทึกสถานะการสัมผัส
        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));

        // อัปเดตสถานะ success เฉพาะถ้าฟอร์มถูกส่ง
        if (formSubmitted) {
            const validationErrors = validateForm({ ...formValues, [name]: value });
            setErrors(validationErrors);

            // เปลี่ยนสถานะ success
            setSuccess(prev => ({
                ...prev,
                [name]: !validationErrors[name]
            }));
        }
    };


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = (values) => {
        const newErrors = {};

        // ตรวจสอบคำนำหน้า
        if (!values.prefix) newErrors.prefix = 'กรุณาเลือกคำนำหน้า';

        // ตรวจสอบชื่อ
        if (!values.user_fname) newErrors.user_fname = 'กรุณากรอกชื่อ';

        // ตรวจสอบนามสกุล
        if (!values.user_lname) newErrors.user_lname = 'กรุณากรอกนามสกุล';

        // ตรวจสอบ username ต้องเป็นอีเมล
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!values.username) {
            newErrors.username = 'กรุณากรอกอีเมล';
        } else if (!emailPattern.test(values.username)) {
            newErrors.username = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }

        // ตรวจสอบรหัสผ่าน อย่างน้อย 8 ตัวอักษร
        if (!values.password) {
            newErrors.password = 'กรุณาใส่รหัสผ่าน';
        } else if (values.password.length < 8) {
            newErrors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
        }

        // ตรวจสอบเบอร์โทรศัพท์ ต้องมีความยาวระหว่าง 4 ถึง 10 หลัก
        const phonePattern = /^[0-9]{4,10}$/; // อนุญาตให้มี 4 ถึง 10 หลัก
        if (!values.phone_number) {
            newErrors.phone_number = 'กรุณากรอกเบอร์โทรศัพท์';
        } else if (!phonePattern.test(values.phone_number)) {
            newErrors.phone_number = 'เบอร์โทรศัพท์ต้องมีระหว่าง 4 ถึง 10 หลัก';
        }

        // ตรวจสอบสังกัด
        if (!values.affiliation) newErrors.affiliation = 'กรุณากรอกสังกัด';

        // ตรวจสอบประเภทผู้ใช้
        if (!values.role) newErrors.role = 'กรุณาเลือกประเภทผู้ใช้';

        return newErrors;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true); // ตั้งค่าสถานะว่าฟอร์มถูกส่ง

        // ตรวจสอบข้อมูลที่กรอกก่อนส่ง
        const validationErrors = validateForm(formValues);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // การใช้ return ในกรณีนี้จะหยุดการดำเนินการถ้ามีข้อผิดพลาดในการตรวจสอบ
        }
        // ตรวจสอบชื่อผู้ใช้ว่ามีอยู่ในระบบหรือไม่
        try {
            const usernameCheckResponse = await axios.get(`http://localhost:3000/check-username?username=${formValues.username}`);
            if (usernameCheckResponse.data.exists) {
                setErrors({ username: 'ชื่อผู้ใช้นี้มีอยู่แล้ว กรุณาเลือกชื่อผู้ใช้อื่น' });
                return; // หยุดการดำเนินการหากชื่อผู้ใช้มีอยู่แล้ว
            }
        } catch (error) {
            console.error("Error checking username:", error);
            // แสดง SweetAlert เมื่อเกิดข้อผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถตรวจสอบชื่อผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง.',
            });
            return; // หยุดการดำเนินการหากเกิดข้อผิดพลาด
        }


        try {
            const response = await axios.post('http://localhost:3000/users', formValues); // เปลี่ยน URL เป็นที่อยู่ API ของคุณ

            console.log('Registration successful:', response.data);

            // แสดง SweetAlert เมื่อการลงทะเบียนสำเร็จ
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'ลงทะเบียนสำเร็จ!',
            }).then(() => {
                // หลังจากปิด SweetAlert ให้เปลี่ยนเส้นทางไปที่หน้า Login
                navigate('/loginpage'); // เปลี่ยนเส้นทางไปที่หน้า Login Page
            });

            // ตั้งข้อความสำเร็จและเปิด Dialog
            setSuccessMessage('ลงทะเบียนสำเร็จ');
            setDialogOpen(true);
            resetForm();
        } catch (error) {
            console.error("Error during registration", error);

            // แสดง SweetAlert เมื่อมีข้อผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'การลงทะเบียนไม่สำเร็จ! กรุณาลองใหม่อีกครั้ง.',
            });
        }
    };


    // ฟังก์ชันสำหรับรีเซ็ตฟอร์ม
    const resetForm = () => {
        setFormValues({
            prefix: '',
            user_fname: '',
            user_lname: '',
            username: '',
            password: '',
            phone_number: '',
            affiliation: '',
            role: ''
        });
    };

    const handleCancel = () => {
        navigate('/loginpage');
    };
    return (
        <div>
            {window.location.pathname === '/registerfrom' && (

                <>
                    <AppBar />
                    <Navbar />
                </>
            )}
            <React.Fragment>
                <CssBaseline />
                <Container
                    maxWidth={false} // ปิดการกำหนด maxWidth
                    sx={{
                        width: '100%', // ทำให้ Container กว้างเต็มหน้าจอ
                        bgcolor: 'white',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2,
                        mt: 10
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '600px',
                            p: 2,
                            borderRadius: 2, // เพิ่มมุมโค้งมน
                            border: '2px solid #1976d2', // เส้นขอบ
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* โลโก้ */}
                        <Logo src="/asset/logosc.png" alt="Logo" />
                        <Typography
                            variant="h5"
                            component="div"
                            gutterBottom
                            sx={{
                                color: '#1976d2', // สีของข้อความ
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // เงาของข้อความ
                                fontWeight: 'bold', // ทำให้ข้อความหนาขึ้น
                                textAlign: 'center', // จัดตำแหน่งข้อความกลาง
                                mb: 4 // เพิ่มระยะห่างด้านล่าง
                            }}
                        >
                            Register
                        </Typography>
                        <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <FormControl variant="outlined"
                                    margin="normal"
                                    error={Boolean(errors.prefix)}

                                    InputProps={{
                                        style: { borderColor: success.user_fname ? 'green' : '', borderWidth: '2px' },
                                    }}
                                    sx={{
                                        flexBasis: '50%',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: success.user_fname ? 'green' : (errors.user_fname ? 'red' : ''),
                                            },
                                        },
                                    }} >

                                    <InputLabel>คำนำหน้า</InputLabel>
                                    <Select
                                        name="prefix"
                                        value={formValues.prefix}
                                        onChange={handleChange}
                                        label="Prefix"
                                    >
                                        <MenuItem value="นาย">นาย</MenuItem>
                                        <MenuItem value="นาง">นาง</MenuItem>
                                        <MenuItem value="นางสาว">นางสาว</MenuItem>
                                        <MenuItem value="ผศ.ดร">ผศ.ดร</MenuItem>
                                        <MenuItem value="อาจารย์">อาจารย์</MenuItem>
                                        <MenuItem value="ศาสตราจารย์.ดร">ศาสตราจารย์.ดร</MenuItem>
                                        <MenuItem value="ดร.">ดร.</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.prefix}</FormHelperText>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="ชื่อ"
                                    name="user_fname"
                                    variant="outlined"
                                    margin="normal"
                                    value={formValues.user_fname}
                                    onChange={handleChange}
                                    error={Boolean(errors.user_fname)}
                                    helperText={errors.user_fname}
                                    InputProps={{
                                        style: { borderColor: success.user_fname ? 'green' : '', borderWidth: '2px' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: success.user_fname ? 'green' : (errors.user_fname ? 'red' : ''),
                                            },
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="นามสกุล"
                                    name="user_lname"
                                    variant="outlined"
                                    margin="normal"
                                    value={formValues.user_lname}
                                    onChange={handleChange}
                                    error={Boolean(errors.user_lname)}
                                    helperText={errors.user_lname}
                                    InputProps={{
                                        style: { borderColor: success.user_lname ? 'green' : '', borderWidth: '2px' },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: success.user_lname ? 'green' : (errors.user_lname ? 'red' : ''),
                                            },
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: -3 }}>

                            </Box>
                            <TextField
                                fullWidth
                                label="Email"
                                name="username"
                                variant="outlined"
                                margin="normal"
                                value={formValues.username}
                                onChange={handleChange}
                                error={Boolean(errors.username)}
                                helperText={errors.username || '*กรุณากรอกอีเมล'}
                                InputProps={{
                                    style: { borderColor: success.username ? 'green' : '', borderWidth: '2px' },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: success.user_lname ? 'green' : (errors.user_lname ? 'red' : ''),
                                        },
                                    },
                                }}

                            />
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                value={formValues.password}
                                onChange={handleChange}
                                error={Boolean(errors.password)}
                                helperText={errors.password || '*รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: success.password ? 'green' : (errors.password ? 'red' : ''),
                                        },
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="โทรศัพท์"
                                name="phone_number"
                                variant="outlined"
                                margin="normal"
                                value={formValues.phone_number}
                                onChange={handleChange}
                                error={Boolean(errors.phone_number)}
                                helperText={errors.phone_number}
                                InputProps={{
                                    style: { borderColor: success.phone_number ? 'green' : '', borderWidth: '2px' },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: success.user_lname ? 'green' : (errors.user_lname ? 'red' : ''),
                                        },
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="สังกัด"
                                name="affiliation"
                                variant="outlined"
                                margin="normal"
                                value={formValues.affiliation}
                                onChange={handleChange}
                                error={Boolean(errors.affiliation)}
                                helperText={errors.affiliation}
                                InputProps={{
                                    style: { borderColor: success.affiliation ? 'green' : '', borderWidth: '2px' },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: success.user_lname ? 'green' : (errors.user_lname ? 'red' : ''),
                                        },
                                    },
                                }}
                            />
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel>ประเภทผู้ใช้</InputLabel>
                                <Select
                                    name="role"
                                    value={formValues.role} // ตั้งค่าเริ่มต้นเป็น 'user'
                                    onChange={handleChange}
                                    label="User Type"
                                    disabled // ทำให้ช่องนี้ไม่สามารถแก้ไขได้
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="admin" disabled>Admin</MenuItem> {/* ทำให้ตัวเลือก Admin ไม่สามารถเลือกได้ */}
                                </Select>
                                <FormHelperText>{errors.role}</FormHelperText>
                            </FormControl>

                            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
                                <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
                                    Register
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </React.Fragment>
        </div>
    )
}

export default RegisterFrom

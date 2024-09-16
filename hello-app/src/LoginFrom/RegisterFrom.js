import React, { useState } from 'react';
import axios from 'axios'; // นำเข้า axios
import { CssBaseline, Container, Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logo = styled('img')(({ theme }) => ({
    height: '60px', // ปรับขนาดโลโก้ตามต้องการ
    marginBottom: theme.spacing(2), // เพิ่มระยะห่างระหว่างโลโก้กับข้อความ
}));

function RegisterFrom() {
    const [formValues, setFormValues] = useState({
        prefix: '',
        user_fname: '',
        user_lname: '',
        username: '',
        password: '',
        phone_number: '',
        affiliation: '',
        role: '' // ตรวจสอบว่า field นี้ส่งข้อมูลไปด้วย
    });
    const [showPassword, setShowPassword] = useState(false);
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



    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const validateForm = (values) => {
        const newErrors = {};
        if (!values.prefix) newErrors.prefix = 'Prefix is required';
        if (!values.user_fname) newErrors.user_fname = 'First Name is required';
        if (!values.user_lname) newErrors.user_lname = 'Last Name is required';
        if (!values.password) newErrors.password = 'Password is required';
        if (!values.username) newErrors.username = 'Username is required';
        if (!values.phone_number) newErrors.phone_number = 'Phone Number is required';
        if (!values.affiliation) newErrors.affiliation = 'Affiliation is required';
        if (!values.role) newErrors.role = 'Role is required';
        return newErrors;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        // ตรวจสอบข้อมูลที่กรอกก่อนส่ง
        const validationErrors = validateForm(formValues);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // การใช้ return ในกรณีนี้จะหยุดการดำเนินการถ้ามีข้อผิดพลาดในการตรวจสอบ
        }

        try {
            const response = await axios.post('http://localhost:3000/users', formValues); // เปลี่ยน URL เป็นที่อยู่ API ของคุณ
            toast.success('ลงทะเบียนสำเร็จ!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.log('Registration successful:', response.data);
            // อาจทำการเปลี่ยนเส้นทางหรือแจ้งเตือนหลังจากลงทะเบียนสำเร็จ
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

        } catch (error) {
            console.error("Error during registration", error);
            toast.error('เกิดข้อผิดพลาดในการลงทะเบียน', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

    };
    return (
        <div>
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
                                    sx={{ flexBasis: '50%' }} >

                                    <InputLabel>Prefix</InputLabel>
                                    <Select
                                        name="prefix"
                                        value={formValues.prefix}
                                        onChange={handleChange}
                                        label="Prefix"
                                    >
                                        <MenuItem value="Mr">Mr</MenuItem>
                                        <MenuItem value="Ms">Ms</MenuItem>
                                        <MenuItem value="Mrs">Mrs</MenuItem>
                                        <MenuItem value="Dr">Dr</MenuItem>
                                        <MenuItem value="Prof">Prof</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors.prefix}</FormHelperText>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="user_fname"
                                    variant="outlined"
                                    margin="normal"
                                    value={formValues.user_fname}
                                    onChange={handleChange}
                                    error={Boolean(errors.user_fname)}
                                    helperText={errors.user_fname}
                                />
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="user_lname"
                                    variant="outlined"
                                    margin="normal"
                                    value={formValues.user_lname}
                                    onChange={handleChange}
                                    error={Boolean(errors.user_lname)}
                                    helperText={errors.user_lname}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: -3 }}>

                            </Box>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                variant="outlined"
                                margin="normal"
                                value={formValues.username}
                                onChange={handleChange}
                                error={Boolean(errors.username)}
                                helperText={errors.username}
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
                                helperText={errors.password}
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
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone_number"
                                variant="outlined"
                                margin="normal"
                                value={formValues.phone_number}
                                onChange={handleChange}
                                error={Boolean(errors.phone_number)}
                                helperText={errors.phone_number}
                            />
                            <TextField
                                fullWidth
                                label="Department"
                                name="affiliation"
                                variant="outlined"
                                margin="normal"
                                value={formValues.affiliation}
                                onChange={handleChange}
                                error={Boolean(errors.affiliation)}
                                helperText={errors.affiliation}
                            />
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel>กรุณาเลือก</InputLabel>
                                <Select
                                    name="role"
                                    value={formValues.role || ""} // ตั้งค่าเริ่มต้นเป็นค่าว่างหากไม่มีค่า
                                    onChange={handleChange}
                                    label="User Type"
                                >


                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                                <FormHelperText>{errors.role}</FormHelperText>
                            </FormControl>

                            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>
                                <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
                                    Register
                                </Button>
                                <Button variant="outlined" color="secondary">
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

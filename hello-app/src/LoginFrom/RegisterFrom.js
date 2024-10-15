import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { CssBaseline, Container, Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import Navbar from '../AppBar/Navbar';
import AppBar from '../AppBar/Appbar';
import Swal from 'sweetalert2';

const Logo = styled('img')(({ theme }) => ({
    height: '60px', 
    marginBottom: theme.spacing(2), 
}));

function RegisterFrom() {
    const [dialogOpen, setDialogOpen] = useState(false); 
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); 
    const [showPassword, setShowPassword] = useState(false);
    const [touchedFields, setTouchedFields] = useState({}); 
    const [formSubmitted, setFormSubmitted] = useState(false); 
    const [formValues, setFormValues] = useState({
        prefix: '',
        user_fname: '',
        user_lname: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone_number: '',
        affiliation: '',
        role: 'user' 
    });

    const [errors, setErrors] = useState({
        prefix: '',
        user_fname: '',
        user_lname: '',
        username: '',
        password: '',
        confirmPassword: '',
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
        confirmPassword: false,
        phone_number: false,
        affiliation: false,
        role: false
    });


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });

        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));


        if (formSubmitted) {
            const validationErrors = validateForm({ ...formValues, [name]: value });
            setErrors(validationErrors);


            setSuccess(prev => ({
                ...prev,
                [name]: !validationErrors[name]
            }));
        }
    };


    useEffect(() => {
        if (formValues.confirmPassword && formValues.password !== formValues.confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: 'รหัสผ่านไม่ตรงกัน',
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: null,
            }));
        }

    }, [formValues.password, formValues.confirmPassword]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }


        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));


        if (formSubmitted) {
            const validationErrors = validateForm({ ...formValues, [name]: value });
            setErrors(validationErrors);


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

        if (!values.prefix) newErrors.prefix = 'กรุณาเลือกคำนำหน้า';

        if (!values.user_fname) newErrors.user_fname = 'กรุณากรอกชื่อ';


        if (!values.user_lname) newErrors.user_lname = 'กรุณากรอกนามสกุล';


        if (!values.username) {
            newErrors.username = 'กรุณากรอกชื่อผู้ใช้งาน';
        } else if (!values.username.endsWith('@tsu.ac.th')) {
            newErrors.username = 'กรุณากรอกอีเมลที่ลงท้ายด้วย @tsu.ac.th';
        }


        if (!values.password) {
            newErrors.password = 'กรุณากรอกข้อมูลรหัสผ่าน';
        } else if (values.password.length < 8) {
            newErrors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
        }

        if (!values.confirmPassword) newErrors.confirmPassword = 'กรุณากรอกนามสกุล';


        const phonePattern = /^[0-9]{4,10}$/;
        if (!values.phone_number) {
            newErrors.phone_number = 'กรุณากรอกเบอร์โทรศัพท์';
        } else if (!phonePattern.test(values.phone_number)) {
            newErrors.phone_number = 'เบอร์โทรศัพท์ต้องมีระหว่าง 4 ถึง 10 หลัก';
        }


        if (!values.affiliation) newErrors.affiliation = 'กรุณากรอกสังกัด';


        if (!values.role) newErrors.role = 'กรุณาเลือกประเภทผู้ใช้';

        return newErrors;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormSubmitted(true);


        const validationErrors = validateForm(formValues);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (formValues.password !== formValues.confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: 'รหัสผ่านไม่ตรงกัน',
            }));
            return;
        }


        setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: null,
        }));

        try {
            const usernameCheckResponse = await axios.get(`http://localhost:3000/check-username?username=${formValues.username}`);
            if (usernameCheckResponse.data.exists) {
                setErrors({ username: 'ชื่อผู้ใช้นี้มีอยู่แล้ว กรุณาเลือกชื่อผู้ใช้อื่น' });
                return;
            }
        } catch (error) {
            console.error("Error checking username:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถตรวจสอบชื่อผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง',
            });
            return;
        }


        try {
            const response = await axios.post('http://localhost:3000/users', formValues);

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'ลงทะเบียนสำเร็จ!',
            }).then(() => {
                navigate('/loginpage');
            });

            setSuccessMessage('ลงทะเบียนสำเร็จ');
            setDialogOpen(true);
            resetForm();
        } catch (error) {
            console.error("Error during registration", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
            });
        }
    };



    const resetForm = () => {
        setFormValues({
            prefix: '',
            user_fname: '',
            user_lname: '',
            username: '',
            password: '',
            confirmPassword: '',
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
                            borderRadius: 2,
                            border: '2px solid #1976d2',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >

                        <Logo src="/asset/logosc.png" alt="Logo" />
                        <Typography
                            variant="h5"
                            component="div"
                            gutterBottom
                            sx={{
                                color: '#1976d2',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 4
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
                                        <MenuItem value="อาจารย์">อาจารย์</MenuItem>
                                        <MenuItem value="ดร.">ดร.</MenuItem>
                                        <MenuItem value="ผศ.ดร">ผศ.ดร</MenuItem>
                                        <MenuItem value="ศาสตราจารย์.ดร">ศาสตราจารย์.ดร</MenuItem>

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
                                    endAdornment: <InputAdornment position="end">@tsu.ac.th</InputAdornment>,
                                    style: { borderColor: success.username ? 'green' : '', borderWidth: '2px' },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: success.username ? 'green' : (errors.username ? 'red' : ''),
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
                                onChange={handleInputChange}
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
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                value={formValues.confirmPassword}
                                onChange={handleInputChange}
                                error={Boolean(errors.confirmPassword)}
                                helperText={errors.confirmPassword || '*กรุณายืนยันรหัสผ่าน'}
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
                                            borderColor: success.confirmPassword ? 'green' : (errors.confirmPassword ? 'red' : ''),
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
                            {/* <TextField
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
                            /> */}
                            <FormControl
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                error={Boolean(errors.affiliation)}
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
                            >
                                <InputLabel>สังกัด</InputLabel>
                                <Select
                                    name="affiliation"
                                    value={formValues.affiliation}
                                    onChange={handleChange}
                                    label="สังกัด"
                                    fullWidth
                                >
                                    <MenuItem value="สาขาวิชาวิทยาศาสตร์กายภาพ">สาขาวิชาวิทยาศาสตร์กายภาพ</MenuItem>
                                    <MenuItem value="สาขาวิชาวิทยาศาสตร์ชีวภาพ">สาขาวิชาวิทยาศาสตร์ชีวภาพ</MenuItem>
                                    <MenuItem value="หลักสูตร วท.บ. คณิตศาสตร์และการจัดการข้อมูล">หลักสูตร วท.บ. คณิตศาสตร์และการจัดการข้อมูล</MenuItem>
                                    <MenuItem value="หลักสูตร วท.บ. วิทยาการคอมพิวเตอร์และสารสนเทศ">หลัก วท.บ. วิทยาการคอมพิวเตอร์และสารสนเทศ</MenuItem>
                                    <MenuItem value="หลักสูตร วท.บ. วิทยาศาสตร์สิ่งแวดล้อม">หลักสูตร วท.บ. วิทยาศาสตร์สิ่งแวดล้อม</MenuItem>
                                    <MenuItem value="สำนักงานคณะวิทยาศาสตร์และนวัตกรรมดิจิทัล">สำนักงานคณะวิทยาศาสตร์และนวัตกรรมดิจิทัล</MenuItem>
                                </Select>
                                <FormHelperText>{errors.affiliation}</FormHelperText>
                            </FormControl>


                            {/* <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel>ประเภทผู้ใช้</InputLabel>
                                <Select
                                    name="role"
                                    value={formValues.role} // ตั้งค่าเริ่มต้นเป็น 'user'
                                    onChange={handleChange}
                                    label="User Type"
                                    disabled // ทำให้ช่องนี้ไม่สามารถแก้ไขได้
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="admin" disabled>Admin</MenuItem>
                                </Select>
                                <FormHelperText>{errors.role}</FormHelperText>
                            </FormControl> */}

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

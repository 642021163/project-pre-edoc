import React, { useState } from 'react';
import { Container, TextField, Button, MenuItem, Box, Typography, Paper, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Grid, Snackbar, CssBaseline, InputBase, Badge,Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';
import Notifications from '@mui/icons-material/Notifications';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ListItemIcon from '@mui/material/ListItemIcon';
import Home from '@mui/icons-material/Home';
import PersonAdd from '@mui/icons-material/PersonAdd';

// ความกว้างของ Drawer
const drawerWidth = 240;

// ส่วนของ Alert สำหรับ Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

    // สถานะของ Drawer
    const [drawerOpen, setDrawerOpen] = useState(false);

    // สถานะของ Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // ใช้สำหรับการนำทาง
    const navigate = useNavigate();

    // ฟังก์ชันเพื่อเปิดหรือปิด Drawer
    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };



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
            const response = await axios.post('http://localhost:3000/users', formData);
            console.log('เพิ่มผู้ใช้สำเร็จ:', response.data);
            setOpenSnackbar(true); // เปิด Snackbar เมื่อเพิ่มผู้ใช้สำเร็จ
            setTimeout(() => {
                navigate('/list'); // เปลี่ยนเส้นทางไปยังหน้ารายชื่อผู้ใช้หลังจาก 2 วินาที
            }, 2000);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:', error);
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

    // ฟังก์ชันจัดการกลับไปที่หน้า Home
    const handleBackToHome = () => {
        navigate('/list');
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* AppBar */}
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1976d2' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff' }}>
                        Admin Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Search Box */}
                        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2 }}>
                            <IconButton sx={{ p: '10px' }}>
                                <Search />
                            </IconButton>
                            <InputBase
                                placeholder="Search…"
                                sx={{ ml: 1, flex: 1 }}
                            />
                        </Box>
                        {/* Notifications Icon */}
                        <IconButton sx={{ color: '#fff' }}>
                            <Badge badgeContent={4} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#1A2035',  // สีพื้นหลังของ Drawer (สีเข้ม)
                        color: '#B9BABF',    // สีของตัวหนังสือ (สีขาว/เทาอ่อน)
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <Tooltip title="Home" arrow>
                            <ListItem button onClick={handleBackToHome}>
                                <ListItemIcon sx={{ color: '#ddd' }}> {/* ไอคอนสีเทาอ่อน */}
                                    <Home />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                        </Tooltip>
                        <Tooltip title="ผู้ใช้ที่ลงทะเบียน" arrow>
                            <ListItem button onClick={() => navigate('/list')}>
                                <ListItemIcon sx={{ color: '#ddd' }}> {/* ไอคอนสีเทาอ่อน */}
                                    <PersonAdd />
                                </ListItemIcon>
                                <ListItemText primary="ผู้ใช้ที่ลงทะเบียน" />
                            </ListItem>
                        </Tooltip>
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container component={Paper} elevation={3} maxWidth="sm" sx={{ padding: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
                        เพิ่มผู้ใช้ใหม่
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
                                    <MenuItem value="Mr.">Mr.</MenuItem>
                                    <MenuItem value="Ms.">Ms.</MenuItem>
                                    <MenuItem value="Mrs.">Mrs.</MenuItem>
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
                                label="ชื่อผู้ใช้"
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
                                label="รหัสผ่าน"
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
                        <Box sx={{ textAlign: 'center' }}>
                            <Button type="submit" variant="contained" color="primary">
                                ADD USER
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    เพิ่มผู้ใช้สำเร็จ!
                </Alert>
            </Snackbar>


        </Box>
    );
}

export default AddUser;
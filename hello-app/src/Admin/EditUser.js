import React, { useEffect, useState } from 'react';
import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Badge, InputBase, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Paper, Button, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip
} from '@mui/material';
import { Search, Notifications, Home, PersonAdd } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const drawerWidth = 240; // หรือค่าที่คุณต้องการ

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user_fname: '',
    user_lname: '',
    username: '',
    phone_number: '',
    affiliation: '',
    role: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // สถานะเปิด/ปิด Dialog
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);


  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' }
  ];

  // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://test-db-app-mysql-4cc2e0748b1a.herokuapp.com/user/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error.response?.data || error.message);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, value); // ดีบัก: ตรวจสอบการเปลี่ยนแปลงของฟิลด์
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // จัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://test-db-app-mysql-4cc2e0748b1a.herokuapp.com/users/${id}`, user);
      console.log('อัปเดตผู้ใช้สำเร็จ:', response.data);

      // ใช้ SweetAlert แสดงแจ้งเตือนความสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        timer: 2000, // กำหนดเวลาแสดง SweetAlert 2 วินาที
        showConfirmButton: false // ไม่ต้องแสดงปุ่ม Confirm
      }).then(() => {
        // คุณสามารถเพิ่มการนำทางไปยังหน้าที่คุณต้องการหลังจากแสดง SweetAlert เสร็จ
        navigate('/list'); // เปลี่ยนเส้นทางไปยังหน้ารายชื่อผู้ใช้
      });

    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้:', error.response?.data || error.message);

      // แสดง SweetAlert ข้อผิดพลาด
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้',
      });
    }
  };


  // ฟังก์ชันสำหรับรีเซ็ตรหัสผ่าน
  const handleResetPassword = async () => {
    if (resetPassword !== confirmPassword) {
      // แสดงข้อความแจ้งเตือนว่ารหัสผ่านไม่ตรงกัน
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'รหัสผ่านไม่ตรงกัน',
      });
      return;
    }

    try {
      // ส่งคำขอไปที่ API
      const response = await axios.put(`https://test-db-app-mysql-4cc2e0748b1a.herokuapp.com/api/reset-password`, {
        userId: id, // ใช้ `id` ที่มาจาก useParams
        newPassword: resetPassword
      });

      // แสดงข้อความเมื่อการรีเซ็ตรหัสผ่านสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'อัปเดตรหัสผ่านเรียบร้อยแล้ว',
      });

      // รีเซ็ตค่าของฟิลด์รหัสผ่าน
      setResetPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error resetting password:', error);
      // แสดงข้อความเมื่อการอัปเดตไม่สำเร็จ
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ไม่สามารถอัปเดตรหัสผ่านได้',
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/home'); // นำทางไปที่หน้าโฮม
  };
  const handleCancel = () => {
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
            <Tooltip title="Registered Users" arrow>
              <ListItem button onClick={() => navigate('/list')}>
                <ListItemIcon sx={{ color: '#ddd' }}> {/* ไอคอนสีเทาอ่อน */}
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary="Registered Users" />
              </ListItem>
            </Tooltip>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Edit Document</Typography>
        <Paper
          sx={{
            padding: 3,
            backgroundColor: '#f5f5f5' // สีพื้นหลังของ Paper
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ p: 2 }}>แก้ไขข้อมูลผู้ใช้</Typography>
            <Box mb={2}>
              <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="ชื่อ"
                    name="user_fname"
                    value={user.user_fname}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="นามสกุล"
                    name="user_lname"
                    value={user.user_lname}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="หมายเลขโทรศัพท์"
                    name="phone_number"
                    value={user.phone_number}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="สังกัด"
                    name="affiliation"
                    value={user.affiliation}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      name="role"
                      value={user.role}
                      onChange={handleChange}
                      required
                    >
                      {roleOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>


              </Grid>
            </Box>
            <DialogActions style={{ justifyContent: 'center' }}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={{ marginRight: '8px' }} // เพิ่มระยะห่าง
              >
                บันทึก
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
        </Paper>
        {/* Form for Resetting Password */}
        <Paper sx={{ padding: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>รีเซ็ตรหัสผ่านใหม่</Typography>
          <TextField
            margin="dense"
            label="รหัสผ่านใหม่"
            type="password"
            fullWidth
            variant="outlined"
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="ยืนยันรหัสผ่านอีกครั้ง"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResetPassword}
              sx={{ mr: 2 }}
            >
              รีเซ็ต
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={handleCancel}
            >
              ยกเลิก
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default EditUser;

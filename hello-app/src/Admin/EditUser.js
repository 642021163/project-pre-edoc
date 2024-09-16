import React, { useEffect, useState } from 'react';
import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Badge, InputBase, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Paper, Button, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,Tooltip 
} from '@mui/material';
import { Search, Notifications, Home, PersonAdd } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // ไอคอนสำเร็จ

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
  const [successMessage, setSuccessMessage] = useState(''); // สถานะข้อความสำเร็จ

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' }
  ];

  // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${id}`);
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
      await axios.put(`http://localhost:3000/users/${id}`, user);
      setSuccessMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
      setDialogOpen(true);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้:', error.response?.data || error.message);
      setError('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้');
    }
  };

  // ปิด Dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate('/list'); // นำทางไปยังหน้า user-list หลังจากปิด Dialog
  };

  const handleBackToHome = () => {
    navigate('/home'); // นำทางไปที่หน้าโฮม
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
            <Box mb={2}>
              <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    name="user_fname"
                    value={user.user_fname}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last Name"
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
                    label="Phone Number"
                    name="phone_number"
                    value={user.phone_number}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Affiliation"
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

                {/* Row 6 */}
                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    name="notes"
                    value={user.notes || ''}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                  />
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
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/user-list')}
              >
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Paper>

        {/* Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="success-dialog-title"
          aria-describedby="success-dialog-description"
        >
          <DialogTitle id="success-dialog-title">Success</DialogTitle>
          <DialogContent>
            <Typography variant="h6" component="div" align="center">
              <CheckCircleIcon color="success" /> {successMessage}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default EditUser;
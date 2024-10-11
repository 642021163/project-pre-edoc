import React, { useEffect, useState } from 'react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, CircularProgress,IconButton, Collapse, Button, Toolbar, AppBar, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider, InputBase, Badge, Tooltip, Tabs, Tab, Menu, MenuItem, Avatar } from '@mui/material';
import {  Delete} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../LayoutAdmin/Layout';
import EditIcon from '@mui/icons-material/Edit';


function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0); // State สำหรับแท็บ
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (userId) => {
    if (userId) {
      setLoading(true);
      setTimeout(() => {
        navigate(`/editu/${userId}`);
        setLoading(false);
      }, 400); // หน่วงเวลา 400ms
    } else {
      console.error('User ID is undefined or invalid');
    }
  };

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  const handleAddUser = () => {
    setLoading(true); // เริ่มการโหลด
    setTimeout(() => {
      navigate('/newuser'); // เปลี่ยนหน้าไปยัง path ที่ระบุ
      setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
    }, 400); // หน่วงเวลา 400ms
  };


  const filteredUsers = users.filter(user =>
    user.user_fname.toLowerCase().includes(search.toLowerCase()) ||
    user.user_lname.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const usersOnly = filteredUsers.filter(user => user.role.toLowerCase() === 'user');
  const admins = filteredUsers.filter(user => user.role.toLowerCase() === 'admin');

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
            <CircularProgress />
          </Box>
        )}
        {/* เนื้อหาหลัก */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: '#eaeff1', p: 3 }}>
          <Toolbar /> {/* ระยะห่างด้านบน */}
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                รายชื่อผู้ใช้
              </Typography>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleAddUser}
                sx={{ height: 'fit-content' }}
              >
                + Add User
              </Button> */}
            </Box>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
              <Tab label="User" />
              <Tab label="Admin" />
            </Tabs>

            {/* การแสดงข้อมูลตามแท็บที่เลือก */}
            {activeTab === 0 && (
              <>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Users
                </Typography>
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#1976d2' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>ลำดับ</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ชื่อ-สกุล</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ชื่อผู้ใช้</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>บทบาท</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {usersOnly.map((user, index) => (
                        <TableRow
                          key={user.user_id}
                          sx={{
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                            '&:hover': { backgroundColor: '#f1f1f1' },
                          }}
                        >
                          <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                          <TableCell sx={{ padding: '12px 16px' }}>{user.user_fname} {user.user_lname}</TableCell>
                          <TableCell sx={{ padding: '12px 16px' }}>{user.username}</TableCell>
                          <TableCell sx={{ padding: '12px 16px' }}>{user.role}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Tooltip title="แก้ไขข้อมูลเอกสาร" arrow>
                                <Button variant="contained"
                                  sx={{
                                    mx: 1,
                                    backgroundColor: 'success', // สีหลักของปุ่ม
                                    color: '#fff',
                                    '&:hover': {
                                      backgroundColor: '#fbc02d', // สีเมื่อชี้เมาส์
                                    },
                                    display: 'flex',
                                    alignItems: 'center', // จัดแนวให้อยู่กลาง
                                  }}
                                  onClick={() => handleEditClick(user.user_id)}>
                                  <EditIcon />
                                  Edit
                                </Button>
                              </Tooltip>
{/* 
                              <IconButton onClick={() => handleDelete(user.user_id)} color="secondary">
                                <Delete />
                              </IconButton> */}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            {activeTab === 1 && (
              <>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Admins
                </Typography>
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#1976d2' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>ลำดับ</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ชื่อ-สกุล</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ชื่อผู้ใช้</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>บทบาท</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {admins.map((user, index) => (
                        <TableRow
                          key={user.user_id}
                          sx={{
                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                            '&:hover': { backgroundColor: '#f1f1f1' },
                          }}
                        >
                          <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                          <TableCell sx={{ padding: '12px 16px' }}>{user.user_fname} {user.user_lname}</TableCell>
                          <TableCell sx={{ padding: '12px 16px' }}>{user.username}</TableCell>
                          <TableCell sx={{ padding: '12px 16px' }}>{user.role}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <Tooltip title="แก้ไขข้อมูลเอกสาร" arrow>
                                {/* <Button variant="contained"
                                  sx={{
                                    mx: 1,
                                    backgroundColor: 'success', // สีหลักของปุ่ม
                                    color: '#fff',
                                    '&:hover': {
                                      backgroundColor: '#fbc02d', // สีเมื่อชี้เมาส์
                                    },
                                    display: 'flex',
                                    alignItems: 'center', // จัดแนวให้อยู่กลาง
                                  }}
                                  onClick={() => handleEditClick(user.user_id)}>
                                  <EditIcon />
                                  Edit
                                </Button> */}
                              </Tooltip>

                              {/* <IconButton onClick={() => handleDelete(user.user_id)} color="secondary">
                                <Delete />
                              </IconButton> */}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}

export default UserList;

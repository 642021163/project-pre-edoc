import React, { useEffect, useState } from 'react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, IconButton, Collapse, Button, Toolbar, AppBar, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider, InputBase, Badge, Tooltip, Tabs, Tab, Menu, MenuItem, Avatar } from '@mui/material';
import { Edit, Delete, Home as HomeIcon, PersonAdd, Dashboard, Search, Notifications, InsertDriveFile, BarChart, ExitToApp,AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// กำหนดความกว้างของเมนูด้านข้าง
const drawerWidth = 240;

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0); // State สำหรับแท็บ
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [username, setUsername] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

 

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
      navigate(`/editu/${userId}`);
    } else {
      console.error('User ID is undefined or invalid');
    }
  };

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  const handleClick = () => {
    setOpenUserMenu(!openUserMenu);
  };

  const handleBackToHome = () => {
    // ตรวจสอบสถานะการล็อกอิน
    const isLoggedIn = Boolean(localStorage.getItem('userToken')); // เปลี่ยนเป็นวิธีที่คุณใช้ตรวจสอบสถานะการล็อกอิน

    if (!isLoggedIn) {
      navigate('/home'); // เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ ถ้าผู้ใช้ไม่ได้ล็อกอิน
    } else {
      // ผู้ใช้ล็อกอินอยู่แล้ว ไม่ต้องเปลี่ยนเส้นทาง
      // คุณสามารถแสดงข้อความแจ้งเตือนได้ที่นี่ ถ้าต้องการ
      console.log('ผู้ใช้ล็อกอินอยู่แล้ว');
    }
  };

  const handleAddUser = () => {
    navigate('/newuser');
  };

  const handleAllDocuments = () => {
    navigate('/doc');
  };

  const handleStatistics = () => {
    navigate('/rec');
  };

 
  const handleLogout = () => {
    const confirmLogout = window.confirm("คุณแน่ใจว่าต้องการออกจากระบบไหม?");
    if (confirmLogout) {
      localStorage.clear();
      navigate('/loginpage');
      handleMenuClose(); // ปิดเมนูหลังจากออกจากระบบ
    }
  };
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const filteredUsers = users.filter(user =>
    user.user_fname.toLowerCase().includes(search.toLowerCase()) ||
    user.user_lname.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const usersOnly = filteredUsers.filter(user => user.role.toLowerCase() === 'user');
  const admins = filteredUsers.filter(user => user.role.toLowerCase() === 'admin');

  return (
    <Box sx={{ display: 'flex' }}>
      {/* เมนูด้านข้าง */}
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* ช่องค้นหา */}
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2 }}>
              <IconButton sx={{ p: '10px' }}>
                <Search />
              </IconButton>
              <InputBase
                placeholder="Search…"
                value={search}
                onChange={handleSearchChange}
                sx={{ ml: 1, flex: 1 }}
              />
            </Box>
            {/* ช่องแสดงชื่อโปรไฟล์ */}
            {/* สัญลักษณ์แจ้งเตือน */}
            <IconButton sx={{ color: 'inherit' }}>
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            {/* โปรไฟล์ */}
            <IconButton onClick={handleProfileMenuOpen}  color="inherit">
            <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>{username}</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1A2035',
            color: '#B9BABF',
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
                <ListItemIcon sx={{ color: '#ddd' }}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Tooltip>

            <Tooltip title="ผู้ใช้ที่ลงทะเบียน" arrow>
              <ListItem button onClick={handleClick}>
                <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon>
                <ListItemText primary="ผู้ใช้ที่ลงทะเบียน" />
              </ListItem>
            </Tooltip>

            <Collapse in={openUserMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={handleAddUser}>
                  <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon>
                  <ListItemText primary="เพิ่มผู้ใช้" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => navigate('/list')}>
                  <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon>
                  <ListItemText primary="รายชื่อผู้ใช้" />
                </ListItem>
              </List>
            </Collapse>

            <Tooltip title="เอกสารทั้งหมด" arrow>
              <ListItem button onClick={handleAllDocuments}>
                <ListItemIcon sx={{ color: '#ddd' }}><InsertDriveFile /></ListItemIcon>
                <ListItemText primary="เอกสารทั้งหมด" />
              </ListItem>
            </Tooltip>

            <Tooltip title="สถิติการรับเอกสาร" arrow>
              <ListItem button onClick={handleStatistics}>
                <ListItemIcon sx={{ color: '#ddd' }}><BarChart /></ListItemIcon>
                <ListItemText primary="สถิติการรับเอกสาร" />
              </ListItem>
            </Tooltip>

            <Divider sx={{ my: 2 }} />

            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: '4px',
                backgroundColor: '#f44336',
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
                '&:active': {
                  backgroundColor: '#b71c1c',
                }
              }}
            >
              <ListItemIcon>
                <ExitToApp sx={{ color: '#fff' }} />
              </ListItemIcon>
              <ListItemText primary="ออกจากระบบ" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* เนื้อหาหลัก */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar /> {/* ระยะห่างด้านบน */}
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              รายชื่อผู้ใช้
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUser}
              sx={{ height: 'fit-content' }}
            >
              Add User
            </Button>
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
                          <IconButton onClick={() => handleEditClick(user.user_id)} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(user.user_id)} color="secondary">
                            <Delete />
                          </IconButton>
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
                          <IconButton onClick={() => handleEditClick(user.user_id)} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(user.user_id)} color="secondary">
                            <Delete />
                          </IconButton>
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
  );
}

export default UserList;

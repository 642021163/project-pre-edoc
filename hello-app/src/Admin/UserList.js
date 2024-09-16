import React, { useEffect, useState } from 'react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, IconButton, Button, Toolbar, AppBar, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider, InputBase, Badge,Tooltip } from '@mui/material';
import { Edit, Delete, Home, PersonAdd, Dashboard, Search, Notifications } from '@mui/icons-material'; // เพิ่มไอคอน
import { useNavigate } from 'react-router-dom';

// กำหนดความกว้างของเมนูด้านข้าง
const drawerWidth = 240;

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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

  const handleEdit = (userId) => {
    navigate(`/edit/+${userId}`);
  };

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
  };

  const handleAddUser = () => {
    navigate('/newuser');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.user_fname.toLowerCase().includes(search.toLowerCase()) ||
    user.user_lname.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );


  const handleEditClick = (userId) => {
    if (userId) {
      navigate(`/editu/${userId}`);
    } else {
      console.error('User ID is undefined or invalid');
    }
  };

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
            <Typography variant="body1" sx={{ mr: 2 }}>
              Username
            </Typography>
            {/* สัญลักษณ์แจ้งเตือน */}
            <IconButton sx={{ color: 'inherit' }}>
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
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
            bgcolor: '#1A2035',  // สีพื้นหลังของ Drawer (สีเข้ม)
            color: '#B9BABF',    // สีของตัวหนังสือ (สีขาว/เทาอ่อน)

          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <Tooltip title="Home" arrow>
            <ListItem button onClick={handleBackToHome}>
              <ListItemIcon sx={{ color: '#ddd' }}><Home /></ListItemIcon>{/* ไอคอนสีเทาอ่อน */}
              <ListItemText primary="Home" />
            </ListItem>
          </Tooltip>
          <Tooltip title="Add User" arrow>
          <ListItem button onClick={handleAddUser}>
            <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon>{/* ไอคอนสีเทาอ่อน */}
            <ListItemText primary="Add User" />
          </ListItem>
          </Tooltip>
        </List>
      </Drawer>

      {/* เนื้อหาหลัก */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
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
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.user_id} // ใช้ user_id แทน userId
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
                      <IconButton onClick={() => handleEditClick(user.user_id)} color="primary"> {/* ใช้ user.user_id */}
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.user_id)} color="secondary"> {/* ใช้ user.user_id */}
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
}

export default UserList;

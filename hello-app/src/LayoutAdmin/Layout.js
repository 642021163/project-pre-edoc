import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, IconButton, Badge, Menu, MenuItem, Collapse, Divider, Tooltip } from '@mui/material';
import { Home as HomeIcon, PersonAdd, InsertDriveFile, BarChart, ExitToApp, Notifications, Search, AccountCircle } from '@mui/icons-material';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);



  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


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

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };


  const handleClick = () => {
    setOpenUserMenu(!openUserMenu);
  };

  const handleBackToHome = () => {
    navigate('/home');
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

  return (
    <>
      <CssBaseline />
      {/* AppBar */}
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
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
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

      {/* Drawer */}
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

      {/* Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: 8 }}>
        {children}
      </Box>
    </>
  );
};

export default Layout;

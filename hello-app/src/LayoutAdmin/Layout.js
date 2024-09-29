import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, IconButton, Badge, Menu, MenuItem, Collapse, Divider, Tooltip } from '@mui/material';
import { Home as HomeIcon, PersonAdd, Article, InsertDriveFile, ArrowDropDown, ArrowDropUp, AddComment, Description, SupervisorAccount, BarChart, ExitToApp, Notifications, Search, AccountCircle } from '@mui/icons-material';
import InputBase from '@mui/material/InputBase';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import { CircularProgress, Backdrop } from '@mui/material';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openDocumentMenu, setOpenDocumentMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [user_fname, setUser_fname] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]); // State สำหรับเก็บข้อมูลการแจ้งเตือน
  const [newDocumentsCount, setNewDocumentsCount] = useState(0);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null); // State สำหรับ Menu ของการแจ้งเตือน
  const location = useLocation()
  const [loading, setLoading] = useState(false);

  function timeAgo(uploadDate) {
    const date = new Date(uploadDate);
    if (isNaN(date)) {
      console.error("Invalid Date:", uploadDate);
      return "วันที่ไม่ถูกต้อง";
    }

    const now = new Date();
    const secondsDiff = Math.floor((now - date) / 1000);

    if (secondsDiff < 60) return `${secondsDiff} วินาทีที่แล้ว`;
    if (secondsDiff < 3600) return `${Math.floor(secondsDiff / 60)} นาทีที่แล้ว`;
    if (secondsDiff < 86400) return `${Math.floor(secondsDiff / 3600)} ชั่วโมงที่แล้ว`;
    return `${Math.floor(secondsDiff / 86400)} วันที่แล้ว`;
  }
  const fetchNewDocumentsCount = async () => {
    try {
      const response = await axios.get('https://test-db-app-mysql-4cc2e0748b1a.herokuapp.com/api/new-documents');
      setNotificationCount(response.data.length);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching new documents count:', error);
    }
  };
  useEffect(() => {
    fetchNewDocumentsCount(); // ดึงข้อมูลเมื่อคอมโพเนนต์โหลด
    const intervalId = setInterval(fetchNewDocumentsCount, 5000); // อัปเดตทุก 5 วินาที

    return () => clearInterval(intervalId); // เคลียร์ interval เมื่อคอมโพเนนต์ถูกลบ
  }, []);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const storedUsername = localStorage.getItem('username');
    const storedUser_fname = localStorage.getItem('user_fname');
    if (storedUsername, storedUser_fname) {
      setUsername(storedUsername);
      setUser_fname(storedUser_fname);

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

  const handleClickDocument = () => {
    setOpenDocumentMenu(!openDocumentMenu);
  };

  const handleBackToHome = () => {

    setLoading(true); // เริ่มการโหลด
    setTimeout(() => {
      navigate('/home');
      setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
    }, 400); // หน่วงเวลา 500ms
  };

  const handleAddUser = () => {
    setLoading(true); // เริ่มการโหลด
    setTimeout(() => {
      navigate('/newuser');
      setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
    }, 400); // หน่วงเวลา 500ms
  };
  const handleListUser = () => {
    setLoading(true); // เริ่มการโหลด
    setTimeout(() => {
      navigate('/list');
      setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
    }, 400); // หน่วงเวลา 500ms
  };

  const handleAllDocuments = () => {
    setLoading(true); // เริ่มการโหลด
    setTimeout(() => {
      navigate('/doc');
      setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
    }, 400); // หน่วงเวลา 500ms
  };

  const handleAddFile = () => {
    setLoading(true); // เริ่มการโหลด
    setTimeout(() => {
      navigate('/addfile');
      setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
    }, 400); // หน่วงเวลา 500ms
  };

  const handleStatistics = () => {
    setLoading(true); // เริ่มการโหลด
    setTimeout(() => {
      navigate('/rec');
      setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
    }, 400); // หน่วงเวลา 500ms
  };

  const handleNotificationClick = (event) => {
    setNotificationMenuAnchor(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setNotificationMenuAnchor(null);
  };

  return (
    <>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        {loading && (
          <Box style={{
            position: 'fixed', // เพื่อให้คอมโพเนนต์คงอยู่กับหน้าจอ
            top: 0,
            left: 0,
            width: '100vw', // คลุมทั้งความกว้างของหน้าจอ
            height: '100vh', // คลุมทั้งความสูงของหน้าจอ
            display: 'flex', // ใช้ flexbox ในการจัดกึ่งกลาง
            justifyContent: 'center', // จัดกึ่งกลางในแนวนอน
            alignItems: 'center', // จัดกึ่งกลางในแนวตั้ง
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // สีพื้นหลังโปร่งใสเล็กน้อยเพื่อเน้นการโหลด
            zIndex: 9999 // ทำให้ชั้นการแสดงอยู่ด้านบนสุด
          }}>
            <CircularProgress />
          </Box>
        )}

        <Toolbar>
          {/* ช่องค้นหา */}
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2, justifyContent: 'flex-start' }}>
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            DashBoard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            {/* สัญลักษณ์แจ้งเตือน */}
            <IconButton onClick={handleNotificationClick} sx={{ color: 'inherit' }}>
              <Badge badgeContent={notificationCount} color="error"> {/* อัปเดตที่นี่ */}
                <Notifications />
              </Badge>
            </IconButton>

            {/* โปรไฟล์ */}
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar alt={username} src="path_to_your_avatar_image.png" />
            </IconButton>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem
                onClick={handleProfileMenuClose}
                sx={{ fontSize: '18px'}} // ปรับแต่งฟอนต์ที่นี่
              >
                คุณ, {user_fname}
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleProfileMenuClose}
                sx={{  fontSize: '16px' }} // ปรับแต่งฟอนต์ที่นี่
              >
                {username}
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{  fontSize: '16px'}} // ปรับแต่งฟอนต์ที่นี่
              >
                ออกจากระบบ
              </MenuItem>
            </Menu>


            {/* ข้อความทักทายผู้ใช้ */}
            <Typography variant="body1" sx={{ marginLeft: 2, color: 'inherit' }}>
              Hi, {user_fname}
            </Typography>

            {/* การแจ้งเตือนเอกสารใหม่ */}
            <Menu
              anchorEl={notificationMenuAnchor}
              open={Boolean(notificationMenuAnchor)}
              onClose={handleCloseNotificationMenu}
            >
              <List sx={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                <ListItem>
                  <ListItemText
                    primary={`คุณมีการแจ้งเตือนใหม่ ${notifications.length} รายการ`}
                    sx={{ textAlign: 'center', fontWeight: 'bold' }}
                  />
                </ListItem>
                <Divider />
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ padding: '10px', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <ListItemIcon>
                          <NotificationsIcon sx={{ color: '#1976d2' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={`คุณ ${notification.user_fname} ${notification.user_lname} ได้เพิ่มเอกสาร`}
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {timeAgo(notification.upload_date)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="ไม่มีเอกสารใหม่" sx={{ textAlign: 'center' }} />
                  </ListItem>
                )}
              </List>
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
        {/* <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // เปลี่ยนพื้นหลังให้เป็นสีดำโปร่งแสง
          }}
          open={loading} // เปิดเมื่อ loading เป็น true
        >
          <CircularProgress color="inherit" />
        </Backdrop> */}
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
                <ListItemIcon sx={{ color: '#ddd' }}><SupervisorAccount /></ListItemIcon>
                <ListItemText primary="ผู้ใช้" />
                {openUserMenu ? <ArrowDropUp /> : <ArrowDropDown />} {/* ไอคอนลูกศร */}
              </ListItem>
            </Tooltip>

            <Collapse in={openUserMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={handleListUser}>
                  <ListItemIcon sx={{ color: '#ddd' }}><Article /></ListItemIcon>
                  <ListItemText primary="รายชื่อผู้ใช้" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={handleAddUser}>
                  <ListItemIcon sx={{ color: '#ddd' }}><PersonAdd /></ListItemIcon>
                  <ListItemText primary="เพิ่มผู้ใช้" />
                </ListItem>
              </List>
            </Collapse>

            <Tooltip title="เอกสารทั้งหมด" arrow>
              <ListItem button onClick={handleClickDocument}>
                <ListItemIcon sx={{ color: '#ddd' }}><InsertDriveFile /></ListItemIcon>
                <ListItemText primary="รายการเอกสาร" />
                {openUserMenu ? <ArrowDropUp /> : <ArrowDropDown />} {/* ไอคอนลูกศร */}
              </ListItem>
            </Tooltip>

            <Collapse in={openDocumentMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={handleAllDocuments}>
                  <ListItemIcon sx={{ color: '#ddd' }}><Description /></ListItemIcon>
                  <ListItemText primary="เอกสารทั้งหมด" />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={handleAddFile}>
                  <ListItemIcon sx={{ color: '#ddd' }}><AddComment /></ListItemIcon>
                  <ListItemText primary="เพิ่มเอกสาร" />
                </ListItem>
              </List>
            </Collapse>

            <ListItem button onClick={handleStatistics}>
              <ListItemIcon sx={{ color: '#ddd' }}><BarChart /></ListItemIcon>
              <ListItemText primary="สถิติการรับเอกสาร" />
            </ListItem>

            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: '#ddd' }}><ExitToApp /></ListItemIcon>
              <ListItemText primary="ออกจากระบบ" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#f5f5f5', p: 3, marginLeft: `${drawerWidth}px` }}
      >
        <Toolbar />
        {children}
      </Box>
    </>
  );
};

export default Layout;

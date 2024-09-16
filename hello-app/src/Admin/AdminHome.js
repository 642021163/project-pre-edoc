import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Snackbar, TextField, IconButton, AppBar, Toolbar, Menu, MenuItem, Divider
} from '@mui/material';
import { InsertDriveFile, Person, ReportProblem, Search, Notifications, AccountCircle, ExitToApp, Home as HomeIcon, FileUpload as FileUploadIcon } from '@mui/icons-material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AdminHome() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [unreadDocuments, setUnreadDocuments] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();




  const handleLogout = () => {
    const confirmLogout = window.confirm("คุณแน่ใจว่าต้องการออกจากระบบไหม?");
    if (confirmLogout) {
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      navigate('/loginpage');
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'เอกสารทั้งหมด', link: '/doc', icon: <InsertDriveFile /> },
    { text: 'เอกสารที่ยังไม่อ่าน', link: '/track', icon: <FileUploadIcon /> },
    { text: 'ข้อมูลผู้ใช้', link: `/profile/${userId}`, icon: <AccountCircle /> },
  ];

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        if (!storedUsername) {
          navigate('/loginpage');
        } else {
          setUsername(storedUsername);
          setUserId(storedUserId);
        }

        await Promise.all([
          fetchUserCount(),
          fetchDocumentCount()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // ฟังก์ชันสำหรับดึงข้อมูลจำนวนผู้ใช้
  const fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user-count');
      setUserCount(response.data.count);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจำนวนเอกสาร
  const fetchDocumentCount = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/document-count');
      setDocumentCount(response.data.count);
    } catch (error) {
      console.error('Error fetching document count:', error);
    }
  };

  // ใช้ useEffect ในการดึงข้อมูลเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    fetchUserCount();
    fetchDocumentCount();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex' }}>
      <AppBar position="fixed" sx={{ width: `calc(100% - 250px)`, ml: '250px' }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
            <TextField
              variant="outlined"
              placeholder="ค้นหา..."
              size="small"
              sx={{ marginRight: 2, bgcolor: '#fff' }}
               InputProps={{
                endAdornment: (
                <IconButton>
                  <Search />
                </IconButton>
              ),
            }}
            />
          <IconButton onClick={handleNotificationsClick} color="inherit">
            <Notifications />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationsClose}
          >
            <MenuItem onClick={handleNotificationsClose}>การแจ้งเตือน 1</MenuItem>
            <MenuItem onClick={handleNotificationsClose}>การแจ้งเตือน 2</MenuItem>
          </Menu>
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
        </Toolbar>
      </AppBar>

      <Box sx={{ width: 250, bgcolor: '#ffffff', p: 2, boxShadow: 3, position: 'fixed', height: '100%', top: 0 }}>
        <Typography variant="h6" gutterBottom>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e3f2fd',
              padding: '8px 16px',
              borderRadius: '4px',
              color: '#0277bd',

            }}
          >
            <HomeIcon sx={{ marginRight: '8px' }} />
            Dashboard
          </Box>
        </Typography>

        <List>
          {menuItems.map((item) => (
            <ListItem
              component={Link}
              to={item.link}
              key={item.text}
              sx={{
                borderRadius: '4px',
                mb: 1,
                backgroundColor: location.pathname === item.link ? '#bbdefb' : 'transparent',
                '&:hover': { backgroundColor: '#e1f5fe' }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem
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

      <Box sx={{ flexGrow: 1, ml: '250px', p: 3, bgcolor: '#f0f2f5', mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Card 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <Link to="/list" style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#e3f2fd', // Light blue
                    borderRadius: 2,
                    boxShadow: 3
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Person fontSize="large" sx={{ mr: 1, color: '#0277bd' }} />
                    ผู้ใช้ที่ลงทะเบียน
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#555' }}>{userCount} คน</Typography>
                </Paper>
              </Link>
            </Grid>

            {/* Card 2 */}
            <Grid item xs={12} sm={6} md={4}>
              <Link to="/doc" style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#e8f5e9', // Light green
                    borderRadius: 2,
                    boxShadow: 3
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <InsertDriveFile fontSize="large" sx={{ mr: 1, color: '#4caf50' }} />
                    เอกสารทั้งหมด
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#555' }}>{documentCount} รายการ</Typography>
                </Paper>
              </Link>
            </Grid>

            {/* Card 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#fff3e0', // Light orange
                  borderRadius: 2,
                  boxShadow: 3
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <ReportProblem fontSize="large" sx={{ mr: 1, color: '#ff9800' }} />
                  เอกสารที่ยังไม่อ่าน
                </Typography>
                <Typography variant="h6" sx={{ color: '#555' }}>{unreadDocuments} รายการ</Typography>
              </Paper>
            </Grid>

            {/* Card 4 */}
            <Grid item xs={12} sm={6} md={4}>
              <Link to="/rec" style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#f3e5f5', // Light purple
                    borderRadius: 2,
                    boxShadow: 3
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <ReportProblem fontSize="large" sx={{ mr: 1, color: '#ab47bc' }} />
                    สถิติการรับเอกสาร
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#555' }}>{unreadDocuments} รายการ</Typography>
                </Paper>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success">
          เอกสารได้รับการอัปโหลดเรียบร้อยแล้ว!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminHome;

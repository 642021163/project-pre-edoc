import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Snackbar, TextField, IconButton, AppBar, Toolbar, Menu, MenuItem, Divider,
  List, ListItem, ListItemIcon, ListItemText, Tooltip, Drawer, CssBaseline, Collapse
} from '@mui/material';
import {
  InsertDriveFile, Person, ReportProblem, PersonAdd, Home, Search, Notifications, AccountCircle, ExitToApp, Home as HomeIcon, FileUpload,
  BarChart,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert'; // สำหรับการแจ้งเตือน
import axios from 'axios';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const drawerWidth = 240; // หรือค่าที่คุณต้องการ
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
  const [openUserMenu, setOpenUserMenu] = useState(false);


  const handleLogout = () => {
    const confirmLogout = window.confirm("คุณแน่ใจว่าต้องการออกจากระบบไหม?");
    if (confirmLogout) {
      localStorage.clear();
      navigate('/loginpage');
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  const handleBackToHome = () => {
    navigate('/home'); // หรือเส้นทางที่คุณต้องการ
  };

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };


  const handleCloseAlert = () => {
    setOpenAlert(false);
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
  const handleClick = () => {
    setOpenUserMenu(!openUserMenu);
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

        // เรียกใช้ฟังก์ชันทั้งหมดเพื่อนำข้อมูล
        await Promise.all([
          fetchUserCount(),
          fetchDocumentCount(),
          fetchUnreadDocumentCount() // เรียกใช้ฟังก์ชันนี้
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

  // ฟังก์ชันสำหรับดึงข้อมูลจำนวนเอกสารที่ยังไม่อ่าน
  const fetchUnreadDocumentCount = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/unread-document-count');
      setUnreadDocuments(response.data.count);
    } catch (error) {
      console.error('Error fetching unread document count:', error);
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
    <Box >
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1976d2' }}>
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


      <Box sx={{ flexGrow: 1, ml: '250px', p: 3, bgcolor: '#f0f2f5', mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>


            {/* Card 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <Link to="/unread" style={{ textDecoration: 'none' }}>
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
                  <Typography variant="h6" sx={{ color: '#555' }}> รายการ</Typography>
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

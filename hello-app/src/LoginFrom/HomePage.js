import React, { useEffect, useState } from 'react';
import { Box, Typography, Link, List, ListItem, ListItemIcon, ListItemText, Divider, Tooltip, Collapse, CircularProgress } from '@mui/material';
import { FileUpload, AccountCircle, ExitToApp, InsertDriveFile } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../AppBar/Navbar';
import AppBar from '../AppBar/Appbar';

const images = [
    { src: '/asset/0001.png', title: 'ส่งเอกสาร', link: '/fileupload' },
    { src: '/asset/002.png', title: 'ติดตามเอกสาร', link: '/track' },
    { src: '/asset/005.jpg', title: 'Image Title 4', link: '/page4' },
    { src: '/asset/006.jpg', title: 'Image Title 5', link: '/page5' },
    // เพิ่มรายการภาพที่นี่
];

function HomePage() {
    const [username, setUsername] = useState('');
    const [user_fname, setUser_fname] = useState('');
    const [user_lname, setUser_lname] = useState('');
    const [userId, setUserId] = useState('');
    const [menuOpen, setMenuOpen] = useState(true); // สถานะการเปิด/ปิดเมนู
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // เปลี่ยนสถานะการเปิด/ปิดเมนูเมื่อคลิกไอคอน
    };

    useEffect(() => {
        // ตรวจสอบการเข้าสู่ระบบ
        const storedUsername = localStorage.getItem('username');
        const storedUser_fname = localStorage.getItem('user_fname');
        const storedUser_lname = localStorage.getItem('user_lname');
        const storedUserId = localStorage.getItem('userId');
        if (!storedUsername) {
            navigate('/loginpage'); // เปลี่ยนเส้นทางไปยังหน้า login
        } else {
            setUsername(storedUsername);
            setUser_fname(storedUser_fname || '');
            setUser_lname(storedUser_lname || '');
            setUserId(storedUserId);
        }
    }, [navigate]);

    const menuItems = [
        { text: 'ติดตามเอกสาร', link: '/track', icon: <InsertDriveFile /> },
        { text: 'ส่งเอกสาร', link: '/fileupload', icon: <FileUpload /> },
        { text: 'ข้อมูลผู้ใช้', link: `/profile/${userId}`, icon: <AccountCircle /> },
    ];

    const handleMenuClick = (link) => {
        setLoading(true);
        setTimeout(() => {
            navigate(link);
            setLoading(false);
        }, 400); // หน่วงเวลา 400ms
    };

    return (
        <Box>
            {location.pathname === '/homepage' && (
                <>
                    <AppBar />
                    <Navbar />
                </>
            )}
            <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex' }}>
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
                {/* ส่วนหลักของ Menu ฝั่งซ้าย */}
                <Box sx={{
                    width: menuOpen ? 250 : 60, // ขนาดของเมนูตามสถานะ
                    bgcolor: '#e3f2fd',
                    color: '#212121',
                    p: 2,
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'width 0.3s' // เพิ่มแอนิเมชั่นให้กับการแสดง/ซ่อนเมนู
                }}>
                    <Typography variant="h6" gutterBottom>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#bbdefb',
                                padding: '8px 16px',
                                borderRadius: '4px',
                            }}
                        >
                            <MenuIcon sx={{ marginRight: '8px' }} onClick={toggleMenu} /> {/* ไอคอนเมนู */}
                            {menuOpen && 'Menu'} {/* แสดงชื่อเมนูเฉพาะเมื่อเมนูเปิด */}
                        </Box>
                    </Typography>
                    <Collapse in={menuOpen}>
                        <List>
                            {menuItems.map((item) => (
                                <Tooltip title={item.text} key={item.text} arrow>
                                    <ListItem
                                        component="div"
                                        onClick={() => handleMenuClick(item.link)}
                                        sx={{
                                            borderRadius: '4px',
                                            mb: 1,
                                            backgroundColor: location.pathname === item.link ? '#bbdefb' : 'transparent',
                                            '&:hover': { backgroundColor: '#b3e5fc' },
                                            color: '#212121',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        {menuOpen && <ListItemText primary={item.text} />}
                                    </ListItem>
                                </Tooltip>
                            ))}
                        </List>
                    </Collapse>

                    <Divider sx={{ my: 2, bgcolor: '#bbdefb' }} />
                </Box>
                <Box sx={{ flex: 1, p: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        สวัสดีคุณ ,{user_fname} {user_lname}!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This is the main content area.
                    </Typography>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                        padding: 2
                    }}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    loading="lazy"
                                    style={{
                                        width: '300px',
                                        height: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <Typography variant="body2" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', bgcolor: 'rgba(0, 0, 0, 0.5)', color: 'white', p: 1 }}>
                                    <Link
                                        component={RouterLink}
                                        to={image.link}
                                        underline="hover"
                                        color="inherit"
                                    >
                                        {image.title}
                                    </Link>
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default HomePage;

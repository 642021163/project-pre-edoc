import React, { useEffect, useState } from 'react';
import { Box, Typography, Link, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
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
    const navigate = useNavigate(); // ใช้ React Router เพื่อการนำทาง
    const location = useLocation(); // ใช้ React Router เพื่อตรวจสอบเส้นทางปัจจุบัน
    const [menuOpen, setMenuOpen] = useState(false); // สถานะการเปิด/ปิดเมนู

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
            setUser_fname(storedUser_fname || ''); // ตั้งค่า user_fname
            setUser_lname(storedUser_lname || ''); // ตั้งค่า user_lname
            setUserId(storedUserId);
        }
    }, [navigate]);


  
    const menuItems = [
        { text: 'ติดตามเอกสาร', link: '/track', icon: <InsertDriveFile /> },
        { text: 'ส่งเอกสาร', link: '/fileupload', icon: <FileUpload /> },
        { text: 'ข้อมูลผู้ใช้', link: `/profile/${userId}`, icon: <AccountCircle /> }, // ใช้ ID ของผู้ใช้ที่ล็อกอิน
    ];

    return (
        <Box>
        {/* แสดง AppBar และ Navbar เฉพาะเมื่ออยู่ในหน้า /homepage */}
        {location.pathname === '/homepage' && (
          <>
            <AppBar />
            <Navbar />
          </>
        )}
        <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex' }}>
            {/* ส่วนหลักของ Menu ฝั่งซ้าย */}
            <Box sx={{
                width: 250,
                bgcolor: '#e3f2fd', // สีพื้นหลังของเมนู (ฟ้าอ่อน)
                color: '#212121', // สีฟร้อนของเมนู (ดำ)
                p: 2,
                boxShadow: 1, // ลดความเข้มของเงา
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography variant="h6" gutterBottom>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#bbdefb', // สีพื้นหลังของหัวข้อเมนู (ฟ้าอ่อน)
                            padding: '8px 16px',
                            borderRadius: '4px',
                        }}
                    >
                        <MenuIcon sx={{ marginRight: '8px' }} /> {/* ไอคอนเมนู */}
                        Menu
                    </Box>
                </Typography>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            component="a"
                            href={item.link}
                            key={item.text}
                            sx={{
                                borderRadius: '4px',
                                mb: 1,
                                backgroundColor: location.pathname === item.link ? '#bbdefb' : 'transparent',
                                '&:hover': { backgroundColor: '#b3e5fc' }, // สีพื้นหลังเมื่อ hover (ฟ้าอ่อน)
                                color: '#212121' // สีฟร้อนของรายการเมนู (ดำ)
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2, bgcolor: '#bbdefb' }} /> {/* สีของ divider (ฟ้าอ่อน) */}
            </Box>
            <Box sx={{ flex: 1, p: 2 }}>
                {/* ส่วนหลักของหน้า */}
                <Typography variant="h4" gutterBottom>
                    สวัสดีคุณ ,{user_fname} {user_lname}!
                </Typography>
                <Typography variant="body1" paragraph>
                    This is the main content area.
                </Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)', // กำหนดให้มี 2 คอลัมน์
                    gap: 2, // ช่องว่างระหว่างภาพ
                    padding: 2 // ช่องว่างรอบๆกริด
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
                                <Link to={image.link} underline="hover" color="inherit">
                                    
                                </Link>
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

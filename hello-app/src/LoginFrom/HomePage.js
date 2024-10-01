import React, { useEffect, useState } from 'react';
import { Box, Typography, Link, CircularProgress } from '@mui/material';
import { FileUpload, AccountCircle, ExitToApp, InsertDriveFile } from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../AppBar/Navbar';
import AppBar from '../AppBar/Appbar';
import Drawer from '../AppBar/Drawer';

const images = [
    { src: '/asset/0001.png', title: 'ส่งเอกสาร', link: '/fileupload' },
    { src: '/asset/002.png', title: 'ติดตามเอกสาร', link: '/track' },
    { src: '/asset/005.jpg', title: 'Image Title 4', link: '/page4' },
    { src: '/asset/006.jpg', title: 'Image Title 5', link: '/page5' },
    // เพิ่มรายการภาพที่นี่
];

function HomePage() {
    const [username, setUsername] = useState('');
    const { id } = useParams();
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


    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD']; // Array of colors
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

                <Drawer menuOpen={menuOpen} toggleMenu={toggleMenu} />
                {/* เนื้อหาหลัก */}
                <Box sx={{ flex: 1, p: 2 }}>

                    <Typography variant="h4" gutterBottom>
                        สวัสดีคุณ ,{user_fname} {user_lname}!
                    </Typography>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, // เปลี่ยนจำนวนคอลัมน์ตามขนาดหน้าจอ
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
                                        width: '250px',
                                        height: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <Typography variant="body2" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', bgcolor: '#338ef7', color: 'white', p: 1 }}>
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

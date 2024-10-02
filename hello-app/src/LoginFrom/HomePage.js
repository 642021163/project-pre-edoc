import React, { useEffect, useState } from 'react';
import { Box, Typography, Link, CircularProgress, Tooltip } from '@mui/material';
import { useNavigate, useLocation, useParams, Link as RouterLink } from 'react-router-dom';
import Navbar from '../AppBar/Navbar';
import AppBar from '../AppBar/Appbar';
import Drawer from '../AppBar/Drawer';

const images = [
    { src: '/asset/0001.png', title: 'ส่งเอกสาร', link: '/fileupload' },
    { src: '/asset/002.png', title: 'ติดตามเอกสาร', link: '/track' },
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

    const handleLinkClick = (link) => {
        setLoading(true); // เริ่มการโหลดเมื่อคลิก
        setTimeout(() => {
            navigate(link); // เปลี่ยนเส้นทางหลังจากหน่วงเวลาเล็กน้อย
            setLoading(false); // หยุดการโหลดหลังจากเปลี่ยนหน้า
        }, 1000); // หน่วงเวลา 1 วินาที (สามารถปรับได้)
    };

    // สีพื้นหลังที่สบายตา
    const backgroundColors = ['#E8F5E9', '#E3F2FD', '#FFF3E0']; // ตัวอย่างสีพื้นหลังที่สบายตา
    const borderColor = '#A5D6A7'; // สีกรอบ

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
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography sx={{ mt: 2 }}>Loading...</Typography>
                        </Box>
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
                            <Box
                                key={index}
                                sx={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: 4,
                                    backgroundColor: backgroundColors[index % backgroundColors.length],
                                    border: `2px solid ${borderColor}`, // สร้างกรอบ
                                    padding: 1,
                                    boxShadow: 2 // เพิ่มเงาเพื่อให้กรอบเด่นขึ้น
                                }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    loading="lazy"
                                    style={{
                                        width: '300px', // ขนาดภาพ
                                        height: '300px', // ขนาดภาพ
                                        objectFit: 'cover',
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        textAlign: 'center',
                                        bgcolor: '#338ef7',
                                        color: 'white',
                                        p: 2, // เพิ่ม padding เพื่อให้กรอบข้อความมีขนาดใหญ่ขึ้น
                                        fontSize: '1rem', // ปรับขนาดตัวอักษรให้สมดุลกับขนาดภาพ
                                    }}
                                >
                                    <Tooltip title={image.title}>
                                        <Link
                                            onClick={() => handleLinkClick(image.link)} // เรียกใช้ฟังก์ชัน handleLinkClick
                                            underline="hover"
                                            color="inherit"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {image.title}
                                        </Link>
                                    </Tooltip>
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

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// กำหนดสไตล์โลโก้
const Logo = styled('img')(({ theme }) => ({
  height: '60px', // ปรับขนาดโลโก้ตามต้องการ
  marginRight: theme.spacing(0), // เพิ่มระยะห่างระหว่างโลโก้กับข้อความ
}));

function Appbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: '250px', // ปรับความสูงให้เหมาะสม
            padding: '20px', // เพิ่ม padding เพื่อให้พื้นที่ดูดีขึ้น
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Logo src="/asset/logosc.png" alt="Logo" />
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography variant="h5" component="div" gutterBottom
                sx={{
                  color: 'black',
                 
                 
                }} >
                ระบบเตรียมข้อมูลสำหรับป้อนเข้าสู่ระบบเอกสารอิเล็กทรอนิกส์
              </Typography>
              <Typography variant="h6" component="div" gutterBottom sx={{ color: 'black',  }}>
                Data Preparation For E-DOC System
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Appbar;

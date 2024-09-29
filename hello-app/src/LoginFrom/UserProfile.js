import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Paper, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // ไอคอนสำเร็จ

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    prefix: '',
    user_fname: '',
    user_lname: '',
    username: '',
    phone_number: '',
    affiliation: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // สถานะเปิด/ปิด Dialog
  const [successMessage, setSuccessMessage] = useState(''); // สถานะข้อความสำเร็จ

  // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://test-db-app-mysql-4cc2e0748b1a.herokuapp.com/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error.response?.data || error.message);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // จัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://test-db-app-mysql-4cc2e0748b1a.herokuapp.com/users/${id}`, user);
      setSuccessMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
      setDialogOpen(true);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้:', error.response?.data || error.message);
      setError('เกิดข้อผิดพลาดในการอัปเดตผู้ใช้');
    }
  };

  // แสดงข้อความระหว่างการโหลดหรือข้อผิดพลาด
  if (loading) return <Typography variant="h6">กำลังโหลด...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  // ปิด Dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate('/homepage'); // นำทางไปยังหน้า homepage หลังจากปิด Dialog
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          อัปเดตโปรไฟล์ผู้ใช้
        </Typography>
        <form onSubmit={handleSubmit}>

          <TextField
            label="คำนำหน้า"
            name="prefix"
            value={user.prefix}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="ชื่อจริง"
                name="user_fname"
                value={user.user_fname}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="นามสกุล"
                name="user_lname"
                value={user.user_lname}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <TextField
            label="ชื่อผู้ใช้"
            name="username"
            value={user.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="หมายเลขโทรศัพท์"
            name="phone_number"
            value={user.phone_number}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="หน่วยงาน"
            name="affiliation"
            value={user.affiliation}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="บทบาท"
            name="role"
            value={user.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true, // ทำให้ไม่สามารถแก้ไขได้
            }}
          />
          <p><strong>คำนำหน้า:</strong> {user.prefix || 'ไม่ระบุ'}</p>
          <p ><strong>ชื่อ:</strong> {user.user_fname || 'ไม่ระบุ'} {user.user_lname || 'ไม่ระบุ'}</p>
          <p><strong>อีเมล:</strong> {user.username || 'ไม่ระบุ'}</p>
          <p><strong>หมายเลขโทรศัพท์:</strong> {user.phone_number || 'ไม่ระบุ'}</p>
          <p><strong>หน่วยงาน:</strong> {user.affiliation || 'ไม่ระบุ'}</p>
          <p><strong>บทบาท:</strong> {user.role || 'ไม่ระบุ'}</p>

          <DialogActions style={{ justifyContent: 'center' }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={{ marginRight: '8px' }} // เพิ่มระยะห่างขวาเล็กน้อย
            >
              บันทึก
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => navigate('/homepage')}
            >
              ยกเลิก
            </Button>
          </DialogActions>
        </form>
      </Paper>

      {/* Dialog สำหรับแสดงข้อความสำเร็จ */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon color="success" style={{ marginRight: 8 }} />
            สำเร็จ
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {successMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;

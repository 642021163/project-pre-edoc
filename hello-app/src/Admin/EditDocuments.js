import React, { useEffect, useState } from 'react';
import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Badge, InputBase, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Paper, Button, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,
  Tooltip
} from '@mui/material';
import { Search, Notifications, Home, PersonAdd } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // ไอคอนสำเร็จ

const drawerWidth = 240; // หรือค่าที่คุณต้องการ



function EditDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState({
    upload_date: '',
    user_id : localStorage.getItem('user_id'),
    subject: '',
    to_recipient: '',
    document_number: '',
    document_type: '',
    status: '',
    recipient: '',
    notes: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // สถานะเปิด/ปิด Dialog
  const [successMessage, setSuccessMessage] = useState(''); // สถานะข้อความสำเร็จ
  const [recipients, setRecipients] = useState([]);

  const statusOptions = [
    { value: 0, label: 'รอดำเนินการ' },
    { value: 1, label: 'กำลังดำเนินการ' },
    { value: 2, label: 'ดำเนินการเรียบร้อย' }
  ];
  const document_typeOptions = ([
    { value: 'เอกสารภายใน', label: 'เอกสารภายใน' },
    { value: 'เอกสารภายนอก', label: 'เอกสารภายนอก' },
    { value: 'เอกสารสำคัญ', label: 'เอกสารสำคัญ' }
  ]);



  // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/document/${id}`);
        setDocument(response.data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร:', error.response?.data || error.message);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร');
      } finally {
        setLoading(false);
      }
    };
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admins');
        setRecipients(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
    fetchDocument();
  }, [id]);


  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // จัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/documents/${id}`, document);
      setSuccessMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
      setDialogOpen(true);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตเอกสาร:', error.response?.data || error.message);
      setError('เกิดข้อผิดพลาดในการอัปเดตเอกสาร');
    }
  };
  // ปิด Dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate('/doc'); // นำทางไปยังหน้า homepage หลังจากปิด Dialog
  };

  const handleBackToHome = () => {
    navigate('/home'); // นำทางไปที่หน้าโฮม
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff' }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Search Box */}
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px', px: 1, mx: 2 }}>
              <IconButton sx={{ p: '10px' }}>
                <Search />
              </IconButton>
              <InputBase
                placeholder="Search…"
                sx={{ ml: 1, flex: 1 }}
              />
            </Box>
            {/* Notifications Icon */}
            <IconButton sx={{ color: '#fff' }}>
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
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
            bgcolor: '#1A2035',  // สีพื้นหลังของ Drawer (สีเข้ม)
            color: '#B9BABF',    // สีของตัวหนังสือ (สีขาว/เทาอ่อน)
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
                <ListItemIcon sx={{ color: '#ddd' }}> {/* ไอคอนสีเทาอ่อน */}
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Tooltip>
            <Tooltip title="ผู้ใช้ที่ลงทะเบียน" arrow>
              <ListItem button onClick={() => navigate('/user-list')}>
                <ListItemIcon sx={{ color: '#ddd' }}> {/* ไอคอนสีเทาอ่อน */}
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary="ผู้ใช้ที่ลงทะเบียน" />
              </ListItem>
            </Tooltip>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Edit Document</Typography>
        <Paper
          sx={{
            padding: 3,
            backgroundColor: '#f5f5f5' // สีพื้นหลังของ Paper
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="วันที่อัปโหลด"
                    name="upload_date"
                    type="datetime-local"
                    value={document.upload_date}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>ผู้รับเอกสาร</InputLabel>
                    <Select
                      label="Recipient"
                      name="recipient"
                      value={document.recipient || ''}
                      onChange={handleChange}
                      required
                    >
                      {recipients.length > 0 ? (
                        recipients.map(admin => (
                          <MenuItem key={admin.user_id} value={admin.user_id}>
                            {admin.user_fname} {admin.user_lname}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No Recipients Available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="เรื่อง"
                    name="subject"
                    value={document.subject}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>สถานะ</InputLabel>
                    <Select
                      label="Status"
                      name="status"
                      value={document.status}
                      onChange={handleChange}
                      required
                    >
                      {statusOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="ถึง"
                    name="to_recipient"
                    value={document.to_recipient}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="เลขที่เอกสาร"
                    name="document_number"
                    value={document.document_number}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Row 4 */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>ประเภทเอกสาร</InputLabel>
                    <Select
                      label="Document Type"
                      name="document_type"
                      value={document.document_type}
                      onChange={handleChange}
                      required
                    >
                      {document_typeOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Row 5 */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <TextField
                      label="หมายเหตุ"
                      name="notes"
                      value={document.notes}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
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
                onClick={() => console.log()}
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
      </Box>
    </Box>
  );
}

export default EditDocuments;

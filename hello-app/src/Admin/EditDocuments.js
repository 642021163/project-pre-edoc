import React, { useEffect, useState } from 'react';
import {
  Box, CssBaseline, Typography, Paper, Button, Grid, TextField, FormControl,
  InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // ไอคอนสำเร็จ
import Layout from '../LayoutAdmin/Layout';

// การจัดรูปแบบวันที่และเวลา
const formatDateTime = (dateTime) => format(parseISO(dateTime), 'yyyy-MM-dd HH:mm:ss');

function EditDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState({
    upload_date: '',
    user_id: localStorage.getItem('user_id'),
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
  const [documentId, setDocumentId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [paperCost, setPaperCost] = useState('');
  const [isReceived, setIsReceived] = useState(false);
  const [docId, setDocId] = useState(id);


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
      console.log('Document updated successfully.');
      // ตั้งค่าข้อความแจ้งเตือนเมื่อบันทึกสำเร็จ

      setSuccessMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
      setDialogOpen(true);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตเอกสาร:', error.response?.data || error.message);
      setError('เกิดข้อผิดพลาดในการอัปเดตเอกสาร');
    }
  };
  const handleDocumentReceive = async (docId) => {
    try {
      // ตรวจสอบว่า adminId มีค่าเป็นหมายเลขที่ถูกต้อง
      if (!adminId || isNaN(adminId)) {
        console.error('Invalid adminId:', adminId);
        return; // ออกจากฟังก์ชันถ้า adminId ไม่ถูกต้อง
      }

      // อัปเดตสถานะเอกสาร
      const updateStatusResponse = await axios.put(`http://localhost:3000/document/${docId}/status`, {
        received_by: adminId // รหัสของผู้ดูแลระบบที่รับเอกสาร
      });

      // บันทึกข้อมูลการรับเอกสาร
      const receiptResponse = await axios.post('http://localhost:3000/document-stats', {
        documentId: docId,
        adminId: adminId,
        dateReceived: new Date().toISOString().split('T')[0], // ใช้วันที่ปัจจุบัน
        paperCost: paperCost // ค่ากระดาษหรือข้อมูลที่คุณต้องการบันทึก
      });
      console.log('Receipt response:', receiptResponse.data); // Log ค่าการตอบกลับจากการบันทึกข้อมูลการรับเอกสาร

    } catch (error) {
      console.error('Error handling document receive:', error); // Log ข้อผิดพลาด
    }
  };

  // ฟังก์ชันจัดการปุ่มรับเอกสาร
  const handleReceiveButtonClick = (docId) => {
    console.log('Document ID clicked:', docId); // Log ค่า docId ที่ถูกกด
    console.log('Admin ID:', adminId,"Unfind"); // ตรวจสอบค่าก่อนที่จะใช้

    // ตรวจสอบสถานะเอกสารก่อนการเรียกใช้งาน
    handleDocumentReceive(docId);
  };

  // ปิด Dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate('/doc'); // นำทางไปยังหน้า homepage หลังจากปิด Dialog
  };


  const handleCancel = () => {
    navigate('/doc');
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: '#1976d2' }}>แก้ไขเอกสาร</Typography>
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

                  <Button
                    variant="contained"
                    color={isReceived ? "success" : "primary"}
                    onClick={() => handleReceiveButtonClick(docId)}
                    disabled={isReceived}
                  >
                    {isReceived ? 'เอกสารได้รับการบันทึกแล้ว' : 'รับเอกสาร'}
                  </Button>

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
                  onClick={handleCancel}
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
    </Layout>
  );
}

export default EditDocuments;

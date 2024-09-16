import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import { CPagination, CPaginationItem } from '@coreui/react';
import '../App.css';

function HomeStatus() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    UserGet();
  }, []);

  const UserGet = () => {
    fetch("https://www.melivecode.com/api/users")
      .then(res => res.json())
      .then(result => {
        console.log("Fetched users:", result); // ตรวจสอบข้อมูลที่ได้รับ
        setItems(result);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  };

  const handleUpdate = id => {
    window.location = "/update/" + id;
  };
  const handleDelete = id => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    };
    fetch("https://www.melivecode.com/api/users/delete", requestOptions)
      .then(response => response.json())
      .then(result => {
        alert(result["message"]);
        if (result["status"] === "ok") UserGet();
      })
      .catch(error => console.error("Error deleting user:", error));
  };

  return (
    <div>
      <div>
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth="lg" sx={{ p: 2 }}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" sx={{ p: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant='h6' gutterBottom component="div" align='left'>
                    Users
                  </Typography>
                </Box>
                <Box>
                  <Link to="/create">
                    <Button variant='contained'>
                      Create
                    </Button>
                  </Link>
                </Box>
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">ID</TableCell>
                      <TableCell align="center">Profile</TableCell>
                      <TableCell align="right">First Name</TableCell>
                      <TableCell align="right">เรื่อง</TableCell>
                      <TableCell align="right">จาก</TableCell>
                      <TableCell align="right">ถึง</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(row => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center">
                            <Avatar alt={row.username} src={row.avatar} />
                          </Box>
                        </TableCell>
                        <TableCell align="right">{row.fname}</TableCell>
                        <TableCell align="right">{row.lname}</TableCell>
                        <TableCell align="right">{row.username}</TableCell>
                        <TableCell align="right">
                          <button
                            className='edit-button'
                            onClick={() => handleUpdate(row.id)}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </button>
                          <button
                            className='delete-button'
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Container>
        </React.Fragment>
        <CPagination aria-label="Page navigation example" align='center'>
          <CPaginationItem>Previous</CPaginationItem>
          <CPaginationItem>1</CPaginationItem>
          <CPaginationItem>2</CPaginationItem>
          <CPaginationItem>3</CPaginationItem>
          <CPaginationItem>Next</CPaginationItem>
        </CPagination>
      </div>
    </div>
  );
}

export default HomeStatus;

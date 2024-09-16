// UserUpdate.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  Box, Button, Container, CssBaseline, Grid, TextField,  Typography } from '@mui/material';
import { useParams, } from 'react-router-dom';
import '../App.css';

function UserUpdate() {
    const pages = ['Products', 'Pricing', 'Blog'];
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const { id } = useParams();
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    useEffect(() => {
        fetch(`https://www.melivecode.com/api/users/${id}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === "ok") {
                    setFname(result.user.fname);
                    setLname(result.user.lname);
                    setUsername(result.user.username);
                    setEmail(result.user.email);
                    setAvatar(result.user.avatar);
                }
            })
            .catch((error) => console.error(error));
    }, [id]);


    const handleSubmit = (e) => {
        e.preventDefault();
    
        const updatedUser = {
            id, // เพิ่ม id
            fname,
            lname,
            username,
            email,
            avatar,
        };
    
        axios.put(`https://www.melivecode.com/api/users/update`, updatedUser)
            .then(response => {
                console.log(response.data);
                alert(response.data.message);
                if (response.data.status === 'ok') {
                    window.location.href = '/home1';

                }
            })    
            .catch(error => {
                console.log(error);
            });
    };
    
    
    return (

        <div>
            <Box sx={{ p: 2 }}>
                <React.Fragment>
                    <CssBaseline />
                    <Container maxWidth="lg">
                        <Typography variant='h6' gutterBottom component="div" align='left'>
                            UPDATE USER
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField required
                                        id="fname"
                                        label="First Name"
                                        fullWidth
                                        onChange={(e) => setFname(e.target.value)} // Corrected spelling and used target
                                        value={fname}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField required
                                        id="lname"
                                        label="Last Name"
                                        fullWidth
                                        onChange={(e) => setLname(e.target.value)} // Corrected spelling and used target
                                        value={lname}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required
                                        id="username"
                                        label="Username"
                                        fullWidth
                                        onChange={(e) => setUsername(e.target.value)} // Corrected spelling and used target
                                        value={username}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required
                                        id="email"
                                        label="Email"
                                        fullWidth
                                        onChange={(e) => setEmail(e.target.value)} // Corrected spelling and used target
                                        value={email}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        id="avatar"
                                        label="Avatar"
                                        fullWidth
                                        onChange={(e) => setAvatar(e.target.value)} // Corrected spelling and used target
                                        value={avatar}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type='submit' variant='contained' fullWidth>Update</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Container>
                </React.Fragment>
            </Box>

        </div>
    )
}

export default UserUpdate;

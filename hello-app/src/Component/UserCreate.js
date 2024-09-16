import React, { useState } from 'react';
import axios from 'axios';
import {  Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material';


function UserCreate() {



    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");



    const handleSubmit = e => {
        e.preventDefault();
        const data = JSON.stringify({
            "id": 1,
            "fname": fname,
            "lname": lname,
            "username": username,
            "email": email,
            "avatar": avatar,
        });

        axios.post('https://www.melivecode.com/api/users/create', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
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
                            Create
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField required
                                        id="fname"
                                        label="First Name"
                                        fullWidth
                                        onChange={(e) => setFname(e.target.value)} // Corrected spelling and used target
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField required
                                        id="lname"
                                        label="Last Name"
                                        fullWidth
                                        onChange={(e) => setLname(e.target.value)} // Corrected spelling and used target
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required
                                        id="username"
                                        label="Username"
                                        fullWidth
                                        onChange={(e) => setUsername(e.target.value)} // Corrected spelling and used target
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required
                                        id="email"
                                        label="Email"
                                        fullWidth
                                        onChange={(e) => setEmail(e.target.value)} // Corrected spelling and used target
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        id="avatar"
                                        label="Avatar"
                                        fullWidth
                                        onChange={(e) => setAvatar(e.target.value)} // Corrected spelling and used target
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type='submit' variant='contained' fullWidth>Create</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Container>
                </React.Fragment>
            </Box>

        </div>
    );
}

export default UserCreate;

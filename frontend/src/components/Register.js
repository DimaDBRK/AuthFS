import * as React from 'react';
import { useState, useContext } from "react";
import { Alert, Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from "@mui/material";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useTheme } from '@mui/material/styles';
import { AppContext } from "../App";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isButton, setIsButton] = useState(true);
  
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  
  // regular exp for email
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // click on button
  const handleClick = async (e) => {
    e.preventDefault();
    setMsg("");
    // -> Register
    try {
      const res = await axios.post(`/signup`, { email, password });
      if (res.status === 200 ||res.status === 201) {
        console.log(res.data);
        setMsg("");
        navigate("/login"); //to Login
        
      }
    } catch (err) {
      console.log(err.response);
      setMsg(err.response.data.msg); // to show in the same alert part
    }
  }

  // change email
  const handleChangeEmail = (e) => {
    setMsg(""); 
    const address = e.target.value;
    
    // if email
    if (re.test(address)) {
      setEmail(address);
      if (password.length >= 3) {setIsButton(false)};
    } else {
      setMsg("Wrong email format!"); 
      setIsButton(true);
    };
  }

   // change password
   const handleChangePassword = (e) => {
    setMsg(""); 
    setPassword(e.target.value);
    // check length
    if (e.target.value.length >= 3 ) {
      if (re.test(email)) {setIsButton(false)};
    } else {
      setMsg("Password is less 3 symbols!"); 
      setIsButton(true);
    };
  }
  return (
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 450,
                px: 2,
                py: 1,
                width: '100%'
          }}
        >
          { msg.length > 1 && <Alert severity="warning">{msg}</Alert>}
           
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
       

          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange ={ handleChangeEmail }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete='off'
                  onChange ={ handleChangePassword }
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
              disabled={isButton}
            >
              SignUp
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link  sx={{color:theme.palette.secondary[200]}} variant="body3" onClick={()=>{ navigate("/login")}}>
                Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box> 
       
        </Box>

  );
}

export default Register;
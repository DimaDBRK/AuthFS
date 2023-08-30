import * as React from 'react';
import { useState, useContext } from "react";
import { Alert, Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from "@mui/material";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useTheme } from '@mui/material/styles';
import { AppContext } from "../App";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const LogIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isButton, setIsButton] = useState(true);
  
  const {setToken} = useContext(AppContext);
  const {setRefreshToken} =  useContext(AppContext);
  const { isLogin, setIsLogin } = useContext(AppContext);
  
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  // regular exp for email
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // click on button
  const handleClick = async (e) => {
    e.preventDefault();
    setMsg("");
    // -> Login
    try {
      const res = await axios.post(`/signin`, { email, password });
      if (res.status === 200) {
        console.log(res.data);
        // store refresh token to local storage
        // localStorage.setItem('refreshToken', res.data.refreshToken);
        
        setToken(res.data.access_token);
        setMsg("");
        setIsLogin(true);
        const origin = location.state?.from?.pathname || '/';
        console.log("origin=>", origin)
        navigate(origin); //to origin or main page /
      }
    } catch (err) {
      console.log(err.response);
      setMsg(err.response.data.msg); // to show in the same part
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
            Login
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
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link  sx={{color:theme.palette.secondary[200]}} variant="body3" onClick={()=>{ navigate("/register")}}>
                  Don't have an account? Register
                </Link>
              </Grid>
            </Grid>
          </Box> 
       
        </Box>

  );
}

export default LogIn;
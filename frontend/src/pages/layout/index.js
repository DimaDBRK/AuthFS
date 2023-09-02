import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "components/Navbar";
import { AppContext } from "App";
import jwt_token from 'jwt-decode';
import axios from "axios";

const Layout = () => {
    const [msg, setMsg] = useState('');
    // media query desktop - true
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const { isLogin, setIsLogin } = useContext(AppContext);
    const { token, setToken } = useContext(AppContext);
    const { userinfo, setUserInfo } = useContext(AppContext);

// fot access_token
    useEffect(()=>{
      if (token) {
        const payload = jwt_token(token);
        const info = payload.sub;
        setUserInfo(info);
        console.log("userinfo from token=>", info);
        } 
      }, [token])
      
      const getReportsNew = async (id) =>{
        console.log("user_id in get=>", userinfo.user_id)
      
        try {
          const res = await axios.get(`/wbapi/alluserreportsisdispaly/${id}`);
          
          console.log('res=>',res.data);
          setMsg("");
           
        }catch (err) {
          setMsg(err.response.data.msg);
          console.log(err.response.data.msg);
        }
   
      }
      
  return (
    <Box display={isNonMobile ? "flex": "block"} width="100%" height="100%">
    
        <Box flexGrow={1}>
            <Navbar
                user={userinfo|| ""}
             />
            <Outlet/>
        </Box>
    </Box>
  )
}

export default Layout;
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
      
    //for test User info
    // const user = {name: "Albert", isDeveloper: true }
    const { isLogin, setIsLogin } = useContext(AppContext);
    const { token, setToken } = useContext(AppContext);
    // const { refreshToken, setRefreshToken } = useContext(AppContext);
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
      

    // useEffect(()=>{
         
    //     if (token) {
    //         const payload = jwt_token(token);
    //         const info = payload.userinfo;
    //         setUserInfo(info);
    //         setIsDeveloper(info.isdeveloper);
    //         console.log("userinfo from token=>", info);
    //     }  else if (refreshToken) {
    //         const payload = jwt_token(refreshToken);
    //         const info = payload.userinfo;
    //         setIsLogin(true);
    //         setUserInfo(info);
    //         setIsDeveloper(info.isdeveloper);
    //         getReportsNew(info.user_id);
    //         console.log("userinfo from ref token=>", info);
    //         setMsg("");
           
    //     }
   
    // },[token, refreshToken]);


    // useEffect(()=>{
    //     getReports();
    //     console.log('res=>',reports);
    //   }, [])
      
      const getReportsNew = async (id) =>{
        console.log("user_id in get=>", userinfo.user_id)
      
        try {
          const res = await axios.get(`/wbapi/alluserreportsisdispaly/${id}`);
          
          console.log('res=>',res.data);
          // setReports(res.data);
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
import React, { useState, useContext} from 'react';
import { 
    LightModeOutlined, 
    DarkModeOutlined, 
    Menu as MenuIcon, 
    Search, 
    SettingsOutlined, 
    ArrowDropDownOutlined,
    ConstructionOutlined,
   
} from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from "state";
import { AppBar, IconButton, Toolbar, useTheme, InputBase, Button, Box, Typography, Menu, MenuItem} from '@mui/material';
import { Link, Navigate } from "react-router-dom";
// import profileImage from "asset/profile.jpg"
import { AppContext } from "App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

// import { logoutClearInfo } from 'helpers/logoutClearInfo';

const Navbar = ({
    user
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    // status
    const { isLogin, setIsLogin, userinfo, setUserInfo } = useContext(AppContext);
    //right button user info
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const imageLink = `https://robohash.org/${userinfo.name}`
    
//  App logic
    const { token, setToken } = useContext(AppContext);
  
    const navigate = useNavigate();

    const logout = () => {
        setToken(null);
        setIsLogin(false);
        setUserInfo("");
            // delete from local storage
            // localStorage.removeItem('refreshToken');
        navigate("/");
    }
      
  return (
    <AppBar sx={{
        position: "static",
        // background: "none",
        boxShadow: "none",
    }}> 
        <Toolbar sx={{ justifyContent: "space-between"}}>
            {/* Left block */}
            <FlexBetween>
                <FlexBetween >
                    <Box display="flex" alignItems="center" gap="0.5rem">
                        <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary.main} onClick={()=>{ navigate("/")}}>
                            Auth
                        </Typography>
                    </Box>
                </FlexBetween>

                {/* Menu */}
                {isLogin && (
                    <Button  variant="h4" sx={{ my: 2, display: 'block' }} component={Link} to='/user' > 
                        User
                    </Button>
                )} 
                {isLogin && (
                    <Button  variant="h4" sx={{ my: 2, display: 'block' }} component={Link} to='/settings' > 
                        Settings
                    </Button>
                )}  
              
           </FlexBetween>

         {/* Right block */}
            <FlexBetween>
                <IconButton onClick={()=>dispatch(setMode())}>
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlined sx={{ fontSize: "25px" }}/>
                    ): (
                        <LightModeOutlined sx={{ fontSize: "25px" }}/> 
                    )}
                </IconButton>
              
            {/* user info box */}
                <FlexBetween>
                    <Button
                    onClick={handleClick}
                    variant="h4"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textTransform: "none",
                        gap: "1rem",
                    }}
                    >
                    {isLogin && (
                        <Box textAlign="left">
                            <Typography
                                fontSize="0.75rem"
                            >
                                login with email:
                            </Typography>
                            <Typography
                                fontWeight="bold"
                                fontSize="0.85rem"
                            >
                                { user }
                            </Typography>
                        </Box>
                        )}
                        {isLogin && (
                        <Box
                            component="img"
                            alt="profile"
                            src={imageLink}
                            height="32px"
                            width="32px"
                            borderRadius="50%"
                            sx={{ objectFit: "cover", backgroundColor: theme.palette.primary.light}}
                            />
                        )}
                        <ArrowDropDownOutlined
                            sx={{ fontSize: "25px" }}
                        />
                    </Button>
                    <Menu
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    >
                        <MenuItem onClick={()=>{handleClose(); logout()}}>Log Out</MenuItem>
                        {isLogin && <MenuItem onClick={()=>{handleClose(); navigate("/profile")}}>Profile</MenuItem>}
                    </Menu>
                </FlexBetween>
                {/* end user info box */}
            </FlexBetween>
        </Toolbar>
    </AppBar>
  )
}

export default Navbar;
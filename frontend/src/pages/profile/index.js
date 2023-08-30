import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import { Alert, Grid, Avatar, TextField, Box, FormControlLabel, Checkbox, Button, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
// import Auth from "auth/Auth";
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

import axios from "axios";

const Profile = (props) => {
    
    const [msg, setMsg] = useState("");
    const { isLogin, setIsLogin, userinfo, setUserInfo, token, setToken } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [userOrg, setUserOrg] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isDeleteAlert, setIsDeleteAlert] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isButton, setIsButton] = useState(true);


    // regular exp for email
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //web page title for browser
    const title = props.title;
    useEffect(() => {
      document.title = title;

    },[]);
   
    //theme
    const theme = useTheme();
    const navigate = useNavigate();
    
    // requests
    const getUserInfoByEmail = async (email) => {
 
    console.log("Button get info by email")
    // -> request by email
      try {
          const res = await axios.get(`/users/user/${email}`);
          if (res.status === 200) {
              console.log(res.data);
              setId(res.data.id);
              setUserInfo(res.data.email);
              
              setUserOrg(res.data.organizations);
              setMsg("");
          
          }
      } catch (err) {
      console.log(err);
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
        setIsButton(false);
      } else {
        setMsg("Wrong email format!");
        setEmail(address); 
        setIsButton(true);
      };
    }
    
    // update email
    const handleClick = async (event) => {
        event.preventDefault();
        setMsg("");
        console.log("Button update");
        try {
            const res = await axios.put(`/users/user/update`, {email: userinfo, new_email: email});
            if (res.status === 200) {
                console.log(res.data);
              setUserInfo(res.data.email);
              setEmail("");
              setMsg("");
            
            }
        } catch (err) {
        console.log(err);
        setMsg(err.response.data.msg); // to show in the same part
        }
    }

// Delete user profile
    const deleteUserProfile = async (event) => {
      console.log("Button delete");
      setIsDeleteAlert(true);
      if (confirmDelete && password?.length>2) {
        console.log("delete start");
          // -> Delete user
        try {
          const res = await axios.post(`/users/delete-user`, { email: userinfo, password, command:"deleteuser" });
          if (res.status === 200) {
              console.log(res.data);
              // // clear and exit
              setToken(null);
              setIsLogin(false);
              setUserInfo("");
              // delete from local storage
              // localStorage.removeItem('refreshToken');
              navigate("/");
          }
        } catch (err) {
          console.log(err);
          setMsg(err.response.data.msg); // to show in the same part
        }
      } else { return }
    }

    useEffect(()=>{
      userinfo && getUserInfoByEmail(userinfo);
        // if (token) {
        //     const payload = jwt_token(token);
        //     console.log("payload=>", payload);
        //     setEmail(payload.userinfo.email);
        //     setId(payload.userinfo.user_id);
        console.log("useEffect")
        // }
    },[]);



    return(
        <Box m="1.5rem 2.5rem">
            <Header title="PROFILE" subtitle="Information" />
            { msg.length > 1 && <Alert severity="warning">{msg}</Alert>}
            
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
    
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            User information
          </Typography>
          {/* <Grid container spacing={2}>
            <Grid item xs={12}> */}
                <Typography>
                    ID: {id}
                </Typography> 
            {/* </Grid>
            <Grid item xs={12}> */}
                <Typography>
                    E-mail: {userinfo}
                </Typography> 
            {/* </Grid>
          </Grid> */}
            <Typography>
              Organization: {
              userOrg.length > 0
              ? 
              <ul>
                  {userOrg.map((org, index) => (
                  <li key={index}>{org}</li>
                  ))}
              </ul>
              :"No"}
            </Typography> 
          <Button
              // fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={()=>{getUserInfoByEmail(userinfo)}}
            >
              Update Profile info from DB
            </Button>
          {/* Change name */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOpenOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            Change Email 
          </Typography>
      
           <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="New email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange ={ handleChangeEmail } // add check of format  
                  onBlur={()=>{setMsg("")}}
                />
              </Grid>
              
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
              disabled={isButton}
            >
              Change
            </Button>
            
          </Box>     
   
     
        
           {/* Delete user */}
           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOpenOutlinedIcon />
          </Avatar>
           <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
             
              
              <Grid item xs={12}>
                <Typography variant="h5">
                  Delete account  
                </Typography>
              </Grid>
            </Grid>
            { isDeleteAlert && (
            
            <Grid item xs={12}>
               <Alert severity="warning">This is a warning alert — check it out!</Alert>
                <FormControlLabel onChange ={(e) => {setConfirmDelete(!confirmDelete)}}
                  control={
                <Checkbox value="on" checked={confirmDelete}  />}
                  label="I would like to delete account"
                />
                 {/* <Grid item xs={12}> */}
                <TextField
                  fullWidth
                  id="password"
                  label="password"
                  name="password"
                  required={true}
                  value={password}
                  autoComplete='off'
                  onChange ={(e) => setPassword(e.target.value)}
                />
              {/* </Grid> */}
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={()=>{setConfirmDelete(false); setPassword(""); setIsDeleteAlert(false)}}
                    >
             Cancel
            </Button>
              </Grid>
            )}
            {email != "demo@demo.com" ? (
            <Button
              
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={()=>deleteUserProfile()}
            >
              Delete account
            </Button>
            ) : (
              <Typography>
                    Register to use this functions
              </Typography> 
            )
          }
          </Box>          

        </Box>
      
                
          
      </Box>
    )
}

export default Profile;
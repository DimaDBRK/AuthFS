import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import { Alert, Grid, Link ,Avatar, TextField, Box, MenuItem, InputLabel, Select, FormControl, FormControlLabel, Checkbox, Button, Typography, useTheme, FormHelperText } from "@mui/material";
import Header from "components/Header";
// import Auth from "auth/Auth";
import Container from '@mui/material/Container';
import jwt_token from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

import axios from "axios";

const Settings = (props) => {
  // organization
  const [org, setOrganization] = useState("");
  const [orgList, setOrgList] = useState([]);
  
  const [msg, setMsg] = useState("");
   
  const { isLogin, setIsLogin, userinfo, setUserInfo, token, setToken } = useContext(AppContext);
    
  const [id, setId] = useState(null);
    const [userOrg, setUserOrg] = useState([]);
    
    const [email, setEmail] = useState(userinfo? userinfo : null);
    const [password, setPassword] = useState("");
    const [isDeleteAlert, setIsDeleteAlert] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDeleteButton, setIsDeleteButton] = useState(true);
    //web page title for browser
    const title = props.title;
    useEffect(() => {
      document.title = title;
    },[]);
   
    //theme
    const theme = useTheme();
  
    const navigate = useNavigate();
    
    // get organization list
     useEffect(()=>{
        getOrganizations();
        // console.log('res=>',reports);
      }, [])
      
    const getOrganizations = async () =>{
      try {
        const res = await axios.get(`/organizations`);
        console.log('res=>',res.data.organizations);
        setOrgList(res.data.organizations);
        setMsg("");
      } catch (err) {
        setMsg(err.response.data.msg);
        console.log(err.response.data.msg);
      }
    }

    // select organization
    const handleChangeOrganization = (event) => {
      setOrganization(event.target.value);
      checkDeleteButton();
    };

    // old
    const getUserInfoByEmail = async (email) => {
 
    console.log("Button get info by email")
    // -> request by email
      try {
          const res = await axios.get(`/users/user/${email}`);
          if (res.status === 200) {
              console.log(res.data);
              setEmail(res.data.name);
              setMsg("");
          
          }
      } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
      }
    }
    
    const handleClick = async (event) => {
        event.preventDefault();
       
        console.log("Button update");
        try {
            const res = await axios.put(`/users/user/${email}`, {email});
            if (res.status === 200) {
                console.log(res.data);
                // setName(res.data.name);
                // setProfileIsDeveloper(res.data.isdeveloper);
                // setMsg("");
            
            }
        } catch (err) {
        console.log(err);
        setMsg(err.response.data.msg); // to show in the same part
        }
    }

    // open organization management
    const openOrganizationManagement = () => {
      console.log("Button manage organization");
      setIsDeleteAlert(true);
    }

    // delete button
    const checkDeleteButton = (res) => {
      // setIsDeleteButton(true);
      console.log(res);
      if (res) {
        setIsDeleteButton(false);
      } else {
        setIsDeleteButton(true);
      }
    }

    const deleteOrganization = async (event) => {
        // event.preventDefault();
        console.log("Button delete");
        // setIsDeleteAlert(true);
        if (confirmDelete) {
            console.log("delete start");
            // -> Login
            try {
                const res = await axios.post(`/users/user/deleteprofile`, { email, password });
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
        } else { return}
   
    }





    useEffect(()=>{
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
            <Header title="SETTINGS" subtitle="Organization Management" />
            { msg != "" && <Alert severity="warning">{msg}</Alert>}
            <Box>
              <FormControl sx={{ mt: "1rem", minWidth: 150 }}>
                <InputLabel id="select-organization">Organization</InputLabel>
                <Select
                  labelId="select-organization"
                  value={org}
                  label="Organization"
                  onChange={handleChangeOrganization}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  { orgList.length > 0 && (orgList.map(item => {
                    return (
                      <MenuItem value={item}>{item}</MenuItem>
                    );
                    })
                  )}
                </Select>
                <FormHelperText>Select Organization</FormHelperText>              
              </FormControl>
              
              <Button
              variant="contained"
              sx={{ mt: 3, mb: 2, mx: 3}}
              onClick={()=>{getUserInfoByEmail(id)}}
              >
                Show users
              </Button>

            </Box>

            {/* Manage organizations */}
            <Box sx={{
              marginTop: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: 400,
              px: 2,
              py: 1,
              width: '100%'}}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOpenOutlinedIcon />
              </Avatar>
              <Box component="form" noValidate sx={{ mt: 3 }}>
              { isDeleteAlert && (
                <Grid item xs={12}>
                  <Typography variant="h5">
                    Manage organization 
                    <Button
                      // fullWidth
                      variant="contained"
                      sx={{ mt: 1, mb: 1, mx: 3}}
                      onClick={()=>{setConfirmDelete(false); setPassword(""); setIsDeleteAlert(false)}}
                    >
                    Close
                    </Button>
                  </Typography>
                 
                  <Alert severity="warning">Select organization to delete!</Alert>
                  <FormControlLabel 
                    onChange ={(e) => {const res = !confirmDelete; setConfirmDelete(res); checkDeleteButton(res)}}
                    control={
                    <Checkbox value="on" checked={confirmDelete} />
                    }
                    label="I would like to delete this organization"
                  />
                
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

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={ () => deleteOrganization() }
                    disabled={isDeleteButton}
                  >
                    Delete organization
                  </Button>
                </Grid>
              )}

                { !isDeleteAlert && (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={ () => openOrganizationManagement() }
                >
                  Manage organization
                </Button>
                )}
              </Box>          
            </Box>
           


           {/* Old */}
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
           <Typography component="p" variant="h6">
            {msg}
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          {/* <Grid container spacing={2}>
            <Grid item xs={12}> */}
                <Typography>
                    User ID: {id}
                </Typography> 
            {/* </Grid>
            <Grid item xs={12}> */}
                <Typography>
                    E-mail: {email}
                </Typography> 
            {/* </Grid>
          </Grid> */}
          {/* Change name */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOpenOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            Change Email 
          </Typography>
          { email != "demo@demo.com" ? (
           <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange ={(e) => setEmail(e.target.value)} // add check of format  
                />
              </Grid>
              
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
            >
              Save changes
            </Button>
            
          </Box>     
          )
        : (
          <Typography>
                Register to use this functions
          </Typography> 
        )
        }
  

        </Box>
      
                
          
      </Box>
    )
}

export default Settings;
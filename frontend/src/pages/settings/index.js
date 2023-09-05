import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import { Alert, Grid, Link ,Avatar, TextField, Box, MenuItem, InputLabel, Select, FormControl, FormControlLabel, Checkbox, Button, Typography, useTheme, FormHelperText } from "@mui/material";
import Header from "components/Header";
import UsersGrid from "components/UsersGrid";
// import Auth from "auth/Auth";
import Container from '@mui/material/Container';
import jwt_token from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import axios from "axios";

const Settings = (props) => {
  // organization
  const [org, setOrganization] = useState("");
  const [orgList, setOrgList] = useState([]);
  
  const [msg, setMsg] = useState("");
   
  const { isLogin, setIsLogin, userinfo, setUserInfo, token, setToken } = useContext(AppContext);
    
  const [id, setId] = useState(null);
  const [usersData, setUsersData] = useState([]);
    
  const [newOrg, setNewOrg] = useState("");
  const [isDeleteAlert, setIsDeleteAlert] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleteButton, setIsDeleteButton] = useState(true);
  const [isAddNewButton, setIsAddNewButton] = useState(true);

    

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
      setConfirmDelete(false);
      checkDeleteButton(false);
      
    };

    // get users list by organization
    const getUsersByOrg = async (orgName) => {
 
    console.log("Button get users by org")
    // -> request by email
      try {
          const res = await axios.get(`get-users-by-org?org_name=${orgName}`);
          if (res.status === 200) {
              console.log(res.data.data);
              setUsersData(res.data.data)
              setMsg("");
          
          }
      } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
      }
    }
    
//  add new organization
    const handleClickAddNew = async (event) => {
        event.preventDefault();
       
        console.log("Button new=>", newOrg.trim());
        try {
            const res = await axios.post(`/create-org`, {"name": newOrg.trim(), "author": userinfo});
            if (res.status === 200 || res.status === 201) {
                console.log(res.data);
                setMsg(res.data.msg);
                setOrgList(res.data.organizations);
            }
        } catch (err) {
        console.log(err);
        setMsg(err.response.data.msg); // to show in the same part
        }
    }

    // change new org name
    const handleChangeNewOrganization = (event) => {
      const newName = (event.target.value).trimStart();
      setMsg("");
      setNewOrg(newName);
      if (newName != "" && newName.trim().length < 80) {
        
        setIsAddNewButton(false)
      } else {
        setIsAddNewButton(true)
        setMsg("Wrong or empty new organization name!");

      }
      
    }

    // open organization management
    const openOrganizationManagement = () => {
      console.log("Button manage organization");
      setIsDeleteAlert(true);
      setMsg("");
    }

    // delete button
    const checkDeleteButton = (res) => {
      // setIsDeleteButton(true);
      console.log(res);
      if (res && org != "") {
        setIsDeleteButton(false);
      } else {
        setIsDeleteButton(true);
      }
    }

    const deleteOrganization = async (event) => {
      console.log("Button delete, org name=>", org);
        if (confirmDelete) {
          // -> Delete Org
          try {
                const res = await axios.delete(`/delete-org?name=${org}`);
                if (res.status === 200) {
                    console.log(res.data);
                    setMsg(res.data.msg);// // clear and exit
                    setOrgList(res.data.organizations);
                    setUsersData([])
                }
            } catch (err) {
            console.log(err);
            setMsg(err.response.data.msg); // to show in the same part
            }
        } else { return}
    }

    return(
        <Box m="1.5rem 2.5rem">
            <Header title="ADMIN SETTINGS" subtitle="Organization Management" />
            { msg != "" && <Alert severity="warning">{msg}</Alert>}
            <Box>
              <FormControl sx={{ mt: "1rem", minWidth: 150 }}>
                <InputLabel id="select-organization">Organization</InputLabel>
                <Select
                  labelId="select-organization"
                  value={org}
                  label="Organization"
                  onChange={(e) => {handleChangeOrganization(e); getUsersByOrg(e.target.value)}}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  { orgList.length > 0 && (orgList.map((item, index) => {
                    return (
                      <MenuItem value={item} key={index}>{item}</MenuItem>
                    );
                    })
                  )}
                </Select>
                <FormHelperText>Select Organization</FormHelperText>              
              </FormControl>
              
              <Button
              variant="contained"
              sx={{ mt: 3, mb: 2, mx: 3}}
              onClick={()=>{ getUsersByOrg(org) }}
              >
                Update info
              </Button>

            </Box>
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
                  <PeopleAltOutlinedIcon />
              </Avatar>
            </Box>

            {/* User table */}
            <UsersGrid data = {usersData} isUserInOrg={true} org ={org} setMsg={setMsg} usersData={usersData} setUsersData={setUsersData} />
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
                      size="small"
                      sx={{ mt: 1, mb: 1, mx: 3}}
                      onClick={()=>{setConfirmDelete(false); setIsDeleteAlert(false); setMsg(""); setNewOrg("");}}
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
                
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={ () => deleteOrganization() }
                    disabled={isDeleteButton}
                  >
                    Delete organization
                  </Button>
                  {/* new organization */}
                  <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
                    Add organization to list
                  </Typography>
              
                    <TextField
                      fullWidth
                      id="new-org"
                      label="New Organization"
                      name="new-org"
                      value={newOrg}
                      onChange ={(event) => { handleChangeNewOrganization(event); }} // add check of format  
                      onBlur={()=>{setMsg("")}}
                    />
           
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isAddNewButton}
                    onClick={handleClickAddNew}
                  >
                    Save new 
                  </Button>
                  {/* end new organization */}
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
           
          </Box>

   
    )
}

export default Settings;
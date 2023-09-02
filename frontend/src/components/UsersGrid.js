import React from 'react'
import { Box, Button, Typography, useTheme, Autocomplete, TextField } from "@mui/material";
import Header from "components/Header";
import { DataGrid, GridToolbar, GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid"
import { useState, useEffect } from "react";
import axios from "axios";
import FlexBetween from 'components/FlexBetween';
import { Paragliding } from '@mui/icons-material';

const UsersGrid = (props) => {
  const theme = useTheme();
  
  //get data
  const [data, setData] = useState([]);
  const [freeUsersEmails, setFreeUserEmails] = useState([]);
  const [checkboxSelection, setCheckboxSelection] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [isAddSection, setIsAddSection] = useState(false);
  const [newUsers, setNewUsers] = useState([]);

  const setMsg = props.setMsg;
  const setUsersData = props.setUsersData;
  const usersData = props.usersData
  const org = props.org;
  const title = props.title;

  // delete
  const deleteUsersFromOrg = async (idList) => {
    console.log("Button delete users by org =>", props.org)
    const emails = idList.map(id => {return usersData.find(x => x.id === id).email})
    setMsg("");
    // -> delete
    try {
      const res = await axios.post(`/delete-user-from-org`, {"emails": emails, "name": props.org});
      if (res.status === 200 || res.status === 201) {
          console.log(res.data);
          setMsg(res.data.msg);
          console.log(res.data.data)
          setUsersData(res.data.data);
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
    }
  }
  
// add users
const addUsersToOrg = async (listOfUsers) => {
  console.log("button add");
  const emails = listOfUsers.map(item => {return item.email})
  setMsg("");
  // -> add to organization
  try {
    const res = await axios.post(`/add-users-to-org`, {"emails": emails, "name": props.org});
    if (res.status === 200 || res.status === 201) {
        console.log(res.data);
        setMsg(res.data.msg);
        console.log(res.data.data)
        setUsersData(res.data.data);
        setNewUsers([]);
    }
  } catch (err) {
    console.log(err);
    setMsg(err.response.data.msg); // to show in the same part
  }
}

  // on change add users input
const handleChangeAddUsers = (event, values) => {
  setNewUsers(values);
  setMsg("");
}

  useEffect(()=>{
    const userIsInOrg = []
    const userEmailsFree = []
    props.data.map((user) => {
      if (user.status === props.isUserInOrg) {
        userIsInOrg.push(user);
      } else {
        userEmailsFree.push(user);
      }
    }
    );
    setData(userIsInOrg);
    setFreeUserEmails(userEmailsFree);

    console.log('data=>',props.data);
    console.log('in Org=>',props.isUserInOrg);
  }, [props])

  
  //start 
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.1,
    },
    {
      field: "email",
      headerName: "User email",
      flex: 0.3,
    },
    
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 0.3,
    // },
  ]
 
  return (
  
    <Box
    
    // minHeight="40vh"
    width="450px"
    >
    { data.length > 0 ? (
    <Box>
      <Typography>
        Users in {org}
      </Typography>
      <DataGrid
        loading={data?.length < 1}
        getRowId={(row) => row.id}
        rows={data || []}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
          setMsg("");
          // console.log(rowSelectionModel)
        }}
      /> 
      { title != "User" && (
      <Button
        sx={{ mt: 1}}
        onClick={() => {setCheckboxSelection(!checkboxSelection); setMsg("")}}
        size="small"
      >
        Remove users 
      </Button>
      )}
      { (checkboxSelection) && (
      <Button
        sx={{ mt: 1 }}
        variant="contained"
        color="error"
        size="small"
        disabled={rowSelectionModel.length === 0}
        onClick={() => deleteUsersFromOrg(rowSelectionModel)}
      >
        Delete 
      </Button>
      )}
    </Box>)
    : (<Typography>
        No users in Organization 
      </Typography>
      )
    }
     {/* Add users section */}
     { !isAddSection && (
       <Button
        sx={{ mb: 1, mt: 1 }}
        size="small"
        onClick={()=>{setIsAddSection(true)}}
      >
        Add users
      </Button>
      )}
      { isAddSection && (
        <>
      <Typography variant="h5"  sx={{ mb: 1, mt: 1 }}>
        Add user to organization
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 1, mb: 1, mx: 1}}
          onClick={()=>{ setIsAddSection(false); setMsg("") }}
        >
        Close
        </Button>
        
      </Typography>
      {/* Multiple chose of free emails */}
      <Autocomplete
        multiple
        id="tags-standard"
        key={data} // Bool to rerender if changed
        options={freeUsersEmails ?? []}
        getOptionLabel={(option) => (!option ? "" : option?.email)}
        // defaultValue={freeUsersEmails[0]}
        filterSelectedOptions
        values={newUsers}
        onChange={ handleChangeAddUsers }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Choose users"
            placeholder="Email"
                    
          />
        )}
      />
      <Button
          variant="contained"
          color="success"
          size="small"
          sx={{ mt: 1, mb: 1, mx: 1}}
          onClick={()=>{ addUsersToOrg(newUsers) }}
          disabled={newUsers.length === 0}
        >
        Add
        </Button>
      </>
      )}
    </Box>
  )
}

export default UsersGrid;
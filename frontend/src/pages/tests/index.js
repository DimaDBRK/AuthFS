import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import { Alert, Grid, Link ,Avatar, TextField, Box, MenuItem, InputLabel, Select, FormControl, FormControlLabel, Checkbox, Button, Typography, useTheme, FormHelperText } from "@mui/material";
import Header from "components/Header";
import UsersGrid from "components/UsersGrid";

import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import axios from "axios";

const Tests = (props) => {
 
  const [msg, setMsg] = useState("");
  const [isReport, setIsReport] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [reportHtml, setReportHtml] = useState('');
  
  const url = 'http://localhost:5000/report';
  
  //web page title for browser
  const title = props.title;
  useEffect(() => {
    document.title = title;
  },[]);
   
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  


  const startTest = async (command) => {
    setMsg("");
    setIsReport(false);
    setIsDownload(true);
    try {
      const res = await axios.post(`/run-tests`, {"command": command});
      if (res.status === 200) {
        setMsg(res.data.msg);
       

      // Open a new browser tab to display the HTML report
       
        setIsReport(true);
        setIsDownload(false);
      
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
    }
  }

  const  showReport = () => {
    console.log("go to =>", url);
    window.open(url, '_blank');
    setIsDownload(false);
    setIsReport(false);
  }

  return(
    <Box m="1.5rem 2.5rem">
      <Header title="TESTS" subtitle="Automation test cases" />
      { msg != "" && <Alert severity="warning">{msg}</Alert>}
      <Typography variant="h7" sx={{ mt: 1, mb: 1 }}>
        The tests encompass both backend and frontend automation test cases, implemented using Pytest. 
        For the frontend, Selenium WebDriver is utilized.
      </Typography>
        <Box sx={{  
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start'
          }}>
          <Typography variant="h7" sx={{ mt: 1, mb: 1 }}>
            API:
          </Typography>
          <Button
              variant="contained"
              sx={{ mt: 3, mb: 2, mx: 1 }}
              onClick={ () => startTest("api") }
          >
            Start API test
          </Button>
         
          <Typography variant="h7" sx={{ mt: 1, mb: 1 }}>
            Frontend:
          </Typography>
          <Button
              variant="contained"
              sx={{ mt: 3, mb: 2, mx: 1  }}
              onClick={ () => startTest("front") }
          >
            Start Frontend
          </Button>
          { isDownload && (
          <Box sx={{  
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',}}
          >
            <Typography variant="h7" sx={{ mt: 1, mb: 1 }}>
              DOWNLOADING...
            </Typography>
            <CircularProgress />
          </Box>)}
          { isReport && (<>
          <Typography variant="h7" sx={{ mt: 1, mb: 1 }}>
            Frontend:
          </Typography>
          <Button
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2, mx: 1  }}
              onClick={ () => showReport() }
          >
            Show report
          </Button>
          </>)}

        </Box>          
    </Box>
  )
}

export default Tests;
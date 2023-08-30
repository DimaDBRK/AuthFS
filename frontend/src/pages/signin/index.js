import { useEffect } from "react";
import LogIn from 'components/LogIn'; 
import FlexBetween from 'components/FlexBetween';
//MUI
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material';

const SignIn = (props) => {
   
   const theme = useTheme();
   
   //web page title for browser
   const title = props.title;
   useEffect(() => {
    document.title = title;
    }, []);
   
  return (
    <>
      <Grid container component="main" sx={{ height: '85vh' }} >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          display="flex" justifyContent="center" alignItems="center"
          sx={{
          backgroundColor: theme.palette.primary.light,
          }}
        >
          <FlexBetween component="h1" variant="h2" fontWeight="bold" color={theme.palette.secondary.main} sx={{ display: { xs: 'none', md: 'flex'  }}}>
              Sign In
          </FlexBetween>
        </Grid> 
        <Grid item xs={12} sm={8} md={5}  elevation={6} square="true" display="flex" justifyContent="center" alignItems="center" >
          <LogIn />
        </Grid>   
      </Grid>
    </>
  )
}

export default SignIn;
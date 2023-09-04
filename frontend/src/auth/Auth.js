import { useEffect, useState, useContext } from "react";
import axios from "axios";

import { useNavigate,  useLocation, Navigate} from "react-router-dom";
import { AppContext } from "../App";
// import {newRefreshToken} from "helpers/newRefreshToken.js"

const Auth = (props) => {
    const { token, setToken } = useContext(AppContext);
    const { isLogin, setIsLogin } = useContext(AppContext);

    const [redirect, setRedirect] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

// update every time token used
    useEffect(()=> {
        verifyMyToken()
    },[]);

    const verifyMyToken = async () => {
        try {
             // set the Authorization header - token
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const res = await axios.get(`/verify`, { headers });
            //test
            console.log("check Token in Auth");
            console.log("res Status", res);
            if (res.status === 200) {
                setToken(res.data.access_token);
                return setRedirect(true);
            }
            console.log("check Token false");
            setRedirect(false);
            setIsLogin(false);
            setToken(null);
            navigate("/login", { state: { from: location }, replace: true }); //to dashboard 
           
            
        } catch(e) {
            console.log("error in check=>", e.response.status);
            // if 
            if  (e.response.status && [401, 403, 422].includes(e.response.status)) {
                console.log("error:", e.response.status, "try refresh");
     
                    setRedirect(false);
                    setIsLogin(false);
                    setToken(null);
                    navigate("/login", { state: { from: location }, replace: true }); //to dashboard 
         
            } else {
            console.log("check Token false, redirect to login");
           
            }

        }
    }



    console.log("redirect auth res:", redirect)
    return redirect ? props.children : <p>Problem with Auth</p>;
};

export default Auth;
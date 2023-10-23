import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { host } from '../../utils/base-endpoint';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const GoogleSignin = () => {
    let auth = useAuth();
    let { getToken, setToken, tokenDecoder, login } = auth;
    const { baseUrl } = host;
    const navigate = useNavigate();

    const sender = async (res) => {
        try {
            const payload = {
                clientId: res.clientId,
                token: res.credential
            }

            console.log(payload)
            const val = await axios.post(`${baseUrl}/api/google-signin`, { payload: payload });
            console.log("User successfully logged in");

            if (val && val?.data.status === "login successful") {
                setToken("access_token", val.data.accToken);
                setToken("refresh_token", val.data.renewToken);

                let appuser = tokenDecoder(getToken("access_token"));

                login(appuser);

                const { role } = appuser;

                if (role === "admin") {
                    return navigate('/admin/system', { replace: true })
                }
                else if (role === "client") {
                    return navigate('/auth/user', { replace: true })
                }
                else {
                    return navigate('/', { replace: true });
                }
            }

        } catch (err) {
            const { error } = err.response.data;
            console.log(error);
        }
    }

    
    
    return (
        <>
            <GoogleLogin
                onSuccess={(response) => {
                    console.log(response);
                    sender(response);
                }}
                type="outline"
                shape="circle"
                onError={() => console.log('Login Failed')}
            />
        </>
    );
};

export default GoogleSignin;
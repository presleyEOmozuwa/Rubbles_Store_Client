import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from '../../utils/base-endpoint';
import './User.css';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../services/user.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const UserDetails = () => {
    let [appuser, setUser] = useState({
        id: '',
        username: '',
        email: '',
        role: ''
    });

    let { id, username, email, role } = appuser;

    let auth = useAuth();

    let navigate = useNavigate();

    let { baseUrl } = host;

    let { httptoken, getToken, setToken } = auth;


    // REQUEST TO RETRIEVE A USER
    useEffect(() => {
        const token = getToken("access_token");
        getUser(`${baseUrl}/api/user`, { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.user) {
                setUser((state) => {
                    let user = res.data.user;
                    const clone = {
                        ...state,
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                    return clone;
                });
            }
        }).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, baseUrl, getToken, setToken, toast);
                }
            }
        });

    }, [httptoken, navigate, getToken, baseUrl]);


    return (
        <div className='container-fluid'>
            <div className='row mb-5'>
                <div className='col-lg-5'></div>
                <div className='col-lg-5'></div>
                <div className='col-lg-2 text-end'>
                    <span className='text-muted fw-bold'> Hi, {username} </span>
                </div>
            </div>
            <div className='row mb-4 justify-content-center mx-3'>
                <div className='col-lg-4 text-center'>
                    <h4 className='text-muted'> Profile Info</h4>
                    <div className='p-3 shadow-lg'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum</p>
                        <a className='fw-bold' href='/auth/user/update'>Profile</a>
                    </div>
                </div>
                <div className='col-lg-4 text-center'>
                    <h4 className='text-muted'> Login and Security</h4>
                    <div className='p-3 shadow-lg'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum</p>
                        <a className='fw-bold' href='#'>Login & Security</a>
                    </div>
                </div>
                <div className='col-lg-4 text-center'>
                    <h4 className='text-muted'> Payments</h4>
                    <div className='p-3 shadow-lg'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum</p>
                        <a className='fw-bold' href='#'>Payments</a>
                    </div>
                </div>
            </div>
            <div className='row mb-4 mx-3'>
                <div className='col-lg-4 text-center'>
                    <h4 className='text-muted'> Orders</h4>
                    <div className='p-3 shadow-lg'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum</p>
                        <a className='fw-bold' href='#'>Orders</a>
                    </div>
                </div>
                <div className='col-lg-4 text-center'>
                    <h4 className='text-muted'> Gift Cards</h4>
                    <div className='p-3 shadow-lg'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum</p>
                        <a className='fw-bold' href='#'>Gift Cards</a>
                    </div>
                </div>
                <div className='col-lg-4 text-center'>
                    <h4 className='text-muted'> Customer Service</h4>
                    <div className='p-3 shadow-lg'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum</p>
                        <a className='fw-bold' href='#'>Customer Service</a>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default UserDetails;
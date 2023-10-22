import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { host } from '../../utils/base-endpoint';
import { singleSubHistory } from '../../services/stripe.service'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const CheckoutSubSingle = () => {    
    let auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let { baseUrl } = host;

    let { session_id } = useParams();

    let sessionId = session_id.substring(11);

    let navigate = useNavigate();

    useEffect(() => {
        singleSubHistory(`${baseUrl}/api/checkout/success/single/${sessionId}`, { headers: httptoken(getToken("access_token")) }).then((res) => {
            if (res && res.data) {
                console.log(sessionId);
            }
        }).catch( async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, baseUrl, getToken, setToken, toast);
                }
            }
        });
        
    }, [navigate, httptoken, getToken, baseUrl])



    return (
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className='col-lg-3'></div>
                <div className='col-lg-6 text-center border p-4'>
                    <h4>Online Payment Was Successful</h4>
                    <div>
                        <p className='display-6'> Subscribed single item </p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum aspernatur facere! Similique dolores sequi repellendus assumenda, nobis enim, quod aspernatur numquam error eum iste?</p>
                    </div>
                    <span></span>
                </div>
                <div className='col-lg-3'></div>
            </div>
        </div>
    );
};

export default CheckoutSubSingle;
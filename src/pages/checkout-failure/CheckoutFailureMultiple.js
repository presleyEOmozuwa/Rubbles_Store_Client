import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { checkoutFailureMultipleHandler } from '../../services/stripe.service'
import { host } from '../../utils/base-endpoint';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const CheckoutFailureMultiple = () => {

    let auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let { session_id } = useParams();

    let sessionId = session_id.substring(11);

    let { baseUrl } = host;

    let navigate = useNavigate();

    useEffect(() => {
        checkoutFailureMultipleHandler(`${baseUrl}/api/checkout/failure/multiple/${sessionId}`, { headers: httptoken(getToken("access_token")) }).then((res) => {
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
        <div className='container'>
            <div className='row'>
                <div className='col-lg-4'></div>
                <div className='col-lg-4'>
                    <h2> Stripe Multiple Failure Page </h2>
                </div>
                <div className='col-lg-4'></div>
            </div>
        </div>
    );
};

export default CheckoutFailureMultiple;
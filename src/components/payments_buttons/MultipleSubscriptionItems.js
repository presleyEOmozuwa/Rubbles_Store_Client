import React from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from '../../utils/base-endpoint';
import { useAuth } from '../../context/AuthContext';
import { multipleSubHandler } from '../../services/stripe.service'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const MultipleSubscriptionItems = ({ products, content }) => {
    let auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let navigate = useNavigate();

    const { baseUrl } = host;


    const handleCheckout = () => {
        if (!getToken("access_token")) {
            toast.info("Login to continue");
        }
        else {
            // MULTIPLE SUBSCRIPTION ITEMS 
            const token = getToken("access_token");
            multipleSubHandler(`${baseUrl}/api/sub/multiple/create-checkout-session`, { products: products }, { headers: httptoken(token)}).then((res) => {
                if (res && res.data.url) {
                    window.location.href = res.data.url;
                }
            }).catch( async (err) => {
                console.log(err);
                const { error } = err.response.data;
                if (err.response) {
                    if (error === "access token expired") {
                        await tokenRenewalHandler(navigate, baseUrl, getToken, setToken, toast);
                    }
                    if(error === "product already exist on cart"){
                        toast.info(error);
                    }
                }
            });
            
        }
    }

    return (
        <>
            <button className='border px-4 py-1 ms-2 bg-danger text-white shadow' onClick={() => handleCheckout()}>{content}</button>
        </>
    );
};

export default MultipleSubscriptionItems;
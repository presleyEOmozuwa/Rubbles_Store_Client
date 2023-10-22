import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from '../../utils/base-endpoint';
import { useAuth } from '../../context/AuthContext';
import SubscriptionCart from './SubscriptionCart';
import { getCartItems } from '../../services/product.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';


const SubscriptionCartBuilder = () => {    
    const [subCartObj, setSubCartObj] = useState({ products: [] });
    const { products } = subCartObj;

    const [deletedProduct, setDeletedProduct] = useState({ });


    const auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let navigate = useNavigate();

    let { baseUrl } = host;

    // REQUEST TO GET ALL CART ITEMS
    useEffect(() => {
        const token = getToken("access_token");
        getCartItems(`${baseUrl}/api/sub/cart`, { headers: httptoken(token) }).then((res) => {
            console.log(res);
            if (res && res.data.cart) {
                setSubCartObj((state) => {
                    return {
                        ...state,
                        products: res.data.cart?.Products
                    }
                });
            }
        }).catch(async (err) => {
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

    }, [JSON.stringify(products), navigate,  deletedProduct._id, httptoken, getToken, baseUrl]);

    
    return (
        <SubscriptionCart products={products} initAmount={0} httptoken={httptoken} getToken={getToken} setToken={setToken} setDeletedProduct={setDeletedProduct} />
    );
};

export default SubscriptionCartBuilder;
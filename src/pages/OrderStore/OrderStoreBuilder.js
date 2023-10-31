import React, { useState, useEffect } from 'react';
import { host } from '../../utils/base-endpoint';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../services/order.service'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';
import OrderHistory from './OrderHistory.js';


const OrderStoreBuilder = () => {
    const [orderStore, setOrder] = useState({ orders: [] });

    const { orders } = orderStore;

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();

    const { baseUrl } = host;

    useEffect(() => {
        const token = getToken("access_token");
        getOrders(`${baseUrl}/api/order/history`, { headers: httptoken(token) }).then((res) => {
            if (res && res?.data.orderArchive) {
                setOrder((state) => {
                    console.log(res.data.orderArchive.orders);
                    return {
                        ...state,
                        orders: res.data.orderArchive.orders
                    }
                })
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

    }, [JSON.stringify(orders), navigate, httptoken, getToken, setToken, baseUrl]);
    
    return (
        <React.Fragment>
            {orders.map((order, i) => {
                return (
                    <OrderHistory key={i} order={order}/>
                )
            })}
        </React.Fragment>
    )

};

export default OrderStoreBuilder;
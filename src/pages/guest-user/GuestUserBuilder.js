import React, { useState, useEffect } from 'react';
import { host } from '../../utils/base-endpoint';
import axios from 'axios';
import GuestUser from './GuestUser';

const GuestUserBuilder = () => {
    let [products, setProducts] = useState([])

    let [deletedItem, setDeletedItem] = useState({ });

    let { baseUrl } = host;


    // REQUEST FOR ALL PRODUCTS ADDED TO CART BY USER
    useEffect(() => {
        const sender = async () => {
            try {
                const val = await axios.get(`${baseUrl}/api/shopping-cart/guestUser`, { withCredentials: true });

                if (val && val.data.cart) {
                    const cartProducts = val.data.cart?.products;
                    setProducts(cartProducts);
                }

            } catch (err) {
                const { error } = err.response.data;
                console.log(error);
            }
        }
        sender();
    }, [JSON.stringify(products), deletedItem._id, baseUrl]);

    return (
        <GuestUser products={products} initAmount={0} setDeletedItem={setDeletedItem}/>
    );

};

export default GuestUserBuilder;
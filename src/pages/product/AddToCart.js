import React from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from '../../utils/base-endpoint';
import { useAuth } from '../../context/AuthContext';
import { addItemToCart } from '../../services/product.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const AddToCart = ({ productId, typeOfItem }) => {

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();

    const { baseUrl } = host;

    const handleAddtoCart = async (event) => {
        event.preventDefault();
        if (!getToken("access_token")) {
            addItemToCart(`${baseUrl}/api/addtocart/guestUser`, { productId: productId }, { withCredentials: true }).then((res) => {
                if (res && res.data.status === "product successfully added to cart") {
                    navigate("/cart/guest");
                }
            }).catch(async (err) => {
                console.log(err);
                const { error } = err.response.data;
                if (err.response) {
                    console.log(error);
                }
            });
        }
        else {
            if (typeOfItem === "regular") {
                addItemToCart(`${baseUrl}/api/addtocart/loggedInUser`, { productId: productId }, { headers: httptoken(getToken("access_token")) }).then((res) => {
                    if (res && res.data.status === "product successfully added to cart") {
                        navigate("/auth/shoppingcart");
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
            }
            else {
                addItemToCart(`${baseUrl}/api/sub/addtocart`, { productId: productId }).then((res) => {
                    if (res && res.data.status === "product successfully added to cart") {
                        navigate("/auth/sub/shoppingcart");
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
            }

        }
    }


    return (
        <>
            <div className='text-center mt-3'>
                <button className='btn btn-primary rounded-0 shadow px-5 fw-bold' type='submit' onClick={(e) => handleAddtoCart(e)}>Add to Cart</button>
            </div>
        </>
    );
};

export default AddToCart;
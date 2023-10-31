import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { host } from '../../utils/base-endpoint';
import axios from 'axios';
import { toast } from 'react-toastify';
import { totalHandler } from '../../utils/helper';
import './GuestUser.css';

const GuestUser = ({ products, initAmount, setDeletedItem }) => {
    const [totalAmount, setTotalAmount] = useState(0);

    const { baseUrl } = host;


    const handleQty = (event, productId) => {
        const modified = products.map((p) => {
            if (productId === p._id) {
                p.quantity = parseInt(event.target.value)
            }
            return p;
        });

        let total = modified.reduce((sum, p) => {
            return sum + (p.quantity * p.newPrice)
        }, 0)

        setTotalAmount(total);
    }

    const handleCheckout = () => {
        toast.info("Login to checkout");
    }


    // REQUEST TO REMOVE AN ITEM FROM THE CART
    const handleDelete = async (event) => {
        try {
            event.preventDefault();
            const res = await axios.post(`${baseUrl}/api/delete-item/guestUser`, { productId: event.target.value }, { withCredentials: true });
            console.log(res.data);

            if (res && res.data.status === "product removed from cart successfully") {
                setDeletedItem(res.data.deletedItem);
            }

        } catch (err) {
            const { error } = err.response.data;
            console.log(error);
        }
    }


    if (products.length === 0) {
        return (
            <div className='container-fluid mt-3 p-3 vh-100 shared'>
                <div className='row'>
                    <div className='col-lg-9'>
                        <h1 className='fw-light text-center pt-2 align-self-center'>My Shopping Cart </h1>
                        <div className='text-center mt-4'>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum aspernatur facere! Similique dolores sequi repellendus assumenda, nobis enim, quod aspernatur numquam error eum iste?</p>
                        </div>
                    </div>
                    <div className='col-lg-3 text-center'>
                        <h2 className='fw-light m-0 text-muted'> Summary</h2>
                        <div className='text-center my-1'>
                            <p className='fw-bold m-0'> Items : {products?.length <= 1 ? products?.length + ' item' : products?.length + ' items'}</p>

                            <p className='mb-3'> Total : <span className='fs-5 text-success fw-bold'>${initAmount.toFixed(2)}</span></p>

                            <Link className='border px-4 py-2 bg-danger text-white fw-bolder shadow' to='/'> Checkout </Link>
                        </div>
                    </div>
                </div>
                <div className='row mt-4 show-cart'>
                    <div className='col-sm-3'></div>
                    <div className='col-sm-6 p-5 shadow empty'>
                        <p className='display-5 mb-2'> Your Cart is Empty! </p>
                        <Link className='me-1 border py-1 px-3 bg-danger text-white fw-bolder shadow' to='/'> Shop Now </Link>
                    </div>
                    <div className='col-sm-3'></div>
                </div>

            </div>
        )
    }
    else if (products.length >= 1) {
        return (
            <div className='container-fluid mt-3 p-3 vh-100 shared'>
                <div className='row'>
                    <div className='col-lg-9'>
                        <h1 className='fw-light text-center pt-2 align-self-center'>My Shopping Cart </h1>
                        <div className='text-center mt-4'>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum aspernatur facere! Similique dolores sequi repellendus assumenda, nobis enim, quod aspernatur numquam error eum iste?</p>
                        </div>
                    </div>
                    <div className='col-lg-3 text-center'>
                        <h2 className='fw-light m-0 text-muted'> Summary</h2>

                        <p className='fw-bold m-0'> Items : {products?.length <= 1 ? products?.length + ' item' : products?.length + ' items'}</p>


                        <p className='mb-2 ms-3'> Total : <span className='fs-5 text-success fw-bold'>${totalAmount === 0 ? totalHandler(products).toFixed(2) : totalAmount.toFixed(2)}</span></p>

                        <button className='border px-4 py-1 ms-2 bg-danger text-white shadow' onClick={() => handleCheckout()}>Checkout</button>
                    </div>
                </div>

                <div className='row p-4 mt-4'>
                    {products?.map((p, i) => {
                        return (
                            <div key={i} className='col-lg-4 sect p-3 rounded shadow bg-white'>
                                <div className='border shadow mb-3'>
                                    <img src={p.imageUrl} width="100%" alt={p.prodName} />
                                </div>
                                <div className='mb-1'>
                                    <span className='m-3'> Name </span>
                                    <span className='m-3 text-primary fw-bold'> {p.prodName} </span>
                                </div>
                                <div className='mb-1'>
                                    <span className='mx-3'> Price </span>
                                    <span className='mx-3 fw-bold'> ${p.price} </span>
                                </div>
                                <div className='mb-1'>
                                    <span className='m-3'> Coupon </span>
                                    <span className='ms-0'> {p.coupon}% </span>
                                </div>
                                <div className='mb-1'>
                                    <span className='m-3'> New Price </span>
                                    <span className='m-3 fw-bold'> ${p.newPrice} </span>
                                </div>
                                <span className='mx-3'>Quantity</span>
                                <select className='me-5 ms-1 qty' onChange={(e) => handleQty(e, p._id)}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q, index) => {
                                        return (
                                            <option key={index} value={q}>{q}</option>
                                        )
                                    })}
                                </select>
                                <button className='btn btn-danger rounded shadow p-0 px-2  fw-bold' type='submit' value={p.id} onClick={(e) => handleDelete(e)}> del</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
};

export default GuestUser;
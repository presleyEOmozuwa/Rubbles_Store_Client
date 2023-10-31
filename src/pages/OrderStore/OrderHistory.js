import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = ({order}) => {
    const navigate = useNavigate();

    const handleBuyAgain = (event) => {
        event.preventDefault();
        navigate("/auth/show");

    }



    return (
        <React.Fragment>
            <div className='container shadow mt-3 p-4 pt-1 justify-content-center'>
                <div className='row justify-content-center mb-3 bg-light pt-0'>
                    <div className='col-lg-3'>
                        <small>ORDER PLACED</small>
                        <p><small>{order.orderplaced}</small></p>
                    </div>
                    <div className='col-lg-3'>
                        <small>SHIP TO</small>
                        <p>{order.customerAddress?.name}</p>
                    </div>
                    <div className='col-lg-3'>
                        <small>ESTIMATED DELIVERY</small>
                        <p> <small>DATE</small> : {order.estimatedDeliveryDate}</p>
                    </div>
                    <div className='col-lg-3'></div>
                </div>
                {order.cartItems?.map((product, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className='row justify-content-center mb-4'>
                                <div className='col-lg-3 mt-1'>
                                    <img className='img-fluid' src={product.imageUrl} alt="sofa display" width="55%" />
                                </div>
                                <div className='col-lg-4'>
                                    <div className='mb-1'>
                                        <span className='text-success fw-semibold'>{product.des}</span>
                                    </div>
                                    <div>
                                        <button className="btn btn-white p-0 px-2 py-1 border me-1" onClick={(e) => handleBuyAgain(e)}> Buy it again</button>
                                        <button className="btn btn-white p-0 px-2 py-1 border"> <small> View your item </small></button>
                                    </div>
                                </div>
                                <div className='col-lg-5'></div>
                            </div>
                        </React.Fragment>
                    )
                })}
                {/* <div className='row mt-4'>
                    <div className='col-lg-3'>
                        <button className="btn btn-white p-0 px-5 py-1 border me-1" onClick={(e) => handleGoToOrders(e)}> Go to orders</button>
                    </div>
                    <div className='col-lg-2'>
                    </div>
                    <div className='col-lg-7'></div>
                </div> */}
            </div>
        </React.Fragment>
    );
};

export default OrderHistory;
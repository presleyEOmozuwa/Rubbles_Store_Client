import React, { useState, useEffect, useRef } from 'react';
import { host } from '../../utils/base-endpoint';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrder } from '../../services/order.service'
import { totalBeforeTax, totalAfterTax } from './helper'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import './OrderStore.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

const OrderDetails_Invoice = () => {
    const [order, setOrder] = useState({});
    const pdfRef = useRef();

    const params = useParams();
    const { sessionId } = params;

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();

    const { baseUrl } = host;

    const handleDownloadInv = async (event) => {
        event.preventDefault();
        const input = pdfRef.current
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('img/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('invoice.pdf');

    }

    useEffect(() => {
        console.log(pdfRef);
        const token = getToken("access_token");
        getOrder(`${baseUrl}/api/order-details/${sessionId}`, { headers: httptoken(token) }).then((res) => {
            if (res && res?.data.order) {
                console.log(res?.data.order)
                setOrder(res.data.order);
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

    }, [navigate, httptoken, getToken, setToken, baseUrl]);


    return (
        <div className='container' ref={pdfRef}>
            <div className='row mb-3 p-2'>
                <div className='col-lg-4'>
                    <h4>Invoice</h4>
                    <div>
                        <small className='me-2 fw-semibold'> Invoice number </small>
                        <small> {order.orderNumber} </small>
                    </div>
                    <div>
                        <small className='me-2 fw-semibold'> Date of issue </small>
                        <small> {order.orderplaced} </small>
                    </div>
                    <div>
                        <small className='me-2 fw-semibold'> Date due </small>
                        <small> {order.orderplaced} </small>
                    </div>

                </div>
                <div className='col-lg-5'></div>
                <div className='col-lg-3'>
                    <button className="btn btn-white p-0 px-3 border me-1 " onClick={(e) => handleDownloadInv(e)}><small> Download invoice </small></button>
                </div>
            </div>
            <div className='row mb-3 p-2'>
                <div className='col-lg-2'>
                    <p className='fw-semibold'>Rubble Tech Inc</p>
                </div>
                <div className='col-lg-3'></div>
                <div className='col-lg-4'>
                    <span className='fw-semibold'>Bill to</span>
                    <p>{order.customerAddress?.name}</p>
                </div>
                <div className='col-lg-3'></div>
            </div>
            <div className='row mb-3 p-3'>
                <div className='col-lg-8'>
                    <h5>${order.orderTotal} due {order.orderplaced}</h5>
                </div>
                <div className='col-lg-4'></div>
            </div>
            {order.cartItems?.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        <div className='row mb-3 p-2'>
                            <hr />
                            <div className='col-lg-3 mb-3'>
                                <span className='fw-semibold'>Description</span>
                                <p className='m-0 text-success fw-semibold'>{item.prodName}</p>
                            </div>
                            <div className='col-lg-3 mb-3'>
                                <span className='fw-semibold'>Qty</span>
                                <p className='ms-2'>{item.quantity}</p>
                            </div>
                            <div className='col-lg-3'>
                                <span className='fw-semibold'>Unit price</span>
                                <p>${item.newPrice}</p>
                            </div>
                            <div className='col-lg-3'>
                                <span className='fw-semibold'>Amount</span>
                                <p>${(item.newPrice * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    </React.Fragment>
                )
            })}
            <div className='row'>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'></div>
            </div>
            <div className='row'>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'>
                    <span className='me-5 fw-semibold'>Subtotal:</span>
                </div>
                <div className='col-lg-3'>
                    <span> ${order.orderTotal} </span>
                </div>

            </div>
            <div className='row'>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'>
                    <span className='me-5 fw-semibold'>Shipping & Handling:</span>
                </div>
                <div className='col-lg-3'>
                    <span> ${order.shipping} </span>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'>
                    <span className='me-5 fw-semibold'>Total before tax:</span>
                </div>
                <div className='col-lg-3'>
                    <span> ${totalBeforeTax(order.orderTotal, order.shipping)} </span>
                </div>

            </div>
            <div className='row'>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'>
                    <span className='me-5 fw-semibold'>Estimated tax:</span>
                </div>
                <div className='col-lg-3'>
                    <span> ${order.tax}</span>
                </div>

            </div>
            <div className='row'>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'></div>
                <div className='col-lg-3'>
                    <span className='me-5 fw-semibold'>Grand total:</span>
                </div>
                <div className='col-lg-3'>
                    <span> ${totalAfterTax(order.orderTotal, order.shipping, order.tax)} </span>
                </div>

            </div>
        </div>
    );
};

export default OrderDetails_Invoice;
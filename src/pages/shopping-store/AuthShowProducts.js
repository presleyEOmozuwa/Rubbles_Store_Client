import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from '../../utils/base-endpoint';
import { getAllProducts } from '../../services/product.service';

const AuthShowProducts = () => {
    const [products, setProducts] = useState([]);
    
    let navigate = useNavigate();
    
    let { baseUrl } = host;

    const handleClick = (event) => {
        navigate(`/product/${event.target.value}`);
    }

    // REQUEST TO GET ALL PRODUCTS FOR DISPLAY
    useEffect(() => {
        getAllProducts(`${baseUrl}/api/product-list`).then((res) => {
            console.log(res.data);
            if (res.data.products) {
                setProducts(res.data.products)
            }

        }).catch((err) => {
            if(err.response){
                const { error } = err.response.data;
                console.log(error);
            }
        });

    }, [baseUrl]);

    return (
        <div>
            <div className='container-fluid pt-4'>
                <div className='d-flex justify-content-center align-items-center'>
                    <h1 className='fw-light display-5 text-muted'> Rubbles Brand Gallery </h1>
                </div>
                <div className='row mx-3 p-3'>
                    {products.map((product, index) => {
                        return (
                            <div key={index} className='col-lg-4 p-4 shadow sect mb-2 rounded'>
                                <div className='border shadow mb-3'>
                                    <img className='img-fluid' src={product.imageUrl} width="100%" alt={product.prodName} />
                                </div>

                                <p className='card-text'><span className='fw-bold'>Name : </span> {product.prodName} </p>

                                <p > <span className='fw-bold'>Price : </span>{product.price}</p>

                                <p className='mb-2'> <span className='fw-bold'>Coupon : </span> {product.coupon}% off original price </p>

                                <div className="d-grid gap-2 col-10 rounded-0 shadow mx-auto">
                                    <button className="btn btn-primary" type="button" onClick={(e) => handleClick(e)} value={product._id}>Show Info</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default AuthShowProducts;
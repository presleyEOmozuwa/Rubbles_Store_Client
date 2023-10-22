import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import './Product.css'
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { host } from '../../utils/base-endpoint';
import { getProduct, getProductWithCategories } from '../../services/product.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';

const ProductEditForm = () => {
    const [product, setProduct] = useState({ id: '', prodName: '', price: 0, coupon: 0, newPrice: 0, priceId: '', imageUrl: '', quantity: 0, typeOfItem: '', des: '' });

    const [categoryObj, setCategoryObj] = useState({categoryGroup: []})

    const { categoryGroup } = categoryObj;

    const { id, prodName, price, priceId, coupon, imageUrl, typeOfItem, des } = product;
    
    const params = useParams();
    const { productId } = params;
    
    const auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let { baseUrl } = host;

    const navigate = useNavigate();

    const initialValues =
    {
        prodName: '',
        price: 0,
        priceId: '',
        coupon: 0,
        stockQty: 0,
        des: '',
        imageUrl: '',
        typeOfItem: '',
        categories: [...categoryGroup]
    }

    const onSubmit = async (payload, onSubmitProps) => {
        const token = getToken("access_token");
        createProduct(`${baseUrl}/api/product-form/payload`, payload, { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.status === "product successfully created") {
                onSubmitProps.resetForm();
                navigate("/admin/productlist");
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


    useEffect(() => {
        getProduct(`${baseUrl}/api/product-details/${productId}`).then((res) => {
            if (res && res.data.product) {
                setProduct((state) => {
                    const data = res.data.product;
                    const clone = {
                        ...state,
                        id: data._id,
                        prodName: data.prodName,
                        price: data.price,
                        coupon: data.coupon,
                        priceId: data.priceId,
                        stockQty: data.stockQty,
                        des: data.des,
                        quantity: data.quantity,
                        typeOfItem: data.typeOfItem,
                        imageUrl: data.imageUrl
                    }
                    return clone;
                });
            }

        }).catch( async (err) => {
            if(err.response){
                const { error } = err.response.data;
                console.log(error);
            }
        });

    }, [productId, baseUrl]);

    useEffect(() => {
        const token = getToken("access_token");
        getProductWithCategories(`${baseUrl}/api/product/with/categories/${productId}`, { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.categories) {
                setCategoryObj((state) => {
                    const clone = {
                        ...state,
                        categoryGroup: res.data.categories
                    }
                    return clone;
                });
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

    }, [JSON.stringify(categoryGroup), httptoken, getToken, baseUrl, productId]);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-3'></div>
                <div className='col-lg-6'>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    >
                        {(formik) => {
                            const handleCategory = (event) => {
                                const { target } = event;
                                const { checked, value } = target;
                                formik.values.categories.forEach((obj) => {
                                    if(obj._id === value){
                                        obj.ischecked = checked;
                                        return;
                                    }
                                })
                            }


                            return (
                                <Form>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='prodName'>Name</label>
                                        <Field name="prodName">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="text" id="prodName" value={prodName}/>
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='price'>Price</label>
                                        <Field name="price">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="number" id="price" value={price}/>
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='priceId'>PriceId</label>
                                        <Field name="priceId">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control'  type="text" id="priceId" value={priceId}/>
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='coupon'>Coupon</label>
                                        <Field name="coupon">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control'  type="number" id="coupon" value={coupon}/>
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='stockQty'>StockQty</label>
                                        <Field name="stockQty">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control'  type="number" id="stockQty" value={stockQty}/>
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='des'>Description</label>
                                        <Field name="des">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control'  type="text" id="des" value={des}/>
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='imageUrl'>ImageUrl</label>
                                        <Field name="imageUrl">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control'  type="text" id="imageUrl" value={imageUrl}/>
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='typeOfItem'>TypeOfItem</label>
                                        <Field as="select" name="typeOfItem">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <option value="Regular">Regular</option>
                                                        <option value="Subscription">Subscription</option>
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-check mb-3'>
                                        {categoryGroup.map((cat, i) => {
                                            return (
                                                <React.Fragment key={i}>
                                                    <input className="form-check-input" type="checkbox" id={cat.catName} defaultChecked={cat.ischecked} onChange={(e) => handleCategory(e)} value={cat._id}/>
                                                    <label htmlFor={cat.catName}>{cat.catName}</label>
                                                </React.Fragment>
                                            )
                                        })}
                                    </div>
                                    <div className='text-center'>
                                        <button className='btn btn-primary rounded-0 shadow px-3 fw-semibold' type='submit'>Update</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
                <div className='col-lg-3'></div>
            </div>
        </div>
    );
};

export default ProductEditForm;
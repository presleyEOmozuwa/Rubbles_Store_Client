import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './Product.css'
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { host } from '../../utils/base-endpoint';
import { getAllCategories } from '../../services/category.service';
import { createProduct } from '../../services/product.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';


const ProductFormData = () => {
    const [categoryObj, setCategoryObj] = useState({ categoryArray: [] });

    const { categoryArray } = categoryObj;

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
        newPrice: 0,
        stockQty: 0,
        des: '',
        imageUrl: '',
        typeOfItem: '',
        categories: [...categoryArray]
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

    const validationSchema = Yup.object({
        prodName: Yup.string().required("name field is required"),
        price: Yup.string().required("price field is required"),
        des: Yup.string().required("description field is required"),
        imageUrl: Yup.string().required("image url field is required"),
        typeOfItem: Yup.string().required("type of item required")
    })

    useEffect(() => {
        const token = getToken("access_token");
        getAllCategories(`${baseUrl}/api/category-list`, { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.categoryList) {
                setCategoryObj((state) => {
                    const clone = {
                        ...state,
                        categoryArray: res.data.categoryList
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
                if (error === "already cleared out") {
                    toast.info(error);
                }
            }

        });

    }, [JSON.stringify(categoryArray), httptoken, getToken, baseUrl]);


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
                                                        <input className='form-control' type="text" id="prodName" />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
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
                                                        <input className='form-control' type="number" id="price" />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
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
                                                        <input className='form-control'  type="text" id="priceId" />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
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
                                                        <input className='form-control'  type="number" id="coupon" />
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
                                                        <input className='form-control'  type="number" id="stockQty" />
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
                                                        <input className='form-control'  type="text" id="des" />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
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
                                                        <input className='form-control'  type="text" id="imageUrl" />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
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
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-check mb-3'>
                                        {categoryArray.map((cat, i) => {
                                            return (
                                                <React.Fragment key={i}>
                                                    <input className="form-check-input" type="checkbox" id={cat.catName} defaultChecked={cat.ischecked} onChange={(e) => handleCategory(e)} value={cat._id}/>
                                                    <label htmlFor={cat.catName}>{cat.catName}</label>
                                                </React.Fragment>
                                            )
                                        })}
                                    </div>
                                    <div className='text-center'>
                                        <button className='btn btn-primary rounded-0 shadow px-3 fw-semibold' type='submit'>Submit</button>
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

export default ProductFormData;
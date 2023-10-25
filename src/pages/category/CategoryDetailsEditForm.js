import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { host } from '../../utils/base-endpoint';
import { useAuth } from '../../context/AuthContext'
import './Category.css';
import { getCategory, updateCategory } from '../../services/category.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const CategoryDetailsEditForm = () => {
    const [category, setCategory] = useState({ catName: '', des: '' });
    const { catName, des } = category;

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const params = useParams();
    const { categoryId } = params;

    const navigate = useNavigate();
    const { baseUrl } = host;

    // GET A CATEGORY
    useEffect(() => {
        getCategory(`${baseUrl}/api/category/${categoryId}`, { headers: httptoken(getToken("access_token")) }).then((res) => {
            
            if (res && res.data.category) {
                setCategory((state) => {
                    let data = res.data.category;
                    const clone = {
                        ...state,
                        catName: data.catName,
                        des: data.description
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
    }, [categoryId, httptoken, setToken, getToken, baseUrl, navigate])

    
    // REQUEST TO UPDATE CATEGORY DATA
    const submitHandler = async (event) => {
        event.preventDefault();
        const payload = {
            catName: catName,
            description: des
        }
        console.log(payload)

        updateCategory(`${baseUrl}/api/category/update`, { payload: payload }, { headers: httptoken(getToken("access_token")) }).then((res) => {
            
            if (res && res.data.status === "category updated successful") {
                console.log(res.data.status);
                navigate('/admin/categorylist');
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


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-sm-4'></div>
                <div className='col-sm-4 border mt-5 p-4 sect'>
                    <form onSubmit={(e) => submitHandler(e)}>
                        <input type='hidden' />
                        <div className='form-group mb-3'>
                            <label htmlFor='categoryName'>Category Name</label>
                            <input onChange={(event) => setCategory((prev) => {
                                return {
                                    ...prev,
                                    catName: event.target.value
                                }
                            })} className='form-control rounded-0' id='categoryName' type='text' value={catName} readOnly/>
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor='des'>Description</label>
                            <textarea onChange={(event) => setCategory((prev) => {
                                return {
                                    ...prev,
                                    des: event.target.value
                                }
                            })} className='form-control' id='des' value={des}>
                            </textarea>
                        </div>
                        <div className='form-group text-center'>
                            <button className='btn btn-primary rounded-0 shadow fw-bold' type='submit'>Update</button>
                        </div>
                    </form>
                </div>
                <div className='col-sm-4'></div>
            </div>
        </div>
    );
};

export default CategoryDetailsEditForm;
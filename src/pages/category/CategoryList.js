import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { host } from '../../utils/base-endpoint';
import { useAuth } from '../../context/AuthContext';
import './Category.css';
import { deleteCategory, getAllCategories  } from '../../services/category.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const CategoryList = () => {
    let [categoryObj, setCategories] = useState({ categories: [] })
    let { categories } = categoryObj;

    const auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let [deletedCategory, setDeletedCategory] = useState({ });

    const navigate = useNavigate();
    let { baseUrl } = host;


    // REQUEST TO GET ALL CATEGORIES
    useEffect(() => {
        getAllCategories(`${baseUrl}/api/category-list`, { headers: httptoken(getToken("access_token"))}).then((res) => {
            if (res && res.data.categoryList) {
                setCategories((state) => {
                    const clone = {
                        ...state,
                        categories: res.data.categoryList
                    }
                    return clone;
                });
            }
        }).catch( async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, baseUrl, getToken, setToken, toast);
                }
            }
        });

    }, [JSON.stringify(categories), deletedCategory._id, baseUrl]);


    const handleDelete = async (event) => {
        deleteCategory(`${baseUrl}/api/category-details-delete/${event.target.value}`, { headers: httptoken(getToken("access_token")) }).then((res) => {
            if (res && res.data.status === "category deleted successfully") {
                setDeletedCategory(res.data.deletedCategory);
                navigate('/admin/categorylist');
            }
        }).catch( async (err) => {
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
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-1'></div>
                <div className='col-sm-10 border mt-5'>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Category Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        {categories.map((category, index) => {
                            return (
                                <tbody key={index}>
                                    <tr>
                                        <th scope="row">{category._id}</th>
                                        <td>{category.catName}</td>
                                        <td>{category.description}</td>
                                        <td>
                                            <Link className='me-1 border py-1 px-2 bg-primary text-white fw-bold shadow' to={`/admin/category/update/${category._id}`}>Edit</Link>
                                            <button className='btn btn-danger rounded-0 shadow p-0 px-2 fw-bold' type='submit' value={category._id} onClick={(e) => handleDelete(e)}>Del</button>
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        })}
                    </table>
                </div>
                <div className='col-sm-1'></div>
            </div>
        </div>
    );
};

export default CategoryList;

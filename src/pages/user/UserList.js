import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';
import { useAuth } from '../../context/AuthContext';
import { host } from '../../utils/base-endpoint';
import { getAllUsers } from '../../services/user.service';
import { deleteUserByAdmin, clearHandler, locationHandler } from '../../services/admin.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';
import { adminEmail } from '../../vars/common';

const UserList = () => {
    let [userObj, setUsers] = useState({ users: [] });
    let { users } = userObj;

    let [deletedUser, setDeletedUser] = useState({});

    const auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let { baseUrl } = host;

    const navigate = useNavigate();


    // REQUEST TO GET ALL USERS
    useEffect(() => {
        const token = getToken("access_token");
        getAllUsers(`${baseUrl}/api/users`, { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.users) {
                setUsers((state) => {
                    const clone = {
                        ...state,
                        users: res.data.users
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

    }, [JSON.stringify(users), deletedUser._id, httptoken, getToken, baseUrl]);

    const handleEdit = (event) => {
        event.preventDefault();
        navigate(`/admin/user/update/${event.target.value}`);
    }


    // REQUEST TO DELETE A USER
    const handleDelete = async (event) => {
        event.preventDefault();
        if (window.confirm("are you sure you want to delete user?")) {
            const token = getToken("access_token");
            deleteUserByAdmin(`${baseUrl}/api/admin/user-delete/${event.target.value}`, { headers: httptoken(token) }).then((res) => {
                console.log(res.data);
                if (res && res.data.status === "user deleted successfully") {
                    setDeletedUser(res.data.deletedUser);
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

    const handleDeletedUsers = (event) => {
        event.preventDefault();
        clearHandler(`${baseUrl}/api/admin/clear-deletedusers`, { headers: httptoken(getToken("access_token")) }).then((res) => {
            console.log(res.data);
            if (res && res.data.status === "deleted users successfully removed") {
                toast.info(res.data.status);
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

        })

    }


    const handleLocation = (event) => {
        event.preventDefault();
        locationHandler(`${baseUrl}/api/admin/clear-locationusers`, { headers: httptoken(getToken("access_token")) }).then((res) => {
            console.log(res.data);
            if (res && res.data.status === "users location successfully removed") {
                toast.info(res.data.status);
            }
        }).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, baseUrl, getToken, setToken, toast);
                }
                if (error === "location already cleared out") {
                    toast.info(error);
                }
            }

        })

    }


    return (
        <div className='container-fluid pt-3'>
            <div className='row mb-1 justify-content-center'>
                <div className='col-lg-4'></div>
                <div className='col-lg-5'></div>
                <div className='col-lg-3'>
                    <button className='btn btn-success rounded-0 shadow p-0 px-2' type='submit' onClick={(e) => handleDeletedUsers(e)}> Clear deleted users </button>
                </div>
            </div>
            {/* <div className='row justify-content-center'>
                <div className='col-lg-4'></div>
                <div className='col-lg-5'></div>
                <div className='col-lg-3'>
                    <button className='btn btn-success rounded-0 shadow p-0 px-2' type='submit' onClick={(e) => handleLocation(e)}> Clear location users </button>
                </div>
            </div> */}
            <div className='row justify-content-center'>
                <div className='col-sm-1'></div>
                <div className='col-sm-10 border mt-5'>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                {/* <th scope="col">Id</th> */}
                                <th scope="col">UserName</th>
                                <th scope="col">Email</th>
                                <th scope="col">VerifiedEmail</th>
                                <th scope="col">Security</th>
                                <th scope="col">Blocked</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        {users.map((user, index) => {

                            if (user.email !== adminEmail()) {
                                return (
                                    <tbody className='' key={index}>
                                        <tr>
                                            {/* <th scope="row">{user.id}</th> */}
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{(user.confirmemail)}</td>
                                            <td>
                                                <a href={`/admin/user/block/${user._id}`} style={{ "textDecoration": "underline" }}> Block user</a>
                                            </td>
                                            <td>{(user.isblocked)}</td>
                                            <td>
                                                <button className='btn btn-primary rounded-0 shadow p-0 px-2 m-1' type='submit' value={user._id} onClick={(e) => handleEdit(e)}>Edit</button>
                                                <button className='btn btn-danger rounded-0 shadow p-0 px-2' type='submit' value={user._id} onClick={(e) => handleDelete(e)}>Del</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            }

                        })}
                    </table>
                </div>
                <div className='col-sm-1'></div>
            </div>
        </div>
    );
};

export default UserList;
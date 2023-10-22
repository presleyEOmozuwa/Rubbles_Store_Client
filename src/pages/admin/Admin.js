import React from 'react';

const Admin = () => {
    return (
        <div className='container-fluid mt-5'>
            <div className='row'>
                <div className='col-lg-3'></div>
                <div className='col-lg-6 bg-primary text-center p-4'>
                    <p className='display-5 text-white'>Admin User Page</p>
                </div>
                <div className='col-lg-3'></div>
                <input type="email" name="email"/>
            </div>
        </div>
    );
};

export default Admin;
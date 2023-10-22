import React from 'react';
import { Link } from 'react-router-dom';

const NavbarPublic = () => {

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark m-1">
                <div className="container-fluid">
                    <a className="navbar-brand text-white" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className='nav-link text-white' href='/'>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href='/register'>Register</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-link text-white' href='/login'>Login</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-link text-white' href='/cart/guest'>Guest</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavbarPublic;
import React, { Suspense } from 'react';
import "../node_modules/bootstrap/dist/js/bootstrap";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { google } from './vars/google.utils'
import HomeProducts from './pages/home/HomeProducts';
import NoMatch from './pages/no-match/NoMatch';
import { AuthProvider } from './context/AuthContext';
import { LayoutAdmin, LayoutAuthUser, LayoutPublic } from './components/auth-layout/AuthLayout';

import { Admin, AdminHome, AdminSubProducts, UserEditAdminForm, UserBlockAdmin, CheckoutRegMultiple, CheckoutRegSingle, CheckoutSubMultiple, CheckoutSubSingle, ForgotPasswordForm, ProductList, ProductEditForm, UserEditForm, UserList, CategoryList, CategoryDetailsEditForm, CategoryForm, EmailConfirmation, GuestUserBuilder, LoginForm, LoginOTP, ProductDetails, ProductFormData, RegisterForm, ResetPasswordForm, UserDetails, ShoppingCartBuilder, SubscriptionProducts, SubscriptionCartBuilder, AuthShowProducts } from './utils/lazy-loading';


const router = createBrowserRouter([
      {
            path: '/',
            element: <LayoutPublic />,
            children: [
                  { path: 'product/:productId', element: <ProductDetails /> },
                  { path: 'email/confirm/:token', element: <EmailConfirmation /> },
                  { path: 'cart/guest', element: <GuestUserBuilder /> },
                  { path: 'login', element: <LoginForm /> },
                  { path: 'otp/2fa/:userId', element: <LoginOTP /> },
                  { path: 'forgot/password', element: <ForgotPasswordForm/> },
                  { path: 'password/reset/:token', element: <ResetPasswordForm/> },
                  { path: 'register', element: <RegisterForm /> },
                  { path: '/', element: <HomeProducts /> }
            ]
      },
      {
            path: '/admin',
            element: <LayoutAdmin />,
            children: [
                  { path: 'product/:id', element: <ProductDetails /> },
                  { path: 'product/update/:productId', element: <ProductEditForm /> },
                  { path: 'category/update/:categoryId', element: <CategoryDetailsEditForm /> },
                  { path: 'user/update/:userId', element: <UserEditAdminForm/> },
                  { path: 'user/block/:userId', element: <UserBlockAdmin/> },
                  { path: 'categorylist', element: <CategoryList /> },
                  { path: 'productlist', element: <ProductList /> },
                  { path: 'sub/products', element: <AdminSubProducts /> },
                  { path: 'categoryform', element: <CategoryForm /> },
                  { path: 'productform', element: <ProductFormData /> },
                  { path: 'system', element: <Admin /> },
                  { path: 'adminhome', element: <AdminHome /> },
                  { path: 'userlist', element: <UserList /> },
                  

            ]
      },
      {
            path: '/auth',
            element: <LayoutAuthUser />,
            children: [
                  { path: 'user', element: <UserDetails /> },
                  { path: 'user/update', element: <UserEditForm /> },
                  { path: 'product/:id', element: <ProductDetails /> },
                  { path: 'shoppingcart', element: <ShoppingCartBuilder /> },
                  { path: 'sub/products', element: <SubscriptionProducts /> },
                  { path: 'sub/shoppingcart', element: <SubscriptionCartBuilder /> },
                  { path: 'regular/multiple/checkout/success/:session_id', element: <CheckoutRegMultiple /> },
                  { path: 'regular/single/checkout/success/:session_id', element: <CheckoutRegSingle /> },
                  { path: 'sub/multiple/checkout/success/:session_id', element: <CheckoutSubMultiple /> },
                  { path: 'sub/single/checkout/success/:session_id', element: <CheckoutSubSingle /> },
                  { path: 'show', element: <AuthShowProducts /> },
            ]
      }
]);

function App() {
      return (
            <>
                  <AuthProvider>
                        <GoogleOAuthProvider clientId={google().clientId}>
                              <Suspense fallback={<div>...loading</div>}>
                                    <ToastContainer style={{ "width": "300px" }} position={"top-center"} theme={"colored"} hideProgressBar={true} limit={1} />
                                    <RouterProvider router={router} />
                              </Suspense>
                        </GoogleOAuthProvider>
                  </AuthProvider>
            </>
      )
}
export default App;


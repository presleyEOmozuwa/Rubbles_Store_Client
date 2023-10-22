import { lazy } from 'react';

export const Admin = lazy(() => import('../pages/admin/Admin'));

export const AdminHome = lazy(() => import('../pages/admin/AdminHome'));

export const AdminSubProducts = lazy(() => import('../pages/admin/AdminSubProducts'));

export const UserBlockAdmin = lazy(() => import('../pages/admin/UserBlockAdmin'));

export const UserEditAdminForm = lazy(() => import('../pages/admin/UserEditAdminForm'));

export const CheckoutRegMultiple = lazy(() => import('../pages/checkout-success/CheckoutRegMultiple'));

export const CheckoutRegSingle = lazy(() => import('../pages/checkout-success/CheckoutRegSingle'));

export const CheckoutSubMultiple = lazy(() => import('../pages/checkout-success/CheckoutSubMultiple'));

export const CheckoutSubSingle = lazy(() => import('../pages/checkout-success/CheckoutSubSingle'));

export const CheckoutFailureMultiple = lazy(() => import('../pages/checkout-failure/CheckoutFailureMultiple'));

export const CheckoutFailureSingle = lazy(() => import('../pages/checkout-failure/CheckoutFailureSingle'));

export const GuestUserBuilder = lazy(() => import('../pages/guest-user/GuestUserBuilder'));

export const ForgotPasswordForm = lazy(() => import('../pages/profile-settings/ForgotPasswordForm'));

export const ProductList = lazy(() => import('../pages/product/ProductList'));

export const UserList = lazy(() => import('../pages/user/UserList'));

export const UserEditForm = lazy(() => import('../pages/user/UserEditForm'));

export const ProductEditForm = lazy(() => import('../pages/product/ProductEditForm'));

export const CategoryList = lazy(() => import('../pages/category/CategoryList'));

export const CategoryDetailsEditForm = lazy(() => import('../pages/category/CategoryDetailsEditForm'));

export const CategoryForm = lazy(() => import('../pages/category/CategoryForm'));

export const EmailConfirmation = lazy(() => import('../pages/profile-settings/EmailConfirmation'));

export const LoginForm = lazy(() => import('../pages/login/LoginForm'));

export const LoginOTP = lazy(() => import('../pages/profile-settings/LoginOTP'));

export const ProductDetails = lazy(() => import('../pages/product/ProductDetails'));

export const ProductFormData = lazy(() => import('../pages/product/ProductFormData'));

export const RegisterForm = lazy(() => import('../pages/register/RegisterForm'));

export const ResetPasswordForm = lazy(() => import('../pages/profile-settings/ResetPasswordForm'));

export const UserDetails = lazy(() => import('../pages/user/UserDetails'));

export const ShoppingCartBuilder = lazy(() => import('../pages/shopping-store/ShoppingCartBuilder'));

export const SubscriptionProducts = lazy(() => import('../pages/subscription/SubscriptionProducts'));

export const SubscriptionCartBuilder = lazy(() => import('../pages/subscription/SubscriptionCartBuilder'));

export const AuthShowProducts = lazy(() => import('../pages/shopping-store/AuthShowProducts'));
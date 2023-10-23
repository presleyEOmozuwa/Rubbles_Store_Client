import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useParams } from 'react-router-dom'
import { host } from '../../utils/base-endpoint';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { OTPHandler } from '../../services/user.service';

const LoginOTP = () => {

    const initialValues = {
        code: ''
    }

    const auth = useAuth();
    const { getToken, setToken, tokenDecoder, login } = auth;

    const params = useParams();
    const { userId } = params;

    const { baseUrl } = host;

    const navigate = useNavigate();

    const validationSchema = Yup.object({
        code: Yup.string().required("verification code field is required")
    })


    // REQUEST TO AUTHENTICATE WITH THE SERVER
    const onSubmit = async (values, onSubmitProps) => {
        const payload = {
            code: values.code,
            userId: userId
        }
        console.log(payload);
        
        OTPHandler(`${baseUrl}/api/otp-code/payload`, { payload: payload }).then((res) => {
            if (res && res?.data.status === "login successful") {
                onSubmitProps.resetForm();
                
                setToken("access_token", res.data.accToken);
                setToken("refresh_token", res.data.renewToken);
                
                const user = tokenDecoder(getToken("access_token"));
                const { role } = user;

                login(user);

                if (role === "admin") {
                    return navigate('/admin/system', { replace: true })
                }
                else if (role === "client") {
                    return navigate('/auth/user', { replace: true })
                }
                else {
                    return navigate('/', { replace: true });
                }
            }
    
        }).catch((err) => {
            if (err && err.response) {
                const { error } = err.response.data;
                console.log(error);
            }
        });
    }


    return (
        <div className='container-fluid pt-5 bg-primary mx-auto vh-100 login-section'>
            <div className='row'>
                <div className='col-lg-4'></div>
                <div className='col-lg-4 border p-4 bg-white shadow-lg mt-2'>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {
                            (formik) => {

                                return (
                                    <Form>
                                        <div className='form-group sect mb-3'>
                                            <label className='me-5' htmlFor='code'>Verification code</label>
                                            <Field name='code'>
                                                {
                                                    (props) => {
                                                        const { field, meta } = props
                                                        return (
                                                            <>
                                                                <input className='form-control rounded-0' id='code' {...field} type='text'/>
                                                                {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                            </>
                                                        )
                                                    }
                                                }
                                            </Field>
                                        </div>
                                        <div className='text-center mt-3'>
                                            <button className='btn btn-primary rounded-0 shadow px-5 fw-bold' type='submit'>Verify</button>
                                        </div>
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                </div>
                <div className='col-lg-4'></div>
            </div>
        </div>
    );
};

export default LoginOTP;
import { toast } from 'react-toastify';
import { host } from './base-endpoint';
import { setToken, getToken, sendRefreshToken } from './token-service';

export const totalHandler = (products) => {
    let total;
    if (products) {
        total = products.reduce((sum, p) => {
            return sum + (p.quantity * p.newPrice)
        }, 0);
    }
    return total;
}

// export const tokenRenewalHandler = async (err, navigate) => {
//     let con = { done: false };
//     const { error } = err.response.data;
//     const { baseUrl } = host;

//     if (error === "access token expired") {
//         const { entryToken, renewToken, bug, isVerified } = await sendRefreshToken(`${baseUrl}/api/refresh-token/payload`, getToken("refresh_token"));

//         if (isVerified) {
//             setToken("access_token", entryToken);
//             setToken("refresh_token", renewToken);
//         }

//         if (bug === "refresh token expired") {
//             toast.info("Session expired, Login to continue", { autoClose: 4000 });
//             setTimeout(() => {
//                 navigate('/login');
//             }, 4000)
//         }
//     }

//     if (error === "product already exist on cart") {
//         toast.info(error);
//     }
//     con.done = true;

//     return con;
// }




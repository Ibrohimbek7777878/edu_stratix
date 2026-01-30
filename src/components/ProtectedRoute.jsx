import React  from "react";
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        //Agar token bo'lmasa, Loginga haydaymiz!
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;

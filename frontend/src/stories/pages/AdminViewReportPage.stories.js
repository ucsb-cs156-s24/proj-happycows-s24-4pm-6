import React from 'react';
import AdminViewReportPage from "main/pages/AdminViewReportPage";
import { Route, Routes } from 'react-router-dom';

export default {
    title: 'pages/AdminViewReportPage',
    component: AdminViewReportPage,
};

export const Default = () => {
    return (
        <Routes>
            <Route
                element={<AdminViewReportPage  />}
                path="/admin/report/:reportId" 
            />
        </Routes>
    )
}
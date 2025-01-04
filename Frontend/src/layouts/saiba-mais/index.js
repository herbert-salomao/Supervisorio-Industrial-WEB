
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import React, { useEffect, useState } from 'react';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import "./saiba_mais.css"


const SaibaMais = () => {



    return (
        <DashboardLayout>
            <DashboardNavbar />   
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Card style={{height: '700px', width: '75%', display: 'center'}}>
                    <SoftBox>
                        <div className="saibamais-title-container">
                            <div className="saibamais-title"> Saiba Mais </div>    
                        </div>
                    </SoftBox>
                    </Card>
                </div>
            <Footer />
        </DashboardLayout>     
    )


}



export default SaibaMais;

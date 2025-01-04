
import { useState } from "react";
import React, { useRef, useEffect } from 'react';
import { createContext, useContext } from 'react';
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";


import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";


import Table from "examples/Tables/Table";

// Data
import data from "layouts/dashboard/components/Projects/data";

import "./processo.css"
import "./processo.scss"
import { Height } from "@mui/icons-material";

import Context from "layouts/dashboard/Context.js"
import zIndex from "@mui/material/styles/zIndex";

import classNames from 'classnames';
function Projects() {
  const [isClicked, setIsClicked] = useState(false);

  const [isCLP01_Clicked, setCLP01_Clicked] = useState(false);
  const [control, setControl] = useContext(Context);


  const [is2D, setIs2D] = useState(true);
  
  const [isMobile, setIsMobile] = useState(false);

  const checkDeviceType = () => {
    setIsMobile(window.innerWidth < 768); // Change the width based on your needs
  };
  useEffect(() => {
    checkDeviceType(); // Run on mount
    window.addEventListener("resize", checkDeviceType); // Re-run on resize
    return () => window.removeEventListener("resize", checkDeviceType); // Cleanup
  }, []);

  const handleChange = (event) => {
    setIs2D(event.target.checked);
    setControl(0)
    setIsClicked(false);
    setCLP01_Clicked(false)
  };
  const handleCLP02_Click = () => {
    setIsClicked(!isClicked);
    setCLP01_Clicked(false)
    if (isClicked) {
      setControl(0)
    }
    else {
      setControl('CLP-02')
    }
  };

  const handleCLP01_Click = () => {

    setCLP01_Clicked(!isCLP01_Clicked);
    setIsClicked(false);
    if (isCLP01_Clicked) {
      setControl(0)
    }
    else {
      setControl('CLP-01')
    }
  };



  return (
    <Card>
      <SoftBox className="DiagramBox" display="flex" justifyContent="space-between" alignItems="center" p={3} >
        <SoftBox>

          <div className="PandID"></div>
          <SoftTypography style={{position: "relative", zIndex: 2, width: "50px"}} variant="h6" gutterBottom>
            P&ID
          </SoftTypography>

          <div style={{zIndex: 2}} className="mid">

            <label className="rocker rocker-small">
              <input type="checkbox"         
              checked={is2D}
              onChange={handleChange}
              ></input>
              <span className="switch-left">2D</span>
              <span className="switch-right">3D</span>
            </label>

          </div>






          <div className="scrollable" >
          <div className="image-container" width="100%" height="100%" style={{ display: is2D ? 'block' : 'none' }}>


            
            <img src="/Base.png" alt="processo" width="100%" className="base-image"/>
            
            <button className={`image-button ${isClicked ? 'clicked' : ''}`} onClick={handleCLP02_Click} style={{ cursor: 'pointer' }}>
              <img src="/clp02.png" alt="processo" width="100%" className={`overlay-image2 ${isClicked ? 'clicked' : ''}`}/>

            </button>
            
            <button className={`image-button ${isCLP01_Clicked ? 'clicked' : ''}`} onClick={handleCLP01_Click} style={{ cursor: 'pointer' }}>
              <img src="/clp01.png" alt="processo" width="100%" className={`overlay-image ${isCLP01_Clicked ? 'clicked' : ''}`}/>
            </button>

            
            <img src="/motor_off.png" className="motor"></img>
            <img src="/motor_on.png" className="motor"></img>
            <img src="/valvula_off.png" className="valvula"></img>
            
 
          </div>

          </div>


          {isMobile ? (
            <p style={{ display: is2D ? 'none' : 'block' }} className="aviso">Para uma melhor experiência, use um computador.</p>
          ) : (
            <div  className="Supervisorio3D" style={{ display: is2D ? 'none' : 'block' }}>
              <iframe className="responsive-iframe" src={`${process.env.REACT_APP_URL}/3D/ProjetoIntegrador.html`} sandbox=" allow-top-navigation-by-user-activation allow-top-navigation-to-custom-protocols allow-scripts allow-same-origin allow-pointer-lock" width={'100vh'} height={'100%'} frameBorder="0"></iframe>
            </div> 
          )}

 
        </SoftBox>
      </SoftBox>
    </Card>

  );
}

export default Projects;


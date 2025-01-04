/* eslint-disable react/prop-types */ 
import axios, { Axios } from 'axios';
import React, { useEffect, useState } from 'react';
// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Box } from '@mui/material';
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import TextField from '@mui/material/TextField';
// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";


import Projects from "layouts/dashboard/components/Projects";

import Propriedades from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";

import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';
import Context from './Context';

import Slider, { SliderTooltip }from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

import "./dashboard.css"
import boxShadow from 'assets/theme/functions/boxShadow';
import { position } from 'stylis';
import zIndex from '@mui/material/styles/zIndex';

import { useNavigate } from 'react-router-dom';



// Add a request interceptor
axios.interceptors.request.use(
  config => {
      const token = localStorage.getItem('token');
      if (token) {
          config.headers['Authorization'] = `${token}`;
      }
      return config;
  },
  error => {
      return Promise.reject(error);
  }
);





function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const [times, setTimes] = useState([]);
  const [values, setValues] = useState([]);

  const [spValues, set_spValues] = useState([]);
  const [pvValues, set_pvValues] = useState([]);
  const [mvValues, set_mvValues] = useState([]);



  const [control, setControl] = useState(0);




  const [res_sp_clp02,set_res_sp_clp02] = useState(0);
  const [get_sp_clp02, set_sp_clp02 ] = useState(0);



  const [isProps_CLP2Visible, setIsProps_CLP2Visible] = useState(false);
  const [isProps_CLP1Visible, setIsProps_CLP1Visible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isSPChanging, setSPChanging] = useState(false)

  const [descr, setDescr] = useState('')

  const [ActualControl, setActualControl] = useState(0);


  const [currentKPText, setCurrentKPText] = useState(0.0); 
  const [previousKPText, setPreviousKPText] = useState(0.0); 

  const [currentTDText, setCurrentTDText] = useState(0.0); 
  const [previousTDText, setPreviousTDText] = useState(0.0); 

  const [currentTIText, setCurrentTIText] = useState(0.0); 
  const [previousTIText, setPreviousTIText] = useState(0.0); 

  const [isVisible, setIsVisible] = useState(true);

  const [isOptimizers, setOptimize] = useState(true);
  const [isMantenedor, setMantenedor] = useState();
  const [isVisitante, setVisitante] = useState(false);
  const [isEditing, setIsEditing] = useState(false);



  const [liga, setLiga] = useState(false);



  const optimalArgs_CLP01 = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/pid_clp01`,  { message: `${currentKPText};${currentTIText};${currentTDText}` });
      console.log('Response from backend /api/pid_clp1:', response.data.pid_clp01);
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  const optimalArgs_CLP02 = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/pid_clp02`,  { message: `${currentKPText};${currentTIText};${currentTDText}` });
      console.log('Response from backend /api/pid_clp2:', response.data.pid_clp02);
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  useEffect(() => {
  
    
      const fetchData = async () => {
        if (isPlaying == false) {
          if (control == 'CLP-02') {


            
              axios.get(`${process.env.REACT_APP_API_URL}/api/clp02`)
              .then(response => {
                setTimes(response.data.times.reverse());
                set_spValues(response.data.spValues.reverse());
                set_pvValues(response.data.pvValues.reverse());
                set_mvValues(response.data.mvValues.reverse());
                if (ActualControl != 'CLP-02') {

                  axios.get(`${process.env.REACT_APP_API_URL}/api/pid_clp02`)
                  .then(response => {
                     setCurrentKPText(response.data.lastKPValues)
                     setCurrentTDText(response.data.lastTIValues)
                     setCurrentTDText(response.data.lastTDValues)
                  })
                  .catch(error => {
                    console.error('Tem um erro na procura de dados!', error);
                  });

                  set_res_sp_clp02(response.data.spValues.reverse()[0])
                  
                  setActualControl('CLP-02')
                }
              })
              .catch(error => {
                console.error('Tem um erro na procura de dados!', error);
              });
              if (!isVisitante) {
                try {
                  const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/sp_clp02`,  { message: res_sp_clp02 });
                  console.log('Response from backend CLP02:', response.data.sp_clp02);
                } catch (error) {
                  console.error('There was an error!', error);
                }
              } else {
                axios.get(`${process.env.REACT_APP_API_URL}/api/clp02`)
                .then(response => {
                 
                  set_res_sp_clp02(response.data.spValues.reverse()[0])
                })
                .catch(error => {
                  console.error('Tem um erro na procura de dados!', error);
                });
              }
              //optimalArgs_CLP02();
              if (isProps_CLP2Visible == false) {
                setIsProps_CLP2Visible(true)

              }


            
         }
         if (control == 'CLP-01') {
          axios.get(`${process.env.REACT_APP_API_URL}/api/clp01`)
          .then(response => {
            setTimes(response.data.times.reverse());
            set_spValues(response.data.spValues.reverse());
            set_pvValues(response.data.pvValues.reverse());
            set_mvValues(response.data.mvValues.reverse());
            if (ActualControl != 'CLP-01') {
              set_res_sp_clp02(response.data.spValues[response.data.spValues.length - 1])
              setActualControl('CLP-01')
            }
          })
          .catch(error => {
            console.error('Tem um erro na procura de dados!', error);
          });
          if (!isVisitante) {
            try {
              const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/sp_clp01`,  { message: res_sp_clp02 });
              console.log('Response from backend CLP01:', response.data.sp_clp01);
            } catch (error) {
              console.error('There was an error!', error, 'sending: ', res_sp_clp02);
            }
          } else {
            axios.get(`${process.env.REACT_APP_API_URL}/api/clp01`)
            .then(response => {
              set_res_sp_clp02(response.data.spValues.reverse()[0])
            })
            .catch(error => {
              console.error('Tem um erro na procura de dados!', error);
            });
          }


          if (isProps_CLP2Visible == false) {
            setIsProps_CLP2Visible(true)

          }
          //optimalArgs_CLP01();

          if (!isEditing) {  
            try {
            await axios.get(`${process.env.REACT_APP_API_URL}/api/pid_clp01`)
            .then(response => {
              setCurrentKPText(response.data.kpValues)
              setCurrentTIText(response.data.tiValues)
              setCurrentTDText(response.data.tdValues)
            })
            .catch(error => {
              console.error('Tem um erro na procura de dados!', error);
            }); 
            
          } catch (error) {
            console.error('There was an error!', error);
          }
     }


     }
         
      }

      }
    
      fetchData();

   
      const intervalId = setInterval(fetchData, 1000);

      if (control == 0) {

        if (ActualControl != '0') {
          setActualControl('0')
        }
        setTimes([null]);
        setValues([null]);
        if (isProps_CLP2Visible == true) {
          setIsProps_CLP2Visible(false)
        }
        setIsProps_CLP1Visible(false)
        setDescr('')
      }
      if (control == 'CLP-01') {
        setIsProps_CLP1Visible(true)
        axios.get(`${process.env.REACT_APP_API_URL}/api/pid_clp01`)
        .then(response => {
           setCurrentKPText(response.data.kpValues)
           setCurrentTIText(response.data.tiValues)
           setCurrentTDText(response.data.tdValues)

        })
        .catch(error => {
          console.error('Tem um erro na procura de dados!', error);
        });

        setDescr('Controle do nível do silo de carvão')
      }
      if (control == 'CLP-02') {
        //set_res_sp_clp02(spValues[0])
        setDescr('Controle do nível de água da caldeira')

        axios.get(`${process.env.REACT_APP_API_URL}/api/pid_clp02`)
        .then(response => {
           setCurrentKPText(response.data.kpValues)
           setCurrentTIText(response.data.tiValues)
           setCurrentTDText(response.data.tdValues)
        
        })
        .catch(error => {
          console.error('Tem um erro na procura de dados!', error);
        });
        setIsProps_CLP1Visible(false)

      }



      
      return () => clearInterval(intervalId);
    




  }, [control, res_sp_clp02, isPlaying, ActualControl, isEditing] );



  const navigate = useNavigate();


  useEffect(() => {
    // Function to verify the token
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          setError('No token found, redirecting to login...');
          navigate('/authentication/sign-in');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/verify`, {
          headers: {
            'Authorization': token
          }
        });

        if (response.data.success) {
          console.log(`${response.data.username} user logged`); // Set the username if verified
          (response.data.username == 'mantenedor') ? (setOptimize(true), setMantenedor(true)) : (setOptimize(false), setMantenedor(false));
          (response.data.username == 'visitante') ? setVisitante(true) : setVisitante(false);

        } else {
          console.log('Failed to verify token');
          navigate('/authentication/sign-in'); // Redirect to login if not authenticated
        }
      } catch (err) {
        console.log('Token verification failed. Redirecting to login...');
        navigate('/authentication/sign-in'); // Redirect to login on error
      }
    };

    verifyToken();
  }, [navigate]);








  const GradientPlayIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00bbff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0062ff', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M8 5v14l11-7L8 5z" fill="url(#playGradient)" />
    </svg>
  );
  
  const GradientPauseIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pauseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0062ff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00bbff', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="url(#pauseGradient)" />
    </svg>
  );
  







  const handleSPbox = (event) => {
    set_sp_clp02(String(event.target.value).replace('%',''))
    set_res_sp_clp02(String(event.target.value).replace('%',''))
    
  };

  const handleLiga =  () => {
    
    try {
    const response = axios.put(`${process.env.REACT_APP_API_URL}/api/planta`,  { estado: true });
    setLiga(true);
    console.log(liga);
    } catch (error) {
      console.log('Houve um erro, ' , error)
    }

  }

  const handleDesliga =  () => {
    
    
    try {
    const response =  axios.put(`${process.env.REACT_APP_API_URL}/api/planta`,  { estado: false });
    setLiga(false);
    console.log(liga);
    } catch {
      console.log('Houve um erro, ' , error)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handle_SP_SliderChange = (event) => {
    set_res_sp_clp02(event.target.value)
    
  };
  const handle_SP_SliderClick = (event) => {

    setSPChanging(!isSPChanging)
    
  }

  const isValidFloat = (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  };

  const handleKPFocus = () => {
    setIsEditing(true);  // Mark the field as being edited
  };

  const handleKPKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      
      if (isValidFloat(currentKPText)) {
        
        setPreviousKPText(currentKPText);
        if(control == 'CLP-02') {
            await optimalArgs_CLP02();
        }
        if(control == 'CLP-01') {
          await optimalArgs_CLP01();
      }
        

      } else {
        alert('Por favor, digite um número decimal válido')
        setCurrentKPText(previousKPText);
 
        }
      setIsEditing(false);
    }
  };

  const handleKPChange =  (event) => {
    setCurrentKPText(event.target.value);
    setIsEditing(true);
 
  };


  const handleKPBlur = () => {
    setIsEditing(false); 

  };


  const handleTIKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsEditing(false);
      if (isValidFloat(currentTIText)) {
        setPreviousTIText(currentTIText);
        if(control == 'CLP-02') {
          optimalArgs_CLP02();
      }
      if(control == 'CLP-01') {
        optimalArgs_CLP01();
    }
      } else {
        alert('Por favor, digite um número decimal válido')
        setCurrentTIText(previousTIText)
      }
    }
  };

  const handleTIChange = (event) => {
    setCurrentTIText(event.target.value);
    setIsEditing(true);
  };

  const handleTIBlur = () => {
    setIsEditing(false);  
  };

  const handleTIFocus = () => {
    setIsEditing(true);  // Mark the field as being edited
  };

  const handleTDKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsEditing(false);
      if (isValidFloat(currentTDText)) {
        setPreviousTDText(currentTDText);
        if(control == 'CLP-02') {
          optimalArgs_CLP02();
      }
      if(control == 'CLP-01') {
        optimalArgs_CLP01();
    }
      } else {
        alert('Por favor, digite um número decimal válido')
        setCurrentTDText(previousTDText)
      }
    }
  };

  const handleTDChange = (event) => {
    setIsEditing(true);
    setCurrentTDText(event.target.value);
  };


  const handleTDBlur = () => {
    setIsEditing(false);  
  };

  const handleTDFocus = () => {
    setIsEditing(true);  // Mark the field as being edited
  };

  const optimalArgs = async () => {
    if (control == 'CLP-02') {
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/pid_clp02`,  { message: `${currentKPText};${currentTIText};${currentTDText}` });
        console.log('Response from /api/pid_clp02:', response.data.pid_clp02);
      } catch (error) {
        console.error('There was an error!', error);
      }
  }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>

          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>

          <Grid container spacing={3}>

            <Grid item xs={12} lg={12}>
    

    
              <GradientLineChart
                title="Gráfico de Tendência"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                
                    </SoftBox>

          
                  </SoftBox>
                }
                height={"100%"}
                chart={ {
                  labels: times,
                  datasets: [
                    {
                      label: "SP",
                      borderColor: 'rgb(255, 0, 0)',
                      data: spValues,
                    },
                    {
                      label: "PV",
                      borderColor: 'rgb(0, 255, 0)',
                      data: pvValues,
                    },
                    {
                      label: "MV",
                      borderColor: "rgb(0, 0, 255)",
                      data: mvValues,
                    },

                  ]
                }
            
                }

              />

            </Grid>
            <button  onClick={togglePlayPause} className='PlayButton'>
              {isPlaying ? <GradientPlayIcon /> : <GradientPauseIcon />}
            </button>
          </Grid>

        </SoftBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
          <Context.Provider value={[control, setControl]}>
            <Projects/>
          </Context.Provider>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
          <Card className="h-100" style={{height: '700px'}}>
            <SoftBox pt={3} px={3} >
                  <SoftTypography variant="h6" fontWeight="medium">
                    Propriedades
                  </SoftTypography>
                  <div className='description' style={{fontSize: '14px', marginLeft: '24%', alignContent: 'center'}}>{descr}</div>
                  <SoftBox mt={1} mb={2}>
                  </SoftBox>
                </SoftBox>
                <SoftBox>


                <div className="propertiesBox" style={{display: control == 0 ? 'block' : 'none'}}>
                  <div className="retangulo-arredondado">               
                    <span className='OEE_label'>OEE</span>
                    <div className='disp'>
                      
                        <span> Disponibilidade: </span>
                        <div className="dispBox">
                          90%
                        </div>
                        <span className='x1'>  x </span>
                    </div>
                    <div className='perf'>
                    <span className='x2'>  x </span>
                    <span> Desempenho: </span>
                        <div className="perfBox">
                          95%
                        </div>
                    </div>
                    <div className='qual'>
                    
                    <span> Qualidade: </span>
                        <div className="qualBox">
                          99.9%
                    </div>

                    </div>


                    <div className='OEE'>
                    <span className='equal_symbol'>  = </span>
                    <span> OEE: </span>
                        <div className="OEEBox">
                          85.4%
                    </div>


              





                  </div> 
                  </div>
                      <div className='button-container' style={{ visibility: isVisitante ? 'hidden' : 'visible' }}>
                      <button className="button_liga" onClick={handleLiga}></button>
                      <button className="button_desliga" onClick={handleDesliga}></button>
                      
                    </div>
                    <div className="onoff-container" style={{ visibility: isVisitante ? 'hidden' : 'visible' }}>
                      <div className='liga_label' >LIGA</div>
                      <div className='desliga_label' >DESLIGA</div>
                    </div>
                </div>


                <div className="controlBox" spacing={1} style={{  opacity: isProps_CLP2Visible ? 1 : 0 , visibility: isProps_CLP2Visible ? 'visible' : '' }}>

                <div className="controlSP">
                <div className='SP_Label'>SP</div>
        
                <input type="text" className="sp-box"  value={res_sp_clp02} onChange={handleSPbox}/>
                <div className='sp_perc'> %</div>
                <input id="sp_slider" type="range" min="0" max="100"  className={isVisitante ? "sp_slider_visitante" : "sp_slider"} value={res_sp_clp02}  onChange={isVisitante ? null : handle_SP_SliderChange}/>


           
                </div> 

                <div className="controlPV">
                <div className='PV_Label'>PV</div>
                <input type="text" className="pv-box" value={pvValues[pvValues.length-1]}/>
                <div className='pv_perc'> %</div>
                <input id="pv_slider" type="range" min="0" max="100"  className="pv_slider" value={pvValues[pvValues.length-1]}/> 
                </div>

                <div className="controlMV">
                <div className='MV_Label'>MV</div>
                <input type="text" className="mv-box" value={mvValues[mvValues.length-1]} />
                <div className='mv_perc'> %</div>
                <input id="mv_slider" type="range" min="0" max="100"  className="mv_slider" value={mvValues[mvValues.length-1]}/> 
                </div>
                <div className="otimizadores" style={{ visibility: isOptimizers || isVisitante & (control != 0) ? 'visible' : 'hidden' }}> 
                <div className='KP'>
                  <div className='KP_Label'>KP: </div>
                  <input
                      disabled={!isMantenedor}
                      type="text"
                      className="kp-input"
                      value={currentKPText}
                      onKeyDown={handleKPKeyDown}
                      onChange={handleKPChange}
                      onBlur={handleKPBlur}
                      onFocus={handleKPFocus}
                      maxLength={4}
                  />
                  <div className='KP_Label'>TI: </div>
                  <input
                      disabled={!isMantenedor}
                      type="text"
                      className="ti-input"
                      value={currentTIText}
                      onKeyDown={handleTIKeyDown}
                      onChange={handleTIChange}
                      onBlur={handleTIBlur}
                      onFocus={handleTDFocus}
                      maxLength={4}
                  />
                  <div className='KP_Label'>TD: </div>
                  <input
                      disabled={!isMantenedor}
                      type="text"
                      className="td-input"
                      value={currentTDText}
                      onKeyDown={handleTDKeyDown}
                      onChange={handleTDChange}
                      onBlur={handleTDBlur}
                      onFocus={handleTDFocus}
                      maxLength={4}
                  />

                </div>


                </div>
                <div className="AI" style={{ visibility: isProps_CLP1Visible ? 'visible' : 'hidden' }}>
                  <img className="sparkle" src='./sparkle.png'/>
                  <span className='IA'>
                    IA
                  </span>
                </div>
                </div>

                </SoftBox>
              </Card>
          </Grid>

          
        </Grid>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );

}

export default Dashboard;

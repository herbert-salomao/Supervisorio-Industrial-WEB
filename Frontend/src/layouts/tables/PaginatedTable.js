import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './PaginatedTable.css'; // Import the CSS file
import { json } from 'react-router-dom';

const PaginatedTable = ({rowsPerPage }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState('option1');
  const [jsonDataset, setJsonDataset] = useState({})
  const [firstCollum, setFirstCollum] = useState();
  const [secondCollum, setSecondCollum] = useState();
  const [thirdCollum, setThirdCollum] = useState();

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };




  useEffect(() => {
    const executeScript = async () => {
      let url
      url = `${process.env.REACT_APP_API_URL}/api/dbPID_CLP01`; // Replace with your actual URL for option 1
      setFirstCollum('KP')
      setSecondCollum('TI')
      setThirdCollum('TD')
      const response = await fetch(url);
      const jsonData = await response.json();
      const transformedData = Object.entries(jsonData).flatMap(([date, times]) =>
        Object.entries(times).map(([time, values]) => ({
          KP: values.KP || 'N/A',
          TI: values.TI ,
          TD: values.TD ,
          Date: date,
          Time: time,
        }))
        
      );
      
   

    setData(transformedData);
    setJsonDataset(jsonData);
    setCurrentPage(1);

    };

    executeScript();
    return () => {};
  }, []);




  const handleSelectChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    let url = '';
    switch (selectedValue) {
      case 'option1':
        url = `${process.env.REACT_APP_API_URL}/api/dbPID_CLP01`; // Replace with your actual URL for option 1
        setFirstCollum('KP')
        setSecondCollum('TI')
        setThirdCollum('TD')

        break;
      case 'option2':
        url = `${process.env.REACT_APP_API_URL}/api/dbPID_CLP02`; // Replace with your actual URL for option 2
        setFirstCollum('KP')
        setSecondCollum('TI')
        setThirdCollum('TD')
        break;
      case 'option3':
        url = `${process.env.REACT_APP_API_URL}/api/dbCLP01`; // Replace with your actual URL for option 3
        setFirstCollum('SP')
        setSecondCollum('PV')
        setThirdCollum('MV')
        break;
      case 'option4':
          url = `${process.env.REACT_APP_API_URL}/api/dbCLP02`; // Replace with your actual URL for option 3
          setFirstCollum('SP')
          setSecondCollum('PV')
          setThirdCollum('MV')
          break;
      default:
        setData([]);
        return;
    }
    try {
      console.log(selectedValue)
      const response = await fetch(url);
      const jsonData = await response.json();

      if (selectedValue == 'option1') {
        const transformedData = Object.entries(jsonData).flatMap(([date, times]) =>
          Object.entries(times).map(([time, values]) => ({
            KP: values.KP || 'N/A',
            TI: values.TI || 'N/A',
            TD: values.TD ,
            Date: date,
            Time: time,
          }))
          
        );
        
      const invertedData = transformedData.reverse();
      setJsonDataset(jsonData);
      setData(invertedData);
      } 
      if (selectedValue == 'option2') {
        const transformedData = Object.entries(jsonData).flatMap(([date, times]) =>
          Object.entries(times).map(([time, values]) => ({
            KP: values.KP || 'N/A',
            TI: values.TI || 'N/A',
            TD: values.TD ,
            Date: date,
            Time: time,
          }))
          
        );
        
      const invertedData = transformedData.reverse();
      setJsonDataset(jsonData);
      setData(invertedData);
      }

      if (selectedValue == 'option3') {
        const transformedData = Object.entries(jsonData).flatMap(([date, times]) =>
          Object.entries(times).map(([time, values]) => ({
            KP: values.SP,
            TI: values.PV ,
            TD: values.MV,
            Date: date,
            Time: time,
          }))
          
        );
        
      const invertedData = transformedData.reverse();
      setJsonDataset(jsonData);
      setData(invertedData);
      }

      if (selectedValue == 'option4') {
        const transformedData = Object.entries(jsonData).flatMap(([date, times]) =>
          Object.entries(times).map(([time, values]) => ({
            KP: values.SP,
            TI: values.PV ,
            TD: values.MV ,
            Date: date,
            Time: time,
          }))
          
        );
        
      const invertedData = transformedData.reverse();
      setJsonDataset(jsonData);
      setData(invertedData);
      }

      setCurrentPage(1); // Reset to the first page on new data load
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

  const pageLimit = 10; 
  const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
  const endPage = Math.min(totalPages, startPage + pageLimit - 1);

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(jsonDataset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };



  return (
  
    <div className="table-container">
      <div style={{ marginBottom: '20px' }}>
        <select id="options" style={{marginLeft: '40%'}} value={selectedOption} onChange={handleSelectChange}>
          <option value="option1">Otimizadores CLP-01</option>
          <option value="option2">Otimizadores CLP-02</option>
          <option value="option3">Gráfico de Controle CLP-01</option>
          <option value="option4">Gráfico de Controle CLP-02</option>
        </select>
        <button onClick={handleSave} style={{ marginLeft: '10px' }}>
          Salvar
        </button>
      </div>
      <div className="table" style={{overflow: 'auto'}}>
      <table className="soft-ui-table">
        <thead>
          <tr>
            <th>{firstCollum}</th>
            <th>{secondCollum}</th>
            <th>{thirdCollum}</th>
            <th>Data</th>
            <th>Horário</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={`${row.Date}-${row.Time}`}>
              <td>{row.KP}</td>
              <td>{row.TI}</td>
              <td>{row.TD}</td>
              <td>{row.Date}</td>
              <td>{row.Time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="pagination" style={{overflow: 'auto'}}>
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-nav-button"
          disabled={currentPage === 1} // Disable if on the first page
        >
          Anterior
        </button>

        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button
            key={startPage + index}
            onClick={() => handlePageChange(startPage + index)}
            className={`pagination-button ${currentPage === startPage + index ? 'active' : ''}`}
          >
            {startPage + index}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-nav-button"
          disabled={currentPage === totalPages} // Disable if on the last page
        >
          Proximo
        </button>
      </div>
      
    </div>
  );
};

PaginatedTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      KP: PropTypes.string.isRequired,
      TI: PropTypes.string.isRequired,
      TD: PropTypes.string.isRequired,
      Date: PropTypes.string.isRequired,
      Time: PropTypes.string.isRequired,
    })
  ).isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default PaginatedTable;

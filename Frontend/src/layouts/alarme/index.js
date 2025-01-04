import React, { useEffect, useState } from 'react';
import './alarme.css'; // Import the Soft UI CSS
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const Alarme = () => {
  const rowsPerPage = 10;
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchId, setSearchId] = useState('');
  const totalPages = Math.ceil(alarms.length / rowsPerPage);
  const [expandedRows, setExpandedRows] = useState({});


  // Function to fetch alarm data from API
  const fetchAlarms = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/alarme`);
      const data = await response.json();

      const formattedAlarms = [];
      for (const date in data) {
        for (const time in data[date]) {
          const alarm = data[date][time];
          formattedAlarms.push({
            id: alarm.id,
            nome: alarm.Nome,
            severity: alarm.Severidade,
            timestamp: `${date} ${time}`,
            description: alarm.Descricao,
          });
        }
      }

      setAlarms(formattedAlarms.reverse());
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar os dados dos alarmes.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleRowClick = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state of the clicked row
    }));
  };
  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const filteredAlarms = alarms.filter(alarm => 
    alarm.id.toString().includes(searchId) // Filtering based on ID search
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredAlarms.slice(startIndex, startIndex + rowsPerPage);

  const pageLimit = 10;
  const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
  const endPage = Math.min(totalPages, startPage + pageLimit - 1);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="table-container-search">
        {/* Search Input */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <input
          className='input-id'
            type="text"
            placeholder="Pesquisar por ID"
            value={searchId}
            onChange={handleSearchChange}
            style={{ padding: '10px', borderRadius: '5px', width: '250px', marginRight: '15px' }}
          />
        </div>

        <div className="table">
          <table className="soft-ui-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Severidade</th>
                <th>Data e Hora</th>
              </tr>
            </thead>
            <tbody>
            {currentRows.map((alarm) => (
                <React.Fragment key={alarm.id}>
                  <tr
                    onClick={() => handleRowClick(alarm.id)}
                    className="clickable-row"
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{alarm.id}</td>
                    <td>{alarm.nome}</td>
                    <td className={alarm.severity.toLowerCase()}>{alarm.severity}</td>
                    <td>{alarm.timestamp}</td>
                  </tr>
                  {/* Expanded row content */}
                  {expandedRows[alarm.id] && (
                    <tr className="expanded-row">
                      <td colSpan="4">
                        <div>
                          <strong>Informações Adicionais:</strong>
                          <p>{alarm.description}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="pagination-nav-button"
            disabled={currentPage === 1}
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

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="pagination-nav-button"
            disabled={currentPage === totalPages}
          >
            Próximo
          </button>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default Alarme;

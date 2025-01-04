
// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';
import PaginatedTable from './PaginatedTable';


function Tables() {
  const { columns, rows } = authorsTableData;
  const { columns: prCols, rows: prRows } = projectsTableData;





  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="tabela">
        <PaginatedTable rowsPerPage={10} />
      </div>

      <Footer />
    </DashboardLayout>
  );
}




export default Tables;

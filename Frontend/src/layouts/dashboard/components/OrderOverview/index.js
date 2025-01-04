
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import TimelineItem from "examples/Timeline/TimelineItem";

function Propriedades() {
  return (
    <Card className="h-100" >
      <SoftBox pt={3} px={3} style={{height: "400px"}}>
        <SoftTypography variant="h6" fontWeight="medium">
          Propriedades
        </SoftTypography>
        <SoftBox mt={1} mb={2}>
        </SoftBox>
      </SoftBox>
      <SoftBox>



      </SoftBox>
    </Card>
  );
}

export default Propriedades;



// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";

function Shop({ color, size }) {
  return (
    <img width="16px" src="statistics.png"/>
  );
}

// Setting default values for the props of Shop
Shop.defaultProps = {
  color: "dark",
  size: "16px",
};

// Typechecking props for the Shop
Shop.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
    "white",
  ]),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Shop;

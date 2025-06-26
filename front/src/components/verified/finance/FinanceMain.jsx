import { useSpring, animated } from "@react-spring/web";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "../../../App.css";
import { useState } from "react";
import FinanceTable from "./FinanceTable";
import NavbarWelcome from "../navbar/NavbarWelcome";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  const springProps = useSpring({
    // transform: value === index ? 'translateX(0%)' : 'translateX(100%)',
    scale: value === index ? 1 : 0,
    opacity: value === index ? 1 : 0,
  });

  return (
    <animated.div style={{ ...springProps }}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    </animated.div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function FinanceMain() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const springs = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { tension: 170, friction: 50 },
  });

  return (
    <Box>
      <NavbarWelcome />
      <animated.div
        style={{
          backgroundColor: "white",
          ...springs,
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            width: "100rem",
            height: "100%",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Table1" {...a11yProps(0)} />
            <Tab label="Table2" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <FinanceTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <FinanceTable />
        </CustomTabPanel>
      </animated.div>
    </Box>
  );
}

export default FinanceMain;

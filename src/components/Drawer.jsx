import React from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import InputData from './InputData';
import "./Drawer.css";
import { SpeedDialIcon } from '@mui/material';
import { useNavigate } from 'react-router';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: 'transparent',
  zIndex: 1,
  borderRadius: '30px'
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '30px',
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.divider,
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#0F7275', // Green color
    },
  },
});

function Drawer(props) {
  const { Data, setData, WetLeaves, WetLeavesWeightToday, DryLeaves, Flour, Shipment, UserID, window, firstText, secondText, thirdText, fourthText, firstImgSrc, secondImgSrc, thirdImgSrc, showThirdInput, includeFourthSection } = props;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  const handleSelectFlour = (flourID) => {
    console.log("Selected flour ID in Drawer component:", flourID);
  };

  const handleAddClick = () => {
    setOpen(true);
  };

  const navigate = useNavigate();

  const handleSettingsClick = () =>{
    navigate("settings", {replace: false});
  }
  const actions = [
    { icon: <AddIcon />, name: 'Add', onClick: handleAddClick },
    { icon: <SettingsIcon />, name: 'Settings', onClick: handleSettingsClick }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <SpeedDial
          ariaLabel="SpeedDial for add and settings"
          icon={<SpeedDialIcon />}
          direction="up"
          style={{ position: 'fixed', bottom: '75px', right: '16px', zIndex: '1000' }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>

        <SwipeableDrawer
          container={container}
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox>
            <InputData
              setData={setData}
              Data={Data}
              open={open}
              setOpen={setOpen}
              UserID={UserID}
              firstp={firstText}
              secondp={secondText}
              thirdp={thirdText}
              fourthp={fourthText}
              firstimg={firstImgSrc}
              secondimg={secondImgSrc}
              showThirdInput={showThirdInput}
              thirdimg={thirdImgSrc}
              includeFourthSection={includeFourthSection}
              WetLeaves={WetLeaves}
              DryLeaves={DryLeaves}
              Flour={Flour}
              Shipment={Shipment}
              WetLeavesWeightToday={WetLeavesWeightToday}
            />
          </StyledBox>
          <Puller />
        </SwipeableDrawer>
      </Root>
    </ThemeProvider>
  );
}

export default Drawer;

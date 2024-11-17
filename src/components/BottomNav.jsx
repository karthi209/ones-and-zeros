import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import LightbulbCircleRoundedIcon from '@mui/icons-material/LightbulbCircleRounded';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <Link to="/" onClick={() => setSelectedItem("home")}><BottomNavigationAction label="Home" icon={<HomeRoundedIcon />} /></Link>
        <BottomNavigationAction label="Blogs" icon={<AccountBalanceWalletRoundedIcon />} />
        <BottomNavigationAction label="Projects" icon={<AccountTreeRoundedIcon />} />
        <BottomNavigationAction label="About" icon={<LightbulbCircleRoundedIcon />} />
      </BottomNavigation>
    </Box>
  );
}
import { Box } from '@mui/material';
import React from 'react';
import Map from './features/map/Map';

const App = () => {
  return (
   <Box sx={{
    width: "100%",
    height: "100vh",
   }}>
    <Map/>
   </Box>
  );
}

export default App;

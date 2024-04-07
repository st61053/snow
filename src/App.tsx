import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Map from './features/map/Map';

import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Quest from './features/map/Quest';
import { useDispatch, useSelector } from 'react-redux';
import { getMap, setPolygons } from './features/map/mapSlice';
import { ref, onValue } from 'firebase/database';
import { database } from './utils/firebase';

const App = () => {
  const dispatch = useDispatch();
  const { polygons } = useSelector(getMap);

  const routes = polygons.map((polygon, i) => ({
    path: `/${polygon?.key}`,
    element: <Quest polygon={polygon} i={i} />
  }));

  useEffect(() => {
    console.log("run");
    const query = ref(database, `${"polygons"}`);
    return onValue(query, (snapshot) => {
      dispatch(setPolygons(snapshot.val()))
    });
  }, []);

  useEffect(() => {
    console.log(polygons);
  }, [polygons]);

  return (
    <Box sx={{
      width: "100%",
      height: "100vh",
    }}>
      <Routes>
        <Route key={`main`} path={"/map"} element={<Map />} />
        {
          routes.map((route, i) => (
            <Route key={`route_${i}`} path={route.path} element={route.element} />
          ))
        }
      </Routes>
    </Box>
  );
}

export default App;

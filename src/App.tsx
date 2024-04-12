import { Box } from '@mui/material';
import React, { ReactNode, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getMap, setDad, setHouses, setMessage, setPolygons } from './features/map/mapSlice';
import { ref, onValue, set } from 'firebase/database';
import { database } from './utils/firebase';

const App = ({children} : {children: ReactNode}) => {
  const dispatch = useDispatch();

  const {polygons, houses} = useSelector(getMap)

  useEffect(() => {
    const polygonsQuery = ref(database, `${"polygons"}`);
    return onValue(polygonsQuery, (snapshot) => {
      dispatch(setPolygons(snapshot.val()))
    });
  }, []);

  useEffect(() => {
    const housesQuery = ref(database, `${"houses"}`);
    return onValue(housesQuery, (snapshot) => {
      dispatch(setHouses(snapshot.val()))
    });
  }, []);

  useEffect(() => {
    const messagesQuery = ref(database, `${"messages"}`);
    return onValue(messagesQuery, (snapshot) => {
      dispatch(setMessage(snapshot.val()))
    });
  }, []);

  useEffect(() => {
    const dadQuery = ref(database, `${"dads"}`);
    return onValue(dadQuery, (snapshot) => {
      dispatch(setDad(snapshot.val()))
    });
  }, []);

  useEffect(() => {
    houses.forEach((house) => {
      const updatedHouse = ({
          ...house,
          influence: polygons.reduce((prev, next) => {

              if (next.first === house.id) return prev += next.influence;
              if (next.second === house.id) return prev += (next.influence / 100) * 80;
              if (next.third === house.id) return prev += (next.influence / 100) * 60;
              return prev;

          }, 0)
      })
      set(ref(database, 'houses/' + updatedHouse.id), {
          ...updatedHouse
      });
  })
  }, [polygons])

  return (
    <Box sx={{
      width: "100%",
      height: "100vh",
    }}>
      {children}
    </Box>
  );
}

export default App;

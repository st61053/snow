import { GoogleMap, useJsApiLoader, Polygon, Marker, InfoWindow } from '@react-google-maps/api'
import React, { useEffect, useRef, useState } from 'react'
import { onValue, ref } from "firebase/database";
import { database } from '../../utils/firebase';
import { getMap, setPolygons } from './mapSlice';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from '../../assets/icons';
import { Box, Card, Grid, Typography } from '@mui/material';
import { housesIcons } from './constants';

import life from "../../assets/life.png";

const Map = () => {
    const { polygons, houses } = useSelector(getMap);

    const [open, setOpen] = useState(-1);

    const mapRef = useRef(null);
    const [center, setCenter] = useState({
        lat: 50.086444, lng: 14.411963
    });

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`
    });

    const onLoad = React.useCallback(function callback(map: any) {
        mapRef.current = map;
    }, []);

    return (
        <>
            {
                isLoaded &&
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                    onLoad={onLoad}
                    options={{
                        gestureHandling: "greedy",
                        disableDefaultUI: true, // Vypne výchozí uživatelské rozhraní (UI)
                        streetViewControl: false, // Vypne ovládání street view
                        styles: [
                            {
                                featureType: "poi.business",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "transit",
                                elementType: "labels.icon",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "poi",
                                stylers: [
                                    { visibility: "off" }
                                ]
                            },
                            {
                                featureType: "poi.park",
                                stylers: [
                                    { visibility: "on" }
                                ]
                            },
                            {
                                featureType: "landscape.natural",
                                stylers: [
                                    { visibility: "off" }
                                ]
                            }
                        ],
                    }}

                >
                    {polygons.map((polygon) =>
                        <Polygon
                            key={polygon.name}
                            path={polygon.coords}
                            options={{
                                fillColor: polygon.first !== -1 ? houses.find((house) => house.id === polygon.first)?.color : polygon.color,
                                fillOpacity: 0.5,
                                strokeColor: "black",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,

                            }}
                        />
                    )}
                    {
                        polygons.map((polygon, i) => {
                            return (
                                <Marker
                                    key={`${polygon.name}_${i}`}
                                    position={polygon.position}
                                    icon={{
                                        url: icons[i],
                                        scaledSize: new google.maps.Size(40, 40),
                                    }}
                                    label={{
                                        text: `${polygon.influence ?? 0}`,
                                        // text: `${i ?? 0}`,
                                        fontWeight: "bold",
                                        className: 'marker-label'

                                    }}
                                    onClick={() => setOpen(open === i ? -1 : i)}

                                >
                                    {
                                        open === i &&
                                        <InfoWindow
                                            options={{ disableAutoPan: true }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                p: 0.5
                                            }}>
                                                <Typography
                                                    lineHeight={1}
                                                    sx={{ fontWeight: "bold" }}>
                                                    {`${polygon.name}`}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: "grey",
                                                        pb: 0.5
                                                    }}
                                                    variant='caption'>
                                                    {polygon.desc}
                                                </Typography>
                                                <Typography
                                                    variant='caption'>
                                                    {`${polygon.position.lat}, ${polygon.position.lng}`}
                                                </Typography>
                                            </Box>
                                        </InfoWindow>
                                    }

                                </Marker>
                            )
                        }
                        )
                    }


                </GoogleMap >
            }
            <Card sx={{
                position: "absolute",
                top: 0,
                width: "100%"
            }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container>
                            {
                                [...houses]
                                    .map((house, i) =>
                                        <Grid item xs={4} key={i}>
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}>
                                                <Box key={house.name} sx={{
                                                    p: 1,
                                                    pb: 0.5,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    justifyContent: "center"
                                                }}>
                                                    <img src={housesIcons[house.id]} width={"25px"} height={"25px"}></img>
                                                    <Typography
                                                        variant='caption'>
                                                        {`-`}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: house.color
                                                        }}
                                                        variant='caption'>
                                                        {`${house.influence.toFixed(2)}`}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 0.3,
                                                    pb: 1
                                                }}>
                                                    {[0, 1, 2, 3, 4].map((num) =>
                                                        <img
                                                        key={num}
                                                        style={{
                                                            filter: house.shields > num ? "grayscale(0%)" : "grayscale(100%)"
                                                        }}
                                                            src={life}
                                                            width={"12px"}
                                                            height={"12px"}>

                                                        </img>
                                                    )}

                                                </Box>
                                            </Box>
                                        </Grid>
                                    )}

                        </Grid>
                    </Grid>
                </Grid>



            </Card>
        </>
    )
}

export default React.memo(Map)
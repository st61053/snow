import { GoogleMap, useJsApiLoader, Polygon, Marker, InfoWindow } from '@react-google-maps/api'
import React, { useEffect, useRef, useState } from 'react'
import { onValue, ref } from "firebase/database";
import { database } from '../../utils/firebase';
import { getMap, setPolygons } from './mapSlice';
import { useDispatch, useSelector } from 'react-redux';

import { icons } from '../../assets/icons';
import { Box, Card, Dialog, DialogTitle, Divider, Grid, Typography, useTheme } from '@mui/material';
import { housesIcons } from './constants';

import life from "../../assets/life.png";
import dadIco from "../../assets/dad.png";
import { relative } from 'path';

const Map = () => {
    const { polygons, houses, message, dad } = useSelector(getMap);

    const theme = useTheme();

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
                                                    lineHeight={1.2}
                                                    sx={{
                                                        pt: 0.5,
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

                    {
                        dad.active && <Marker
                            key={`${dad.name}`}
                            position={dad.position}
                            icon={{
                                url: dadIco,
                                scaledSize: new google.maps.Size(30, 30),
                            }}
                            onClick={() => setOpen(open === 20 ? -1 : 20)}
                        >
                            {
                                dad.active && open === 20 &&
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
                                            {`${dad.name}`}
                                        </Typography>
                                        <Typography
                                            lineHeight={1.2}
                                            sx={{
                                                pt: 0.5,
                                                color: "grey",
                                                pb: 0.5
                                            }}
                                            variant='caption'>
                                            {dad.desc}
                                        </Typography>
                                        <Typography
                                            variant='caption'>
                                            {`${dad.position.lat}, ${dad.position.lng}`}
                                        </Typography>
                                    </Box>
                                </InfoWindow>
                            }

                        </Marker>
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
                                                    pb: 0.3,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    justifyContent: "center",
                                                }}>
                                                    <Box sx={{
                                                        position: "relative"
                                                    }}>
                                                        <img src={housesIcons[house.id]} width={"25px"} height={"25px"}></img>
                                                        {
                                                            [0, 1].map((num) => (
                                                                num < house.dads &&
                                                                <Box sx={{
                                                                    position: "absolute",
                                                                    bottom: 0,
                                                                    right: num* -9,
                                                                    display: "flex"
                                                                }}>
                                                                    <img src={dadIco} width={"10px"} height={"10px"}></img>
                                                                </Box>
                                                            ))
                                                        }
                                                    </Box>

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

            <Dialog open={Boolean(message.active)}>
                <DialogTitle>{message.title}</DialogTitle>
                <Box sx={{
                    px: 3,
                    pb: 4
                }}>
                    <Typography variant='caption'>
                        {message.message}
                    </Typography>
                </Box>
            </Dialog>
        </>
    )
}

export default React.memo(Map)
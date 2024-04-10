import React, { useEffect, useState } from 'react'
import { IPolygon, getMap } from './mapSlice'
import { Box, Card, Divider, Typography } from '@mui/material'
import { icons } from '../../assets/icons'
import { useSelector } from 'react-redux'

const Quest = ({ questKey }: { questKey: string }) => {

    const [polygon, setPolygon] = useState<IPolygon>();

    const { polygons } = useSelector(getMap);

    useEffect(() => {
        setPolygon(polygons.find((p) => p.key === questKey));
    }, [polygons]);

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#FDEBD0"
        }}>
            {polygon &&
                <Card sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "calc(100% - 2em)",
                    height: "calc(100% - 2em)",
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}>
                        <Box sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                <Typography
                                    variant='h6'
                                    sx={{
                                        fontWeight: "bold"
                                    }}
                                >
                                    {polygon?.name}
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{
                                        color: "grey"
                                    }}
                                >
                                    {`${polygon?.position.lat}, ${polygon?.position.lng}`}
                                </Typography>
                            </Box>
                            {polygon && <img src={icons[polygons.indexOf(polygon)]} width={"50px"} height={"50px"}></img>}
                        </Box>
                        <Box sx={{
                            px: 3
                        }}>
                            <Typography>
                                {polygon?.quest}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Divider />
                        <Box sx={{
                            p: 3,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Typography variant='h6'
                                sx={{
                                    color: "grey"
                                }}
                            >
                                {`-- ${polygon?.influence} --`}
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            }
        </Box>
    )
}

export default Quest
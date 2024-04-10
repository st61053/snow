import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { ref, set } from 'firebase/database';
import { database } from '../../utils/firebase';

// Define a type for the slice state
interface IMap {
    polygons: IPolygon[];
    houses: IHouse[];
}

export interface IPolygon {
    name: string;
    desc: string;
    position: { lat: number, lng: number };
    coords: google.maps.LatLngLiteral[];
    color: string;
    influence: number;
    first: number;
    second: number;
    third: number;
    quest: string;
    key: string;
}

export interface IHouse {
    id: number;
    name: string;
    influence: number;
    color: string;
    shields: number;
}


// Define the initial state using that type
const initialState: IMap = {
    polygons: [],
    houses: []
}

export const mapSlice = createSlice({
    name: 'counter',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setPolygons: (state, action: PayloadAction<IPolygon[]>) => {
            state.polygons = action.payload;
        },
        setHouses: (state, action: PayloadAction<IHouse[]>) => {

            state.houses = action.payload.map((house) => ({
                ...house,
                influence: house.influence - ((5 - house.shields) * 20)
            }))
        },


    },
})

const writeHouseData = (house: IHouse) => {

}

export const { setPolygons, setHouses } = mapSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getMap = (state: RootState) => state.mapSlice

export default mapSlice.reducer
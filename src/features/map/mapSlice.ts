import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { houses } from './constants';

// Define a type for the slice state
interface IMap {
    polygons: IPolygon[];
    houses: IHouse[];
}

export interface IPolygon {
    name: string;
    desc: string;
    position: { lat: number, lng: number};
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
    icon: string;
}


// Define the initial state using that type
const initialState: IMap = {
    polygons: [],
    houses: houses
}

export const mapSlice = createSlice({
    name: 'counter',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setPolygons: (state, action: PayloadAction<IPolygon[]>) => {
            state.polygons = action.payload;

            state.houses = state.houses.map((house) => ({
                ...house,
                influence: state.polygons.reduce((prev, next) => {
                    
                    if (next.first === house.id) return prev += next.influence;
                    if (next.second === house.id) return prev += (next.influence / 100) * 80;
                    if (next.third === house.id) return prev += (next.influence / 100) * 60;
                    return prev;

                }, 0)
            }))
        },
    },
})

export const { setPolygons } = mapSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getMap = (state: RootState) => state.mapSlice

export default mapSlice.reducer
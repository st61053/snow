import { IHouse } from "./mapSlice";

import stark from "../../assets/stark.png";
import lannister from "../../assets/lannister.png";
import tyrell from "../../assets/tyrell.png";

export const houses : IHouse[] = [
    {
        id: 0,
        name: "Starkové",
        influence: 0,
        color: "blue",
        icon: stark
    },
    {
        id: 1,
        name: "Lannisterové",
        influence: 0,
        color: "red",
        icon: lannister
    },
    {
        id: 2,
        name: "Tyrellové",
        influence: 0,
        color: "green",
        icon: tyrell
    },
]
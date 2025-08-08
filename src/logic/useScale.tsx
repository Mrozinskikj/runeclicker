import { createContext, useContext } from "react";

interface ScaleContextProps {
    scale: number;
    offsetX: number;
}

export const ScaleContext = createContext<ScaleContextProps>({ scale: 1, offsetX: 0 });

export const useScale = () => useContext(ScaleContext);
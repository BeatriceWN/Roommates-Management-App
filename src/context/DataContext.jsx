import { createContext, useContext, useEffect, useState } from "react";
const DataContext = createContext();
export const useData = () => useContext(DataContext);
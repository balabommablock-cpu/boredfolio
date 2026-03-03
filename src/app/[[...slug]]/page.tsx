"use client";
import dynamic from "next/dynamic";
const App = dynamic(() => import("../BoredfolioApp"), { ssr: false });
export default function CatchAll() { return <App />; }

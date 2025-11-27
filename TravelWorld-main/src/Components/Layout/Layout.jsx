import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Router from "../../Router/Routers";
import Footer from "../Footer/Footer";
import DynamicTravelAlerts from "../DynamicTravelAlerts";

const Layout = () => {
  const [travelData, setTravelData] = useState({
    drivingHours: 0,
    fuelLevel: 70,
    inForestZone: false,
    weather: "clear",
    speed: 50,
  });

  // Example: simulate driving hours increasing
  useEffect(() => {
    const interval = setInterval(() => {
      setTravelData((prev) => ({
        ...prev,
        drivingHours: prev.drivingHours + 1,
      }));
    }, 60000); // +1 hour every 60s for demo

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />

      {/* 🔔 Alerts available on all pages */}
      <DynamicTravelAlerts {...travelData} />

      <Router />

      <Footer />
    </div>
  );
};

export default Layout;

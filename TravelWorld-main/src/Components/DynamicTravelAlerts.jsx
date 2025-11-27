import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDynamicAlerts } from "../utils/getDynamicAlerts";

const DynamicTravelAlerts = (props) => {
  useEffect(() => {
    const alerts = getDynamicAlerts(props);

    alerts.forEach((alert) => {
      toast[alert.type](alert.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  }, [props]);

  return <ToastContainer />;
};

export default DynamicTravelAlerts;

// src/utils/getDynamicAlerts.js
export const getDynamicAlerts = ({
  drivingHours = 0,
  fuelLevel = 100,
  inForestZone = false,
  weather = "clear", // clear, rain, fog, heat
  speed = 0,
}) => {
  const alerts = [];
  const hour = new Date().getHours();

  // 🍳 Meal-time alerts
  if (hour >= 6 && hour < 11) {
    alerts.push({ type: "info", message: "☀️ Good Morning! It’s time for Breakfast." });
  } else if (hour >= 11 && hour < 16) {
    alerts.push({ type: "info", message: "🍴 It’s Lunch Time! Recharge yourself with a meal." });
  } else if (hour >= 15 && hour < 16) {
    alerts.push({ type: "info", message: "☕ Evening snacks? Don’t skip, stay energized!" });
  } else if (hour >= 20 && hour < 23) {
    alerts.push({ type: "info", message: "🌙 Dinner time! Better eat before it gets too late." });
  } else {
    alerts.push({ type: "info", message: "🌌 Midnight cravings? Find something light & safe." });
  }

  // 🚗 Driving alerts
  if (drivingHours >= 3) {
    alerts.push({ type: "warning", message: "🚗 You’ve been driving too long. Take a short break." });
  }
  if (drivingHours >= 5) {
    alerts.push({ type: "warning", message: "⚠️ Long continuous driving may cause fatigue. Rest recommended." });
  }

  // ⛽ Fuel alerts
  if (fuelLevel < 20) {
    alerts.push({ type: "warning", message: "⛽ Fuel running low! Refill soon." });
  } else if (fuelLevel < 10) {
    alerts.push({ type: "warning", message: "❌ Critical fuel warning! Stop at nearest fuel station." });
  }

  // 🌲 Forest & Night alerts
  if (inForestZone && (hour >= 21 || hour < 5)) {
    alerts.push({ type: "warning", message: "🌲 Dangerous zone at night! Stay nearby, don’t risk." });
  }

  // 🌦️ Weather alerts
  if (weather === "rain") {
    alerts.push({ type: "warning", message: "🌧️ Roads are wet, drive carefully." });
  } else if (weather === "fog") {
    alerts.push({ type: "warning", message: "🌫️ Low visibility ahead. Use fog lights." });
  } else if (weather === "heat") {
    alerts.push({ type: "info", message: "🔥 It’s very hot. Stay hydrated!" });
  }

  // ⚡ Speed alerts
  if (speed > 100) {
    alerts.push({ type: "warning", message: "⚡ You’re driving too fast! Slow down for safety." });
  } else if (speed < 30 && drivingHours > 1) {
    alerts.push({ type: "warning", message: "🐌 Driving slow for a while. Need a break?" });
  }

  return alerts;
};

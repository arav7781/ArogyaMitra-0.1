"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineController,
  BarController,
  PieController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import ResponsiveGridLayout from "react-grid-layout";
import Image from "next/image";
import { UserButton, useUser } from "@stackframe/stack";
import { Button } from "@heroui/button";
import Link from "next/link";
import GradientText from "@/components/ui/GradientText"; // Ensure this component exists
import { Vortex } from "@/components/ui/vortex"; // Ensure this component exists
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./page.css"; // Ensure this file exists

// Register Chart.js components
ChartJS.register(
  LineController,
  BarController,
  PieController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// App Header Component
function AppHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-blue-500 to-purple-500 opacity-70"></div>
          <Image
            src="/f2881fdf-d2ac-41a3-8c0a-7e9c30219a74.png"
            alt="logo"
            width={40}
            height={35}
            className="relative"
          />
        </div>
        <GradientText className="text-3xl font-bold">BlueBox AI</GradientText>
      </div>
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" className="text-sm font-medium">
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button asChild variant="ghost" className="text-sm font-medium">
            <Link href="/Docs">Docs</Link>
          </Button>
          <Button asChild variant="ghost" className="text-sm font-medium">
            <Link href="/support">Support</Link>
          </Button>
        </nav>
        <div className="relative">
          <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-blue-400 to-purple-400 opacity-70"></div>
          <UserButton className="relative" />
        </div>
      </div>
    </header>
  );
}

// User Profile Summary Component
function UserProfileSummary() {
  const user = useUser()
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-blue-500 to-purple-500 opacity-50"></div>
       <UserButton/>
      </div>
      <div>
        <h3 className="font-bold text-gray-500">Welcome back,{" "}
                    <GradientText as="span" className="inline">
                      {user?.displayName || "User"}
                    </GradientText></h3>
        <p className="text-sm text-gray-400">Premium Account · Active since March 2025</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-300">
            <span className="w-1.5 h-1.5 rounded-full bg-green-800 mr-1"></span>
            Online
          </span>
          <span className="text-xs text-gray-400">Last login: Today, 09:45 AM</span>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
const Page = () => {
  const [availablePlots, setAvailablePlots] = useState([]);
  const [selectedPlots, setSelectedPlots] = useState([]);
  const [parameters, setParameters] = useState({});
  const [theme, setTheme] = useState("dark");
  const [layout, setLayout] = useState([]);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [configName, setConfigName] = useState("");
  const [summary, setSummary] = useState({ totalSales: 0, topEmployee: "", topProduct: "", avgOrderValue: 0 });
  const [divisions, setDivisions] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [shipmentIds, setShipmentIds] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("visualizations");
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    growthRate: 0,
    activeProducts: 0,
    pendingShipments: 0,
  });
  const [userActivity, setUserActivity] = useState([
    { action: "Logged in", time: "Today, 09:45 AM" },
    { action: "Generated monthly report", time: "Yesterday, 04:30 PM" },
    { action: "Updated dashboard settings", time: "Apr 15, 2023, 11:20 AM" },
    { action: "Exported sales data", time: "Apr 12, 2023, 02:15 PM" },
  ]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:5000/api/available_plots"),
      axios.get("http://localhost:5000/api/filter_options/divisions"),
      axios.get("http://localhost:5000/api/filter_options/territories"),
      axios.get("http://localhost:5000/api/filter_options/shipment_ids"),
    ])
      .then(([plotsRes, divRes, terrRes, shipRes]) => {
        setAvailablePlots(plotsRes.data);
        setDivisions(divRes.data);
        setTerritories(terrRes.data);
        setShipmentIds(shipRes.data);

        const initialParams = {};
        plotsRes.data.forEach((plot) => {
          initialParams[plot.id] = {};
          plot.parameters.forEach((param) => {
            if (param.includes("date")) {
              initialParams[plot.id][param] = "";
            } else if (param === "shipment_id") {
              initialParams[plot.id][param] = shipRes.data[0] || "1";
            } else if (param === "month") {
              initialParams[plot.id][param] = new Date().toISOString().slice(0, 7);
            } else if (param === "top_n") {
              initialParams[plot.id][param] = "10";
            } else {
              initialParams[plot.id][param] = "";
            }
          });
        });
        setParameters(initialParams);
        setLayout(
          plotsRes.data.map((plot, i) => ({
            i: plot.id,
            x: (i % 2) * 6,
            y: Math.floor(i / 2) * 4,
            w: 6,
            h: 4,
          }))
        );
        setLoading(false);
        addNotification("Dashboard data loaded successfully", "success");
      })
      .catch((err) => {
        setError("Failed to load initial data. Please check server connection.");
        setLoading(false);
        console.error(err);
        addNotification("Failed to load dashboard data", "error");
      });

    const saved = JSON.parse(localStorage.getItem("dashboardConfigs") || "[]");
    setSavedConfigs(saved);

    setDashboardStats({
      totalRevenue: 12458900,
      growthRate: 14.2,
      activeProducts: 42,
      pendingShipments: 18,
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:5000/api/total_sales_by_month"),
      axios.get("http://localhost:5000/api/employee_ranking", { params: { top_n: 1 } }),
      axios.get("http://localhost:5000/api/top_selling_products", { params: { top_n: 1 } }),
    ])
      .then(([salesRes, empRes, prodRes]) => {
        const totalSales = salesRes.data.reduce((sum, d) => sum + d.TotalSales, 0);
        const topEmployee = empRes.data[0]?.EmployeeName || "N/A";
        const topProduct = prodRes.data[0]?.ProductName || "N/A";
        const avgOrderValue = salesRes.data.length > 0 ? totalSales / salesRes.data.length : 0;
        setSummary({ totalSales, topEmployee, topProduct, avgOrderValue });
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load summary data.");
        setLoading(false);
        console.error(err);
      });
  }, [parameters]);

  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 5000);
  };

  const handlePlotToggle = (plotId) => {
    setSelectedPlots((prev) =>
      prev.includes(plotId) ? prev.filter((id) => id !== plotId) : [...prev, plotId]
    );
  };

  const handleParameterChange = (plotId, param, value) => {
    setParameters((prev) => ({
      ...prev,
      [plotId]: { ...prev[plotId], [param]: value },
    }));
  };

  const resetParameters = () => {
    const resetParams = {};
    availablePlots.forEach((plot) => {
      resetParams[plot.id] = {};
      plot.parameters.forEach((param) => {
        if (param.includes("date")) {
          resetParams[plot.id][param] = "";
        } else if (param === "shipment_id") {
          resetParams[plot.id][param] = shipmentIds[0] || "1";
        } else if (param === "month") {
          resetParams[plot.id][param] = new Date().toISOString().slice(0, 7);
        } else if (param === "top_n") {
          resetParams[plot.id][param] = "10";
        } else {
          resetParams[plot.id][param] = "";
        }
      });
    });
    setParameters(resetParams);
    addNotification("Filters have been reset", "info");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    document.documentElement.classList.toggle("dark");
    addNotification(`Switched to ${theme === "light" ? "dark" : "light"} mode`, "info");
  };

  const saveConfig = () => {
    if (!configName) return;
    const config = { name: configName, selectedPlots, parameters, layout };
    const updatedConfigs = [...savedConfigs, config];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem("dashboardConfigs", JSON.stringify(updatedConfigs));
    setConfigName("");
    addNotification(`Configuration "${configName}" saved successfully`, "success");
  };

  const loadConfig = (config) => {
    setSelectedPlots(config.selectedPlots);
    setParameters(config.parameters);
    setLayout(config.layout);
    addNotification(`Configuration "${config.name}" loaded`, "success");
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
      <div className="min-h-screen">
        <AppHeader />
        <div className="fixed top-20 right-4 z-50 space-y-2 w-80">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className={`p-4 rounded-lg shadow-lg backdrop-blur-sm ${
                  notification.type === "success"
                    ? "bg-green-900/50 text-green-200 border-l-4 border-green-500"
                    : notification.type === "error"
                    ? "bg-red-900/50 text-red-200 border-l-4 border-red-500"
                    : "bg-blue-900/50 text-blue-200 border-l-4 border-blue-500"
                }`}
              >
                {notification.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                 <GradientText as="span" className="inline">
                    Sales Dashboard
                 </GradientText>
                </h1>
                <p className="mt-1 text-gray-400">Welcome back! Here's your sales performance overview</p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-indigo-900 text-indigo-200 hover:bg-indigo-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-full bg-indigo-900 text-indigo-200 hover:bg-indigo-800 md:hidden transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            {error && (
              <div className="p-4 mb-8 rounded-xl bg-red-900/30 text-red-200 border-l-4 border-red-500">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}
          </div>
          <div className="mb-8">
            <UserProfileSummary />
          </div>
          <div className="mb-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Dashboard Overview
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-gradient-to-r from-blue-500/80 to-indigo-600/80 rounded-lg p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-80">Total Revenue</p>
                      <p className="text-2xl font-bold mt-1">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <span className="flex items-center text-sm bg-white/20 px-2 py-1 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {dashboardStats.growthRate}% from last month
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-lg p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-80">Top Employee</p>
                      <p className="text-2xl font-bold mt-1">{summary.topEmployee}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <span className="flex items-center text-sm bg-white/20 px-2 py-1 rounded">
                      Top performer for 3 months
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-gradient-to-r from-emerald-500/80 to-teal-500/80 rounded-lg p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-80">Active Products</p>
                      <p className="text-2xl font-bold mt-1">{dashboardStats.activeProducts}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <span className="flex items-center text-sm bg-white/20 px-2 py-1 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      3 new this month
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-gradient-to-r from-amber-500/80 to-orange-500/80 rounded-lg p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-80">Pending Shipments</p>
                      <p className="text-2xl font-bold mt-1">{dashboardStats.pendingShipments}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <span className="flex items-center text-sm bg-white/20 px-2 py-1 rounded">5 require attention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div
              className={`fixed inset-y-0 left-0 w-64 md:w-80 transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:relative md:translate-x-0 transition-transform duration-300 z-30 bg-gray-800/95 backdrop-blur-sm border-r border-white/10 p-6 rounded-r-xl shadow-xl md:w-1/4 overflow-auto`}
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-indigo-900 text-indigo-200 hover:bg-indigo-800 md:hidden transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-bold mb-6 text-center text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Dashboard Controls
                </span>
              </h2>
              <div className="flex mb-6 p-1 rounded-lg bg-indigo-900/30">
                <button
                  onClick={() => setActiveTab("visualizations")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "visualizations" ? "bg-gray-800 text-indigo-400 shadow-sm" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Visualizations
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "settings" ? "bg-gray-800 text-indigo-400 shadow-sm" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Settings
                </button>
              </div>
              {activeTab === "visualizations" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-white">Select Visualizations</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {availablePlots.map((plot) => (
                        <label key={plot.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPlots.includes(plot.id)}
                            onChange={() => handlePlotToggle(plot.id)}
                            className="form-checkbox h-4 w-4 text-indigo-500 border-gray-600 bg-gray-700 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300">{plot.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-white">Set Filters</h3>
                    {selectedPlots.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPlots.map((plotId) => {
                          const plot = availablePlots.find((p) => p.id === plotId);
                          return (
                            <div
                              key={plotId}
                              className="p-4 rounded-lg bg-indigo-900/20 border border-indigo-800/30"
                            >
                              <h4 className="text-sm font-medium mb-3 text-gray-300">{plot.name}</h4>
                              <div className="space-y-3">
                                {plot.parameters.map((param) => (
                                  <div key={param}>
                                    <label className="block text-xs font-medium mb-1 text-gray-400">
                                      {param.replace("_", " ").toUpperCase()}
                                    </label>
                                    {param.includes("date") ? (
                                      <input
                                        type="date"
                                        value={parameters[plotId][param] || ""}
                                        onChange={(e) => handleParameterChange(plotId, param, e.target.value)}
                                        className="w-full rounded-md text-sm bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                      />
                                    ) : param === "shipment_id" ? (
                                      <select
                                        value={parameters[plotId][param] || shipmentIds[0] || "1"}
                                        onChange={(e) => handleParameterChange(plotId, param, e.target.value)}
                                        className="w-full rounded-md text-sm bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                      >
                                        {shipmentIds.map((id) => (
                                          <option key={id} value={id}>
                                            {id}
                                          </option>
                                        ))}
                                      </select>
                                    ) : param === "month" ? (
                                      <input
                                        type="month"
                                        value={parameters[plotId][param] || new Date().toISOString().slice(0, 7)}
                                        onChange={(e) => handleParameterChange(plotId, param, e.target.value)}
                                        className="w-full rounded-md text-sm bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                      />
                                    ) : param === "top_n" ? (
                                      <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={parameters[plotId][param] || "10"}
                                        onChange={(e) => handleParameterChange(plotId, param, e.target.value)}
                                        className="w-full rounded-md text-sm bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                      />
                                    ) : param === "division" ? (
                                      <select
                                        value={parameters[plotId][param] || ""}
                                        onChange={(e) => handleParameterChange(plotId, param, e.target.value)}
                                        className="w-full rounded-md text-sm bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                      >
                                        <option value="">All Divisions</option>
                                        {divisions.map((div) => (
                                          <option key={div} value={div}>
                                            {div}
                                          </option>
                                        ))}
                                      </select>
                                    ) : param === "territory" ? (
                                      <select
                                        value={parameters[plotId][param] || ""}
                                        onChange={(e) => handleParameterChange(plotId, param, e.target.value)}
                                        className="w-full rounded-md text-sm bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                      >
                                        <option value="">All Territories</option>
                                        {territories.map((terr) => (
                                          <option key={terr} value={terr}>
                                            {terr}
                                          </option>
                                        ))}
                                      </select>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        <button
                          onClick={resetParameters}
                          className="w-full py-2 px-4 rounded-md text-sm font-medium bg-red-900/30 text-red-300 hover:bg-red-800/50 transition-colors"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Select visualizations to configure filters</p>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-white">Save Configuration</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={configName}
                        onChange={(e) => setConfigName(e.target.value)}
                        placeholder="Configuration Name"
                        className="w-full rounded-md text-sm bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={saveConfig}
                        disabled={!configName}
                        className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                          !configName ? "opacity-50 cursor-not-allowed" : ""
                        } bg-indigo-600 text-white hover:bg-indigo-700 transition-colors`}
                      >
                        Save Current Layout
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-white">Load Configuration</h3>
                    {savedConfigs.length > 0 ? (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const config = savedConfigs.find((c) => c.name === e.target.value);
                            if (config) loadConfig(config);
                          }
                        }}
                        className="w-full rounded-md text-sm bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Configuration</option>
                        {savedConfigs.map((config) => (
                          <option key={config.name} value={config.name}>
                            {config.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-gray-400">No saved configurations</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-white">Recent Activity</h3>
                    <div className="space-y-2">
                      {userActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-2 rounded-lg bg-indigo-900/20 border border-indigo-800/30"
                        >
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400"></div>
                          <div>
                            <p className="text-sm text-gray-300">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="md:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full blur-md bg-indigo-600 opacity-50 animate-pulse"></div>
                    <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-indigo-400 rounded-full relative"></div>
                  </div>
                </div>
              ) : selectedPlots.length === 0 ? (
                <div className="p-8 rounded-xl text-center bg-gray-800/80 backdrop-blur-sm border border-white/10 shadow-xl">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute -inset-1 rounded-full blur-md bg-indigo-700 opacity-30"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-600 relative"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-white">No visualizations selected</h3>
                  <p className="text-sm text-gray-400">
                    Select visualizations from the sidebar to populate your dashboard
                  </p>
                </div>
              ) : (
                <ResponsiveGridLayout
                  className="layout"
                  layout={layout}
                  onLayoutChange={setLayout}
                  cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                  rowHeight={100}
                  width={1200}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                >
                  {selectedPlots.map((plotId) => {
                    const plot = availablePlots.find((p) => p.id === plotId);
                    return (
                      <div key={plotId} className="p-2">
                        <PlotComponent plot={plot} parameters={parameters[plotId] || {}} theme={theme} />
                      </div>
                    );
                  })}
                </ResponsiveGridLayout>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Plot Component
const PlotComponent = ({ plot, parameters, theme }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chartRef = useRef(null);
  const [aiInsight, setAiInsight] = useState("");
  const [showInsight, setShowInsight] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    const url =
      plot.id === "temperature_trends"
        ? `http://localhost:5000/api/${plot.id}/${parameters.shipment_id || "1"}`
        : `http://localhost:5000/api/${plot.id}`;

    axios
      .get(url, { params: parameters })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load visualization data. Please check server connection.");
        setLoading(false);
        console.error(err);
      });
  }, [plot.id, parameters]);

  useEffect(() => {
    if (data.length > 0 && plot.type !== "table" && !loading && !error) {
      const ctx = document.getElementById(`${plot.id}Chart`)?.getContext("2d");
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
        chartRef.current = new ChartJS(ctx, {
          type: plot.type,
          data: getChartData(plot.id, data),
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: theme === "light" ? "#1F2937" : "#E5E7EB",
                  font: { size: 12 },
                },
              },
              tooltip: {
                enabled: true,
                backgroundColor: theme === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(17, 24, 39, 0.9)",
                titleColor: theme === "light" ? "#1F2937" : "#E5E7EB",
                bodyColor: theme === "light" ? "#4B5563" : "#D1D5DB",
                borderColor: theme === "light" ? "rgba(209, 213, 219, 0.5)" : "rgba(75, 85, 99, 0.5)",
                borderWidth: 1,
                padding: 10,
                boxPadding: 5,
                usePointStyle: true,
                callbacks: {
                  labelPointStyle: () => ({
                    pointStyle: "circle",
                    rotation: 0,
                  }),
                },
              },
              title: {
                display: true,
                text: plot.name,
                font: { size: 16, weight: "bold" },
                color: theme === "light" ? "#1F2937" : "#E5E7EB",
                padding: { bottom: 15 },
              },
            },
            scales:
              plot.type !== "pie"
                ? {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: theme === "light" ? "#1F2937" : "#E5E7EB",
                        maxRotation: 45,
                        minRotation: 45,
                        font: { size: 10 },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      grid: { color: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" },
                      ticks: {
                        color: theme === "light" ? "#1F2937" : "#E5E7EB",
                        font: { size: 10 },
                        callback: (value) => {
                          if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + "M";
                          } else if (value >= 1000) {
                            return (value / 1000).toFixed(1) + "K";
                          }
                          return value;
                        },
                      },
                      title: {
                        display: plot.id === "shipment_cost_vs_sales",
                        text: "Sales (INR)",
                        color: theme === "light" ? "#1F2937" : "#E5E7EB",
                      },
                    },
                    ...(plot.id === "shipment_cost_vs_sales"
                      ? {
                          y1: {
                            position: "right",
                            beginAtZero: true,
                            grid: { display: false },
                            ticks: { color: theme === "light" ? "#1F2937" : "#E5E7EB" },
                            title: {
                              display: true,
                              text: "Transport Cost (INR)",
                              color: theme === "light" ? "#1F2937" : "#E5E7EB",
                            },
                          },
                        }
                      : {}),
                  }
                : {},
          },
        });
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, plot.id, plot.type, plot.name, theme, loading, error]);

  const getChartData = (plotId, data) => {
    const colors = {
      light: {
        primary: "rgb(79, 70, 229)",
        secondary: "rgba(244, 63, 94, 0.8)",
        tertiary: "rgba(16, 185, 129, 0.8)",
        accent: "rgb(245, 158, 11)",
      },
      dark: {
        primary: "rgb(99, 102, 241)",
        secondary: "rgba(251, 113, 133, 0.8)",
        tertiary: "rgba(52, 211, 153, 0.8)",
        accent: "rgb(251, 191, 36)",
      },
    };
    const themeColors = colors[theme];

    switch (plotId) {
      case "total_sales_by_month":
        return {
          labels: data.map((d) => d.Month),
          datasets: [
            {
              label: "Total Sales (INR)",
              data: data.map((d) => d.TotalSales),
              borderColor: themeColors.primary,
              backgroundColor: themeColors.primary + "33",
              tension: 0.3,
              fill: true,
              pointBackgroundColor: themeColors.primary,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        };
      case "sales_per_division":
        return {
          labels: data.map((d) => d.DivisionName),
          datasets: [
            {
              label: "Sales (INR)",
              data: data.map((d) => d.TotalSales),
              backgroundColor: [
                themeColors.primary,
                themeColors.secondary,
                themeColors.tertiary,
                themeColors.accent,
                "rgba(139, 92, 246, 0.8)",
              ],
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
            },
          ],
        };
      case "top_selling_products":
        return {
          labels: data.map((d) => d.ProductName),
          datasets: [
            {
              label: "Sales (INR)",
              data: data.map((d) => d.TotalSales),
              backgroundColor: themeColors.secondary,
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
              borderRadius: 4,
            },
          ],
        };
      case "on_time_vs_delayed_shipments":
        return {
          labels: data.map((d) => d.Status),
          datasets: [
            {
              data: data.map((d) => d.Count),
              backgroundColor: [themeColors.tertiary, themeColors.secondary],
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
            },
          ],
        };
      case "shipments_by_transport_mode":
        return {
          labels: data.map((d) => d.TransportMode),
          datasets: [
            {
              label: "Number of Shipments",
              data: data.map((d) => d.Count),
              backgroundColor: [themeColors.primary, themeColors.secondary, themeColors.tertiary, themeColors.accent],
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
              borderRadius: 4,
            },
          ],
        };
      case "temperature_trends":
        return {
          labels: data.map((d) => d.CheckTime),
          datasets: [
            {
              label: "Temperature (°C)",
              data: data.map((d) => d.Temperature),
              borderColor: themeColors.accent,
              backgroundColor: themeColors.accent + "33",
              tension: 0.3,
              fill: true,
              pointBackgroundColor: themeColors.accent,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        };
      case "temperature_violations":
        return {
          labels: data.map((d) => `Shipment ${d.ShipmentID}`),
          datasets: [
            {
              label: "Violations",
              data: data.map(() => 1),
              backgroundColor: themeColors.accent,
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
              borderRadius: 4,
            },
          ],
        };
      case "sales_by_employee":
        return {
          labels: data.map((d) => d.EmployeeName),
          datasets: [
            {
              label: "Sales (INR)",
              data: data.map((d) => d.TotalSales),
              backgroundColor: themeColors.secondary,
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
              borderRadius: 4,
            },
          ],
        };
      case "sales_by_territory":
        return {
          labels: data.map((d) => d.TerritoryName),
          datasets: [
            {
              label: "Sales (INR)",
              data: data.map((d) => d.TotalSales),
              backgroundColor: [
                themeColors.primary,
                themeColors.secondary,
                themeColors.tertiary,
                themeColors.accent,
                "rgba(139, 92, 246, 0.8)",
              ],
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
            },
          ],
        };
      case "sales_growth_rate":
        return {
          labels: data.map((d) => d.Month),
          datasets: [
            {
              label: "Growth Rate (%)",
              data: data.map((d) => d.GrowthRate),
              borderColor: themeColors.primary,
              backgroundColor: themeColors.primary + "33",
              tension: 0.3,
              fill: true,
              pointBackgroundColor: themeColors.primary,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        };
      case "customer_segmentation":
        return {
          labels: data.map((d) => d.Segment),
          datasets: [
            {
              data: data.map((d) => d.Count),
              backgroundColor: [themeColors.primary, themeColors.secondary, themeColors.tertiary],
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
            },
          ],
        };
      case "product_profitability":
        return {
          labels: data.map((d) => d.ProductName),
          datasets: [
            {
              label: "Profit Margin (%)",
              data: data.map((d) => d.ProfitMargin),
              backgroundColor: themeColors.tertiary,
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
              borderRadius: 4,
            },
          ],
        };
      case "sales_forecast":
        return {
          labels: data.map((d) => d.Month),
          datasets: [
            {
              label: "Sales (INR)",
              data: data.map((d) => d.TotalSales),
              borderColor: themeColors.primary,
              backgroundColor: themeColors.primary + "33",
              tension: 0.3,
              fill: true,
              pointBackgroundColor: data.map((d) => (d.IsForecast ? themeColors.accent : themeColors.primary)),
              pointRadius: 4,
              pointHoverRadius: 6,
              segment: {
                borderDash: (ctx) => (data[ctx.p0DataIndex].IsForecast ? [6, 6] : undefined),
              },
            },
          ],
        };
      case "employee_ranking":
        return {
          labels: data.map((d) => d.EmployeeName),
          datasets: [
            {
              label: "Sales (INR)",
              data: data.map((d) => d.TotalSales),
              backgroundColor: themeColors.secondary,
              borderWidth: 1,
              borderColor: theme === "light" ? "#ffffff" : "#1f2937",
              borderRadius: 4,
            },
          ],
        };
      case "shipment_cost_vs_sales":
        return {
          labels: data.map((d) => d.Month),
          datasets: [
            {
              label: "Sales (INR)",
              data: data.map((d) => d.TotalSales),
              borderColor: themeColors.primary,
              backgroundColor: themeColors.primary + "33",
              yAxisID: "y",
              tension: 0.3,
              fill: true,
              pointBackgroundColor: themeColors.primary,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: "Transport Cost (INR)",
              data: data.map((d) => d.TotalCost),
              borderColor: themeColors.accent,
              backgroundColor: themeColors.accent + "33",
              yAxisID: "y1",
              tension: 0.3,
              fill: true,
              pointBackgroundColor: themeColors.accent,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        };
      default:
        return {};
    }
  };

  const fetchAiInsight = () => {
    setLoading(true);
    const conversationId = "sales-insight-" + plot.id;
    axios
      .post("http://localhost:5000/chat", {
        message: `Analyze the ${plot.name} data: ${JSON.stringify(data.slice(0, 5))}. Suggest sales growth strategies.`,
        conversation_id: conversationId,
        model: "gemma2-9b-it",
      })
      .then((response) => {
        setAiInsight(response.data.answer);
        setShowInsight(true);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch insights.");
        setLoading(false);
        console.error(error);
      });
  };

  const exportData = (format) => {
    if (format === "csv") {
      window.location.href = `http://localhost:5000/api/export_report/${plot.id}?${new URLSearchParams(
        parameters
      ).toString()}`;
    } else if (format === "image" && chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement("a");
      link.download = `${plot.name.replace(/\s+/g, "_").toLowerCase()}.png`;
      link.href = url;
      link.click();
    }
    setShowExportOptions(false);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-white/10 shadow-xl flex justify-center items-center h-64"
      >
        <div className="relative">
          <div className="absolute -inset-4 rounded-full blur-md bg-indigo-500 opacity-50 animate-pulse"></div>
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-indigo-300 rounded-full relative"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-red-900/30 text-red-200 border-l-4 border-red-500"
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      </motion.div>
    );
  }

  if (plot.type === "table") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition duration-200"></div>
        <div className="relative p-6 rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{plot.name}</h2>
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="px-3 py-1 rounded-md bg-indigo-500 text-gray-200 hover:bg-indigo-600 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export
              </button>
              {showExportOptions && (
                <div className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => exportData("csv")}
                      className="block px-4 py-2 text-sm w-full text-left text-gray-200 hover:bg-gray-600"
                      role="menuitem"
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-900/30">
                  {plot.id === "sales_team_alignment" && (
                    <>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Team Name</th>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Division</th>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Manager</th>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Territory</th>
                    </>
                  )}
                  {plot.id === "expiring_batches" && (
                    <>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Batch ID</th>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Product ID</th>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Expiry Date</th>
                    </>
                  )}
                  {plot.id === "upcoming_permit_expiries" && (
                    <>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Permit Number</th>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Shipment ID</th>
                      <th className="border border-gray-700 p-2 text-left text-gray-300">Valid Till</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border border-gray-700 hover:bg-indigo-900/10">
                    {plot.id === "sales_team_alignment" && (
                      <>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.TeamName}</td>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.DivisionName}</td>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.ManagerName}</td>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.TerritoryName}</td>
                      </>
                    )}
                    {plot.id === "expiring_batches" && (
                      <>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.BatchID}</td>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.ProductID}</td>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.ExpiryDate}</td>
                      </>
                    )}
                    {plot.id === "upcoming_permit_expiries" && (
                      <>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.PermitNumber}</td>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.ShipmentID}</td>
                        <td className="border border-gray-700 p-2 text-gray-300">{item.ValidTill}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={fetchAiInsight}
            className="mt-4 px-4 py-2 rounded-md bg-emerald-500 text-gray-200 hover:bg-emerald-600 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            BlueBox AI Insights
          </button>
          {showInsight && aiInsight && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-emerald-900/20 border border-emerald-800/30"
            >
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 text-emerald-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-emerald-300">AI Insight</h3>
                  <p className="text-sm mt-1 text-emerald-400">{aiInsight}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition duration-200"></div>
      <div className="relative p-6 rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{plot.name}</h2>
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="px-3 py-1 rounded-md bg-indigo-500 text-gray-200 hover:bg-indigo-600 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export
            </button>
            {showExportOptions && (
              <div className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => exportData("csv")}
                    className="block px-4 py-2 text-sm w-full text-left text-gray-200 hover:bg-gray-600"
                    role="menuitem"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => exportData("image")}
                    className="block px-4 py-2 text-sm w-full text-left text-gray-200 hover:bg-gray-600"
                    role="menuitem"
                  >
                    Export as Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-64">
          <canvas id={`${plot.id}Chart`} className="w-full h-full"></canvas>
        </div>
        <div className="flex mt-4 space-x-2">
          <button
            onClick={fetchAiInsight}
            className="px-4 py-2 rounded-md bg-emerald-500 text-gray-200 hover:bg-emerald-600 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            BlueBox AI Insights
          </button>
          {showInsight && (
            <button
              onClick={() => setShowInsight(false)}
              className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
            >
              Hide Insights
            </button>
          )}
        </div>
        {showInsight && aiInsight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-emerald-900/20 border border-emerald-800/30"
          >
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 mt-0.5 text-emerald-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-emerald-300">BlueBox AI Insight</h3>
                <p className="text-sm mt-1 text-emerald-400">{aiInsight}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Page

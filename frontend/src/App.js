/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./pages/app/store";
import PickUp from "./pages/PickUp";
import { renderToString } from "react-dom/server";
import PickUp1 from "./pages/PickUp1";
import { useDispatch, useSelector } from "react-redux";
import { toggleSwitch } from "./pages/app/toggleSlice";
import HotelBill from "./pages/HotelBill";
import RestaurantBill from "./pages/RestaurantBill";
import KOT from "./pages/KOT";
import TokenBill from "./pages/TokenBill";
// import Test from './pages/Test';
import PrintSlectingPage from "./pages/PrintSelectingPage";
import LoginPage from "./pages/login/login";
import TableView from "./pages/tableview/tableView";
import Dashboard from "./pages/tempDashboard/dashboard";
import LiveView from "./pages/LiveView/LiveView"
import { SOCKET_URL } from "./url";
import io from "socket.io-client";
import DineIn from "./pages/dineIn";
import BillingTouchScreen from "./pages/billingTouchScreen";
import DineInBill from "./pages/dineInBill";
import KOTDineIn from "./pages/printDesign/DineInKot";
// Use the exposed ipcRenderer from preload script
const ipcRenderer = window.ipcRenderer;


// import TestPage from "./testPage";
// import Test from './pages/Test';
// import Test from './pages/Test';

const App = () => {
  // Add error handling for localStorage
  let systemPrinter = [];
  try {
    systemPrinter = JSON.parse(localStorage.getItem("printerPreference")) || [];
  } catch (error) {
    console.error('Error parsing printer preference:', error);
  }
  const macAddress = localStorage.getItem("macAddress");
  const pickupkot = systemPrinter?.filter(
    (printer) => printer.categoryId == "pickupKot"
  );
  const pickupbill = systemPrinter?.filter(
    (printer) => printer.categoryId == "pickupBill"
  );
  const deliverykot = systemPrinter?.filter(
    (printer) => printer.categoryId == "deliveryKot"
  );
  const deliverybill = systemPrinter?.filter(
    (printer) => printer.categoryId == "deliveryBill"
  );
  const hotelbill = systemPrinter?.filter(
    (printer) => printer.categoryId == "hotelBill"
  );
  const dineinBill = systemPrinter?.filter(
    (printer) => printer.categoryId == "dineinBill"
  );
  const dineinKot = systemPrinter?.filter(
    (printer) => printer.categoryId == "dineinKot"
  );
  const hotelkot = systemPrinter?.filter(
    (printer) => printer.categoryId == "hotelKot"
  );
  const getPrinter = (data) => {
    switch (data.billType) {
      case 'Pick Up':
        return pickupbill[0];
      case 'Delivery':
        return deliverybill[0];
      case 'Hotel':
        return hotelbill[0];
      case 'Dine In':
        return dineinBill[0];
      default:
        return pickupbill[0];
    }
  }
  const getKotPrinter = (data) => {
    switch (data.billType) {
      case 'Pick Up':
        return pickupkot[0];
      case 'Delivery':
        return deliverykot[0];
      case 'Hotel':
        return hotelkot[0];
      case 'Dine In':
        return dineinKot[0];
      default:
        return pickupkot[0];
    }
  }
  const getPrintData = (data) => {
    switch (data.billType) {
      case 'Pick Up':
        return renderToString(<RestaurantBill data={data} />);
      case 'Delivery':
        return renderToString(<RestaurantBill data={data} />);
      case 'Hotel':
        return renderToString(<HotelBill data={data} />);
      case 'Dine In':
        return renderToString(<DineInBill data={data} />);
      default:
        return renderToString(<RestaurantBill data={data} />);
    }
  }
  const getKotData = (data) => {
    switch (data.billType) {
      case 'Pick Up':
        return renderToString(<KOT data={data} />);
      case 'Delivery':
        return renderToString(<KOT data={data} />);
      case 'Hotel':
        return renderToString(<KOT data={data} />);
      case 'Dine In':
        return renderToString(<KOTDineIn data={data} />);
      default:
        return renderToString(<KOT data={data} />);
    }
  }
  useEffect(() => {
    if (store.getState().toggle.isSwitchOn) {
      localStorage.setItem("isSwitchOn", "true");
    } else {
      localStorage.setItem("isSwitchOn", "false");
    }
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("connect", () => {
    });
    socket.on(`print_Bill_${macAddress}`, (message) => {
      // setHoldCount(message);
      const printBill = {
        printer: getPrinter(message),
        data: getPrintData(message),
      };
      ipcRenderer.send("set-title", printBill);
    });
    socket.on(`print_Kot_${macAddress}`, (message) => {
      const printKot = {
        printer: getKotPrinter(message),
        data: getKotData(message),
      };
      ipcRenderer.send("set-title", printKot);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <Routes>
        {/* <Route path="/main/:tab/:billId" element={<PickUp />} /> */}
        <Route path="/main/:tab/:billId" element={<MainComponent />} />
        <Route path="/main/DineIn/:table/:billId/:status" element={<DineIn />} />
        {/* <Route path="/" element={<TestPage />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<RestaurantBill />} />
        {/* <Route path="/" element={<Test />} /> */}
        <Route path="/printSlectingPage" element={<PrintSlectingPage />} />
        <Route path="/LiveView" element={<LiveView />} />
        <Route path="/tableView" element={<TableView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/" element={<Test />} /> */}
      </Routes>
    </Provider>
  );
};

const MainComponent = () => {
  const dispatch = useDispatch();
  const isSwitchOn = useSelector((state) => state.toggle.isSwitchOn);
  useEffect(() => {
    const storedSwitchState = localStorage.getItem("isSwitchOn") == "true";
    if (isSwitchOn !== storedSwitchState) {
      dispatch(toggleSwitch());
    }
  }, [dispatch, isSwitchOn]);

  return isSwitchOn ? <BillingTouchScreen /> : <PickUp />;
};

export default App;

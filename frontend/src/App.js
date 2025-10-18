/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
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

// Global socket instance to maintain connection
let globalSocket = null;
let heartbeatInterval = null;
const RECONNECT_DELAY = 0; // Instant reconnection
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

// Helper to fetch system printer preferences
const getSystemPrinters = () => {
  try {
    return JSON.parse(localStorage.getItem("printerPreference")) || [];
  } catch (error) {
    console.error('Error parsing printer preference:', error);
    return [];
  }
};

// Global helper functions (retain old switch-case logic)
const getPrinter = (data) => {
  const systemPrinter = getSystemPrinters();
  const find = (id) => systemPrinter.find((printer) => printer.categoryId === id);
  switch (data.billType) {
    case 'Pick Up':
      return find('pickupBill');
    case 'Delivery':
      return find('deliveryBill');
    case 'Hotel':
      return find('hotelBill');
    case 'Dine In':
      return find('dineinBill');
    default:
      return find('pickupBill');
  }
};

const getKotPrinter = (data) => {
  const systemPrinter = getSystemPrinters();
  const find = (id) => systemPrinter.find((printer) => printer.categoryId === id);
  switch (data.billType) {
    case 'Pick Up':
      return find('pickupKot');
    case 'Delivery':
      return find('deliveryKot');
    case 'Hotel':
      return find('hotelKot');
    case 'Dine In':
      return find('dineinKot');
    default:
      return find('pickupKot');
  }
};

const getPrintData = (data) => {
  switch (data.billType) {
    case 'Pick Up':
      return renderToString(<RestaurantBill data={data} />);
    case 'Delivery':
      return renderToString(<RestaurantBill data={data} />);
    case 'Hotel':
      return renderToString(<HotelBill data={data} isEdit={data.isEdit} />);
    case 'Dine In':
      return renderToString(<DineInBill data={data} isEdit={data.isEdit} />);
    default:
      return renderToString(<RestaurantBill data={data} />);
  }
};

const getKotData = (data) => {
  switch (data.billType) {
    case 'Pick Up':
      return renderToString(<KOT data={data} isEdit={data.isEdit} />);
    case 'Delivery':
      return renderToString(<KOT data={data} isEdit={data.isEdit} />);
    case 'Hotel':
      return renderToString(<KOT data={data} isEdit={data.isEdit} />);
    case 'Dine In':
      return renderToString(<KOTDineIn data={data} isEdit={data.isEdit} />);
    default:
      return renderToString(<KOT data={data} />);
  }
};

// Socket connection function
const initializeSocket = () => {
  const macAddress = localStorage.getItem("macAddress");

  if (globalSocket && globalSocket.connected) {
    console.log("Socket already connected");
    return globalSocket;
  }

  console.log("Initializing socket connection...");

  globalSocket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: RECONNECT_DELAY,
    reconnectionAttempts: Infinity, // Never stop trying to reconnect
    timeout: 20000,
    forceNew: false,
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Connection event handlers
  globalSocket.on("connect", () => {
    console.log("Socket connected successfully");

    // Start heartbeat to keep connection alive
    startHeartbeat();
  });

  globalSocket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    stopHeartbeat();

    // Always try to reconnect immediately
    setTimeout(() => {
      console.log("Attempting to reconnect immediately...");
      globalSocket.connect();
    }, RECONNECT_DELAY);
  });

  globalSocket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
    // Don't count attempts, just keep trying
    console.log("Connection failed, will retry immediately...");
  });

  globalSocket.on("reconnect", (attemptNumber) => {
    console.log(`Socket reconnected after ${attemptNumber} attempts`);
    startHeartbeat();
  });

  globalSocket.on("reconnect_error", (error) => {
    console.error("Socket reconnection error:", error);
    // Will automatically retry due to Infinity attempts
  });

  globalSocket.on("reconnect_failed", () => {
    console.error("Socket reconnection failed, but will keep trying...");
    // Force a reconnection attempt
    setTimeout(() => {
      if (globalSocket) {
        globalSocket.connect();
      }
    }, 1000);
  });

  // Print event handlers
  globalSocket.on(`print_Bill_${macAddress}`, (message) => {
    console.log("message_BILL", message);
    try {
      const printBill = {
        printer: getPrinter(message),
        data: getPrintData(message),
      };
      // Add a small delay to ensure proper processing
      setTimeout(() => {
        ipcRenderer.send("set-title", printBill);
        console.log("Bill print request sent to IPC");
      }, 100);
    } catch (error) {
      console.error("Error processing bill print:", error);
    }
  });

  globalSocket.on(`print_Kot_${macAddress}`, (message) => {
    console.log("message_KOT", message);
    try {
      const printKot = {
        printer: getKotPrinter(message),
        data: getKotData(message),
      };
      // Add a small delay to ensure proper processing
      setTimeout(() => {
        ipcRenderer.send("set-title", printKot);
        console.log("KOT print request sent to IPC");
      }, 100);
    } catch (error) {
      console.error("Error processing KOT print:", error);
    }
  });

  return globalSocket;
};

// Heartbeat function to keep connection alive
const startHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }

  heartbeatInterval = setInterval(() => {
    if (globalSocket && globalSocket.connected) {
      globalSocket.emit('heartbeat', { timestamp: Date.now() });
      console.log("Heartbeat sent");
    } else {
      console.log("Socket not connected, attempting to reconnect...");
      if (globalSocket) {
        globalSocket.connect();
      }
    }
  }, HEARTBEAT_INTERVAL);
};

const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Function to get socket status
const getSocketStatus = () => {
  if (!globalSocket) return 'disconnected';
  return globalSocket.connected ? 'connected' : 'disconnected';
};

// Function to manually reconnect
const reconnectSocket = () => {
  if (globalSocket) {
    globalSocket.disconnect();
    setTimeout(() => {
      initializeSocket();
    }, 1000);
  }
};

// Expose socket functions globally for debugging
window.socketDebug = {
  getStatus: getSocketStatus,
  reconnect: reconnectSocket,
  getSocket: () => globalSocket
};

// Initialize socket on app start
// initializeSocket(); // This line is removed as per the edit hint.

// Keep socket alive when page becomes visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && globalSocket && !globalSocket.connected) {
    console.log("Page became visible, reconnecting socket...");
    reconnectSocket();
  }
});

// Keep socket alive on window focus
window.addEventListener('focus', () => {
  if (globalSocket && !globalSocket.connected) {
    console.log("Window focused, reconnecting socket...");
    reconnectSocket();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopHeartbeat();
  if (globalSocket) {
    globalSocket.disconnect();
  }
});

// import TestPage from "./testPage";
// import Test from './pages/Test';
// import Test from './pages/Test';

const App = () => {
  // Track macAddress from localStorage and update dynamically
  const [macAddress, setMacAddress] = React.useState(() => localStorage.getItem('macAddress') || '');

  // Sync macAddress when localStorage changes or periodically
  React.useEffect(() => {
    const checkMac = () => {
      const current = localStorage.getItem('macAddress') || '';
      if (current !== macAddress) {
        console.log('macAddress changed ->', current);
        setMacAddress(current);
      }
    };

    // Listen to storage events (cross-tab) and run check
    window.addEventListener('storage', checkMac);
    // Poll every 2 seconds as same-tab storage event does not fire
    const poll = setInterval(checkMac, 2000);

    return () => {
      window.removeEventListener('storage', checkMac);
      clearInterval(poll);
    };
  }, [macAddress]);

  // Track printerPreference from localStorage and update dynamically
  const [printerPreference, setPrinterPreference] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("printerPreference")) || [];
    } catch (err) {
      return [];
    }
  });

  // Sync printerPreference when localStorage changes or periodically
  React.useEffect(() => {
    const prefStringRef = { current: JSON.stringify(printerPreference) };

    const checkPrinter = () => {
      const raw = localStorage.getItem("printerPreference") || "[]";
      if (raw !== prefStringRef.current) {
        prefStringRef.current = raw;
        try {
          setPrinterPreference(JSON.parse(raw));
        } catch (err) {
          setPrinterPreference([]);
        }
      }
    };

    window.addEventListener('storage', checkPrinter);
    const poll = setInterval(checkPrinter, 2000);
    return () => {
      window.removeEventListener('storage', checkPrinter);
      clearInterval(poll);
    };
  }, []);

  // Derive printer category arrays from state
  const pickupkot = printerPreference.filter((p) => p.categoryId === "pickupKot");
  const pickupbill = printerPreference.filter((p) => p.categoryId === "pickupBill");
  const deliverykot = printerPreference.filter((p) => p.categoryId === "deliveryKot");
  const deliverybill = printerPreference.filter((p) => p.categoryId === "deliveryBill");
  const hotelbill = printerPreference.filter((p) => p.categoryId === "hotelBill");
  const dineinBill = printerPreference.filter((p) => p.categoryId === "dineinBill");
  const dineinKot = printerPreference.filter((p) => p.categoryId === "dineinKot");
  const hotelkot = printerPreference.filter((p) => p.categoryId === "hotelKot");
  // Use global helper functions (always read latest localStorage) so we don't get stale data

  useEffect(() => {
    console.log("macAddress", macAddress);
    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 0,
      timeout: 20000,
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('test', (message) => {
      console.log('test', message);
    });

    socket.on(`print_Bill_${macAddress}`, (message) => {
      console.log('message_BILL', message);
      try {
        const printer = getPrinter(message);
        console.log('message', message);
        console.log('Selected bill printer', printer);
        const printBill = {
          printer,
          data: getPrintData(message),
        };
        setTimeout(() => {
          ipcRenderer.send('set-title', printBill);
        }, 50);
      } catch (err) {
        console.error('Error processing bill print:', err);
      }
    });

    socket.on(`print_Kot_${macAddress}`, (message) => {
      console.log('message_KOT', message);
      try {
        const kotPrinter = getKotPrinter(message);
        console.log('Selected KOT printer', kotPrinter);
        const printKot = {
          printer: kotPrinter,
          data: getKotData(message),
        };
        setTimeout(() => {
          ipcRenderer.send('set-title', printKot);
        }, 50);
      } catch (err) {
        console.error('Error processing KOT print:', err);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [macAddress]);

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

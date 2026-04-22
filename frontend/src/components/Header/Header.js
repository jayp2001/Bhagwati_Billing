import React, { useState, useEffect, act, useRef } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "../Button/Button1";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import "./css/Header.css";
import { Modal, Popover, Switch, Tab, Tooltip, Typography } from "@mui/material";
import WatchLaterTwoToneIcon from "@mui/icons-material/WatchLaterTwoTone";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import GridViewIcon from "@mui/icons-material/GridView";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { toggleSwitch } from "../../pages/app/toggleSlice";
import CloseIcon from "@mui/icons-material/Close";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import UpdateIcon from "@mui/icons-material/Update";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import { BACKEND_BASE_URL, SOCKET_URL } from "../../url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import Badge from "@mui/material/Badge";
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LanguageIcon from "@mui/icons-material/Language";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import notificationSound from "../../assets/notificationSound.mp3";
// import io from 'socket.io-client';

const Header = (props) => {
  const dispatch = useDispatch();
  const isSwitchOn = useSelector((state) => state.toggle.isSwitchOn);
  const naviagate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [logOutPopup, setLogOutPopUp] = useState(false);
  const [adminPasswordModal, setAdminPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPcId, setAdminPcId] = useState('');
  const [tablePasswordModal, setTablePasswordModal] = useState(false);
  const [tablePassword, setTablePassword] = useState("");
  const tablePasswordInputRef = useRef(null);
  /** Stops socket `pendingBillList` from re-fetching while we already fetched (backend often echoes emit per GET → loop). */
  const suppressPendingSocketRefreshRef = useRef(false);
  const pendingBillListDebounceRef = useRef(null);
  const macAddress = localStorage.getItem("macAddress");

  const handlePopoverOpen = (event, data) => {
    setAnchorEl(event.currentTarget);
    setHoveredData(data);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 0,
      top: 5,
      padding: "0 4px",
      backgroundColor: "red",
      color: "white",
    },
  }));

  /** Parrot-style green (bright yellow-green) for pending count */
  const StyledPendingBadge = styled(Badge)(() => ({
    "& .MuiBadge-badge": {
      right: 0,
      top: 5,
      padding: "0 4px",
      backgroundColor: "#00C853",
      color: "#fff",
      fontWeight: 700,
    },
  }));

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setHoveredData(null);
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const handleToggle = () => {
    dispatch(toggleSwitch());
  };
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));
  const getBbill = async (id) => {
    await axios
      .get(
        `${BACKEND_BASE_URL}billingrouter/getBillDataById?billId=${id}`,
        config
      )
      .then((res) => {
        // console.log('path', location.pathname.split("/"))
        if ((location.pathname.split("/")[1] == 'main' && location.pathname.split("/")[2] == 'DineIn') && res.data.billType != 'Dine In') {
          naviagate(`/main/${res.data.billType}/${id}`)
        }
        else if (location.pathname.split("/")[1] != 'main' && location.pathname.split("/")[2] != 'DineIn') {
          res.data.billType == 'Dine In' ? naviagate(`/main/DineIn/${res.data.tableInfo.tableNo}/${res.data.billId}/${res.data.billStatus}`) : naviagate(`/main/${res.data.billType}/${id}`)
          toggleDrawer("right", false);
          setOpenHold(false);
        } else {
          if (res.data.billType == 'Dine In') {
            naviagate(`/main/DineIn/${res.data.tableInfo.tableNo}/${res.data.billId}/${res.data.billStatus}`)
          } else {
            props.setItems(res.data.itemData);
            props.setDueFormData({
              accountId: res?.data?.payInfo?.accountId,
              dueNote: res?.data?.dueNote,
              selectedAccount: res?.data?.payInfo
            });
            props.setUpiId(res.data.onlineId ? res.data.onlineId : '');
            props.setBillData({
              subTotal: res.data.totalAmount,
              discountType: res.data.discountType,
              discountValue: res.data.discountValue,
              settledAmount: res.data.settledAmount,
              totalDiscount: res.data.totalDiscount,
              billPayType: res.data.billPayType,
              billComment: res.data.billComment,
              billCommentAuto: res.data.billComment
                ? res.data.billComment.split(", ")
                : [],
            });
            res?.data?.billType == "Hotel"
              ? props.setCustomerData({
                customerId: "",
                addressId: "",
                mobileNo: res?.data?.hotelDetails?.mobileNo,
                customerName: res?.data?.hotelDetails?.customerName,
                address: "",
                locality: "",
                birthDate: "",
                aniversaryDate: "",
              })
              : props.setCustomerData(res.data.customerDetails);
            props.setEditBillData(res.data);
            props.setIsEdit(true);
            props.setButtonCLicked(res?.data?.billType);
            res?.data?.billType == "Hotel" &&
              props.setHotelFormData({
                hotelId: res.data?.hotelDetails?.hotelId,
                roomNo: res.data?.hotelDetails?.roomNo,
                selectedHotel: res.data?.hotelDetails,
              });
            toggleDrawer("right", false);
            setOpenHold(false);
          }
        }
      })
      .catch((error) => {
        setError(error.response ? error.response.data : "Network Error ...!!!");
      });
  };
  const getHoldBbill = async (id, type) => {
    if (location.pathname.split("/")[1] != 'main') {
      naviagate(`/main/${type}/${id}`)
      toggleDrawer("right", false);
      setOpenHold(false);
    } else {
      await axios
        .get(
          `${BACKEND_BASE_URL}billingrouter/getHoldBillDataById?holdId=${id}`,
          config
        )
        .then((res) => {
          props.setItems(res.data.itemData);
          props.setBillData({
            subTotal: res.data.totalAmount,
            discountType: res.data.discountType,
            discountValue: res.data.discountValue,
            settledAmount: res.data.settledAmount,
            totalDiscount: res.data.totalDiscount,
            billPayType: res.data.billPayType,
            billComment: res.data.billComment,
            billCommentAuto: res.data.billComment
              ? res.data.billComment.split(", ")
              : [],
          });
          res?.data?.billType == "Hotel"
            ? props.setCustomerData({
              customerId: "",
              addressId: "",
              mobileNo: res?.data?.hotelDetails?.mobileNo,
              customerName: res?.data?.hotelDetails?.customerName,
              address: "",
              locality: "",
              birthDate: "",
              aniversaryDate: "",
            })
            : props.setCustomerData(res.data.customerDetails);
          props.setEditBillData(res.data);
          props.setButtonCLicked(res?.data?.billType);
          res?.data?.billType == "Hotel" &&
            props.setHotelFormData({
              hotelId: res.data?.hotelDetails?.hotelId,
              roomNo: res.data?.hotelDetails?.roomNo,
              selectedHotel: res.data?.hotelDetails,
            });
          // console.log("LLPP", {
          //   customerId: "",
          //   addressId: "",
          //   mobileNo: res?.data?.hotelDetails?.mobileNo,
          //   customerName: res?.data?.hotelDetails?.customerName,
          //   address: "",
          //   locality: "",
          //   birthDate: "",
          //   aniversaryDate: "",
          // }, {
          //   hotelId: res?.data?.hotelDetails?.hotelId,
          //   roomNo: res?.data?.hotelDetails?.roomNo,
          //   selectedHotel: res?.data?.hotelDetails
          // })
          toggleDrawer("right", false);
          setOpenHold(false);
        })
        .catch((error) => {
          setError(error.response ? error.response.data : "Network Error ...!!!");
        });
    }
  };
  const discardBill = async (id) => {
    // if (window.confirm("Are You sure you want to discard hold bill ?")) {
    await axios
      .delete(
        `${BACKEND_BASE_URL}billingrouter/discardHoldData?holdId=${id}`,
        config
      )
      .then((res) => {
        // toggleDrawer("right", false);
        // setOpenHold(false);
        getHoldBills();
      })
      .catch((error) => {
        setError(error.response ? error.response.data : "Network Error ...!!!");
      });
    // }
  };

  useEffect(() => {
    getHoldCount();
  }, []);

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const getRecentToken = async (tab) => {
    await axios
      .get(
        `${BACKEND_BASE_URL}billingrouter/getRecentBillData?billType=${tab}`,
        config
      )
      .then((res) => {
        setRecentBill(res.data);
      })
      .catch((error) => {
        setRecentBill([]);
        // setError(error.response ? error.response.data : "Network Error ...!!!");
      });
  };
  const getHoldCount = async () => {
    await axios
      .get(`${BACKEND_BASE_URL}billingrouter/getHoldCount`, config)
      .then((res) => {
        setHoldCount(res.data.holdNo);
      })
      .catch((error) => {
        // setRecentBill([]);
        // setError(error.response ? error.response.data : "Network Error ...!!!");
      });
  };
  const getHoldBills = async () => {
    await axios
      .get(`${BACKEND_BASE_URL}billingrouter/getHoldBillData`, config)
      .then((res) => {
        setHoldBills(res.data);
      })
      .catch((error) => {
        setHoldBills([]);
        // setError(error.response ? error.response.data : "Network Error ...!!!");
      });
  };

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));
  const [state, setState] = useState({
    right: false,
  });
  const [openHold, setOpenHold] = useState(false);
  const [activeTab, setActiveTab] = useState("Pick Up");
  const [recentBill, setRecentBill] = useState([]);
  const [holdCount, setHoldCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [holdBills, setHoldBills] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingItems, setPendingItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [openOnlineRecent, setOpenOnlineRecent] = useState(false);
  const [openPendingDrawer, setOpenPendingDrawer] = useState(false);
  const [pendingQueueTab, setPendingQueueTab] = useState("pending");
  const [onlineRecentBills, setOnlineRecentBills] = useState([]);
  const [onlineRecentTotalCount, setOnlineRecentTotalCount] = useState(0);
  const [onlineRecentTotalAmount, setOnlineRecentTotalAmount] = useState(0);
  const [openPendingViewModal, setOpenPendingViewModal] = useState(false);
  const [pendingViewLoading, setPendingViewLoading] = useState(false);
  const [pendingViewError, setPendingViewError] = useState("");
  const [pendingViewData, setPendingViewData] = useState(null);

  const location = useLocation();
  const toggleDrawer = (anchor, open) => (event) => {
    // if (location.pathname.split("/")[1] == "main") {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    getRecentToken(location.pathname.split("/")[2] == 'DineIn' ? 'Dine In' : location.pathname.split("/")[2] ? location.pathname.split("/")[2] == 'Pick%20Up' || location.pathname.split("/")[2] == 'Pick Up' ? "Pick Up" : location.pathname.split("/")[2] : 'Pick Up');
    setActiveTab(location.pathname.split("/")[2] == 'DineIn' ? 'Dine In' : location.pathname.split("/")[2] ? location.pathname.split("/")[2] == 'Pick%20Up' || location.pathname.split("/")[2] == 'Pick Up' ? "Pick Up" : location.pathname.split("/")[2] : 'Pick Up');
    setState({ ...state, [anchor]: open });
    // }
  };
  const popOverOpen = Boolean(anchorEl);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
  };
  if (loading) {
    toast.loading("Please wait...", {
      toastId: "loading",
    });
  }
  if (success) {
    toast.dismiss("loading");
    toast("success", {
      type: "success",
      toastId: "success",
      position: "top-right",
      toastId: "error",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setTimeout(() => {
      setSuccess(false);
      setLoading(false);
    }, 50);
  }
  if (error) {
    setLoading(false);
    toast.dismiss("loading");
    toast(error, {
      type: "error",
      position: "top-right",
      toastId: "error",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setError(false);
  }
  const statusColors = {
    "Cancel": "bg-red-400 text-red-800",        // error/cancel
    "Food Ready": "bg-blue-300 text-blue-800", // in-progress
    "On Delivery": "bg-orange-300 text-yellow-800", // warning/ready
    "Print": "bg-gray-300 text-gray-800",       // neutral
    "CancelToken": "bg-pink-300 text-pink-800", // soft cancel/secondary
    "Complete": "bg-green-300 text-green-800",  // success/done
    "complete": "bg-green-300 text-green-800",  // success/done
  };

  const filteredBills = recentBill.filter((val) =>
    val.tokenNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 750 }}
      role="presentation"
    // onClick={toggleDrawer(anchor, false)}
    >
      <div className="flex justify-between items-center">
        <div className="p-2 my-1 text-base">Recent</div>
        <div
          className="icons pr-3 cursor-pointer"
          onClick={toggleDrawer(anchor, false)}
        >
          <CloseIcon />
        </div>
      </div>
      <hr className="mb-2" />

      <div className="flex p-2 my-1 sticky">
        <div
          className={`tabButton py-2 w-full text-center cursor-pointer ${activeTab === "Pick Up" ? "active" : ""
            }`}
          onClick={(event) => {
            event.stopPropagation();
            setActiveTab("Pick Up");
            getRecentToken("Pick Up");
            setSearchTerm("");
          }}
        >
          Pick Up
        </div>
        <div
          className={`tabButton py-2 w-full text-center cursor-pointer ${activeTab === "Delivery" ? "active" : ""
            }`}
          onClick={(event) => {
            event.stopPropagation();
            setActiveTab("Delivery");
            getRecentToken("Delivery");
            setSearchTerm("");
          }}
        >
          Delivery
        </div>
        <div
          className={`tabButton py-2 w-full text-center cursor-pointer ${activeTab === "Hotel" ? "active" : ""
            }`}
          onClick={(event) => {
            event.stopPropagation();
            setActiveTab("Hotel");
            getRecentToken("Hotel");
            setSearchTerm("");
          }}
        >
          Hotel
        </div>
        <div
          className={`tabButton py-2 w-full text-center cursor-pointer ${activeTab === "Dine In" ? "active" : ""
            }`}
          onClick={(event) => {
            event.stopPropagation();
            setActiveTab("Dine In");
            getRecentToken("Dine In");
            setSearchTerm("");
          }}
        >
          Dine In
        </div>
      </div>

      <div className="w-full px-3">
        <input
          type="search"
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="py-2 anotherSearch"
          value={searchTerm}
        />
      </div>
      <hr className="my-2" />
      <div className="recentBillGrid recentBillHeader mt-1">
        <span className="shrink-0 w-6" aria-hidden="true" />
        <div className="font-semibold min-w-0">Tkn No</div>
        {activeTab === 'Pick Up' ? (
          <div className="font-semibold text-center min-w-0">Info</div>
        ) : activeTab === 'Delivery' ? (
          <div className="font-semibold text-center min-w-0">Address</div>
        ) : activeTab === "Hotel" ? (
          <div className="font-semibold text-center min-w-0">Hotel</div>
        ) : activeTab === "Dine In" ? (
          <div className="font-semibold text-center min-w-0">Table No.</div>
        ) : (
          <div className="min-w-0" />
        )}
        <div className="font-semibold recentBillRsCol">Rs.</div>
      </div>

      <div
        className="recentBillContainer customHeightRecent"
        onClick={toggleDrawer(anchor, false)}
      >
        {filteredBills.length > 0 ? (
          filteredBills.map((data, index) => {
            const menuStatusLower = (data?.menuStatus || "").toLowerCase();
            return (
              <div
                className={`recentBillRow recentBillGrid pb-2 pt-2 cursor-pointer ${statusColors[data.billStatus] || ''} `}
                key={index}
                onClick={() => {
                  getBbill(data.billId);
                }}
              >
                <div className="flex items-center justify-center w-6 shrink-0 self-center">
                  {menuStatusLower === "offline" && (
                    <StorefrontIcon sx={{ fontSize: 18 }} className="opacity-90" />
                  )}
                  {menuStatusLower === "online" && (
                    <LanguageIcon sx={{ fontSize: 18 }} className="opacity-90" />
                  )}
                </div>
                <Tooltip title={data?.billStatus} arrow>
                  <div className="capitalize min-w-0 truncate">
                    {data.tokenNo} {"(" + data.billPayType + ")"}
                  </div>
                </Tooltip>
                <Tooltip title={data?.info} arrow>
                  <div
                    className="customername min-w-0"
                    style={{ textAlign: "center" }}
                  >
                    {data?.address}
                  </div>
                </Tooltip>
                <div className="recentBillRsCol">
                  {(data.totalAmount).toLocaleString("en-In", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="customHeightRecent flex justify-center text-center items-center ">
            <div className="text-center mb-20">
              <div>
                <HourglassEmptyIcon className="noFoundIcon grayColor" />
              </div>
              <p className="text-lg font-bold grayColor">No Token Found</p>
            </div>
          </div>
        )}
      </div>
    </Box>
  );

  const listHold = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 500 }}
      role="presentation"
    // onClick={toggleDrawer(anchor, false)}
    // onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="flex justify-between items-center">
        <div className="p-2 my-1 text-base">Hold Bills</div>
        <div
          className="icons pr-3 cursor-pointer"
          onClick={() => setOpenHold(false)}
        >
          <CloseIcon />
        </div>
      </div>
      <hr className="mb-2"></hr>
      {/* <div className="flex p-2 my-1">
        <div
          // onClick={
          //   (event) => {
          //   event.stopPropagation();
          //   setActiveTab("Dine In");
          //   getRecentToken("Dine In");
          // }}
          className={`tabButton py-2 w-full text-center cursor-pointer ${activeTab === "Dine In" ? "active" : ""
            }`}
        >
          Dine In
        </div>
        <div
          onClick={(event) => {
            event.stopPropagation();
            setActiveTab("Pick Up");
            getRecentToken("Pick Up");
          }}
          className={`tabButton py-2 w-full text-center cursor-pointer ${activeTab === "Pick Up" ? "active" : ""
            }`}
        >
          Pick Up
        </div>
        <div
          // onClick={(event) => {
          //   event.stopPropagation();
          //   setActiveTab("Delivery");
          //   getRecentToken("Delivery");
          // }}
          className={`tabButton py-2 w-full text-center cursor-pointer ${activeTab === "Delivery" ? "active" : ""
            }`}
        >
          Delivery
        </div>
        {/* <div
          onClick={(event) => {
            event.stopPropagation();
            setActiveTab("KOT");
            getRecentToken("KOT");
          }}
          className={`tabButton py-2 w-full text-center cursor-pointer ${
            activeTab === "KOT" ? "active" : ""
          }`}
        >
          KOT
        </div> */}
      {/* </div> */}
      {/* <div className="flex pl-6 pr-6 mt-1 justify-between recentBillHeader">
        <div>No</div>
        <div>Type</div>
        <div>Rs.</div>
      </div> */}
      <div className="recentBillContainer px-2 ">
        {holdBills.length > 0 ? (
          <>
            {holdBills?.map((data, index) => (
              <div
                key={index}
                className="border-2 blackBorder rounded-lg pt-1 my-4 overflow-hidden shadow-md"
              >
                <div
                  className="flex justify-between px-2"
                  onClick={() => {
                    getHoldBbill(data.holdId, data.billType);
                  }}
                >
                  <div className="flex items-center">
                    <p className="font-semibold text-xs">
                      Hold No: {index + 1}
                    </p>
                    <p className="p-1 rounded-md text-xs ml-3 bg-orange-50">
                      {data?.billType}
                    </p>
                  </div>
                  <div className="daateTimeForHold">
                    <div className="flex items-center text-xs">
                      <CalendarMonthIcon className="HoldBillsIcons" />
                      <p className="text-gray-500">2024-06-28 15:22:49</p>
                    </div>
                  </div>
                </div>
                <div
                  className=" mt-2 flex justify-between px-2 "
                  onClick={() => {
                    getHoldBbill(data.holdId, data.billType);
                  }}
                >
                  <div>
                    <div className="font-semibold text-xs flex items-center">
                      Order Status: {data.orderStatus}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-xs flex items-center ">
                      <CurrencyRupeeIcon className="rupeesIcon" />{" "}
                      {parseFloat(data.totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                <div className="border-t-2 mt-2">
                  <div className="flex bg-gray-200 justify-between items-center px-2 py-1">
                    <div
                      onClick={() => {
                        getHoldBbill(data.holdId, data.billType);
                      }}
                      className="CustomWisthToDisableArea"
                    >
                      <p className="text-gray-500 text-xs">Kept On Hold by</p>
                      <p className="mt-1 text-sm">{data.holdBy}</p>
                    </div>
                    <div>
                      <button
                        className="px-2 py-1 border border-black bg-white rounded-md text-xs"
                        onClick={() => discardBill(data.holdId)}
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="customHeightHold flex justify-center text-center items-center ">
            <div className="text-center mb-20">
              <div>
                <UpdateIcon className="noFoundIcon grayColor" />
              </div>
              <p className="text-lg font-bold grayColor">No Hold Bills</p>
            </div>
          </div>
        )}
      </div>
    </Box>
  );
  const playNotificationSound = () => {
    try {
      const audio = new Audio(notificationSound);
      audio.playbackRate = 1.5;
      audio.play().catch(() => { });
    } catch (e) {
      console.error("Notification sound failed", e);
    }
  };

  /** `status=Pending` only — drawer open, Pending tab, after actions on Pending tab, socket `pendingBillList`. */
  const fetchPendingListOnly = async () => {
    suppressPendingSocketRefreshRef.current = true;
    try {
      const pRes = await axios.get(
        `${BACKEND_BASE_URL}billingrouter/getPendingBillData?status=Pending`,
        config
      );
      const pList = Array.isArray(pRes.data) ? pRes.data : [];
      setPendingItems(pList);
      setPendingCount(pList.length);
    } catch (e) {
      setPendingItems([]);
    } finally {
      window.setTimeout(() => {
        suppressPendingSocketRefreshRef.current = false;
      }, 800);
    }
  };

  /** `status=Reject` only — Rejected tab selected, after actions on Rejected tab. */
  const fetchRejectedList = async () => {
    try {
      const rRes = await axios.get(
        `${BACKEND_BASE_URL}billingrouter/getPendingBillData?status=Reject`,
        config
      );
      setRejectedItems(Array.isArray(rRes.data) ? rRes.data : []);
    } catch (e) {
      setRejectedItems([]);
    }
  };

  const fetchOnlineRecentBills = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}billingrouter/getBillDataForOnlineOrder`,
        config
      );
      const payload = res?.data;
      if (Array.isArray(payload)) {
        const total = payload.reduce(
          (sum, row) => sum + Number(row?.totalAmount || 0),
          0
        );
        setOnlineRecentBills(payload);
        setOnlineRecentTotalCount(payload.length);
        setOnlineRecentTotalAmount(total);
      } else {
        const rows = Array.isArray(payload?.rows) ? payload.rows : [];
        setOnlineRecentBills(rows);
        setOnlineRecentTotalCount(Number(payload?.totalCount || rows.length || 0));
        setOnlineRecentTotalAmount(Number(payload?.totalAmount || 0));
      }
    } catch (e) {
      setOnlineRecentBills([]);
      setOnlineRecentTotalCount(0);
      setOnlineRecentTotalAmount(0);
    }
  };

  const handlePendingView = async (pendingId) => {
    setOpenPendingViewModal(true);
    setPendingViewLoading(true);
    setPendingViewError("");
    setPendingViewData(null);
    try {
      const res = await axios.get(
        `${BACKEND_BASE_URL}billingrouter/getPendingBillDataById`,
        { ...config, params: { pendingId } }
      );
      setPendingViewData(res?.data || null);
    } catch (e) {
      const msg =
        (typeof e?.response?.data === "string" && e.response.data) ||
        e?.response?.data?.message ||
        "Failed to fetch pending order details";
      setPendingViewError(msg);
    } finally {
      setPendingViewLoading(false);
    }
  };

  /** Socket `pendingBillList` — refresh pending queue only. */
  const refreshPendingListFromSocket = () => {
    if (suppressPendingSocketRefreshRef.current) {
      return;
    }
    fetchPendingListOnly();
  };

  /**
   * Accept / Approve (rejected tab): GET acceptPendingBillData?pendingId=
   * Reject: GET rejectPendingBillData?pendingId=
   * Discard: DELETE discardpendingData?pendingId=
   *
   * @param {string} pendingId
   * @param {'Accepted'|'Rejected'|'Approved'|'Discarded'} status
   */
  const handlePendingAction = async (pendingId, status) => {
    try {
      switch (status) {
        case "Accepted":
        case "Approved":
          await axios.get(
            `${BACKEND_BASE_URL}billingrouter/acceptPendingBillData`,
            { ...config, params: { pendingId } }
          );
          break;
        case "Rejected":
          await axios.get(
            `${BACKEND_BASE_URL}billingrouter/rejectPendingBillData`,
            { ...config, params: { pendingId } }
          );
          break;
        case "Discarded":
          await axios.delete(
            `${BACKEND_BASE_URL}billingrouter/discardpendingData`,
            { ...config, params: { pendingId } }
          );
          break;
        default:
          toast.error("Unknown action");
          return;
      }
      if (pendingQueueTab === "pending") {
        await fetchPendingListOnly();
      } else {
        await fetchRejectedList();
      }
    } catch (e) {
      const msg =
        (typeof e?.response?.data === "string" && e.response.data) ||
        e?.response?.data?.message ||
        "Request failed";
      toast.error(msg);
    }
  };

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("getHoldCount", (message) => {
      setHoldCount(message);
    });
    socket.on("getpendingCount", (count) => {
      const n = typeof count === "number" ? count : Number(count);
      setPendingCount(Number.isFinite(n) ? n : 0);
    });
    socket.on("pendingBillList", () => {
      if (suppressPendingSocketRefreshRef.current) {
        return;
      }
      if (pendingBillListDebounceRef.current) {
        clearTimeout(pendingBillListDebounceRef.current);
      }
      pendingBillListDebounceRef.current = setTimeout(() => {
        pendingBillListDebounceRef.current = null;
        refreshPendingListFromSocket();
      }, 400);
    });
    socket.on("notification", () => {
      playNotificationSound();
    });
    return () => {
      if (pendingBillListDebounceRef.current) {
        clearTimeout(pendingBillListDebounceRef.current);
        pendingBillListDebounceRef.current = null;
      }
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    suppressPendingSocketRefreshRef.current = true;
    axios
      .get(
        `${BACKEND_BASE_URL}billingrouter/getPendingBillData?status=Pending`,
        config
      )
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setPendingCount(list.length);
      })
      .catch(() => { })
      .finally(() => {
        window.setTimeout(() => {
          suppressPendingSocketRefreshRef.current = false;
        }, 800);
      });
  }, []);

  /** Drawer opens: load Pending list only. Rejected list loads when user switches to that tab. */
  useEffect(() => {
    if (!openPendingDrawer) return;
    fetchPendingListOnly();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh on drawer open only
  }, [openPendingDrawer]);

  /** Border-only accent (no fill) — pending queue cards + online recent rows */
  const pendingQueueCardBorderClass = (billType) => {
    switch (billType) {
      case "Pick Up":
        return "border border-gray-200 border-l-4 border-l-amber-500";
      case "Delivery":
        return "border border-gray-200 border-l-4 border-l-blue-500";
      case "Hotel":
        return "border border-gray-200 border-l-4 border-l-violet-600";
      case "Dine In":
        return "border border-gray-200 border-l-4 border-l-emerald-600";
      default:
        return "border border-gray-200 border-l-4 border-l-gray-400";
    }
  };

  /**
   * Normalizes address lines — API may use address/locality, info, or alternate keys.
   */
  const getPendingAddressFields = (row) => {
    const pick = (...vals) => {
      for (const v of vals) {
        if (v == null) continue;
        const s = String(v).trim();
        if (s) return s;
      }
      return "";
    };
    const address = pick(
      row.address,
      row.Address,
      row.deliveryAddress,
      row.delivery_address,
      row.fullAddress,
      row.info,
      row.Info,
      row.deliveryInfo
    );
    const locality = pick(
      row.locality,
      row.Locality,
      row.area,
      row.Area,
      row.landmark,
      row.city
    );
    return { address, locality };
  };

  const getPendingContactFields = (row) => {
    let name =
      row.customerName ??
      row.CustomerName ??
      row.customer_name ??
      row.name ??
      "";
    let phone =
      row.phoneNumber ??
      row.PhoneNumber ??
      row.phone ??
      row.mobile ??
      "";
    name = String(name).trim();
    phone = String(phone).trim();
    // API sometimes puts mobile in customerName only
    const digitsOnly = name.replace(/\D/g, "");
    if (!phone && name && digitsOnly.length >= 8 && digitsOnly === name.replace(/\s/g, "")) {
      phone = name;
      name = "";
    }
    return { name, phone };
  };

  /**
   * Order: Phone → Name → (Hotel: hotel, room) → Address → Locality. Omit null/empty.
   *
   * @param {object} row
   * @param {{ compact?: boolean }} [options] — compact layout for pending drawer cards
   */
  const renderPendingMeta = (row, options = {}) => {
    const compact = options.compact === true;
    const t = compact ? "text-[11px] leading-snug" : "text-xs";
    const mt = compact ? "mt-0.5" : "mt-1";
    const { name, phone } = getPendingContactFields(row);
    const { address, locality } = getPendingAddressFields(row);

    const hotelTitle = (row.hoteName || row.hotelName || "").toString().trim();
    const room = row.roomNo != null && String(row.roomNo).trim() ? String(row.roomNo).trim() : "";

    return (
      <div className={`${t} text-gray-600 ${mt} space-y-0.5`}>
        {phone ? (
          <div className="text-gray-800 leading-tight">
            <span className="text-gray-500">Phone: </span>
            {phone}
          </div>
        ) : null}
        {name ? (
          <div className="text-gray-800 leading-tight">
            <span className="text-gray-500">Name: </span>
            {name}
          </div>
        ) : null}

        {row.billType === "Hotel" && hotelTitle ? (
          <div className="font-semibold text-gray-800 leading-tight">{hotelTitle}</div>
        ) : null}
        {row.billType === "Hotel" && room ? (
          <div className="leading-tight">
            <span className="text-gray-500">Room: </span>
            {room}
          </div>
        ) : null}

        {address ? (
          <div className="leading-tight">
            <span className="text-gray-500">Address: </span>
            {address}
          </div>
        ) : null}
        {locality ? (
          <div className="leading-tight">
            <span className="text-gray-500">Locality: </span>
            {locality}
          </div>
        ) : null}
      </div>
    );
  };

  const listOnlineRecent = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 520,
        height: "100%",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      role="presentation"
    >
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="p-2 my-0.5 text-base font-semibold">Online Recent Orders</div>
          <div
            className="icons pr-3 cursor-pointer"
            onClick={() => setOpenOnlineRecent(false)}
          >
            <CloseIcon sx={{ fontSize: "1.15rem" }} />
          </div>
        </div>
        <hr className="mb-1" />
        <div className="flex pl-4 pr-3 mt-0.5 pb-1 justify-between onlineRecentBillHeader text-sm font-semibold">
          <div>Token</div>
          <div className="mr-6">Info</div>
          <div>Rs.</div>
        </div>
      </div>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
          pt: 2,
          pb: 2,
        }}
      >
        {onlineRecentBills.length > 0 ? (
          onlineRecentBills.map((data, index) => (
            <div
              key={data.billId || index}
              className={`recentBillRow py-2 flex justify-between items-center cursor-pointer rounded-md mb-2 px-2 bg-white shadow-sm text-[12px] leading-tight ${pendingQueueCardBorderClass(
                data.billType
              )} ${statusColors[data.billStatus] || ""}`}
              onClick={() => {
                getBbill(data.billId);
                setOpenOnlineRecent(false);
              }}
            >
              <div className="pl-1 capitalize flex flex-col gap-0.5 min-w-0 shrink">
                <span className="font-semibold text-[13px] text-gray-900">
                  {data.tokenNo} ({data.billPayType || ""})
                </span>
                <span className="text-[10px] rounded px-1 py-px w-fit bg-white/90 border border-gray-200/80">
                  {data.billType}
                </span>
              </div>
              <Tooltip title={data?.info || data?.address || ""} arrow>
                <div
                  className="customername ml-2 text-center max-w-[220px] truncate text-[12px] text-gray-700"
                  style={{ textAlign: "center" }}
                >
                  {data?.address || data?.info || "—"}
                </div>
              </Tooltip>
              <div className="pr-1 w-24 shrink-0 text-end tabular-nums font-semibold text-[13px] text-gray-900">
                {Number(data.totalAmount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-[min(320px,50vh)] justify-center items-center text-center py-12">
            <div className="text-center">
              <HourglassEmptyIcon className="noFoundIcon grayColor" />
              <p className="text-lg font-bold grayColor">No online orders</p>
            </div>
          </div>
        )}
      </Box>
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">
            Total Orders: {onlineRecentTotalCount}
          </span>
          <span className="font-semibold text-gray-900 tabular-nums">
            Total Amt: {Number(onlineRecentTotalAmount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </Box>
  );

  const listPendingQueue = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 520,
        height: "100%",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      role="presentation"
    >
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="p-2 my-1 text-base">Online Pending Orders</div>
          <div
            className="icons pr-3 cursor-pointer"
            onClick={() => setOpenPendingDrawer(false)}
          >
            <CloseIcon />
          </div>
        </div>
        <hr className="mb-2" />
        <div className="flex p-2 my-1">
          <div
            className={`tabButton py-2 w-full text-center cursor-pointer ${pendingQueueTab === "pending" ? "active" : ""
              }`}
            onClick={(e) => {
              e.stopPropagation();
              setPendingQueueTab("pending");
              fetchPendingListOnly();
            }}
          >
            Pending
          </div>
          <div
            className={`tabButton py-2 w-full text-center cursor-pointer ${pendingQueueTab === "rejected" ? "active" : ""
              }`}
            onClick={(e) => {
              e.stopPropagation();
              setPendingQueueTab("rejected");
              fetchRejectedList();
            }}
          >
            Rejected
          </div>
        </div>
      </div>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
          pb: 2,
        }}
      >
        {(pendingQueueTab === "pending" ? pendingItems : rejectedItems).length >
          0 ? (
          (pendingQueueTab === "pending" ? pendingItems : rejectedItems).map(
            (data, index) => (
              <div
                key={data.pendingId || index}
                className={`relative rounded-md my-2 overflow-hidden shadow-sm bg-white ${pendingQueueCardBorderClass(
                  data.billType
                )}`}
              >
                <div className="flex justify-between items-start gap-2 px-2 py-1.5">
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0">
                    <p className="font-semibold text-[13px] text-gray-800 shrink-0">
                      #{index + 1}
                    </p>
                    <p className="px-1 py-0 rounded text-[12px] leading-none bg-white border border-gray-200 shrink-0">
                      {data?.billType}
                    </p>
                    <p className="text-[13px] text-gray-600 truncate max-w-[150px]">
                      {data?.PendingBy}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0 text-right">
                    <span className="text-[13px] font-semibold text-gray-900 flex items-center gap-0.5">
                      <CurrencyRupeeIcon
                        className="rupeesIcon"
                        style={{ fontSize: 15 }}
                      />
                      {parseFloat(data.totalAmount || 0).toLocaleString(
                        "en-IN",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </span>
                    <div className="text-[12px] text-gray-500 flex items-center gap-0.5 justify-end">
                      <CalendarMonthIcon
                        className="HoldBillsIcons"
                        style={{ fontSize: 14 }}
                      />
                      <span className="leading-tight max-w-[140px]">
                        {data.pendingDateTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-2 pb-1.5 pt-0 pr-12">
                  {renderPendingMeta(data, { compact: true })}
                </div>
                <button
                  type="button"
                  className="absolute right-2 bottom-[3.2rem] p-1.5 rounded-full text-sky-700 bg-sky-50 border border-sky-200 transition-all duration-200 hover:bg-sky-100 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 z-10"
                  onClick={() => handlePendingView(data.pendingId)}
                  title="View details"
                >
                  <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                </button>
                <div className="border-t border-gray-200">
                  <div className="flex bg-gray-50 justify-between items-stretch px-2 py-1.5 gap-2">
                    {pendingQueueTab === "pending" ? (
                      <>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded text-[12px] font-semibold leading-none bg-green-600 text-white flex-1 transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                          onClick={() =>
                            handlePendingAction(data.pendingId, "Accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded text-[12px] font-semibold leading-none bg-red-600 text-white flex-1 transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                          onClick={() =>
                            handlePendingAction(data.pendingId, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded text-[12px] font-semibold leading-none border border-gray-400 bg-white text-gray-800 flex-1 transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0"
                          onClick={() =>
                            handlePendingAction(data.pendingId, "Discarded")
                          }
                        >
                          Discard
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded text-[12px] font-semibold leading-none bg-green-600 text-white flex-1 transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                          onClick={() =>
                            handlePendingAction(data.pendingId, "Approved")
                          }
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className="flex min-h-[min(320px,50vh)] justify-center items-center text-center py-12">
            <div className="text-center">
              <UpdateIcon className="noFoundIcon grayColor" />
              <p className="text-lg font-bold grayColor">
                {pendingQueueTab === "pending"
                  ? "No pending orders"
                  : "No rejected orders"}
              </p>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );

  const handleMakeAdmin = async () => {
    setAdminPasswordModal(true);
  };

  const handleAdminSubmit = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}billingrouter/makeMeAdmin?macAddress=${macAddress}&adminPassword=${adminPassword}`,
        config
      );
      if (response.data) {
        toast.success("Successfully made admin!");
        setAdminPasswordModal(false);
        setAdminPassword("");
        setAdminPcId(macAddress);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to make admin");
    }
  };

  const handleOpenTableView = () => {
    if (location?.pathname === "/tableView") {
      return;
    }
    setTablePassword("");
    setTablePasswordModal(true);
    setTimeout(() => {
      tablePasswordInputRef.current?.focus();
    }, 0);
  };

  const handleTablePasswordSubmit = async () => {
    try {
      const body = { userPassword: tablePassword };
      const response = await axios.post(
        `${BACKEND_BASE_URL}userrouter/chkPassword`,
        body,
        config
      );
      if (response.status === 200) {
        setTablePasswordModal(false);
        setTablePassword("");
        naviagate("/tableView");
      }
    } catch (error) {
      const apiMessage =
        (typeof error?.response?.data === 'string' && error.response.data) ||
        error?.response?.data?.message ||
        error?.message ||
        "Invalid password";
      toast.error(apiMessage);
      setTablePassword("");
    }
  };

  const handleCommonSearch = async () => {
    await axios
      .get(
        `${BACKEND_BASE_URL}billingrouter/getBillDataByToken?tokenNo=${search}`,
        config
      )
      .then((res) => {
        if (location.pathname.split("/")[1] == 'main' && location.pathname.split("/")[2] != 'DineIn') {
          props.setItems(res.data.itemData);
          props.setBillData({
            subTotal: res.data.totalAmount,
            discountType: res.data.discountType,
            discountValue: res.data.discountValue,
            settledAmount: res.data.settledAmount,
            totalDiscount: res.data.totalDiscount,
            billPayType: res.data.billPayType,
            billComment: res.data.billComment,
            billCommentAuto: res.data.billComment
              ? res.data.billComment.split(", ")
              : [],
          });
          props.setCustomerData(res.data.customerDetails);
          props.setEditBillData(res.data);
          props.setIsEdit(true);
          const billType = res.data.billType;
          props.setButtonCLicked(billType);
          setSearch("");
        } else {
          // console.log('LLL', `/main/DineIn / ${res.data.tableInfo.tableNo} / ${res.data.billId} / ${res.data.billStatus}`)
          res.data.billType != 'Dine In' ? naviagate(`/main/${res.data.billType}/${res.data.billId}`) : naviagate(`/main/DineIn/${res.data.tableInfo.tableNo}/${res.data.billId}/${res.data.billStatus}`);
        }
      })
      .catch((error) => {
        setSearch("");
        setError(error.response ? error.response.data : "Network Error ...!!!");
      });
  };

  // Add useEffect to check admin status on component mount
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}billingrouter/getAdminServerId`,
        config
      );
      if (response.data && response.data.adminMacAddress) {
        setAdminPcId(response.data.adminMacAddress);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 px-2 h-12 sticky top-0 z-50">
        <div className="flex justify-between h-full">
          <div className="flex h-full  ">
            <div className="header_Bars grid content-center">
              <MenuIcon />
            </div>
            <div className="header_logo ml-2 grid content-center">
              BHAGAWATI
            </div>
            <div className="header_button ml-2 grid content-center">
              <button
                className="button text-sm px-2 py-1 rounded-sm text-white"
                onClick={() => {
                  naviagate("/dashboard");
                }}
              >
                New Order
              </button>
            </div>
            <div className="header_search ml-2 grid content-center">
              <input
                type="search"
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCommonSearch();
                  }
                }}
                className="popoverSearch"
                value={search}
              />
            </div>
            {/* <div className="header_toggle ml-2 grid content-center ">
              <div>
                OFF <Switch checked={isSwitchOn} onChange={handleToggle} /> ON
              </div>
            </div> */}
          </div>
          <div className="flex h-full align-middle gap-6 mr-3">
            <Tooltip
              title={adminPcId === macAddress ? "This PC is main PC" : "Click to make this PC main"}
              placement="bottom"
            >
              <div
                onClick={() => {
                  if (adminPcId !== macAddress) {
                    handleMakeAdmin();
                  }
                }}
                className="header_icon cursor-pointer grid content-center"
                style={{ pointerEvents: adminPcId === macAddress ? 'none' : 'auto' }}
              >
                <BrightnessAutoIcon
                  sx={{
                    color: adminPcId === macAddress ? '#22c55e' : 'inherit',
                    fontSize: '1.5rem'
                  }}
                />
              </div>
            </Tooltip>
            <div
              onClick={() => {
                naviagate("/printSlectingPage");
              }}
              className="header_icon cursor-pointer  grid content-center"
            >
              <LocalPrintshopOutlinedIcon />
            </div>
            <div
              className="header_icon cursor-pointer grid content-center"
              onClick={() => {
                // if (location.pathname.split("/")[1] == "main") {
                setOpenHold(true);
                getHoldBills();
                // }
              }}
            >
              <StyledBadge
                badgeContent={holdCount}
                color="primary"
                invisible={holdCount == 0}
              >
                <WatchLaterTwoToneIcon />
              </StyledBadge>
            </div>
            <div
              className="header_icon cursor-pointer grid content-center"
              onClick={() => {
                setOpenOnlineRecent(true);
                fetchOnlineRecentBills();
              }}
              title="Online Recent Orders"
            >
              <LanguageIcon sx={{ fontSize: "1.5rem" }} />
            </div>
            <div
              className="header_icon cursor-pointer grid content-center"
              onClick={() => {
                setPendingQueueTab("pending");
                setOpenPendingDrawer(true);
              }}
              title="Pending / rejected online orders"
            >
              <StyledPendingBadge
                badgeContent={pendingCount}
                invisible={pendingCount === 0}
              >
                <AssignmentLateIcon sx={{ fontSize: "1.5rem" }} />
              </StyledPendingBadge>
            </div>
            <div className="header_icon cursor-pointer grid content-center">
              <PendingActionsIcon onClick={toggleDrawer("right", true)} />
            </div>
            <div className="header_icon cursor-pointer grid content-center">
              <GridViewIcon
                onClick={() => {
                  naviagate("/LiveView");
                }}
              />
            </div>
            <div className="header_icon cursor-pointer grid content-center">
              <CurrencyRupeeIcon onClick={handleOpenTableView} />
            </div>
            {/* <div className="header_icon cursor-pointer grid content-center">
              <NotificationsIcon />
            </div> */}
            <div className="header_icon cursor-pointer  grid content-center">
              <PowerSettingsNewIcon onClick={() => setLogOutPopUp(true)} />
            </div>
          </div>
        </div>
        <Modal
          open={openPendingViewModal}
          onClose={() => {
            setOpenPendingViewModal(false);
            setPendingViewData(null);
            setPendingViewError("");
          }}
          aria-labelledby="pending-view-modal-title"
          disableAutoFocus
        >
          <Box
            sx={{
              ...style,
              width: "min(92vw, 760px)",
              maxHeight: "85vh",
              overflowY: "auto",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              p: 2.5,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Typography id="pending-view-modal-title" variant="h6" component="h2">
                Pending Order Details
              </Typography>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setOpenPendingViewModal(false);
                  setPendingViewData(null);
                  setPendingViewError("");
                }}
              >
                <CloseIcon />
              </button>
            </div>

            {pendingViewLoading ? (
              <div className="py-8 text-center text-sm text-gray-600">Loading details...</div>
            ) : pendingViewError ? (
              <div className="py-8 text-center text-sm text-red-600">{pendingViewError}</div>
            ) : pendingViewData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-semibold">Bill Type:</span> {pendingViewData?.billType || "-"}</p>
                  <p>
                    <span className="font-semibold">Date & Time:</span>{" "}
                    {[pendingViewData?.billDate, pendingViewData?.billTime].filter(Boolean).join(" ") || "-"}
                  </p>
                  <p className="col-span-2"><span className="font-semibold">Bill Comment:</span> {pendingViewData?.billComment || "-"}</p>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-12 gap-1 bg-gray-100 px-3 py-2 text-xs font-semibold">
                    <div className="col-span-4">Item</div>
                    <div className="col-span-1 text-right">Qty</div>
                    <div className="col-span-2 text-right">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-3 text-center">Comment</div>
                  </div>
                  {(Array.isArray(pendingViewData?.itemData) ? pendingViewData.itemData : []).map((item, idx) => (
                    <div key={item?.iwbId || idx} className="grid grid-cols-12 gap-1 px-3 py-2 text-sm border-t">
                      <div className="col-span-4 truncate">
                        {item?.itemName}
                      </div>
                      <div className="col-span-1 text-right">{item?.qty + " " + item?.unit || ""}</div>
                      <div className="col-span-2 text-right">{Number(item?.itemPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="col-span-2 text-right">{Number(item?.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="col-span-3 truncate text-center">{item?.comment || ""}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end border-t pt-2">
                  <div className="text-sm text-right space-y-1.5">
                    <p><span className="font-semibold">Total Amount:</span> {Number(pendingViewData?.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p><span className="font-semibold">Settled Amount:</span> {Number(pendingViewData?.settledAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-600">No details found.</div>
            )}
          </Box>
        </Modal>
        <Modal
          open={logOutPopup}
          onClose={() => {
            setLogOutPopUp(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableAutoFocus
        >
          <Box sx={style} className="p-2 rounded-md">
            {(userInfo?.userName || userInfo?.name) && (
              <div className="mb-2 text-center">
                <AccountCircleIcon sx={{ fontSize: 80, color: "#4b5563" }} />
                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-semibold text-gray-800 font-bold text-xl">
                    {userInfo.userName || userInfo.name}
                  </span>
                </p>
              </div>
            )}
            <p className="text-center">Are You Sure You Want To LogOut ?</p>
            <div className="w-full text-base flex  gap-4 p-1 mt-4 ">
              <div className="w-full">
                <button
                  className="text-base button px-2 w-full py-1 rounded-md text-white"
                  onClick={() => {
                    localStorage.clear();
                    naviagate("/");
                  }}
                >
                  Yes
                </button>
              </div>
              <div className="w-full">
                <button
                  className="another_2 button text-base w-full px-2 py-1 rounded-md text-white"
                  onClick={() => {
                    setLogOutPopUp(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </Box>
        </Modal>
        <Modal
          open={tablePasswordModal}
          onClose={() => {
            setTablePasswordModal(false);
            setTablePassword("");
          }}
          aria-labelledby="table-pw-modal-title"
          aria-describedby="table-pw-modal-description"
          disableAutoFocus
        >
          <Box sx={style} className="p-4 rounded-md">
            <Typography id="table-pw-modal-title" variant="h6" component="h2" className="mb-4">
              Enter Password
            </Typography>
            <input
              type="password"
              value={tablePassword}
              onChange={(e) => setTablePassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTablePasswordSubmit();
                }
              }}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Enter password"
              ref={tablePasswordInputRef}
              autoFocus
            />
            <div className="w-full text-base flex gap-4 p-1">
              <div className="w-full">
                <button
                  className="text-base button px-2 w-full py-1 rounded-md text-white"
                  onClick={handleTablePasswordSubmit}
                >
                  OK
                </button>
              </div>
              <div className="w-full">
                <button
                  className="another_2 button text-base w-full px-2 py-1 rounded-md text-white"
                  onClick={() => {
                    setTablePasswordModal(false);
                    setTablePassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Box>
        </Modal>
        <Modal
          open={adminPasswordModal}
          onClose={() => {
            setAdminPasswordModal(false);
            setAdminPassword("");
          }}
          aria-labelledby="admin-modal-title"
          aria-describedby="admin-modal-description"
          disableAutoFocus
        >
          <Box sx={style} className="p-4 rounded-md">
            <Typography id="admin-modal-title" variant="h6" component="h2" className="mb-4">
              Enter Admin Password
            </Typography>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdminSubmit();
                }
              }}
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Enter password"
            />
            <div className="w-full text-base flex gap-4 p-1">
              <div className="w-full">
                <button
                  className="text-base button px-2 w-full py-1 rounded-md text-white"
                  onClick={handleAdminSubmit}
                >
                  Submit
                </button>
              </div>
              <div className="w-full">
                <button
                  className="another_2 button text-base w-full px-2 py-1 rounded-md text-white"
                  onClick={() => {
                    setAdminPasswordModal(false);
                    setAdminPassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Box>
        </Modal>
        <React.Fragment key={"right"}>
          <Drawer
            anchor={"right"}
            open={state["right"]}
            onClose={toggleDrawer("right", false)}
          >
            {list("right")}
          </Drawer>
        </React.Fragment>
        <React.Fragment key={"rightHold"}>
          <Drawer
            anchor={"right"}
            open={openHold}
            onClose={() => setOpenHold(!openHold)}
          >
            {listHold("right")}
          </Drawer>
        </React.Fragment>
        <React.Fragment key={"onlineRecent"}>
          <Drawer
            anchor={"right"}
            open={openOnlineRecent}
            onClose={() => setOpenOnlineRecent(false)}
            PaperProps={{
              sx: {
                height: "100%",
                maxHeight: "100vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            {listOnlineRecent("right")}
          </Drawer>
        </React.Fragment>
        <React.Fragment key={"pendingQueue"}>
          <Drawer
            anchor={"right"}
            open={openPendingDrawer}
            onClose={() => setOpenPendingDrawer(false)}
            PaperProps={{
              sx: {
                height: "100%",
                maxHeight: "100vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            {listPendingQueue("right")}
          </Drawer>
        </React.Fragment>
      </div>
    </>
  );
};

export default Header;


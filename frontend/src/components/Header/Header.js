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

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("getHoldCount", (message) => {
      setHoldCount(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
          navigate(`/main/${res.data.billType}/${id}`)
        }
        else if (location.pathname.split("/")[1] != 'main' && location.pathname.split("/")[2] != 'DineIn') {
          res.data.billType == 'Dine In' ? navigate(`/main/DineIn/${res.data.tableInfo.tableNo}/${res.data.billId}/${res.data.billStatus}`) : navigate(`/main/${res.data.billType}/${id}`)
          toggleDrawer("right", false);
          setOpenHold(false);
        } else {
          if (res.data.billType == 'Dine In') {
            navigate(`/main/DineIn/${res.data.tableInfo.tableNo}/${res.data.billId}/${res.data.billStatus}`)
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
      navigate(`/main/${type}/${id}`)
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
      <div className="flex pl-6 pr-4 mt-1 justify-between recentBillHeader">
        <div className="font-semibold">Tkn No</div>
        {activeTab === 'Pick Up' ? (
          <div className="mr-12 font-semibold" style={{ textAlign: 'center' }}>Info</div>
        ) : activeTab === 'Delivery' ? (
          <div className="mr-12 font-semibold" style={{ textAlign: 'center' }}>Address</div>
        ) : activeTab === "Hotel" ? (
          <><div className="mr-12 font-semibold" style={{ textAlign: 'center' }}>Hotel</div></>
        ) : activeTab === "Dine In" ? (
          <><div className="mr-12 font-semibold" style={{ textAlign: 'center' }}>Table No.</div></>
        ) : (<></>)}
        <div className="font-semibold">Rs.</div>
      </div>

      <div
        className="recentBillContainer customHeightRecent"
        onClick={toggleDrawer(anchor, false)}
      >
        {filteredBills.length > 0 ? (
          filteredBills.map((data, index) => (
            <div
              className={`recentBillRow pb-2 pt-2 flex justify-between cursor-pointer ${statusColors[data.billStatus] || ''} `}
              key={index}
              onClick={() => {
                getBbill(data.billId);
              }}
            >
              <Tooltip title={data?.billStatus} arrow>
                <div className="pl-6 capitalize">{data.tokenNo} {"(" + data.billPayType + ")"}</div>
              </Tooltip>
              {/* {activeTab === "Delivery" || activeTab === "Hotel" || activeTab === 'Dine In' ? ( */}
              <Tooltip title={data?.info} arrow>
                <div
                  className="customername ml-8"
                  style={{ textAlign: 'center' }}
                // onMouseEnter={(event) => handlePopoverOpen(event, data)}
                // onMouseLeave={handlePopoverClose}
                >
                  {data?.address}
                </div>
              </Tooltip>
              {/* // ) : (
              //   <></>
              // )} */}
              <div className="pr-2 w-28 text-end">{(data.totalAmount).toLocaleString('en-In', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              {/* <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: "none",
                  boxShadow: 1,
                  "& .MuiPaper-root": {
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
                  },
                }}
                open={popOverOpen}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1, maxWidth: 400, minWidth: 'fit-content' }}>
                  {hoveredData && hoveredData.info
                    ? hoveredData.info
                    : "No address available"}
                </Typography>
              </Popover> */}
            </div>
          ))
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
  const navigate = useNavigate();
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
                  navigate("/dashboard");
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
          open={logOutPopup}
          onClose={() => {
            setLogOutPopUp(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableAutoFocus
        >
          <Box sx={style} className="p-2 rounded-md">
            <p>Are You Sure you Want To LogOut?</p>
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
      </div>
    </>
  );
};

export default Header;


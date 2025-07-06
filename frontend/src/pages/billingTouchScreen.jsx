/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
import React, { useState, useRef, useEffect } from "react";
import {
    TextField,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputLabel,
    MenuItem,
    Modal,
    Box,
    Typography,
} from "@mui/material";
// import { useNavigate } from "react-router-dom";
import Close from "@mui/icons-material/Close";
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonIcon from '@mui/icons-material/Person';
import { useParams, useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import Popover from "@mui/material/Popover";
import "./css/pickUp.css";
import Header from "../components/Header/Header";
import { IoIosRestaurant } from "react-icons/io";
import Button1 from "../components/Button/Button1";
import { MdCancel } from "react-icons/md";
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import { FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import { renderToString } from "react-dom/server";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_BASE_URL } from "../url";
import RemoveIcon from "@mui/icons-material/Remove";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";
import BlockIcon from "@mui/icons-material/Block";
import KOT from "./KOT";
import RestaurantBill from "./RestaurantBill";
import Chip from "@mui/material/Chip";
import Select from '@mui/material/Select';

import TokenBil from "./TokenBill";
import { Switch } from "@mui/material";
import HotelBill from "./HotelBill";
// Use the exposed ipcRenderer from preload script
const ipcRenderer = window.ipcRenderer;
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    paddingTop: '15px',
    paddingRight: '15px',
    paddingLeft: '15px',
};
const styleCustomerModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    paddingTop: '15px',
    paddingRight: '15px',
    paddingLeft: '15px',
    paddingBottom: '15px'
};
const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 605,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    paddingTop: '15px',
    paddingRight: '15px',
    paddingLeft: '15px',
};
const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #ced4da",
        fontSize: 14,
        padding: "10px 26px 10px 12px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
        "&:focus": {
            borderRadius: 4,
            borderColor: "#80bdff",
            // border:'1px sold #80bdff !important'
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
        },
    },
}));
const BillingTouchScreen = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const freeSoloValue = React.useRef("");
    const systemPrinter = JSON.parse(localStorage.getItem("printerPreference"));
    const regexMobile = /^[0-9\b]+$/;
    const regex = /^-?\d*(?:\.\d*)?$/;
    const isValidInput = /^(?:\d{1,4}(?:\.\d{0,3})?|\.\d{1,3})$/;
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
    const hotelkot = systemPrinter?.filter(
        (printer) => printer.categoryId == "hotelKot"
    );
    const [selectedAddons, setSelectedAddons] = useState(
        {}
    )
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const getAccountList = async () => {
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/ddlDueAccountData`, config)
            .then((res) => {
                setAccountList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    }
    const handleSaveAccount = async () => {
        if (!accountFormData.customerName) {
            setError('Please add customer name')
        } else if (!accountFormData.customerNumber) {
            setError('Please add customer number')
        }
        else {
            setLoading(true);
            await axios
                .post(
                    `${BACKEND_BASE_URL}billingrouter/addCustomerAccount`,
                    accountFormData,
                    config
                )
                .then((res) => {
                    setSuccess(true);
                    setLoading(false);
                    getAccountList();
                    setAccountFormData({
                        customerName: "",
                        customerNumber: ""
                    })
                    setAddAccount(false);
                    setDueFormData((prev) => ({
                        ...prev,
                        accountId: res.data.accountId,
                        selectedAccount: res.data,
                    }))
                })
                .catch((error) => {
                    setError(
                        error.response && error.response.data
                            ? error.response.data
                            : "Network Error ...!!!"
                    );
                });
        }
    };
    // const data = [
    //   {
    //     "itemShortKey": "BT",
    //     "itemCode": 22,
    //     "itemName": "Butter Tika - BT",
    //     "variantsList": ["kg", "g", "lb", "oz"]
    //   },
    //   {
    //     "itemShortKey": "CG",
    //     "itemCode": 33,
    //     "itemName": "Cheese Garlic Bread",
    //     "variantsList": ["kg"]
    //   },
    //   {
    //     "itemShortKey": "FP",
    //     "itemCode": 44,
    //     "itemName": "French Pizza",
    //     "variantsList": ["kg"]
    //   }
    // ];

    const [fullFormData, setFullFormData] = useState({
        inputCode: "",
        searchWord: '',
    });
    const [hotelFormData, setHotelFormData] = useState({
        hotelId: "",
        roomNo: "",
        selectedHotel: "",
    });

    const [billError, setBillError] = useState({
        mobileNo: false,
        settledAmount: false,
        discountValue: false,
        hotelId: false,
        roomNo: false,
    });
    const [upiList, setUpiList] = useState([])
    const [items, setItems] = useState([]);
    console.log('>>', items)
    const [isEdit, setIsEdit] = useState(false);
    const [itemComment, setItemComment] = useState({
        itemComment: [],
        index: "",
        comment: "",
        oldComment: "",
    });
    const [upiId, setUpiId] = useState()
    const [billData, setBillData] = useState({
        subTotal: 0,
        discountType: "none",
        discountValue: 0,
        settledAmount: "",
        billPayType: "cash",
        billComment: "",
        billCommentAuto: [],
    });
    const [disbledFeild, setDisabledFeild] = useState({
        quantity: true,
        comment: true,
    });
    const [accountList, setAccountList] = useState([]);
    const [customerData, setCustomerData] = useState({
        customerId: "",
        addressId: "",
        mobileNo: "",
        customerName: "",
        address: "",
        locality: "",
        birthDate: "",
        aniversaryDate: "",
    });
    // Temporary state for customer modal
    const [tempCustomerData, setTempCustomerData] = useState({
        customerId: "",
        addressId: "",
        mobileNo: "",
        customerName: "",
        address: "",
        locality: "",
        birthDate: "",
        aniversaryDate: "",
    });
    // Temporary state for comment modal
    const [tempBillCommentAuto, setTempBillCommentAuto] = useState([]);
    const [isEnglish, setIsEnglish] = React.useState(false);
    let { tab, billId } = useParams();
    const [customerList, setCustomerList] = React.useState([]);
    const [hotelList, setHotelList] = React.useState([]);
    const [editBillData, setEditBillData] = React.useState();
    const [commentList, setCommentList] = React.useState([]);
    const [freeSoloField, setFreeSoloField] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [validationError, setValidationError] = useState(false);
    const [buttonCLicked, setButtonCLicked] = useState(tab);
    const [openSuggestions, setopenSuggestions] = useState(false);
    const quantityInputRef = useRef(null);
    const [data, setData] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [billTypeCategory, setBillTypeCategory] = useState([]);
    const unitInputRef = useRef(null);
    const commentInputRef = useRef(null);
    const first = useRef(null);
    const hotelName = useRef(null);
    const roomNoFocus = useRef(null);
    const second = useRef(null);
    const mobileNo = useRef(null);
    const [suggestionData, setSuggestionData] = useState([]);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('')
    const [suggestionSelectedValue, setSuggestionSelectedValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const suggestionListRef = useRef(null);
    const handleInputCodeChange = (e) => {
        if (e.target.name == 'searchWord' && (!e.target.value || e.target.value == '')) {
            getData(billTypeCategory[buttonCLicked]?.menuId);
        }
        setFullFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const [openDue, setOpenDue] = React.useState(false);
    const [openContactDetails, setOpenContactDetails] = React.useState(false);
    const [openCommnet, setOpenCommnet] = React.useState(false);
    const [openVarients, setOpenVarients] = React.useState(false);
    const [selectedVarients, setSelectedVarients] = useState();
    const [dueFormData, setDueFormData] = useState({
        accountId: '',
        dueNote: '',
        selectedAccount: ''
    })
    const [addAccount, setAddAccount] = useState(false);
    const [accountFormData, setAccountFormData] = useState({
        customerName: "",
        customerNumber: ""
    })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElO, setAnchorElO] = React.useState(null);

    const handleCloseDue = () => {
        setOpenDue(false);
    }
    const handleCloseCustomer = () => {
        setOpenContactDetails(false);
    }
    const handleOpenCustomer = () => {
        // Initialize temp state with current customer data
        setTempCustomerData({ ...customerData });
        setOpenContactDetails(true);
    }
    const handleCloseComment = () => {
        setOpenCommnet(false);
    }
    const handleOpenComment = () => {
        // Initialize temp state with current comment data
        setTempBillCommentAuto([...billData.billCommentAuto]);
        setOpenCommnet(true);
    }

    // Save handlers for modals
    const handleSaveCustomer = () => {
        setCustomerData({ ...tempCustomerData });
        setOpenContactDetails(false);
    }

    const handleCancelCustomer = () => {
        // Reset temp state to original values
        setTempCustomerData({ ...customerData });
        setOpenContactDetails(false);
    }

    const handleSaveComment = () => {
        setBillData(prev => ({
            ...prev,
            billCommentAuto: [...tempBillCommentAuto]
        }));
        setOpenCommnet(false);
    }

    const handleCancelComment = () => {
        // Reset temp state to original values
        setTempBillCommentAuto([...billData.billCommentAuto]);
        setOpenCommnet(false);
    }

    const handleResetCustomer = () => {
        // Clear all temp customer data fields
        setTempCustomerData({
            customerId: "",
            addressId: "",
            mobileNo: "",
            customerName: "",
            address: "",
            locality: "",
            birthDate: "",
            aniversaryDate: "",
        });
    }
    const handleCloseVarients = () => {
        setSelectedAddons({})
        setOpenVarients(false);
    }
    const clickAddAccount = () => {
        setAddAccount(true);
    }
    const justDue = () => {
        setDueFormData({
            accountId: '',
            dueNote: '',
            selectedAccount: ''
        })
        setOpenDue(false);
        setBillData((prev) => ({
            ...prev,
            billPayType: 'due'
        }))
    }
    const saveDue = () => {
        setBillData((prev) => ({
            ...prev,
            billPayType: 'due'
        }))
        setOpenDue(false)
    }
    const handleAccountChange = (e, value) => {
        if (value) {
            setDueFormData((prevState) => ({
                ...prevState,
                selectedAccount: value,
                accountId: value.accountId
            }));
        } else {
            setDueFormData((prevState) => ({
                ...prevState,
                selectedAccount: '',
                accountId: ''
            }));
        }
    };
    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setItemComment((perv) => ({
            ...perv,
            index: index,
            oldComment:
                items && items[index] && items[index].comment
                    ? items[index].comment
                    : "",
            itemComment:
                items && items[index] && items[index].comment
                    ? items[index].comment?.split(/,\s*/)
                    : [],
        }));
        // console.log('split', items && items[index] && items[index].comment ? items[index].comment?.split(/,\s*/) : [],)
    };

    const handleClickO = (event) => {
        setAnchorElO(event.currentTarget);
        // console.log('split', items && items[index] && items[index].comment ? items[index].comment?.split(/,\s*/) : [],)
    };
    const handleClose = () => {
        setItemComment({
            itemComment: [],
            index: "",
            comment: "",
            oldComment: "",
        });
        setAnchorEl(null);
    };
    const handleCloseO = () => {
        setItemComment();
        setAnchorElO(null);
    };

    const handleOpenVarients = (obj) => {
        setSelectedVarients({
            ...obj,
            selected: obj?.variantsList[0]?.unit,
            selectedPrice: obj?.variantsList[0]?.price,
            addOnsList: obj?.variantsList[0].addOnsList
        });
        setOpenVarients(true);
    }

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const openO = Boolean(anchorElO);
    const idO = openO ? "simple-popover" : undefined;

    const saveItemComment = async () => {
        setItems((perv) =>
            perv.map((data, index) =>
                index == itemComment.index
                    ? { ...data, comment: itemComment.itemComment?.join(", ") }
                    : data
            )
        );
        handleClose();
        setItemComment({
            itemComment: [],
            index: "",
            comment: "",
            oldComment: "",
        });
    };
    // const cancleComment = async () => {
    //   setItemComment({
    //     itemComment: [],
    //     index: '',
    //     comment: '',
    //     oldComment: ''
    //   });
    //   handleClose();
    // }

    const getData = async (id) => {
        await axios
            .get(`${BACKEND_BASE_URL}menuItemrouter/getItmeDataForTouchView?menuId=${id}&searchWord=`, config)
            .then((res) => {
                setData(res.data.itemList);
                setSubCategoryList(res.data.categoryList);
                setSelectedCategory(res.data.categoryList[0])
            })
            .catch((error) => {
                // setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setData([]);
            });
    };

    const getDataOnCode = async (e, id) => {
        if (e.key === "Enter") {
            await axios
                .get(`${BACKEND_BASE_URL}menuItemrouter/getItmeDataForTouchView?menuId=${id}&searchWord=`, config)
                .then((res) => {
                    setData(res.data.itemList);
                    setSubCategoryList(res.data.categoryList);
                    setSelectedCategory(res.data.categoryList[0])
                })
                .catch((error) => {
                    // setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    setData([]);
                });
        }
    };

    const getDataOnSearch = async (e, id) => {
        if (e.key === "Enter") {
            await axios
                .get(`${BACKEND_BASE_URL}menuItemrouter/getItmeDataForTouchView?menuId=${id}&searchWord=${e.target.value}`, config)
                .then((res) => {
                    setData(res.data.itemList);
                    setSubCategoryList(res.data.categoryList);
                    setSelectedCategory(res.data.categoryList[0])
                })
                .catch((error) => {
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    getData(billTypeCategory[buttonCLicked]?.menuId);
                    setFullFormData({
                        inputCode: "",
                        searchWord: '',
                    })
                    // setData(null);
                });
        }
    };
    const searchDataByCode = async (e, id) => {
        if (e.key === "Enter") {
            await axios
                .get(`${BACKEND_BASE_URL}menuItemrouter/getItemDataByCode?menuId=${id}&itemCode=${e.target.value}`, config)
                .then(async (res) => {
                    if (res.data && !res.data.status) {
                        await window.electronAPI.showAlert(
                            `${res.data.itemName} is not Available`,
                            "Item Not Available"
                        );
                        setFullFormData({
                            inputCode: "",
                            searchWord: '',
                        });
                        setValidationError(false);
                        first.current && first?.current?.focus();
                    } else {
                        handleAddItemTouch(res.data)
                        setFullFormData({
                            inputCode: "",
                            searchWord: '',
                        })
                    }

                })
                .catch((error) => {
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    // getData(billTypeCategory[buttonCLicked]?.menuId);
                    setFullFormData({
                        inputCode: "",
                        searchWord: '',
                    })
                    // setData(null);
                });
        }
    };
    const getBillTypes = async () => {
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/getBillCategory`, config)
            .then((res) => {
                setBillTypeCategory(res.data);
                getData(res.data[tab].menuId ? res.data[tab].menuId : "base_2001");
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
                // setData(null);
            });
    };
    const handleCommentAutocomplete = (e, value) => {
        // setFullFormData((perv) => ({
        //   ...perv,
        //   commentAutoComplete: value ? value : "",
        // }));
        setBillData((perv) => ({
            ...perv,
            billCommentAuto: value ? value : [],
        }));
    };
    const handleShoetCutKey = (event) => {
        if (event.key === "F12") {
            buttonCLicked == "Hotel"
                ? isEdit
                    ? editHotelBill()
                    : saveHotelBill() :
                buttonCLicked === "Delivery"
                    ? isEdit
                        ? editBillDelivery()
                        : saveBillDelivery()
                    : isEdit
                        ? editBill()
                        : saveBill();
        }
        if (event.key === "F1") {
            buttonCLicked == "Hotel"
                ? isEdit
                    ? justEditHotelBill()
                    : justSaveHotelBill() :
                buttonCLicked === "Delivery"
                    ? isEdit
                        ? justEditBillDelivery()
                        : justSaveBillDelivery()
                    : isEdit
                        ? justEditBill()
                        : justSaveBill();
        }
        if (event.key === "F5") {
            window.location.reload();
        }
    };
    const getBbill = async (id) => {
        await axios
            .get(
                `${BACKEND_BASE_URL}billingrouter/getBillDataById?billId=${id}`,
                config
            )
            .then((res) => {
                setItems(res.data.itemData);
                setBillData({
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
                setUpiId(res?.data?.onlineId);
                setDueFormData({
                    accountId: res?.data?.payInfo?.accountId,
                    dueNote: res?.data?.dueNote,
                    selectedAccount: res?.data?.payInfo
                });
                res?.data?.billType == "Hotel"
                    ? setCustomerData({
                        customerId: "",
                        addressId: "",
                        mobileNo: res?.data?.hotelDetails?.mobileNo,
                        customerName: res?.data?.hotelDetails?.customerName,
                        address: "",
                        locality: "",
                        birthDate: "",
                        aniversaryDate: "",
                    })
                    : setCustomerData(res.data.customerDetails);
                setEditBillData(res.data);
                setIsEdit(true);
                setButtonCLicked(res?.data?.billType);
                res?.data?.billType == "Hotel" &&
                    setHotelFormData({
                        hotelId: res.data?.hotelDetails?.hotelId,
                        roomNo: res.data?.hotelDetails?.roomNo,
                        selectedHotel: res.data?.hotelDetails,
                    });
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    const getHoldBbill = async (id) => {
        await axios
            .get(
                `${BACKEND_BASE_URL}billingrouter/getHoldBillDataById?holdId=${id}`,
                config
            )
            .then((res) => {
                setItems(res.data.itemData);
                setBillData({
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
                    ? setCustomerData({
                        customerId: "",
                        addressId: "",
                        mobileNo: res?.data?.hotelDetails?.mobileNo,
                        customerName: res?.data?.hotelDetails?.customerName,
                        address: "",
                        locality: "",
                        birthDate: "",
                        aniversaryDate: "",
                    })
                    : setCustomerData(res.data.customerDetails);
                setEditBillData(res.data);
                setButtonCLicked(res?.data?.billType);
                res?.data?.billType == "Hotel" &&
                    setHotelFormData({
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
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    useEffect(() => {
        tab == 'Hotel' ? hotelName?.current?.focus() : first?.current?.focus();
        // roomNoFocus.current && roomNoFocus.current.focus();
        // getData();
        if (billId != 'x') {
            if (billId?.split('_')[0] == 'hold') {
                getHoldBbill(billId);
            } else {
                getBbill(billId);
            }
        }
        getBillTypes();
        getAccountList();
        getUpiDDl();
        getcustomerDDL();
        getHotelDDL();
        getComments();
    }, []);
    useEffect(() => {
        window.addEventListener("keydown", handleShoetCutKey);
        return () => {
            window.removeEventListener("keydown", handleShoetCutKey);
        };
    }, [
        buttonCLicked,
        isEdit,
        fullFormData,
        billData,
        customerData,
        editBillData,
        billError,
        hotelFormData,
        items,
        // tab,
    ]);
    const handleInputNameChange = async (e, value) => {
        // const filtered = value ? data.filter(item =>
        //   (item.itemShortKey && item.itemShortKey.toLowerCase().includes(value.toLowerCase())) ||
        //   (item.itemName && item.itemName.toLowerCase().includes(value.toLowerCase()))
        // ) : [];
        if (value) {
            if (!value.status) {
                await window.electronAPI.showAlert(
                    `${value.itemName} is not Available`,
                    "Item Not Available"
                );
                setFullFormData({
                    inputCode: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: "",
                    commentAutoComplete: [],
                });
                setValidationError(false);
                first.current && first?.current?.focus();
            } else {
                if (value?.periods?.length > 0 && !isItemAvailableNow(value.periods)) {
                    const confirmed = await window.electronAPI.showConfirm(`Item is not Available From ${value?.periods[0].displayStartTime} To ${value?.periods[0].displayEndTime},do you want to add ?`, "Item Not Available");
                    if (confirmed) {
                        setDisabledFeild({ ...disbledFeild, quantity: false, comment: false });
                        setValidationError(false);
                        setFullFormData((prevState) => ({
                            ...prevState,
                            inputName: value ? value : "",
                            itemName: value && value.itemName ? value.itemName : "",
                            selectedItem: value ? value : "",
                            itemId: value && value.itemId ? value.itemId : "",
                            itemPrice:
                                value && value.variantsList[0] ? value.variantsList[0].price : 0,
                            unit: value && value.variantsList[0] ? value.variantsList[0].unit : "",
                            price: value && value.variantsList[0] ? value.variantsList[0].price : 0,
                        }));

                        if (value) {
                            setFullFormData((prevState) => ({
                                ...prevState,
                                inputCode: value.itemCode.toString(),
                            }));
                        }
                    } else {
                        setFullFormData({
                            inputCode: "",
                            inputName: "",
                            itemName: "",
                            qty: 1,
                            unit: "",
                            comment: "",
                            selectedItem: "",
                            selectedUnit: "",
                            itemPrice: "",
                            commentAutoComplete: [],
                        });
                        setValidationError(false);
                        first.current && first?.current?.focus();
                    }
                } else {
                    setDisabledFeild({ ...disbledFeild, quantity: false, comment: false });
                    setValidationError(false);
                    setFullFormData((prevState) => ({
                        ...prevState,
                        inputName: value ? value : "",
                        itemName: value && value.itemName ? value.itemName : "",
                        selectedItem: value ? value : "",
                        itemId: value && value.itemId ? value.itemId : "",
                        itemPrice:
                            value && value.variantsList[0] ? value.variantsList[0].price : 0,
                        unit: value && value.variantsList[0] ? value.variantsList[0].unit : "",
                        price: value && value.variantsList[0] ? value.variantsList[0].price : 0,
                    }));

                    if (value) {
                        setFullFormData((prevState) => ({
                            ...prevState,
                            inputCode: value.itemCode.toString(),
                        }));
                    }
                }
            }
        } else {
            setDisabledFeild({ ...disbledFeild, quantity: true, comment: true });
            setValidationError(false);
            setFullFormData({
                inputCode: "",
                inputName: "",
                itemName: "",
                qty: 1,
                unit: "",
                comment: "",
                selectedItem: "",
                selectedUnit: "",
                itemPrice: "",
                commentAutoComplete: [],
            });
        }
    };
    const handleHotelInputNameChange = (e, value) => {
        if (value) {
            setHotelFormData((perv) => ({
                ...perv,
                hotelId: value.hotelId,
                selectedHotel: value,
            }));
            setBillError((perv) => ({
                ...perv,
                hotelId: false,
            }));
            setBillData((perv) => ({
                ...perv,
                discountType: value.discountType,
                discountValue: value.discount,
                settledAmount: billData.subTotal
                    ? Math.ceil(
                        value.discountType == "none"
                            ? billData.subTotal
                            : value.discountType == "fixed"
                                ? billData.subTotal - value.discount
                                : billData.subTotal * (1 - value.discount / 100)
                    )
                    : 0,
                billPayType: isEdit ? perv.billPayType : value.payType,
            }));
        } else {
            setHotelFormData((perv) => ({
                ...perv,
                hotelId: "",
                selectedHotel: "",
            }));
            setBillError((perv) => ({
                ...perv,
                hotelId: true,
            }));
            setHotelFormData((perv) => ({
                ...perv,
                hotelId: "",
                selectedHotel: "value",
            }));
        }
    };
    const handleFreeSoloChange = (e, value) => {
        // const filtered = value ? data.filter(item =>
        //   (item.itemShortKey && item.itemShortKey.toLowerCase().includes(value.toLowerCase())) ||
        //   (item.itemName && item.itemName.toLowerCase().includes(value.toLowerCase()))
        // ) : [];
        // setValidationError(false);
        // setFullFormData((prevState) => ({
        //   ...prevState,
        //   inputName: value ? value : "",
        //   selectedItem: value ? value : "",
        //   itemId: value && value.itemId ? value.itemId : "",
        // }));

        // if (value) {
        //   setFullFormData((prevState) => ({
        //     ...prevState,
        //     inputCode: value.itemCode.toString(),
        //   }));
        // }
    };
    const joinArray = (array) => {
        return array.join(", ");
    };
    const addBillData = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Pick Up",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory['Pick Up']?.firmId,
            billStatus: "Print",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Pick Up']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory["Pick Up"]?.billFooterNote,
            appriciateLine: billTypeCategory["Pick Up"]?.appriciateLine
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addPickUpBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                const pickupKotPrint = renderToString(<KOT data={res.data} />);
                const pickupBillPrint = renderToString(
                    res && res.data && res.data.isOfficial ? (
                        <RestaurantBill data={res.data} />
                    ) : (
                        <TokenBil data={res.data} />
                    )
                );
                const printerDataKot = {
                    printer: pickupkot[0],
                    data: pickupKotPrint,
                };
                const printerDataBill = {
                    printer: pickupbill[0],
                    data: pickupBillPrint,
                };
                // const htmlString = renderToString(<RestaurantBill />)
                if (res && res.data && res.data.printBill && res.data.printKot) {
                    ipcRenderer.send("set-title", printerDataKot);
                    ipcRenderer.send("set-title", printerDataBill);
                } else if (res && res.data && res.data.printBill) {
                    ipcRenderer.send("set-title", printerDataBill);
                } else if (res && res.data && res.data.printKot) {
                    ipcRenderer.send("set-title", printerDataKot);
                }
                // setTimeout(() => {
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
                // }, 1500)
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const addHotelBillData = async () => {
        setLoading(true);
        const customData = {
            ...customerData,
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Hotel",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Hotel?.firmId,
            billStatus: "Print",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            hotelId: hotelFormData?.selectedHotel?.hotelId,
            roomNo: hotelFormData?.roomNo,
            hotelDetails: hotelFormData?.selectedHotel,
            isOfficial: billTypeCategory?.Hotel?.isOfficial,
            footerBill: billTypeCategory?.Hotel?.billFooterNote,
            appriciateLine: billTypeCategory?.Hotel?.appriciateLine
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addHotelBillData`,
                customData,
                config
            )
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                const HotelPrint = renderToString(<HotelBill data={res.data} />);
                const pickupBillPrint = renderToString(
                    res && res.data && res.data.isOfficial ? (
                        <RestaurantBill data={res.data} />
                    ) : (
                        <TokenBil data={res.data} />
                    )
                );
                const printerDataKot = {
                    printer: hotelkot[0],
                    data: HotelPrint,
                };
                const printerDataBill = {
                    printer: hotelbill[0],
                    data: HotelPrint,
                };
                // const htmlString = renderToString(<RestaurantBill />)
                if (res && res.data && res.data.printBill && res.data.printKot) {
                    ipcRenderer.send("set-title", printerDataKot);
                    ipcRenderer.send("set-title", printerDataBill);
                } else if (res && res.data && res.data.printBill) {
                    ipcRenderer.send("set-title", printerDataBill);
                } else if (res && res.data && res.data.printKot) {
                    ipcRenderer.send("set-title", printerDataKot);
                }
                // setTimeout(() => {
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
                // }, 1500)
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const addBillDataDelivery = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Delivery",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Delivery?.firmId,
            billStatus: "Print",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Delivery']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory?.Delivery?.billFooterNote,
            appriciateLine: billTypeCategory?.Delivery?.appriciateLine
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addDeliveryBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                const pickupKotPrint = renderToString(<KOT data={res.data} />);
                const pickupBillPrint = renderToString(
                    res && res.data && res.data.isOfficial ? (
                        <RestaurantBill data={res.data} />
                    ) : (
                        <TokenBil data={res.data} />
                    )
                );
                const printerDataKot = {
                    printer: deliverykot[0],
                    data: pickupKotPrint,
                };
                const printerDataBill = {
                    printer: deliverybill[0],
                    data: pickupBillPrint,
                };
                // const htmlString = renderToString(<RestaurantBill />)
                if (res && res.data && res.data.printBill && res.data.printKot) {
                    ipcRenderer.send("set-title", printerDataKot);
                    ipcRenderer.send("set-title", printerDataBill);
                } else if (res && res.data && res.data.printBill) {
                    ipcRenderer.send("set-title", printerDataBill);
                } else if (res && res.data && res.data.printKot) {
                    ipcRenderer.send("set-title", printerDataKot);
                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };

    const holdBillData = async () => {
        setLoading(true);
        const customData = {
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Pick Up",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory["Pick Up"]?.firmId,
            billStatus: "Hold",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            footerKot: "Thank You",
            footerBill: "Thank You",
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addPickUpHoldBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                // const pickupKotPrint = renderToString(<KOT data={res.data} />);
                // const pickupBillPrint = renderToString(
                //   res && res.data && res.data.isOfficial ? (
                //     <RestaurantBill data={res.data} />
                //   ) : (
                //     <TokenBil data={res.data} />
                //   )
                // );
                // const printerDataKot = {
                //   printer: pickupkot,
                //   data: pickupKotPrint,
                // };
                // const printerDataBill = {
                //   printer: pickupbill,
                //   data: pickupBillPrint,
                // };
                // // const htmlString = renderToString(<RestaurantBill />)
                // if (res && res.data && res.data.printBill && res.data.printKot) {
                //   ipcRenderer.send("set-title", printerDataKot);
                //   ipcRenderer.send("set-title", printerDataBill);
                // } else if (res && res.data && res.data.printBill) {
                //   ipcRenderer.send("set-title", printerDataBill);
                // } else if (res && res.data && res.data.printKot) {
                //   ipcRenderer.send("set-title", printerDataKot);
                // }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const holdHotelBillData = async () => {
        setLoading(true);
        const customData = {
            ...customerData,
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Hotel",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Hotel?.firmId,
            billStatus: "Hold",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            hotelId: hotelFormData?.selectedHotel?.hotelId,
            roomNo: hotelFormData?.roomNo,
            hotelDetails: hotelFormData?.selectedHotel,
            footerKot: "Thank You",
            footerBill: "Thank You",
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addHotelHoldBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const handleAddonClick = (obj) => {
        if (selectedAddons?.[obj && obj.addonsId ? obj.addonsId : '']) {
            setSelectedAddons((prev) => {
                const { [obj?.addonsId]: unused, ...newObj } = prev;
                return newObj ? newObj : {};
            })
        } else {
            setSelectedAddons((prev) => ({
                ...prev,
                [obj?.addonsId]: obj
            }))
        }
    }
    const holdBillDataDelivery = async () => {
        setLoading(true);
        const customData = {
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Delivery",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Delivery?.firmId,
            billStatus: "Hold",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            footerKot: "Thank You",
            footerBill: "Thank You",
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addDeliveryHoldBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                // const pickupKotPrint = renderToString(<KOT data={res.data} />);
                // const pickupBillPrint = renderToString(
                //   res && res.data && res.data.isOfficial ? (
                //     <RestaurantBill data={res.data} />
                //   ) : (
                //     <TokenBil data={res.data} />
                //   )
                // );
                // const printerDataKot = {
                //   printer: pickupkot,
                //   data: pickupKotPrint,
                // };
                // const printerDataBill = {
                //   printer: pickupbill,
                //   data: pickupBillPrint,
                // };
                // // const htmlString = renderToString(<RestaurantBill />)
                // if (res && res.data && res.data.printBill && res.data.printKot) {
                //   ipcRenderer.send("set-title", printerDataKot);
                //   ipcRenderer.send("set-title", printerDataBill);
                // } else if (res && res.data && res.data.printBill) {
                //   ipcRenderer.send("set-title", printerDataBill);
                // } else if (res && res.data && res.data.printKot) {
                //   ipcRenderer.send("set-title", printerDataKot);
                // }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const cancleBillData = async () => {
        setLoading(true);
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Pick Up",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory['Pick Up']?.firmId,
            billStatus: "Cancel",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billPayType: "Cancel",
            billComment: billData.billCommentAuto?.join(", "),
            footerKot: "Thank You",
            footerBill: "Thank You",
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updatePickUpBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setIsEdit(false);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const cancleHotelBillData = async () => {
        setLoading(true);
        const customData = {
            ...editBillData,
            ...customerData,
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Hotel",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Hotel?.firmId,
            billStatus: "Cancel",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billPayType: billData.billPayType,
            billComment: billData.billCommentAuto?.join(", "),
            hotelId: hotelFormData?.selectedHotel?.hotelId,
            roomNo: hotelFormData?.roomNo,
            footerKot: "Thank You",
            footerBill: "Thank You",
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateHotelBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setIsEdit(false);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const cancleBillDataDelivery = async () => {
        setLoading(true);
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Delivery",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Delivery?.firmId,
            billStatus: "Cancel",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billPayType: billData.billPayType,
            billComment: billData.billCommentAuto?.join(", "),
            footerKot: "Thank You",
            footerBill: "Thank You",
            billPayType: "Cancel",
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateDeliveryBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setIsEdit(false);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const justSaveBillData = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Pick Up",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory['Pick Up']?.firmId,
            billStatus: "Print",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Pick Up']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory["Pick Up"]?.billFooterNote,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addPickUpBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const justSaveHotelBillData = async () => {
        setLoading(true);
        const customData = {
            ...customerData,
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Hotel",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Hotel?.firmId,
            billStatus: "Print",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            hotelId: hotelFormData?.selectedHotel?.hotelId,
            roomNo: hotelFormData?.roomNo,
            hotelDetails: hotelFormData?.selectedHotel,
            isOfficial: billTypeCategory?.Hotel?.isOfficial,
            footerBill: billTypeCategory?.Hotel?.billFooterNote,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addHotelBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const justSaveBillDataDelivery = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Delivery",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Delivery?.firmId,
            billStatus: "Print",
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Delivery']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory?.Delivery?.billFooterNote,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/addDeliveryBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };

    const editBillDataFunction = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Pick Up",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory['Pick Up']?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Pick Up']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory["Pick Up"]?.billFooterNote,
            appriciateLine: billTypeCategory["Pick Up"]?.appriciateLine
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updatePickUpBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                try {
                    const pickupKotPrint = renderToString(
                        <KOT data={res.data} isEdit={true} />
                    );
                    const pickupBillPrint = renderToString(
                        res && res.data && res.data.isOfficial ? (
                            <RestaurantBill data={res.data} isEdit={true} />
                        ) : (
                            <TokenBil data={res.data} isEdit={true} />
                        )
                    );
                    const printerDataKot = {
                        printer: pickupkot[0],
                        data: pickupKotPrint,
                    };
                    const printerDataBill = {
                        printer: pickupbill[0],
                        data: pickupBillPrint,
                    };
                    // const htmlString = renderToString(<RestaurantBill />)
                    if (res && res.data && res.data.printBill && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                    }
                } catch (error) {
                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const editHotelBillDataFunction = async () => {
        setLoading(true);
        const customData = {
            ...editBillData,
            ...customerData,
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Hotel",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Hotel?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            hotelId: hotelFormData?.selectedHotel?.hotelId,
            roomNo: hotelFormData?.roomNo,
            hotelDetails: hotelFormData?.selectedHotel,
            isOfficial: billTypeCategory?.Hotel?.isOfficial,
            footerBill: billTypeCategory?.Hotel?.billFooterNote,
            appriciateLine: billTypeCategory?.Hotel?.appriciateLine,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateHotelBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                try {
                    const HotelPrint = renderToString(<HotelBill data={res.data} isEdit={true} />);
                    const printerDataKot = {
                        printer: hotelkot[0],
                        data: HotelPrint,
                    };
                    const printerDataBill = {
                        printer: hotelbill[0],
                        data: HotelPrint,
                    };
                    // const htmlString = renderToString(<RestaurantBill />)
                    if (res && res.data && res.data.printBill && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                    }
                } catch (error) {
                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const editBillDataFunctionDelivery = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Delivery",
            printBill: true,
            printKot: true,
            firmId: billTypeCategory?.Delivery?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Delivery']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory?.Delivery?.billFooterNote,
            appriciateLine: billTypeCategory?.Delivery?.appriciateLine
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateDeliveryBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                try {
                    const pickupKotPrint = renderToString(
                        <KOT data={res.data} isEdit={true} />
                    );
                    const pickupBillPrint = renderToString(
                        res && res.data && res.data.isOfficial ? (
                            <RestaurantBill data={res.data} isEdit={true} />
                        ) : (
                            <TokenBil data={res.data} isEdit={true} />
                        )
                    );
                    const printerDataKot = {
                        printer: deliverykot[0],
                        data: pickupKotPrint,
                    };
                    const printerDataBill = {
                        printer: deliverybill[0],
                        data: pickupBillPrint,
                    };
                    // const htmlString = renderToString(<RestaurantBill />)
                    if (res && res.data && res.data.printBill && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                    }
                } catch (error) {
                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const justEditBillDataFunction = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Pick Up",
            printBill: false,
            printKot: false,
            firmId: billTypeCategory['Pick Up']?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Pick Up']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory["Pick Up"]?.billFooterNote,
            appriciateLine: billTypeCategory["Pick Up"]?.appriciateLine
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updatePickUpBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const justEditHotelBillDataFunction = async () => {
        setLoading(true);
        const customData = {
            ...editBillData,
            ...customerData,
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Hotel",
            printBill: false,
            printKot: false,
            firmId: billTypeCategory?.Hotel?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            hotelId: hotelFormData?.selectedHotel?.hotelId,
            roomNo: hotelFormData?.roomNo,
            hotelDetails: hotelFormData?.selectedHotel,
            isOfficial: billTypeCategory?.Hotel?.isOfficial,
            footerBill: billTypeCategory?.Hotel?.billFooterNote,
            appriciateLine: billTypeCategory?.Hotel?.appriciateLine
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateHotelBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const justEditBillDataFunctionDelivery = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Delivery",
            printBill: false,
            printKot: false,
            firmId: billTypeCategory?.Delivery?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Delivery']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory?.Delivery?.billFooterNote,
            appriciateLine: billTypeCategory?.Delivery?.appriciateLine,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateDeliveryBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };

    const editBillPrintDataFunction = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Pick Up",
            printBill: true,
            printKot: false,
            firmId: billTypeCategory['Pick Up']?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Pick Up']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory["Pick Up"]?.billFooterNote,
            appriciateLine: billTypeCategory["Pick Up"]?.appriciateLine
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updatePickUpBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                try {
                    const pickupKotPrint = renderToString(
                        <KOT data={res.data} isEdit={true} />
                    );
                    const pickupBillPrint = renderToString(
                        res && res.data && res.data.isOfficial ? (
                            <RestaurantBill data={res.data} isEdit={true} />
                        ) : (
                            <TokenBil data={res.data} isEdit={true} />
                        )
                    );
                    const printerDataKot = {
                        printer: pickupkot[0],
                        data: pickupKotPrint,
                    };
                    const printerDataBill = {
                        printer: pickupbill[0],
                        data: pickupBillPrint,
                    };
                    // const htmlString = renderToString(<RestaurantBill />)
                    if (res && res.data && res.data.printBill && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                    }
                } catch (error) {
                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const editHotelBillPrintDataFunction = async () => {
        setLoading(true);
        const customData = {
            ...editBillData,
            ...customerData,
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Hotel",
            printBill: true,
            printKot: false,
            firmId: billTypeCategory?.Hotel?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            hotelId: hotelFormData?.selectedHotel?.hotelId,
            roomNo: hotelFormData?.roomNo,
            hotelDetails: hotelFormData?.selectedHotel,
            isOfficial: billTypeCategory?.Hotel?.isOfficial,
            footerBill: billTypeCategory?.Hotel?.billFooterNote,
            appriciateLine: billTypeCategory?.Hotel?.appriciateLine,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateHotelBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                try {
                    const HotelPrint = renderToString(<HotelBill data={res.data} isEdit={true} />);
                    const printerDataKot = {
                        printer: hotelkot[0],
                        data: HotelPrint,
                    };
                    const printerDataBill = {
                        printer: hotelbill[0],
                        data: HotelPrint,
                    };
                    // const htmlString = renderToString(<RestaurantBill />)
                    if (res && res.data && res.data.printBill && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {
                        ipcRenderer.send("set-title", printerDataKot);
                    }
                } catch (error) {
                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const editBillPrintDataFunctionDelivery = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Delivery",
            printBill: true,
            printKot: false,
            firmId: billTypeCategory?.Delivery?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Delivery']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory?.Delivery?.billFooterNote,
            appriciateLine: billTypeCategory?.Delivery?.appriciateLine,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateDeliveryBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setIsEdit(false);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                try {
                    const pickupKotPrint = renderToString(
                        <KOT data={res.data} isEdit={true} />
                    );
                    const pickupBillPrint = renderToString(
                        res && res.data && res.data.isOfficial ? (
                            <RestaurantBill data={res.data} isEdit={true} />
                        ) : (
                            <TokenBil data={res.data} isEdit={true} />
                        )
                    );
                    const printerDataKot = {
                        printer: deliverykot[0],
                        data: pickupKotPrint,
                    };
                    const printerDataBill = {
                        printer: deliverybill[0],
                        data: pickupBillPrint,
                    };
                    // const htmlString = renderToString(<RestaurantBill />)
                    if (res && res.data && res.data.printBill && res.data.printKot) {

                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {

                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {

                        ipcRenderer.send("set-title", printerDataKot);
                    }

                } catch (error) {

                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const editKotPrintDataFunction = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Pick Up",
            printBill: false,
            printKot: true,
            firmId: billTypeCategory['Pick Up']?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Pick Up']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory["Pick Up"]?.billFooterNote,
            appriciateLine: billTypeCategory["Pick Up"]?.appriciateLine,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updatePickUpBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });

                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                try {
                    const pickupKotPrint = renderToString(
                        <KOT data={res.data} isEdit={true} />
                    );
                    const pickupBillPrint = renderToString(
                        res && res.data && res.data.isOfficial ? (
                            <RestaurantBill data={res.data} isEdit={true} />
                        ) : (
                            <TokenBil data={res.data} isEdit={true} />
                        )
                    );
                    const printerDataKot = {
                        printer: pickupkot[0],
                        data: pickupKotPrint,
                    };
                    const printerDataBill = {
                        printer: pickupbill[0],
                        data: pickupBillPrint,
                    };
                    // const htmlString = renderToString(<RestaurantBill />)
                    if (res && res.data && res.data.printBill && res.data.printKot) {

                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {

                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {

                        ipcRenderer.send("set-title", printerDataKot);
                    }

                    setIsEdit(false);
                } catch (error) {

                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const editHotelKotPrintDataFunction = async () => {
        setLoading(true);
        const customData = {
            ...editBillData,
            ...customerData,
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Hotel",
            printBill: false,
            printKot: true,
            firmId: billTypeCategory?.Hotel?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            hotelId: hotelFormData?.selectedHotel?.hotelId,
            roomNo: hotelFormData?.roomNo,
            hotelDetails: hotelFormData?.selectedHotel,
            isOfficial: billTypeCategory?.Hotel?.isOfficial,
            footerBill: billTypeCategory?.Hotel?.billFooterNote,
            appriciateLine: billTypeCategory?.Hotel?.appriciateLine,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateHotelBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });
                try {
                    const HotelPrint = renderToString(<HotelBill data={res.data} isEdit={true} />);
                    const printerDataKot = {
                        printer: hotelkot[0],
                        data: HotelPrint,
                    };
                    const printerDataBill = {
                        printer: hotelbill[0],
                        data: HotelPrint,
                    };
                    // const htmlString = renderToString(<RestaurantBill />)
                    if (res && res.data && res.data.printBill && res.data.printKot) {

                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {

                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {

                        ipcRenderer.send("set-title", printerDataKot);
                    }

                    setIsEdit(false);
                } catch (error) {

                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };

    const editKotPrintDataFunctionDelivery = async () => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            ...editBillData,
            customerDetails: {
                ...customerData,
            },
            ...billData,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            billType: "Delivery",
            printBill: false,
            printKot: true,
            firmId: billTypeCategory?.Delivery?.firmId,
            // billStatus: billData.billStatus,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            itemsData: items,
            billComment: billData.billCommentAuto?.join(", "),
            isOfficial: billTypeCategory['Delivery']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            onlineId: upiId,
            footerBill: billTypeCategory?.Delivery?.billFooterNote,
            appriciateLine: billTypeCategory?.Delivery?.appriciateLine,
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateDeliveryBillData`,
                customData,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setItems([]);
                setEditBillData();
                setFullFormData({
                    inputCode: "",
                    itemId: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: 0,
                    price: 0,
                    commentAutoComplete: [],
                });
                setCustomerData({
                    customerId: "",
                    addressId: "",
                    mobileNo: "",
                    customerName: "",
                    address: "",
                    locality: "",
                    birthDate: "",
                    aniversaryDate: "",
                });
                setBillData({
                    subTotal: 0,
                    discountType: "none",
                    discountValue: 0,
                    settledAmount: "",
                    billPayType: "cash",
                    billComment: "",
                    billCommentAuto: [],
                });


                try {
                    const pickupKotPrint = renderToString(
                        <KOT data={res.data} isEdit={true} />
                    );
                    const pickupBillPrint = renderToString(
                        res && res.data && res.data.isOfficial ? (
                            <RestaurantBill data={res.data} isEdit={true} />
                        ) : (
                            <TokenBil data={res.data} isEdit={true} />
                        )
                    );
                    const printerDataKot = {
                        printer: deliverykot[0],
                        data: pickupKotPrint,
                    };
                    const printerDataBill = {
                        printer: deliverybill[0],
                        data: pickupBillPrint,
                    };


                    if (res && res.data && res.data.printBill && res.data.printKot) {

                        ipcRenderer.send("set-title", printerDataKot);
                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printBill) {

                        ipcRenderer.send("set-title", printerDataBill);
                    } else if (res && res.data && res.data.printKot) {

                        ipcRenderer.send("set-title", printerDataKot);
                    }
                    // 
                    setIsEdit(false);

                } catch (error) {

                }
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };

    const debounce = (func) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args);
            }, 700);
        };
    };

    const handleSearch = () => {
        if (openContactDetails) {
            // If customer modal is open, use temp customer data
            getSourceDDL(tempCustomerData.mobileNo);
        } else {
            // Otherwise use the search input
            getSourceDDL(document.getElementById("searchWord").value);
        }
    };

    const debounceFunction = React.useCallback(debounce(handleSearch), []);
    const getSourceDDL = async (data) => {
        await axios
            .get(
                `${BACKEND_BASE_URL}billingrouter/searchCustomerData?searchWord=${data}`,
                config
            )
            .then((res) => {
                setCustomerList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    const getcustomerDDL = async () => {
        await axios
            .get(
                `${BACKEND_BASE_URL}billingrouter/searchCustomerData?searchWord=${""}`,
                config
            )
            .then((res) => {
                setCustomerList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    const getUpiDDl = async () => {
        await axios
            .get(
                `${BACKEND_BASE_URL}billingrouter/ddlUPI`,
                config
            )
            .then((res) => {
                setUpiList(res.data);
                setUpiId(res?.data[0]?.onlineId)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    const getHotelDDL = async () => {
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/ddlHotelList`, config)
            .then((res) => {
                setHotelList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    const getComments = async () => {
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/getComment`, config)
            .then((res) => {
                setCommentList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    const saveBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                addBillData();
                setValidationError(false);
            }
        }
    };
    const saveHotelBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                !hotelFormData.hotelId ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setBillError((perv) => ({
                    ...perv,
                    hotelId: !hotelFormData.hotelId ? true : false,
                }));
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                addHotelBillData();
                setValidationError(false);
            }
        }
    };
    const saveBillDelivery = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue) ||
                !customerData.mobileNo ||
                customerData.mobileNo.length != 10
            ) {
                if (!customerData.mobileNo || customerData.mobileNo.length != 10) {
                    setBillError((perv) => ({
                        ...perv,
                        mobileNo: true,
                    }));
                }
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                addBillDataDelivery();
            }
        }
    };
    const justSaveBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                justSaveBillData();
            }
        }
    };
    const justSaveHotelBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                !hotelFormData.hotelId ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setBillError((perv) => ({
                    ...perv,
                    hotelId: !hotelFormData.hotelId ? true : false,
                }));
                // console.log('><<<<>>>LLL', !hotelFormData.hotelId ? true : false, !hotelFormData.roomNo ? true : false)
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                justSaveHotelBillData();
            }
        }
    };
    const justSaveBillDelivery = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue) ||
                !customerData.mobileNo ||
                customerData.mobileNo.length != 10
            ) {
                if (!customerData.mobileNo || customerData.mobileNo.length != 10) {
                    setBillError((perv) => ({
                        ...perv,
                        mobileNo: true,
                    }));
                }

                setError("Please Fill All Field?????");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                justSaveBillDataDelivery();
            }
        }
    };
    const justEditBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                justEditBillDataFunction();
            }
        }
    };
    const justEditHotelBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                !hotelFormData.hotelId ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
                setBillError((perv) => ({
                    ...perv,
                    hotelId: !hotelFormData.hotelId ? true : false,
                }));
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                justEditHotelBillDataFunction();
            }
        }
    };
    const justEditBillDelivery = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue) ||
                !customerData.mobileNo ||
                customerData.mobileNo.length != 10
            ) {
                if (!customerData.mobileNo || customerData.mobileNo.length != 10) {
                    setBillError((perv) => ({
                        ...perv,
                        mobileNo: true,
                    }));
                }
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                justEditBillDataFunctionDelivery();
            }
        }
    };
    const holdBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                holdBillData();
            }
        }
    };
    const holdHotelBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                !hotelFormData.hotelId ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setBillError((perv) => ({
                    ...perv,
                    hotelId: !hotelFormData.hotelId ? true : false,
                }));
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                holdHotelBillData();
            }
        }
    };
    const holdBillDelivery = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                // if (!customerData.mobileNo || customerData.mobileNo.length != 10) {
                //   setBillError((perv) => ({
                //     ...perv,
                //     mobileNo: true,
                //   }));
                // }
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                holdBillDataDelivery();
            }
        }
    };
    const cancleBill = async () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                const confirmed = await window.electronAPI.showConfirm("Are you sure you want to Cancel this bill?", "Cancel Bill");
                if (confirmed) {
                    cancleBillData();
                }
            }
        }
    };
    const cancleHotelBill = async () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                !hotelFormData.hotelId ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setBillError((perv) => ({
                    ...perv,
                    hotelId: !hotelFormData.hotelId ? true : false,
                }));
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                if (window.confirm("Are you sure you want to Cancel this bill?")) {
                    cancleHotelBillData();
                }
            }
        }
    };
    const cancleBillDelivery = async () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue) ||
                !customerData.mobileNo ||
                customerData.mobileNo.length != 10
            ) {
                if (!customerData.mobileNo || customerData.mobileNo.length != 10) {
                    setBillError((perv) => ({
                        ...perv,
                        mobileNo: true,
                    }));
                }
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                const confirmed = await window.electronAPI.showConfirm("Are you sure you want to Cancel this bill?", "Cancel Bill");
                if (confirmed) {
                    cancleBillDataDelivery();
                }
            }
        }
    };
    const editBillPrint = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editBillPrintDataFunction();
            }
        }
    };
    const editHotelBillPrint = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                !hotelFormData.hotelId ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setBillError((perv) => ({
                    ...perv,
                    hotelId: !hotelFormData.hotelId ? true : false,
                }));
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editHotelBillPrintDataFunction();
            }
        }
    };
    const editBillPrintDelivery = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue) ||
                !customerData.mobileNo ||
                customerData.mobileNo.length != 10
            ) {
                if (!customerData.mobileNo || customerData.mobileNo.length != 10) {
                    setBillError((perv) => ({
                        ...perv,
                        mobileNo: true,
                    }));
                }
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editBillPrintDataFunctionDelivery();
            }
        }
    };
    const editKotPrint = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editKotPrintDataFunction();
            }
        }
    };
    const editHotelKotPrint = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                !hotelFormData.hotelId ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setBillError((perv) => ({
                    ...perv,
                    hotelId: !hotelFormData.hotelId ? true : false,
                }));
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editHotelKotPrintDataFunction();
            }
        }
    };
    const editKotPrintDelivery = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue) ||
                !customerData.mobileNo ||
                customerData.mobileNo.length != 10
            ) {
                if (!customerData.mobileNo || customerData.mobileNo.length != 10) {
                    setBillError((perv) => ({
                        ...perv,
                        mobileNo: true,
                    }));
                }
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editKotPrintDataFunctionDelivery();
            }
        }
    };
    const editBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editBillDataFunction();
            }
        }
    };
    const editHotelBill = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                !hotelFormData.hotelId ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setBillError((perv) => ({
                    ...perv,
                    hotelId: !hotelFormData.hotelId ? true : false,
                }));
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editHotelBillDataFunction();
            }
        }
    };
    const changeCategoryUpdate = async (id) => {
        const newData = {
            menuId: id,
            itemsData: items
        }
        await axios
            .post(`${BACKEND_BASE_URL}menuItemrouter/updateItemPriceByMenuId`, newData, config)
            .then((res) => {
                setItems(res.data.itemsData);
                setBillData((prev) => ({
                    ...prev,
                    subTotal: res.data.total,
                    settledAmount: res.data.total,
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    }
    const editBillDelivery = () => {
        if (loading || success) {
        } else {
            if (
                !items ||
                items.length < 1 ||
                !billData ||
                !billData.subTotal ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue) ||
                !customerData.mobileNo ||
                customerData.mobileNo.length != 10
            ) {
                if (!customerData.mobileNo || customerData.mobileNo.length != 10) {
                    setBillError((perv) => ({
                        ...perv,
                        mobileNo: true,
                    }));
                }
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editBillDataFunctionDelivery();
            }
        }
    };
    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setFullFormData((prevState) => ({
            ...prevState,
            qty: value,
            price:
                fullFormData && fullFormData.itemPrice
                    ? fullFormData.itemPrice * value
                    : 0,
        }));

        if (e.key === "Enter") {
            e.preventDefault();
            if (unitOptionsExist(fullFormData.inputName)) {
                unitInputRef.current && unitInputRef.current.focus();
            } else {
                commentInputRef.current && commentInputRef.current.focus();
            }
        }
    };
    const handleUnitChange = (e) => {
        const value = e.target.value;
        const options =
            fullFormData &&
                fullFormData.selectedItem &&
                fullFormData.selectedItem.variantsList
                ? fullFormData &&
                fullFormData.selectedItem &&
                fullFormData.selectedItem.variantsList
                : [];

        if (!isNaN(value)) {
            const index = parseInt(value) - 1;
            if (index >= 0 && index < options.length) {
                setFullFormData((prevState) => ({
                    ...prevState,
                    unit: options[index],
                }));
            }
        } else {
            const optionIndex = options.findIndex(
                (option) => option.toLowerCase() === value.toLowerCase()
            );
            if (optionIndex !== -1) {
                setFullFormData((prevState) => ({
                    ...prevState,
                    unit: options[optionIndex],
                }));
            } else {
                setFullFormData((prevState) => ({
                    ...prevState,
                    unit: "",
                }));
            }
        }
    };

    const handleAutofill = (name, code) => {
        setFullFormData((prevState) => ({
            ...prevState,
            inputCode: code.toString(),
            inputName: name,
        }));

        commentInputRef.current && commentInputRef.current.focus();
    };
    function isItemAvailableNow(periods) {
        const now = new Date();

        // Get current time in 'HH:mm:ss' format
        const currentTime = now.toTimeString().split(' ')[0];

        for (const period of periods) {
            const { startTime, endTime } = period;

            // Check if the current time falls within the start and end time
            if (currentTime >= startTime && currentTime <= endTime) {
                return true; // Item is available now
            }
        }
        return false; // Item is not available now
    }
    const handleEnterPressFirst = async (e) => {
        const value = e.target.value;
        if (e.key === "Enter") {
            e.preventDefault();
            const matchingProduct = data ? data?.find(
                (item) =>
                    item.itemCode.toString() === value ||
                    item.itemShortKey.toString().toLocaleLowerCase() ===
                    value.toString().toLocaleLowerCase()
            )
                : [];
            if (matchingProduct && !matchingProduct.status) {
                await window.electronAPI.showAlert(
                    `${matchingProduct.itemName} is not Available`,
                    "Item Not Available"
                );
                setFullFormData({
                    inputCode: "",
                    inputName: "",
                    itemName: "",
                    qty: 1,
                    unit: "",
                    comment: "",
                    selectedItem: "",
                    selectedUnit: "",
                    itemPrice: "",
                    commentAutoComplete: [],
                });
                setValidationError(false);
                first.current && first?.current?.focus();
            } else {
                if (matchingProduct?.periods?.length > 0 && !isItemAvailableNow(matchingProduct.periods)) {
                    const confirmed = await window.electronAPI.showConfirm(`Item is not Available From ${matchingProduct?.periods[0].displayStartTime} To ${matchingProduct?.periods[0].displayEndTime},do you want to add ?`, "Item Not Available");
                    if (confirmed) {
                        if (!matchingProduct || value === "") {
                            setValidationError(true);
                            second.current && second.current.focus();
                            setFullFormData((prevState) => ({
                                ...prevState,
                                selectedItem: "",
                                inputName: "",
                                itemName: "",
                            }));
                        } else if (
                            value === matchingProduct?.itemCode?.toString() ||
                            matchingProduct.itemShortKey?.toString()?.toLocaleLowerCase() ===
                            value.toString().toLocaleLowerCase()
                        ) {
                            e.preventDefault();
                            setValidationError(false);
                            setFullFormData((prevState) => ({
                                ...prevState,
                                inputCode: matchingProduct.itemCode,
                                itemId: matchingProduct.itemId,
                                inputName: matchingProduct,
                                itemName:
                                    matchingProduct && matchingProduct.itemName
                                        ? matchingProduct.itemName
                                        : "",
                                selectedItem: matchingProduct,
                                itemPrice:
                                    matchingProduct && matchingProduct.variantsList[0]
                                        ? matchingProduct.variantsList[0].price
                                        : 0,
                                unit:
                                    matchingProduct && matchingProduct.variantsList[0]
                                        ? matchingProduct.variantsList[0].unit
                                        : "",
                                price:
                                    matchingProduct && matchingProduct.variantsList[0]
                                        ? matchingProduct.variantsList[0].price
                                        : 0,
                            }));
                            quantityInputRef.current && quantityInputRef.current.focus();
                        }
                    } else {
                        setFullFormData({
                            inputCode: "",
                            inputName: "",
                            itemName: "",
                            qty: 1,
                            unit: "",
                            comment: "",
                            selectedItem: "",
                            selectedUnit: "",
                            itemPrice: "",
                            commentAutoComplete: [],
                        });
                        setValidationError(false);
                        first.current && first?.current?.focus();
                    }
                } else {
                    if (!matchingProduct || value === "") {
                        setValidationError(true);
                        second.current && second.current.focus();
                        setFullFormData((prevState) => ({
                            ...prevState,
                            selectedItem: "",
                            inputName: "",
                            itemName: "",
                        }));
                    } else if (
                        value === matchingProduct?.itemCode?.toString() ||
                        matchingProduct.itemShortKey?.toString()?.toLocaleLowerCase() ===
                        value.toString().toLocaleLowerCase()
                    ) {
                        e.preventDefault();
                        setValidationError(false);
                        setFullFormData((prevState) => ({
                            ...prevState,
                            inputCode: matchingProduct.itemCode,
                            itemId: matchingProduct.itemId,
                            inputName: matchingProduct,
                            itemName:
                                matchingProduct && matchingProduct.itemName
                                    ? matchingProduct.itemName
                                    : "",
                            selectedItem: matchingProduct,
                            itemPrice:
                                matchingProduct && matchingProduct.variantsList[0]
                                    ? matchingProduct.variantsList[0].price
                                    : 0,
                            unit:
                                matchingProduct && matchingProduct.variantsList[0]
                                    ? matchingProduct.variantsList[0].unit
                                    : "",
                            price:
                                matchingProduct && matchingProduct.variantsList[0]
                                    ? matchingProduct.variantsList[0].price
                                    : 0,
                        }));
                        quantityInputRef.current && quantityInputRef.current.focus();
                    }
                }
            }
        }
    };
    const handleEnterPressName = (e) => {
        // const value = e.target.value;
        // console.log('VALUE',value,e.target.value)
        if (e.key === "Enter") {
            if (fullFormData.inputName) {
                // e.preventDefault();
                // setValidationError(false)
                quantityInputRef.current && quantityInputRef.current.focus();
            }
        }
    };
    const handleEnterPressHotelNameName = (e) => {
        if (e.key === "Enter") {
            if (hotelFormData.selectedHotel) {
                roomNoFocus.current && roomNoFocus.current.focus();
            }
        }
    };
    const handleEnterPressRoomNo = (e) => {
        if (e.key === "Enter") {
            // if (hotelFormData.selectedHotel) {
            first.current && first?.current?.focus();
            // }
        }
    };

    const handleEnterPressThird = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            commentInputRef.current && commentInputRef.current.focus();
        }
    };

    const handleEnterPressSecond = (e) => {
        if (e.key === "Enter") {
            setFullFormData((perv) => ({
                ...perv,
                unit:
                    fullFormData &&
                        fullFormData.selectedItem &&
                        fullFormData.selectedItem.variantsList
                        ? fullFormData.selectedItem.variantsList[0].unit
                        : "",
                itemPrice:
                    fullFormData &&
                        fullFormData.selectedItem &&
                        fullFormData.selectedItem.variantsList
                        ? fullFormData.selectedItem.variantsList[0].price
                        : 0,
                selectedUnit:
                    fullFormData &&
                        fullFormData.selectedItem &&
                        fullFormData.selectedItem.variantsList
                        ? fullFormData.selectedItem.variantsList[0]
                        : {},
                price:
                    (fullFormData &&
                        fullFormData.selectedItem &&
                        fullFormData.selectedItem.variantsList
                        ? fullFormData.selectedItem.variantsList[0].price
                        : 0) * fullFormData.qty,
            }));
            e.preventDefault();
            if (
                fullFormData &&
                    fullFormData.selectedItem &&
                    fullFormData.selectedItem.variantsList
                    ? fullFormData.selectedItem.variantsList.length > 1
                        ? true
                        : false
                    : false
            ) {
                unitInputRef.current && unitInputRef.current.focus();
            } else if (
                fullFormData &&
                    fullFormData.selectedItem &&
                    fullFormData.selectedItem.variantsList
                    ? fullFormData.selectedItem.variantsList.length == 1
                        ? true
                        : false
                    : false
            ) {
                commentInputRef.current && commentInputRef.current.focus();
            }
        }
    };

    const handleAddItem = (e) => {
        if (e.key === "Enter") {
            setDisabledFeild({ ...disbledFeild, quantity: true, comment: true });
            if (fullFormData.inputName !== "") {
                const isExist = items.findIndex(
                    (item) =>
                        item.inputCode == fullFormData.inputCode &&
                        item.unit == fullFormData.unit
                );
                if (isExist != -1) {
                    setBillData((perv) => ({
                        ...perv,
                        subTotal: Math.ceil(billData.subTotal + fullFormData.price),
                        settledAmount:
                            billData.subTotal + fullFormData.price
                                ? Math.ceil(
                                    billData.discountType == "none"
                                        ? billData.subTotal + fullFormData.price
                                        : billData.discountType == "fixed"
                                            ? billData.subTotal +
                                            fullFormData.price -
                                            billData.discountValue
                                            : (billData.subTotal + fullFormData.price) *
                                            (1 - billData.discountValue / 100)
                                )
                                : 0,
                    }));
                    setItems((prevItems) =>
                        prevItems?.map((data, index) =>
                            isExist == index
                                ? {
                                    ...data,
                                    qty: parseFloat(data.qty) + parseFloat(fullFormData.qty),
                                    comment: data.comment
                                        ? data.comment + ", " + fullFormData.comment
                                        : fullFormData.comment,
                                    price:
                                        data.price + Math.ceil(fullFormData.qty * fullFormData.itemPrice),
                                }
                                : data
                        )
                    );
                    setFullFormData({
                        inputCode: "",
                        inputName: "",
                        itemName: "",
                        qty: 1,
                        unit: "",
                        comment: "",
                        selectedItem: "",
                        selectedUnit: "",
                        itemPrice: "",
                        commentAutoComplete: [],
                    });
                    setValidationError(false);
                    first.current && first?.current?.focus();
                    e.target.value = "";
                } else {
                    const newItem = {
                        inputCode: fullFormData.inputCode,
                        inputName: fullFormData.inputName,
                        itemName: fullFormData.itemName,
                        qty: fullFormData.qty,
                        unit: fullFormData.unit,
                        itemPrice: fullFormData.itemPrice,
                        unit: fullFormData.unit,
                        price: fullFormData.price,
                        // comment: fullFormData.commentAutoComplete
                        //   ? fullFormData.commentAutoComplete?.join(", ")
                        //   : "",
                        itemId: fullFormData.itemId,
                        comment: fullFormData.comment,
                    };
                    setBillData((perv) => ({
                        ...perv,
                        subTotal: Math.ceil(billData.subTotal + fullFormData.price),
                        settledAmount:
                            billData.subTotal + fullFormData.price
                                ? Math.ceil(
                                    billData.discountType == "none"
                                        ? billData.subTotal + fullFormData.price
                                        : billData.discountType == "fixed"
                                            ? billData.subTotal +
                                            fullFormData.price -
                                            billData.discountValue
                                            : (billData.subTotal + fullFormData.price) *
                                            (1 - billData.discountValue / 100)
                                )
                                : 0,
                        // settledAmount: Math.ceil(billData.subTotal + fullFormData.price),
                    }));
                    setItems((prevItems) => [...prevItems, newItem]);
                    setFullFormData({
                        inputCode: "",
                        inputName: "",
                        itemName: "",
                        qty: 1,
                        unit: "",
                        comment: "",
                        selectedItem: "",
                        selectedUnit: "",
                        itemPrice: "",
                        commentAutoComplete: [],
                    });
                    setValidationError(false);
                    first.current && first?.current?.focus();
                    e.target.value = "";
                }
            } else {
            }
        }
    };
    const handleAddItemTouch = (data) => {
        if (data?.variantsList?.length == 1 && !(data?.variantsList[0].addOnsList.length > 0)) {
            const isExist = items.findIndex(
                (item) =>
                    item.inputCode == data?.itemCode &&
                    item.unit == data?.variantsList[0].unit
            );
            if (isExist != -1) {
                setBillData((perv) => ({
                    ...perv,
                    subTotal: Math.ceil(billData.subTotal + data?.variantsList[0]?.price),
                    settledAmount:
                        billData.subTotal + data?.variantsList[0]?.price
                            ? Math.ceil(
                                billData.discountType == "none"
                                    ? billData.subTotal + data?.variantsList[0]?.price
                                    : billData.discountType == "fixed"
                                        ? billData.subTotal +
                                        data?.variantsList[0]?.price -
                                        billData.discountValue
                                        : (billData.subTotal + data?.variantsList[0]?.price) *
                                        (1 - billData.discountValue / 100)
                            )
                            : 0,
                }));
                setItems((prevItems) =>
                    prevItems?.map((dataObj, index) =>
                        isExist == index
                            ? {
                                ...dataObj,
                                qty: parseFloat(dataObj.qty) + parseFloat(1),
                                price:
                                    dataObj.price + Math.ceil(data?.variantsList[0]?.price),
                            }
                            : dataObj
                    )
                );
                // setFullFormData({
                //     inputCode: "",
                //     searchWord: '',
                // });
                setValidationError(false);
            } else {
                const newItem = {
                    inputCode: data.itemCode,
                    inputName: data.itemShortKey,
                    itemName: data.itemName,
                    qty: 1,
                    unit: data?.variantsList[0]?.unit,
                    itemPrice: data?.variantsList[0]?.price,
                    unit: data?.variantsList[0]?.unit,
                    price: data?.variantsList[0]?.price,
                    itemId: data.itemId,
                };
                setBillData((perv) => ({
                    ...perv,
                    subTotal: Math.ceil(billData.subTotal + data?.variantsList[0]?.price),
                    settledAmount:
                        billData.subTotal + data?.variantsList[0]?.price
                            ? Math.ceil(
                                billData.discountType == "none"
                                    ? billData.subTotal + data?.variantsList[0]?.price
                                    : billData.discountType == "fixed"
                                        ? billData.subTotal +
                                        data?.variantsList[0]?.price -
                                        billData.discountValue
                                        : (billData.subTotal + data?.variantsList[0]?.price) *
                                        (1 - billData.discountValue / 100)
                            )
                            : 0,
                    // settledAmount: Math.ceil(billData.subTotal + fullFormData.price),
                }));
                setItems((prevItems) => [...prevItems, newItem]);
                // setFullFormData({
                //     inputCode: "",
                //     searchWord: '',
                // });
                setValidationError(false);
            }
        }
        else if (data?.variantsList?.length != 0) {
            handleOpenVarients(data);
        }
    };

    const isEqualIgnoreOrder = (a, b) => {
        const array1 = Object.keys(a);
        const array2 = Object.keys(b);
        return array1.sort().toString() === array2.sort().toString();
    }
    function getTotalPrice(obj) {
        return Object.values(obj).reduce((total, item) => total + (item.addonPrice ? item.addonPrice : 0), 0);
    }
    const handleAddItemTouchVarients = (data) => {
        const totalAddonPrice = getTotalPrice(selectedAddons)

        const isExist = items.findIndex(
            (item) =>
                item.inputCode == data?.itemCode &&
                item.unit == data.selected &&
                isEqualIgnoreOrder(item.addons, selectedAddons)
        );
        if (isExist != -1) {
            setBillData((perv) => ({
                ...perv,
                subTotal: Math.ceil(billData.subTotal + data?.selectedPrice + totalAddonPrice),
                settledAmount:
                    (billData.subTotal + data?.selectedPrice + totalAddonPrice)
                        ? Math.ceil(
                            billData.discountType == "none"
                                ? billData.subTotal + data?.selectedPrice + totalAddonPrice
                                : billData.discountType == "fixed"
                                    ? billData.subTotal +
                                    data?.selectedPrice + totalAddonPrice -
                                    billData.discountValue
                                    : (billData.subTotal + data?.selectedPrice + totalAddonPrice) *
                                    (1 - billData.discountValue / 100)
                        )
                        : 0,
            }));
            setItems((prevItems) =>
                prevItems?.map((dataObj, index) =>
                    isExist == index
                        ? {
                            ...dataObj,
                            qty: parseFloat(dataObj.qty) + parseFloat(1),
                            price:
                                dataObj.price + Math.ceil(data?.selectedPrice + totalAddonPrice),
                        }
                        : dataObj
                )
            );
            setFullFormData({
                inputCode: "",
                searchWord: '',
            });
            setValidationError(false);
            setOpenVarients(false);
            setSelectedAddons({})
        } else {
            const newItem = {
                inputCode: data.itemCode,
                inputName: data.itemShortKey,
                itemName: data.itemName,
                qty: 1,
                itemPrice: data?.selectedPrice,
                unit: data.selected,
                price: data?.selectedPrice + totalAddonPrice,
                itemId: data.itemId,
                addons: selectedAddons,
                addonPrice: totalAddonPrice
            };
            setBillData((perv) => ({
                ...perv,
                subTotal: Math.ceil(billData.subTotal + data?.selectedPrice + totalAddonPrice),
                settledAmount:
                    (billData.subTotal + data?.selectedPrice + totalAddonPrice)
                        ? Math.ceil(
                            billData.discountType == "none"
                                ? billData.subTotal + data?.selectedPrice + totalAddonPrice
                                : billData.discountType == "fixed"
                                    ? billData.subTotal +
                                    data?.selectedPrice + totalAddonPrice -
                                    billData.discountValue
                                    : (billData.subTotal + data?.selectedPrice + totalAddonPrice) *
                                    (1 - billData.discountValue / 100)
                        )
                        : 0,
                // settledAmount: Math.ceil(billData.subTotal + fullFormData.price),
            }));
            setItems((prevItems) => [...prevItems, newItem]);
            setFullFormData({
                inputCode: "",
                searchWord: '',
            });
            setValidationError(false);
            setOpenVarients(false);
            setSelectedAddons({})
        }
    };


    const handleReset = (e) => {
        setValidationError(false);
        setFullFormData({
            inputCode: "",
            inputName: "",
            itemName: "",
            qty: 1,
            unit: "",
            comment: "",
            commentAutoComplete: [],
            itemPrice: "",
        });

        if (unitOptionsExist(fullFormData.inputName)) {
            unitInputRef.current && unitInputRef.current.focus();
        } else {
            commentInputRef.current && commentInputRef.current.focus();
        }

        first.current && first?.current?.focus();
        e.target.value = "";
    };

    const unitOptionsExist = (itemName) => {
        const product = data.find((item) => item.itemName === itemName);
        return product && product.variantsList && product.variantsList.length > 0;
    };
    const handleDeleteRow = (index) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems.splice(index, 1);
            return updatedItems;
        });
        const newSubTotal = billData.subTotal - items[index].price
        setBillData((prev) => ({
            ...prev,
            subTotal: Math.ceil(billData.subTotal - items[index].price),
            settledAmount: Math.ceil(billData.subTotal - items[index].price),
            settledAmount: Math.ceil(
                newSubTotal -
                (prev.discountType === "fixed"
                    ? prev.discountValue
                    : prev.discountType === "percentage"
                        ? newSubTotal * (prev.discountValue / 100)
                        : 0)
            ),
        }));
    };
    const handleIncreaseQuantity = (index, currentQty) => {
        const newQty = parseFloat(currentQty ? currentQty : 0) + 1;
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index].qty = newQty;
            updatedItems[index].price = newQty * (updatedItems[index].itemPrice + (updatedItems[index].addonPrice ? updatedItems[index].addonPrice : 0));
            return updatedItems;
        });

        setBillData((prev) => {
            const newSubTotal = items.reduce(
                (sum, item, i) =>
                    sum + (i === index ? newQty * (item.itemPrice + (item.addonPrice ? item.addonPrice : 0)) : item.price),
                0
            );
            return {
                ...prev,
                subTotal: Math.ceil(newSubTotal),
                settledAmount: Math.ceil(
                    newSubTotal -
                    (prev.discountType === "fixed"
                        ? prev.discountValue
                        : prev.discountType === "percentage"
                            ? newSubTotal * (prev.discountValue / 100)
                            : 0)
                ),
            };
        });
    };

    const [text, setText] = useState("");
    const handleInputChange = (event, value) => {
        // if (event) {
        if ((regex.test(value) || value === "") && value.length < 11) {
            setCustomerData((perv) => ({
                ...perv,
                address: value && value.address ? value.address : "",
            }));
            setFreeSoloField(value && value.mobileNo ? value.mobileNo : "");
        }
        // } else {
        //   console.log("error>>");
        // }
    };
    const handleDecreaseQuantity = (index, qty1) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            if (updatedItems[index].qty > 1) {
                updatedItems[index].qty -= 1;
                updatedItems[index].price =
                    updatedItems[index].qty * (updatedItems[index].itemPrice + (updatedItems[index].addonPrice ? updatedItems[index].addonPrice : 0));
            }
            return updatedItems;
        });
        setBillData((perv) => ({
            ...perv,
            subTotal:
                qty1 > 1
                    ? Math.ceil(billData.subTotal - (items[index].itemPrice + (items[index].addonPrice ? items[index].addonPrice : 0)))
                    : Math.ceil(billData.subTotal),
            settledAmount: Math.ceil(
                qty1 > 1
                    ? billData.subTotal -
                    (items[index].itemPrice + (items[index].addonPrice ? items[index].addonPrice : 0)) -
                    (billData.discountType == "fixed"
                        ? billData.discountValue
                        : billData.discountType == "percentage"
                            ? (billData.subTotal - (items[index].itemPrice + (items[index].addonPrice ? items[index].addonPrice : 0))) *
                            (billData.discountValue / 100)
                            : 0)
                    : billData.subTotal -
                    (billData.discountType == "fixed"
                        ? billData.discountValue
                        : billData.discountType == "percentage"
                            ? billData.subTotal * (billData.discountValue / 100)
                            : 0)
            ),
        }));
    };
    const handleOnChangePrice = (index, value) => {
        const newQty = value;
        const isValidInput = /^\d*\.?\d{0,3}$/.test(value);
        if (!isNaN(newQty) && newQty >= -1 && isValidInput) {
            setItems((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[index].qty = newQty;
                updatedItems[index].price = newQty * updatedItems[index].itemPrice;
                return updatedItems;
            });
            setBillData((prev) => {
                const newSubTotal = items.reduce(
                    (sum, item, i) =>
                        sum + (i === index ? newQty * item.itemPrice : item.price),
                    0
                );
                return {
                    ...prev,
                    subTotal: Math.ceil(newSubTotal),
                    settledAmount: Math.ceil(
                        newSubTotal -
                        (prev.discountType === "fixed"
                            ? prev.discountValue
                            : prev.discountType === "percentage"
                                ? newSubTotal * (prev.discountValue / 100)
                                : 0
                        ).toFixed(2)
                    ),
                };
            });
        }
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
            autoClose: 2000,
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
    const handleOpenSuggestion = (value) => {
        setopenSuggestions(true);
    };
    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setSuggestionIndex((prevIndex) =>
                prevIndex === customerList.length - 1 ? 0 : prevIndex + 1
            );
        } else if (e.key === "ArrowUp") {
            setSuggestionIndex((prevIndex) =>
                prevIndex === 0 ? customerList.length - 1 : prevIndex - 1
            );
        } else if (e.key === "Enter" && customerList.length > 0) {
            const selectedValue = customerList[suggestionIndex];
            setSuggestionSelectedValue(selectedValue);
            // setInputValue(`${val.mobileNo}`);
            if (openContactDetails) {
                // If customer modal is open, update temp state
                setTempCustomerData((perv) => ({
                    ...perv,
                    mobileNo: selectedValue.mobileNo,
                    address: selectedValue.address,
                    locality: selectedValue.locality,
                    customerId: selectedValue.customerId,
                    addressId: selectedValue.addressId,
                    customerName: selectedValue.customerName,
                }));
            } else {
                // Otherwise update main state
                setCustomerData((perv) => ({
                    ...perv,
                    mobileNo: selectedValue.mobileNo,
                    address: selectedValue.address,
                    locality: selectedValue.locality,
                    customerId: selectedValue.customerId,
                    addressId: selectedValue.addressId,
                    customerName: selectedValue.customerName,
                }));
            }
            setCustomerList([]);
        }
    };

    const handleSuggestionClick = (val) => {
        setSuggestionSelectedValue(val);
        // setInputValue(`${val.mobileNo}`);
        if (openContactDetails) {
            // If customer modal is open, update temp state
            setTempCustomerData((perv) => ({
                ...perv,
                mobileNo: val.mobileNo,
                address: val.address,
                locality: val.locality,
                customerId: val.customerId,
                addressId: val.addressId,
                customerName: val.customerName,
            }));
        } else {
            // Otherwise update main state
            setCustomerData((perv) => ({
                ...perv,
                mobileNo: val.mobileNo,
                address: val.address,
                locality: val.locality,
                customerId: val.customerId,
                addressId: val.addressId,
                customerName: val.customerName,
            }));
        }
        setCustomerList([]);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setCustomerList([]);
        }, 500);
    };

    useEffect(() => {
        if (suggestionListRef.current && customerList.length > 0) {
            const activeSuggestion =
                suggestionListRef.current.children[suggestionIndex];
            if (activeSuggestion) {
                activeSuggestion.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    }, [suggestionIndex]);
    return (
        <div className="bg-gray-200 overfloe-hidden h-screen anotherHeight">
            <Header
                setIsEdit={setIsEdit}
                setBillData={setBillData}
                setEditBillData={setEditBillData}
                setItems={setItems}
                setCustomerData={setCustomerData}
                setButtonCLicked={setButtonCLicked}
                setHotelFormData={setHotelFormData}
                setDueFormData={setDueFormData}
                setUpiId={setUpiId}
            />
            <section className="left_section h-full ">
                <div className=" w-full p-0 my-2 ">
                    <div className="flex justify-between h-full">
                        <div className="right_meun_Touch w-2/5">
                            <section className="right_section flex justify-between items-center">
                                <div className="right_top_header gap-6 p-2 flex paddinAnother w-full">
                                    <div className="sm:w-20 w-20">
                                        <TextField
                                            placeholder="Code"
                                            value={fullFormData.inputCode ? fullFormData.inputCode : ""}
                                            onChange={(e) => handleInputCodeChange(e)}
                                            onKeyDown={(e) => searchDataByCode(e, billTypeCategory[buttonCLicked]?.menuId)}
                                            variant="outlined"
                                            inputRef={first}
                                            size="small"
                                            name="inputCode"
                                            className="textBoxmUI"
                                            error={validationError ? true : false}
                                        />
                                    </div>
                                    <div className="sm:w-96 w-96 autocompleteTxt">
                                        <TextField
                                            placeholder="Search"
                                            value={fullFormData.searchWord ? fullFormData.searchWord : ""}
                                            onChange={(e) => handleInputCodeChange(e)}
                                            onKeyDown={(e) => getDataOnSearch(e, billTypeCategory[buttonCLicked]?.menuId)}
                                            variant="outlined"
                                            name="searchWord"
                                            inputRef={second}
                                            size="small"
                                            className="textBoxmUI"
                                            error={validationError ? true : false}
                                        />
                                    </div>
                                </div>
                                <button className={`p-1 mr-8 border-2 ${(customerData.address || customerData.mobileNo || customerData.locality || customerData.customerName) ? "border-red-500" : "border-gray-400"} rounded-md`} onClick={handleOpenCustomer}>
                                    <PersonIcon fontSize="large" className={`${(customerData.address || customerData.mobileNo || customerData.locality || customerData.customerName) ? "text-red-500" : "text-gray-400"}`} />
                                </button>
                                <button className={`p-1 mr-8 border-2 ${billData.billCommentAuto.length ? "border-red-500" : "border-gray-400"} rounded-md`} onClick={handleOpenComment}>
                                    <RateReviewIcon fontSize="large" className={`${billData.billCommentAuto.length ? "text-red-500" : "text-gray-400"}`} />
                                </button>
                            </section>
                            <div className="w-full right_meun_T flex rounded-md">
                                {/* <div className="w-full text-base h-full overflow-auto  table_no">
                                    <div className="shadow-md bg-white rounded-md my-2 p-2">
                                        <div className="flex justify-between mb-2">
                                            <div className="header_toggle ml-2 grid content-center ">
                                                <p className="w-56">Customer Details</p>
                                            </div>
                                            <div className="header_toggle ml-2 grid content-center ">
                                                <div>
                                                    ENG{" "}
                                                    <Switch
                                                        checked={isEnglish}
                                                        onChange={() => setIsEnglish(!isEnglish)}
                                                    />{" "}
                                                    GUJ
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <table className="my-2 h-44 w-full">
                                            <tbody>
                                                <tr className="mb-3">
                                                    <td className="w-5">Mobile&nbsp;</td>
                                                    <td className="autocompleteTxt">
                                                        <input
                                                            type="text"
                                                            className={`border-2 w-48 p-1 rounded-sm mobileNo relative ${billError.mobileNo ? "mobileNoError" : ""
                                                                }`}
                                                            name="mobileNo"
                                                            // value={customerData.mobileNo}
                                                            // onChange={(e) => {
                                                            //   setCustomerData((perv) => ({
                                                            //     ...perv,
                                                            //     mobileNo: e.target.value,
                                                            //   }));
                                                            //   // handleOpenSuggestion(e.target.value);
                                                            // }}
                                                            // list="suggestion"
                                                            id="searchWord"
                                                            label="Outlined"
                                                            variant="outlined"
                                                            onChange={(e) => {
                                                                // handleFilter(e.target.value);
                                                                setBillError({
                                                                    ...billError,
                                                                    mobileNo: false,
                                                                });
                                                                if ((regexMobile.test(e.target.value) || e.target.value == '') && e.target.value.length < 11) {
                                                                    setCustomerData((perv) => ({
                                                                        ...perv,
                                                                        mobileNo: e.target.value,
                                                                        customerId: "",
                                                                        addressId: "",
                                                                    }));
                                                                    setSuggestionIndex(0);
                                                                    debounceFunction();
                                                                }
                                                                // setInputValue(e.target.value)
                                                            }}
                                                            onBlur={handleBlur}
                                                            onKeyDown={handleKeyDown}
                                                            value={
                                                                customerData && customerData.mobileNo
                                                                    ? customerData.mobileNo
                                                                    : ""
                                                            }
                                                            autoComplete="off"

                                                        // onBlur={() => setopenSuggestions(false)}
                                                        />
                                                        {customerList.length > 0 && (
                                                            <div
                                                                className="suggestions"
                                                                style={{
                                                                    maxHeight: "165px",
                                                                    overflowY: "auto",
                                                                    width: "33%",
                                                                }}
                                                                ref={suggestionListRef}
                                                            >
                                                                {customerList.map((val, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="cursor-pointer suggestionBorder"
                                                                        onClick={() => handleSuggestionClick(val)}
                                                                    >
                                                                        <div
                                                                            className={`suggestionValue px-2 py-1 ${suggestionIndex === index
                                                                                ? "bg-gray-200"
                                                                                : ""
                                                                                }`}
                                                                        >
                                                                            {val.mobileNo} - {val.customerName} -{" "}
                                                                            {val.address}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr className="mb-3">
                                                    <td className="w-5">Name&nbsp;</td>
                                                    <td>
                                                        {!isEnglish ? (
                                                            <input
                                                                value={
                                                                    customerData && customerData.customerName
                                                                        ? customerData.customerName
                                                                        : ""
                                                                }
                                                                type="text"
                                                                name="customerName"
                                                                className="border-2 w-full p-1 rounded-sm"
                                                                onChange={(e) => {
                                                                    setCustomerData((perv) => ({
                                                                        ...perv,
                                                                        customerName: e.target.value,
                                                                    }));
                                                                }}
                                                            />
                                                        ) : (
                                                            <ReactTransliterate
                                                                value={
                                                                    customerData && customerData.customerName
                                                                        ? customerData.customerName
                                                                        : ""
                                                                }
                                                                className="border-2 w-full p-1 rounded-sm"
                                                                onChangeText={(text) => {
                                                                    setCustomerData((perv) => ({
                                                                        ...perv,
                                                                        customerName: text,
                                                                    }));
                                                                }}
                                                                lang="gu"
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr className="mb-3">
                                                    <td className="w-5">Address&nbsp;</td>
                                                    <td>
                                                        {isEnglish ? (
                                                            <ReactTransliterate
                                                                value={customerData.address}
                                                                className="border-2 w-full p-1 rounded-sm"
                                                                onChangeText={(text) => {
                                                                    setCustomerData((perv) => ({
                                                                        ...perv,
                                                                        address: text,
                                                                        addressId: "",
                                                                    }));
                                                                }}
                                                                lang="gu"
                                                            />
                                                        ) : (
                                                            <input
                                                                value={customerData.address}
                                                                type="text"
                                                                className="border-2 w-full p-1 rounded-sm"
                                                                onChange={(e) => {
                                                                    setCustomerData((perv) => ({
                                                                        ...perv,
                                                                        address: e.target.value,
                                                                        addressId: "",
                                                                    }));
                                                                }}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr className="mb-3">
                                                    <td className="w-5">Locality&nbsp;</td>
                                                    <td>
                                                        {isEnglish ? (
                                                            <ReactTransliterate
                                                                value={customerData.locality}
                                                                className="border-2 w-full p-1 rounded-sm"
                                                                onChangeText={(text) => {
                                                                    setCustomerData((perv) => ({
                                                                        ...perv,
                                                                        locality: text,
                                                                    }));
                                                                }}
                                                                lang="gu"
                                                            />
                                                        ) : (
                                                            <input
                                                                value={customerData.locality}
                                                                type="text"
                                                                className="border-2 w-full p-1 rounded-sm"
                                                                onChange={(e) => {
                                                                    setCustomerData((perv) => ({
                                                                        ...perv,
                                                                        locality: e.target.value,
                                                                    }));
                                                                }}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="shadow-md bg-white  rounded-md my-2 p-2">
                                        <div className="w-full py-2 my-2">
                                            <table className=" w-full">
                                                <tbody>
                                                    <tr className="mb-3">
                                                        <td colSpan="2">
                                                            <Autocomplete
                                                                multiple
                                                                id="tags-outlined"
                                                                options={commentList ? commentList : []}
                                                                // getOptionLabel={commentList ? commentList : []}
                                                                defaultValue={[]}
                                                                freeSolo
                                                                                                        value={
                                            tempBillCommentAuto
                                                ? tempBillCommentAuto
                                                : []
                                        }
                                        onChange={(e, value) => {
                                            setTempBillCommentAuto(value ? value : []);
                                        }}
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        placeholder="Order Comment"
                                                                    />
                                                                )}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="categoryListMenu">
                                    {
                                        subCategoryList?.map((data) => (
                                            <div className={`subCategoryListCard grid ${selectedCategory == data ? 'bgRed' : 'bg-gray-500'}`} onClick={() => setSelectedCategory(data)} key={data}>
                                                <div className="self-center">{data}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="menuListMenu">
                                    <div className="flex flex-row flex-wrap gap-4">
                                        {
                                            data[selectedCategory ? selectedCategory : subCategoryList[0]]?.map((obj, index) => (
                                                obj?.variantsList?.length > 0 ?
                                                    <div className="menuItem grid" key={obj.itemId} onClick={() => {
                                                        handleAddItemTouch(obj)
                                                    }}>
                                                        <div className="self-center">
                                                            {obj.itemName}
                                                        </div>
                                                    </div> : <></>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="left_bill_menu_Touch text-base w-full h-full">
                            <div className="w-full  p-0 text-white">
                                <div className="grid w-full grid-flow-row grid-cols-12 mr-2  bg-gray-700">
                                    <div
                                        onClick={() => {
                                            if (items.length <= 0 || isEdit == false) {
                                                setButtonCLicked("Pick Up");
                                                setBillError((perv) => ({
                                                    ...perv,
                                                    mobileNo: false,
                                                }));
                                                setBillData((prev) => ({
                                                    ...prev,
                                                    totalDiscount: 0,
                                                    discountType: 'none',
                                                    discountValue: 0,
                                                    settledAmount: prev.subTotal,
                                                    billPayType: 'cash'
                                                }))
                                                setValidationError(false);
                                                (billTypeCategory['Pick Up'].menuId != billTypeCategory[buttonCLicked].menuId) && getData(billTypeCategory["Pick Up"]?.menuId);
                                                first?.current?.focus();
                                                ((billTypeCategory['Pick Up'].menuId != billTypeCategory[buttonCLicked].menuId) && items.length > 0) && changeCategoryUpdate(billTypeCategory['Pick Up'].menuId);
                                            }
                                        }}
                                        className={
                                            buttonCLicked == "Pick Up"
                                                ? "clicked col-3 p-0  col-span-6 text-center border-x-2"
                                                : "col-3 p-0 cursor-pointer  col-span-6 text-center border-x-2"
                                        }
                                    >
                                        <Button
                                            variant="plain"
                                            color="danger"
                                            className="w-100 col-auto text-center p-2 px-0"
                                        >
                                            Pick Up
                                        </Button>
                                    </div>
                                    <div
                                        onClick={() => {
                                            if (isEdit == false) {
                                                setButtonCLicked("Delivery");
                                                setBillError((perv) => ({
                                                    ...perv,
                                                    mobileNo: false,
                                                }));
                                                setBillData((prev) => ({
                                                    ...prev,
                                                    totalDiscount: 0,
                                                    discountType: 'none',
                                                    discountValue: 0,
                                                    settledAmount: prev.subTotal,
                                                    billPayType: 'cash'
                                                }))
                                                setValidationError(false);
                                                (billTypeCategory['Delivery'].menuId != billTypeCategory[buttonCLicked].menuId) && getData(billTypeCategory?.Delivery?.menuId);
                                                first?.current?.focus();
                                                ((billTypeCategory['Delivery'].menuId != billTypeCategory[buttonCLicked].menuId) && items.length > 0) && changeCategoryUpdate(billTypeCategory['Delivery'].menuId);
                                            }
                                        }}
                                        className={
                                            buttonCLicked == "Delivery"
                                                ? "clicked col-3 p-0  col-span-6 text-center"
                                                : "col-3 p-0 cursor-pointer  col-span-6 text-center"
                                        }
                                    >
                                        <Button
                                            variant="plain"
                                            color="danger"
                                            className="w-100 col-auto text-center p-2 px-0"
                                        >
                                            Delivery
                                        </Button>
                                    </div>
                                    {/* <div
                                        onClick={() => {
                                            if (items.length <= 0 || isEdit == false) {
                                                setButtonCLicked("Hotel");
                                                setBillError((perv) => ({
                                                    ...perv,
                                                    mobileNo: false,
                                                }));
                                                setBillData((prev) => ({
                                                    ...prev,
                                                    totalDiscount: 0,
                                                    discountType: 'none',
                                                    discountValue: 0,
                                                    settledAmount: prev.subTotal,
                                                    billPayType: 'cash'
                                                }))
                                                setHotelFormData((prev) => ({
                                                    ...prev,
                                                    hotelId: '',
                                                    selectedHotel: '',
                                                    roomNo: ''
                                                }))
                                                setValidationError(false);
                                                (billTypeCategory['Hotel'].menuId != billTypeCategory[buttonCLicked].menuId) && getData(billTypeCategory?.Hotel?.menuId);
                                                ((billTypeCategory['Hotel'].menuId != billTypeCategory[buttonCLicked].menuId) && items.length > 0) && changeCategoryUpdate(billTypeCategory['Hotel'].menuId);
                                                setTimeout(() => {
                                                    hotelName.current && hotelName.current.focus();
                                                }, 100)
                                            }
                                        }}
                                        className={
                                            buttonCLicked == "Hotel"
                                                ? "clicked col-3 p-0  col-span-4 text-center"
                                                : "col-3 p-0 cursor-pointer  col-span-4 text-center"
                                        }
                                    >
                                        <Button
                                            variant="plain"
                                            color="danger"
                                            className="w-100 col-auto text-center p-2 px-0"
                                        >
                                            Hotel
                                        </Button>
                                    </div> */}
                                </div>
                            </div>
                            <div className=" p-0 text-base ">
                                <div className="bg-gray-200">
                                    <div className="grid grid-cols-12 w-full p-2">
                                        <div className="col-span-5 justify-self-center underline color-gray-700 pl-3">
                                            ITEMS
                                        </div>
                                        <div className="col-span-4 justify-self-center">
                                            QTY.
                                        </div>
                                        <div className="col-span-1 justify-self-end ">Price</div>
                                        <div className="col-span-2 justify-self-end ">Total</div>
                                    </div>
                                </div>
                                <div
                                    className={"main_bill_Touch"}
                                >
                                    {items.length === 0 && (
                                        <div className="text-center bill_tag h-full">
                                            <div>
                                                <p className="text-lg text-gray-600">No items Added</p>
                                                <p>Please add the item First</p>
                                                <IoIosRestaurant className="Billing_icon text-center ms-7" />
                                            </div>
                                        </div>
                                    )}
                                    {items?.map((item, index) => (
                                        <div
                                            key={index}
                                            className=" billin_content itemBorder p-2 text-lg"
                                        >
                                            <div className="grid grid-cols-12 items-center content-center gap-2">
                                                <div className="col-span-5 w-full flex  justify-self-start items-center ">
                                                    <MdCancel
                                                        onClick={() => handleDeleteRow(index)}
                                                        className="main_bill_icon_Touch text-red-700 mx-1  cursor-pointer"
                                                    />
                                                    <p
                                                        className="ml-2 w-9/12 itemName"
                                                        onClick={(e) => handleClick(e, index)}
                                                    >
                                                        {item.itemName} {item?.unit?.toLocaleLowerCase() != 'no' ? `${'(' + item.unit + ')'}` : ''}
                                                        <br />
                                                        <span className="text-xs">{item && item?.addons && Object.keys(item.addons).length != 0 ? '(' + Object.values(item?.addons).map(data => data.addonsName)?.join(', ') + ')' : ''}</span>
                                                    </p>
                                                </div>
                                                <div className="col-span-4 justify-self-center">
                                                    <div className="flex h-full align-star main_div">
                                                        <div className="plus_button">
                                                            <div
                                                                onClick={() =>
                                                                    handleDecreaseQuantity(index, item.qty)
                                                                }
                                                                className="border quantity_button cursor-pointer flex justify-center p-0 rounded-md border-black"
                                                            >
                                                                <RemoveIcon />
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={item.qty}
                                                            className="w-14 border border-black rounded-md text-center"
                                                            onChange={(e) =>
                                                                handleOnChangePrice(index, e.target.value)
                                                            }
                                                            onBlur={(e) =>
                                                                handleOnChangePrice(index, e.target.value ? e.target.value > 0 ? e.target.value : 1 : 1)
                                                            }
                                                        />
                                                        <div className="plus_button">
                                                            <div
                                                                onClick={() =>
                                                                    handleIncreaseQuantity(index, item.qty)
                                                                }
                                                                className="border quantity_button  cursor-pointer flex justify-center text-md  items-center p-0 rounded-md border-black"
                                                            >
                                                                <AddOutlinedIcon />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-1 justify-self-end">
                                                    <p className="pl-2">{Math.ceil(item.itemPrice)}</p>
                                                </div>
                                                <div className="col-span-2 justify-self-end">
                                                    <p className="pl-2">{Math.ceil(item.price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-base">
                                <div className="w-full p-2 h-full bg-gray-700 text-white">
                                    <div className="flex w-full justify-between pl-2 pr-2 gap-4 main_div">
                                        <div>
                                            <RadioGroup
                                                className="radio_buttons text-base"
                                                value={billData.billPayType}
                                                onChange={(e) => {
                                                    if (!(isEdit && buttonCLicked == 'Hotel')) {
                                                        if (e.target.value == 'due') {
                                                            // setOpenDue(true);
                                                        } else {
                                                            setBillData((perv) => ({
                                                                ...perv,
                                                                billPayType: e.target.value,
                                                            }));
                                                        }
                                                    }
                                                }}
                                            >
                                                <div>
                                                    <FormControlLabel
                                                        value="cash"
                                                        control={
                                                            <Radio
                                                                name="radio"
                                                                sx={{
                                                                    color: "#fff",
                                                                    "&.Mui-checked": {
                                                                        color: "#fff",
                                                                    },
                                                                }}
                                                            />
                                                        }
                                                        label="Cash"
                                                    />
                                                </div>
                                                {buttonCLicked != "Hotel" ? (
                                                    <div>
                                                        <FormControlLabel
                                                            value="due"
                                                            control={
                                                                <Radio
                                                                    name="radio"
                                                                    onClick={() => {
                                                                        setOpenDue(true);
                                                                    }}
                                                                    sx={{
                                                                        color: "#fff",
                                                                        "&.Mui-checked": {
                                                                            color: "#fff",
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            label="Due"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <FormControlLabel
                                                            value="debit"
                                                            control={
                                                                <Radio
                                                                    name="radio"
                                                                    sx={{
                                                                        color: "#fff",
                                                                        "&.Mui-checked": {
                                                                            color: "#fff",
                                                                        },
                                                                    }}
                                                                />
                                                            }
                                                            label="Debit"
                                                        />
                                                    </div>
                                                )}
                                                {buttonCLicked != "Hotel" && (
                                                    <>
                                                        <div>
                                                            <FormControlLabel
                                                                value="online"
                                                                onClick={(e) => handleClickO(e)}
                                                                control={
                                                                    <Radio
                                                                        name="radio"
                                                                        sx={{
                                                                            color: "#fff",
                                                                            "&.Mui-checked": {
                                                                                color: "#fff",
                                                                            },
                                                                        }}
                                                                    />
                                                                }
                                                                label="Online"
                                                            />
                                                        </div>
                                                        <div>
                                                            <FormControlLabel
                                                                value="complimentary"
                                                                control={
                                                                    <Radio
                                                                        name="radio"
                                                                        sx={{
                                                                            color: "#fff",
                                                                            "&.Mui-checked": {
                                                                                color: "#fff",
                                                                            },
                                                                        }}
                                                                    />
                                                                }
                                                                label="Complimentary"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </RadioGroup>
                                        </div>
                                        <div>
                                            <div className="flex gap-2 main_div">
                                                <div className="bg-red-600 p-1">
                                                    <MdOutlineCurrencyExchange className="text-white text-lg" />
                                                </div>
                                                <p className="text-xl">Total:-</p>
                                                <p className="text-xl">{billData.subTotal}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full text-base flex justify-between pl-4 pr-3 text-white gap-4 bg-gray-500">
                                <div>
                                    <RadioGroup
                                        className="radio_buttons text-base"
                                        value={billData.discountType}
                                        onChange={(e) => {
                                            setBillData((perv) => ({
                                                ...perv,
                                                discountType: e.target.value,
                                                discountValue: 0,
                                                settledAmount: billData.subTotal,
                                            }));
                                        }}
                                    >
                                        <div>
                                            <FormControlLabel
                                                value="none"
                                                control={
                                                    <Radio
                                                        name="radio"
                                                        sx={{
                                                            color: "#fff",
                                                            "&.Mui-checked": {
                                                                color: "#fff",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="None"
                                            />
                                        </div>
                                        <div>
                                            <FormControlLabel
                                                value="percentage"
                                                control={
                                                    <Radio
                                                        name="radio"
                                                        sx={{
                                                            color: "#fff",
                                                            "&.Mui-checked": {
                                                                color: "#fff",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="Percentage"
                                            />
                                        </div>
                                        <div>
                                            <FormControlLabel
                                                value="fixed"
                                                control={
                                                    <Radio
                                                        name="radio"
                                                        sx={{
                                                            color: "#fff",
                                                            "&.Mui-checked": {
                                                                color: "#fff",
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="Fixed"
                                            />
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="discountPadding">
                                    {billData.discountType != "none" ? (
                                        <TextField
                                            className="sarchTextTEST"
                                            // onChange={(e) => { onSearchChange(e); debounceFunction() }}
                                            value={billData.discountValue}
                                            name="discountValue"
                                            placeholder="Discount"
                                            error={billData.discountValue <= 0}
                                            onChange={(e) => {
                                                if (
                                                    regex.test(e.target.value) ||
                                                    e.target.value === ""
                                                ) {
                                                    setBillData((perv) => ({
                                                        ...perv,
                                                        discountValue: e.target.value,
                                                        settledAmount: Math.ceil(
                                                            billData.discountType == "fixed"
                                                                ? billData.subTotal - e.target.value
                                                                : billData.subTotal * (1 - e.target.value / 100)
                                                        ),
                                                    }));
                                                }
                                            }}
                                            id="discountValue"
                                            variant="outlined"
                                            sx={{ width: "140px" }}
                                            // label="Discount"
                                            InputProps={{
                                                endAdornment:
                                                    billData.discountType == "percentage" ? (
                                                        <InputAdornment position="end">
                                                            <PercentIcon fontSize="small" />
                                                        </InputAdornment>
                                                    ) : billData.discountType == "fixed" ? (
                                                        <InputAdornment position="end">
                                                            <CurrencyRupeeIcon fontSize="small" />
                                                        </InputAdornment>
                                                    ) : (
                                                        <InputAdornment>
                                                            <BlockIcon fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                style: { fontSize: 14, background: "#fff" },
                                            }}
                                            // InputLabelProps={{ style: { fontSize: 16 } }}
                                            fullWidth
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {/* <div
                                    className="discountPadding flex gap-3 w-4/12"
                                    style={{ textAlign: "end" }}
                                >
                                    <div className="text-white text-xl mt-1 w-full">
                                        {"Total Discount : " +
                                            (billData.discountType == "none"
                                                ? 0
                                                : (billData.subTotal - billData.settledAmount).toFixed(
                                                    2
                                                ))}
                                    </div>
                                </div> */}
                            </div>
                            <div className="w-full text-base flex justify-end pl-4 pr-3 text-white gap-4 bg-gray-500">
                                <div
                                    className="pb-2 flex gap-3"
                                    style={{ textAlign: "end" }}
                                >
                                    <div className="text-white text-xl mt-1 w-full">
                                        {"Total Discount : " +
                                            (billData.discountType == "none"
                                                ? '0.00'
                                                : (billData.subTotal - billData.settledAmount).toFixed(
                                                    2
                                                ))}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full text-base flex justify-end pl-4 pb-1 pr-3 text-white gap-4 bg-gray-700">
                                <div className="discountPadding flex gap-3">
                                    <div className={`text-white text-xl mt-1 `}>
                                        {"Settled Amount   : "}
                                    </div>
                                    <TextField
                                        className="sarchTextTEST"
                                        // onChange={(e) => { onSearchChange(e); debounceFunction() }}
                                        value={billData.settledAmount}
                                        name="discountValue"
                                        id="discountValue"
                                        variant="outlined"
                                        onChange={(e) => {
                                            if (regex.test(e.target.value) || e.target.value === "") {
                                                setBillData((perv) => ({
                                                    ...perv,
                                                    settledAmount: e.target.value,
                                                    discountType:
                                                        billData.subTotal - e.target.value == 0
                                                            ? "none"
                                                            : "fixed",
                                                    discountValue: billData.subTotal - e.target.value,
                                                }));
                                            }
                                        }}
                                        sx={{ width: "140px" }}
                                        // label="Discount"
                                        error={billData.settledAmount <= 0 && billData.subTotal > 0}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyRupeeIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                            style: {
                                                fontSize: 16,
                                                background: "#fff",
                                                color:
                                                    billData.settledAmount <= 0 && billData.subTotal > 0
                                                        ? "red"
                                                        : "black",
                                            },
                                        }}
                                        // InputLabelProps={{ style: { fontSize: 16 } }}
                                        fullWidth
                                    />
                                </div>
                            </div>
                            {(editBillData && editBillData.billStatus == 'Cancel') ?
                                <div className="text-center mt-2 text-lg font-semibold text-red-500">
                                    This bill is canceled ...!
                                </div> :
                                <div className="w-full text-base flex justify-center gap-4 p-1 mt-1 ">
                                    <div>
                                        <button
                                            className="text-base button px-2 py-1 rounded-md text-white"
                                            onClick={() =>
                                                buttonCLicked == "Hotel"
                                                    ? isEdit
                                                        ? justEditHotelBill()
                                                        : justSaveHotelBill()
                                                    : buttonCLicked == "Delivery"
                                                        ? isEdit
                                                            ? justEditBillDelivery()
                                                            : justSaveBillDelivery()
                                                        : isEdit
                                                            ? justEditBill()
                                                            : justSaveBill()
                                            }
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="text-base button save_button py-1 rounded-md text-white"
                                            onClick={() => {
                                                buttonCLicked == "Hotel"
                                                    ? isEdit
                                                        ? editHotelBill()
                                                        : saveHotelBill()
                                                    : buttonCLicked == "Delivery"
                                                        ? isEdit
                                                            ? editBillDelivery()
                                                            : saveBillDelivery()
                                                        : isEdit
                                                            ? editBill()
                                                            : saveBill();
                                            }}
                                        >
                                            Save & Print
                                        </button>
                                    </div>
                                    {isEdit ? (
                                        <>
                                            <div>
                                                <button
                                                    className="another_1 button text-base px-2 py-1 rounded-md text-white"
                                                    onClick={() =>
                                                        buttonCLicked == "Hotel"
                                                            ? editHotelBillPrint()
                                                            : buttonCLicked == "Delivery"
                                                                ? editBillPrintDelivery()
                                                                : editBillPrint()
                                                    }
                                                >
                                                    Save & Bill
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    className="another_1 button text-base px-2 py-1 rounded-md text-white"
                                                    onClick={() =>
                                                        buttonCLicked == "Hotel"
                                                            ? editHotelKotPrint()
                                                            : buttonCLicked == "Delivery"
                                                                ? editKotPrintDelivery()
                                                                : editKotPrint()
                                                    }
                                                >
                                                    Save & KOT
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                                    onClick={() =>
                                                        buttonCLicked == "Hotel"
                                                            ? cancleHotelBill()
                                                            : buttonCLicked == "Delivery"
                                                                ? cancleBillDelivery()
                                                                : cancleBill()
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <button
                                                className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                                onClick={() =>
                                                    buttonCLicked == "Hotel"
                                                        ? holdHotelBill()
                                                        : buttonCLicked == "Delivery"
                                                            ? holdBillDelivery()
                                                            : holdBill()
                                                }
                                            >
                                                HOLD
                                            </button>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <div className="commentPopUp">
                    <div className="commentHeader">Item Comment</div>
                    <div className="mt-2">
                        <Autocomplete
                            multiple
                            id="tags-outli"
                            options={commentList ? commentList : []}
                            // getOptionLabel={commentList ? commentList : []}
                            defaultValue={[]}
                            freeSolo
                            value={itemComment && itemComment.itemComment ? itemComment.itemComment : []}
                            onChange={(e, value) => {
                                setItemComment((perv) => ({
                                    ...perv,
                                    itemComment: value ? value : [],
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Item Comments" />
                            )}
                        />
                    </div>
                    <div className="w-full text-base flex justify-end gap-4 p-1 mt-1 ">
                        <div>
                            <button
                                className="text-base button px-2 py-1 rounded-md text-white"
                                onClick={() => saveItemComment()}
                            >
                                Save
                            </button>
                        </div>
                        <div>
                            <button
                                className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                onClick={() => handleClose()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
            </Popover>
            <Popover
                id={idO}
                open={openO}
                anchorEl={anchorElO}
                placement={'top-start'}
                onClose={handleCloseO}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className="upiPopUp">
                    <div className="commentHeader">Select UPI id</div>
                    <div className="mt-6 mb-4">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">UPI id</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={upiId}
                                label="UPI id"
                                defaultValue={upiList[0]?.onlineId}
                                onChange={(e) => setUpiId(e.target.value)}
                            >
                                {
                                    upiList?.map((data) => (
                                        <MenuItem key={data.onlineId} value={data.onlineId}>{data.upiId}</MenuItem>
                                    ))
                                }
                                {
                                    < MenuItem key={'other'} value={'other'}>Other</MenuItem>
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div className="w-full text-base flex justify-end gap-4 p-1 mt-1 ">
                        <div>
                            <button
                                className="text-base button px-2 py-1 rounded-md text-white"
                                onClick={() => handleCloseO()}
                            >
                                Save
                            </button>
                        </div>
                        <div>
                            <button
                                className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                onClick={() => handleCloseO()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
            </Popover >
            <Modal
                open={openDue}
                onClose={handleCloseDue}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" className="flex justify-between" variant="h6" component="h2">
                        <div>Select Account</div><div className="flex" style={{ marginTop: '-2px', cursor: 'pointer' }} onClick={() => handleCloseDue()}><Close className="self-center" /></div>
                    </Typography>
                    <div className="gap-4 grid mt-6 mb-4">
                        {addAccount ?
                            <>
                                <div>
                                    <TextField
                                        // className="sarchTextTEST"
                                        value={accountFormData.customerName}
                                        name="customerName"
                                        id="customerName"
                                        placeholder='Enter Customer Name'
                                        variant="outlined"
                                        onChange={(e) => {
                                            setAccountFormData((prev) => ({
                                                ...prev,
                                                customerName: e.target.value
                                            }))
                                        }}
                                        fullWidth
                                    />
                                </div>
                                <div>
                                    <TextField
                                        // className="sarchTextTEST"
                                        value={accountFormData.customerNumber}
                                        name="customerNumber"
                                        id="customerNumber"
                                        placeholder='Enter Customer Number'
                                        variant="outlined"
                                        onChange={(e) => {
                                            if ((regexMobile.test(e.target.value) || e.target.value == '') && e.target.value.length < 11) {
                                                setAccountFormData((prev) => ({
                                                    ...prev,
                                                    customerNumber: e.target.value
                                                }))
                                            }
                                        }}
                                        fullWidth
                                    />
                                </div>
                                <div className="flex gap-4 justify-end">
                                    <div>
                                        <button
                                            className="text-base button px-2 py-1 rounded-md text-white"
                                            onClick={() => handleSaveAccount()}
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                            onClick={() => {
                                                setAccountFormData({
                                                    customerName: "",
                                                    customerNumber: ""
                                                });
                                                setAddAccount(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className="flex gap-4 justify-end">
                                    <div>
                                        <button
                                            className="text-base button px-2 py-1 rounded-md text-white"
                                            onClick={() => clickAddAccount()}
                                        >
                                            Add Account
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Autocomplete
                                        options={accountList ? accountList : []}
                                        defaultValue={null}
                                        getOptionLabel={(options) =>
                                            options.customerName ? options.customerName : ""
                                        }
                                        value={dueFormData.selectedAccount}
                                        onChange={handleAccountChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Accounts"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        // className="sarchTextTEST"
                                        value={dueFormData.dueNote}
                                        name="dueNote"
                                        id="dueNote"
                                        placeholder='Enter Note'
                                        variant="outlined"
                                        onChange={(e) => {
                                            setDueFormData((prev) => ({
                                                ...prev,
                                                dueNote: e.target.value
                                            }))
                                        }}
                                        // InputLabelProps={{ style: { fontSize: 16 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className="flex gap-4 justify-end">
                                    {/* <div>
                    <button
                      className="text-base button px-2 py-1 rounded-md text-white"
                      onClick={() => justDue()}
                    >
                      Just Due
                    </button>
                  </div> */}
                                    <div>
                                        <button
                                            className="text-base button px-2 py-1 rounded-md text-white"
                                            onClick={() => saveDue()}
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                            onClick={() => {
                                                handleCloseDue();
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openVarients}
                onClose={handleCloseVarients}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style2}>
                    <Typography id="modal-modal-title" className="flex justify-between" variant="h6" component="h2">
                        <div>Varients of {selectedVarients?.itemName}</div><div className="flex" style={{ marginTop: '-2px', cursor: 'pointer' }} onClick={() => handleCloseVarients()}><Close className="self-center" /></div>
                    </Typography>
                    <div className='varientsListContainer flex flex-row flex-wrap gap-4 mt-6'>
                        {selectedVarients?.variantsList?.map((obj, index) => (
                            <div className={`varientCard grid ${selectedVarients.selected == obj.unit ? 'bgRed' : 'bg-gray-700'}`} key={obj.unit} onClick={() => {
                                setSelectedAddons({})
                                setSelectedVarients((prev) => ({
                                    ...prev,
                                    selected: obj.unit,
                                    selectedPrice: obj.price,
                                    addOnsList: obj?.addOnsList,
                                }))
                            }}>
                                <div className="self-center">
                                    <div className="mb-2">{obj.unit}</div>
                                    <div>{obj.price}</div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    {selectedVarients?.addOnsList?.map((data, index) => (
                        <div key={index} className="mt-5">
                            <div key={'sd'}>
                                {data.groupName}
                            </div>
                            <div className='varientsListContainer flex flex-row flex-wrap gap-4 mt-3'>
                                {data?.addOnArray?.map((obj, index) => (
                                    <div className={`varientCard px-2 grid ${selectedAddons[obj?.addonsId] ? 'bgRed' : 'bg-gray-700'}`} key={obj.addonsId}
                                        onClick={() => handleAddonClick(obj)}
                                    >
                                        <div className="self-center">
                                            <div className="mb-2">{obj.addonsName}</div>
                                            <div>{obj.addonPrice}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                    }
                    <div className="gap-4 grid mt-6 mb-4">
                        <div className="flex gap-4 justify-end">
                            {/* <div className="">
                                {selectedVarients?.selectedPrice}
                            </div> */}
                            <div>
                                <button
                                    className="text-base button px-2 py-1 rounded-md text-white"
                                    onClick={() => handleAddItemTouchVarients(selectedVarients)}
                                >
                                    Save
                                </button>
                            </div>
                            <div>
                                <button
                                    className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                    onClick={() => {
                                        handleCloseVarients();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openContactDetails}
                onClose={handleCloseCustomer}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleCustomerModal}>
                    <Typography id="modal-modal-title" className="flex justify-between" variant="h6" component="h2">
                        <div>Customer Details</div><div className="flex" style={{ marginTop: '-2px', cursor: 'pointer' }} onClick={() => handleCancelCustomer()}><Close className="self-center" /></div>
                    </Typography>
                    <div className="flex justify-between mb-2">
                        <div className="header_toggle ml-2 grid content-center ">
                            <p className="w-56"></p>
                        </div>
                        <div className="header_toggle ml-2 grid content-center ">
                            <div>
                                ENG{" "}
                                <Switch
                                    checked={isEnglish}
                                    onChange={() => setIsEnglish(!isEnglish)}
                                />{" "}
                                GUJ
                            </div>
                        </div>
                    </div>
                    <hr />
                    <table className="my-6 h-44 w-full">
                        <tbody>
                            <tr className="mb-3">
                                <td className="w-5">Mobile&nbsp;</td>
                                <td className="autocompleteTxt">
                                    <input
                                        type="text"
                                        className={`border-2 w-48 p-1 rounded-sm mobileNo relative ${billError.mobileNo ? "mobileNoError" : ""
                                            }`}
                                        name="mobileNo"
                                        // value={customerData.mobileNo}
                                        // onChange={(e) => {
                                        //   setCustomerData((perv) => ({
                                        //     ...perv,
                                        //     mobileNo: e.target.value,
                                        //   }));
                                        //   // handleOpenSuggestion(e.target.value);
                                        // }}
                                        // list="suggestion"
                                        id="searchWord"
                                        label="Outlined"
                                        variant="outlined"
                                        onChange={(e) => {
                                            // handleFilter(e.target.value);
                                            setBillError({
                                                ...billError,
                                                mobileNo: false,
                                            });
                                            if ((regexMobile.test(e.target.value) || e.target.value == '') && e.target.value.length < 11) {
                                                setTempCustomerData((perv) => ({
                                                    ...perv,
                                                    mobileNo: e.target.value,
                                                    customerId: "",
                                                    addressId: "",
                                                }));
                                                setSuggestionIndex(0);
                                                debounceFunction();
                                            }
                                            // setInputValue(e.target.value)
                                        }}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        value={
                                            tempCustomerData && tempCustomerData.mobileNo
                                                ? tempCustomerData.mobileNo
                                                : ""
                                        }
                                        autoComplete="off"

                                    // onBlur={() => setopenSuggestions(false)}
                                    />
                                    {customerList.length > 0 && (
                                        <div
                                            className="suggestions"
                                            style={{
                                                maxHeight: "165px",
                                                overflowY: "auto",
                                                width: "33%",
                                            }}
                                            ref={suggestionListRef}
                                        >
                                            {customerList.map((val, index) => (
                                                <div
                                                    key={index}
                                                    className="cursor-pointer suggestionBorder"
                                                    onClick={() => handleSuggestionClick(val)}
                                                >
                                                    <div
                                                        className={`suggestionValue px-2 py-1 ${suggestionIndex === index
                                                            ? "bg-gray-200"
                                                            : ""
                                                            }`}
                                                    >
                                                        {val.mobileNo} - {val.customerName} -{" "}
                                                        {val.address}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <tr className="mb-3">
                                <td className="w-5">Name&nbsp;</td>
                                <td>
                                    {!isEnglish ? (
                                        <input
                                            value={
                                                tempCustomerData && tempCustomerData.customerName
                                                    ? tempCustomerData.customerName
                                                    : ""
                                            }
                                            type="text"
                                            name="customerName"
                                            className="border-2 w-full p-1 rounded-sm"
                                            onChange={(e) => {
                                                setTempCustomerData((perv) => ({
                                                    ...perv,
                                                    customerName: e.target.value,
                                                }));
                                            }}
                                        />
                                    ) : (
                                        <ReactTransliterate
                                            value={
                                                tempCustomerData && tempCustomerData.customerName
                                                    ? tempCustomerData.customerName
                                                    : ""
                                            }
                                            className="border-2 w-full p-1 rounded-sm"
                                            onChangeText={(text) => {
                                                setTempCustomerData((perv) => ({
                                                    ...perv,
                                                    customerName: text,
                                                }));
                                            }}
                                            lang="gu"
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr className="mb-3">
                                <td className="w-5">Address&nbsp;</td>
                                <td>
                                    {isEnglish ? (
                                        <ReactTransliterate
                                            value={tempCustomerData.address}
                                            className="border-2 w-full p-1 rounded-sm"
                                            onChangeText={(text) => {
                                                setTempCustomerData((perv) => ({
                                                    ...perv,
                                                    address: text,
                                                    addressId: "",
                                                }));
                                            }}
                                            lang="gu"
                                        />
                                    ) : (
                                        <input
                                            value={tempCustomerData.address}
                                            type="text"
                                            className="border-2 w-full p-1 rounded-sm"
                                            onChange={(e) => {
                                                setTempCustomerData((perv) => ({
                                                    ...perv,
                                                    address: e.target.value,
                                                    addressId: "",
                                                }));
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>
                            <tr className="mb-3">
                                <td className="w-5">Locality&nbsp;</td>
                                <td>
                                    {isEnglish ? (
                                        <ReactTransliterate
                                            value={tempCustomerData.locality}
                                            className="border-2 w-full p-1 rounded-sm"
                                            onChangeText={(text) => {
                                                setTempCustomerData((perv) => ({
                                                    ...perv,
                                                    locality: text,
                                                }));
                                            }}
                                            lang="gu"
                                        />
                                    ) : (
                                        <input
                                            value={tempCustomerData.locality}
                                            type="text"
                                            className="border-2 w-full p-1 rounded-sm"
                                            onChange={(e) => {
                                                setTempCustomerData((perv) => ({
                                                    ...perv,
                                                    locality: e.target.value,
                                                }));
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-end w-full gap-4">
                        <button
                            className="another_2 button text-base px-2 py-1 rounded-md text-white"
                            onClick={() => {
                                handleResetCustomer();
                            }}
                        >
                            Reset
                        </button>
                        <button
                            className="another_2 button text-base px-2 py-1 rounded-md text-white"
                            onClick={() => {
                                handleCancelCustomer();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="save_button button text-base px-2 py-1 rounded-md text-white"
                            onClick={() => {
                                handleSaveCustomer();
                            }}
                        >
                            Save
                        </button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openCommnet}
                onClose={handleCloseComment}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleCustomerModal}>
                    <Typography id="modal-modal-title" className="flex justify-between" variant="h6" component="h2">
                        <div>Order comment</div><div className="flex" style={{ marginTop: '-2px', cursor: 'pointer' }} onClick={() => handleCancelComment()}><Close className="self-center" /></div>
                    </Typography>
                    <table className=" mt-4 w-full">
                        <tbody>
                            <tr className="mb-3">
                                <td colSpan="2">
                                    <Autocomplete
                                        multiple
                                        id="tags-outlined"
                                        options={commentList ? commentList : []}
                                        // getOptionLabel={commentList ? commentList : []}
                                        defaultValue={[]}
                                        freeSolo
                                        value={
                                            tempBillCommentAuto
                                                ? tempBillCommentAuto
                                                : []
                                        }
                                        onChange={(e, value) => {
                                            setTempBillCommentAuto(value ? value : []);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Order Comment"
                                            />
                                        )}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex mt-4 justify-end w-full">
                        <button
                            className="save_button button text-base px-2 py-1 rounded-md text-white"
                            onClick={() => {
                                handleSaveComment();
                            }}
                        >
                            Save
                        </button>
                    </div>
                </Box>
            </Modal>
        </div >
    );
};

export default BillingTouchScreen;

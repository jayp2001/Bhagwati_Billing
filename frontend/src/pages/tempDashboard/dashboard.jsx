import './dashboard.css';
import Header from '../../components/Header/Header';
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { BACKEND_BASE_URL, SOCKET_URL } from '../../url';
import Popover from "@mui/material/Popover";
import axios from 'axios';
import { MdOutlineCurrencyExchange } from "react-icons/md";
import React from 'react';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TimerMinutes from './timer';
import InputAdornment from "@mui/material/InputAdornment";
import PercentIcon from "@mui/icons-material/Percent";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BlockIcon from "@mui/icons-material/Block";
import Close from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyRupee from '@mui/icons-material/CurrencyRupee';
import io from "socket.io-client";
import { TextField, Box, RadioGroup, FormControlLabel, Autocomplete, Typography, Radio, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { renderToString } from "react-dom/server";
import TokenBil from '../TokenBill';
import Modal from "@mui/material/Modal";
import TableBarIcon from '@mui/icons-material/TableBar';
import ClearIcon from '@mui/icons-material/Clear';
import { pad } from 'crypto-js';
import { TbBorderRadius } from 'react-icons/tb';
import DineInBill from '../dineInBill';
import RestaurantBill from '../RestaurantBill';
// Use the exposed ipcRenderer from preload script
const ipcRenderer = window.ipcRenderer;
const style = {
    position: "absolute",
    top: "50%",
    outline: 'none',
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 750,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: '10px',
    overflow: 'hidden'
    // p: '0px 10px 5px 10px',
};
const styleDue = {
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
function Dashboard() {
    const navigate = useNavigate();
    const regexMobile = /^[0-9\b]+$/;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [upiId, setUpiId] = useState();
    const [billTypeCategory, setBillTypeCategory] = useState({});
    const [upiList, setUpiList] = useState([])
    const [accountList, setAccountList] = useState([]);
    const [openDue, setOpenDue] = React.useState(false);
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
    const [tableList, setTableList] = useState([]);
    const [isAddTable, setIsTable] = useState(false);
    const [noOfTable, setNoOfTable] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const regex = /^-?\d*(?:\.\d*)?$/;
    const systemPrinter = JSON.parse(localStorage.getItem("printerPreference"));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [anchorElO, setAnchorElO] = useState(null);
    const dineinbill = systemPrinter?.filter(
        (printer) => printer.categoryId == "dineinBill"
    );
    const [open, setOpen] = useState(false);
    const [billData, setBillData] = useState(
        {
            billId: '',
            tableNo: '',
            billPayType: '',
            discountType: '',
            discountValue: '',
            totalDiscount: '',
            settledAmount: '',
            billStatus: 'complete',
            tableStatus: ''
        }
    );
    const handleClose = () => {
        setOpen(false);
        setBillData({
            billId: '',
            tableNo: '',
            billPayType: '',
            discountType: '',
            discountValue: '',
            totalDiscount: '',
            settledAmount: '',
            billStatus: 'complete',
            tableStatus: ''
        })
    };

    const openO = Boolean(anchorElO);
    const idO = openO ? "simple-popover" : undefined;
    const handleClickO = (event) => {
        setAnchorElO(event.currentTarget);
        // console.log('split', items && items[index] && items[index].comment ? items[index].comment?.split(/,\s*/) : [],)
    };
    const handleCancel = async (billId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/sattledCancelTokenTable?billId=${billId}`,
                config
            );
            if (response.data) {
                setSuccess(true);
                getTableList();
            }
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || "Failed to cancel table");
        }
    }
    const handleSettel = async (data) => {
        try {
            // Get bill data by ID
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/getBillDataById?billId=${data.billId}`,
                config
            );
            const resData = response.data;

            // Set UPI and due form data from API response (like PickUp.jsx)
            setUpiId(resData?.onlineId ? resData?.onlineId : upiId);
            setDueFormData((prev) => ({
                ...prev,
                accountId: resData?.payInfo?.accountId || '',
                dueNote: resData?.dueNote || '',
                selectedAccount: resData?.payInfo || '',
            }));

            // Find upiJson from upiList and upiId
            const upiJson = upiList?.find((u) => u.onlineId === (resData?.onlineId || upiId));

            // Set bill data with the response data and always include upi/account info
            // subTotal must be original total (totalAmount) for discount calc - not the discounted settledAmount
            const originalTotal = resData?.totalAmount ?? resData?.subTotal ?? data.billAmt;
            setBillData({
                billId: data.billId,
                tableNo: data.tableNo,
                billPayType: 'cash',
                subTotal: data.billAmt,
                settledAmount: data.billAmt,
                discountType: 'none',
                discountValue: 0,
                totalDiscount: 0,
                billStatus: 'complete',
                tableStatus: data.tableStatus || '',
                ...resData,
                subTotal: originalTotal,
                settledAmount: resData?.settledAmount ?? data.billAmt,
                upiJson: upiJson,
                onlineId: resData?.onlineId || upiId,
                accountId: resData?.payInfo?.accountId || dueFormData.accountId,
                dueNote: resData?.dueNote || dueFormData.dueNote,
            });
            setOpen(true);
        } catch (error) {
            console.error('Error fetching bill data:', error);
            // Fallback to original behavior if API fails (use billAmt for both)
            setBillData({
                billId: data.billId,
                tableNo: data.tableNo,
                billPayType: 'cash',
                subTotal: data.billAmt,
                settledAmount: data.billAmt,
                discountType: 'none',
                discountValue: 0,
                totalDiscount: 0,
                billStatus: 'complete',
                tableStatus: data.tableStatus || '',
                upiJson: upiList?.find((u) => u.onlineId === upiId),
                onlineId: upiId,
                accountId: dueFormData.accountId,
                dueNote: dueFormData.dueNote,
            });
            setOpen(true);
        }
    }
    const getTableList = async () => {
        await axios
            .get(
                `${BACKEND_BASE_URL}billingrouter/getAllTableView`,
                config
            )
            .then((res) => {
                setTableList(res.data);
            })
            .catch((error) => {
                // setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    }
    const clickAddAccount = () => {
        setAddAccount(true);
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
    useEffect(() => {
        const socket = io(SOCKET_URL);
        socket.on("connect", () => {
        });
        socket.on("updateTableView", (data) => {
            getTableList();
        });

        return () => {
            socket.disconnect();
        };
    }, []);
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
    const getAccountList = async () => {
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/ddlDueAccountData`, config)
            .then((res) => {
                setAccountList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    const getBillCategory = async () => {
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/getBillCategory`, config)
            .then((res) => {
                if (res.data && typeof res.data === 'object') {
                    setBillTypeCategory(res.data);
                } else {
                    setBillTypeCategory({});
                }
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    };
    const settelBill = () => {
        if (loading || success) {
        } else {
            if (
                !billData ||
                !billData.subTotal ||
                !billData.tableNo ||
                !billData.billId ||
                !billData.settledAmount ||
                !billData.discountType ||
                (billData.discountType != "none" && !billData.discountValue)
            ) {
                setError("Please Fill All Field");
            } else if (billData.settledAmount <= 0) {
                setError("Sattle Amount can not be less than zero");
            } else {
                // console.log(">>", fullFormData, fullFormData.stockInDate, fullFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                settelBillDataAtPrint();
            }
        }
    };
    const handleCloseDue = () => {
        setOpenDue(false);
    }
    const handleCloseO = () => {
        setAnchorElO(null);
    };
    const settelBillDataAtPrint = async (shouldPrint = false) => {
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            billId: billData.billId,
            tableNo: billData.tableNo,
            billPayType: billData.billPayType,
            discountType: billData.discountType,
            discountValue: billData.discountValue,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            settledAmount: billData.settledAmount,
            accountId: dueFormData.accountId,
            dueNote: dueFormData.dueNote,
            isOfficial: billTypeCategory['Dine In']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            upiJson: upiJson,
            onlineId: upiId,
            billStatus: 'complete'
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/sattledBillDataByID`,
                customData,
                config
            )
            .then(async (res) => {
                if (shouldPrint && res?.data && dineinbill?.[0]) {
                    try {
                        const BillComponent = res.data.isOfficial ? RestaurantBill : DineInBill;
                        const pickupKotPrint = renderToString(<BillComponent data={res.data} />);
                        const printerDataKot = {
                            printer: dineinbill[0],
                            data: pickupKotPrint,
                        };
                        ipcRenderer.send("set-title", printerDataKot);
                    } catch (rrr) { /* print fail */ }
                }
                setSuccess(true);
                setLoading(false);
                getTableList();
                setOpen(false);
                setBillData({
                    billId: '',
                    tableNo: '',
                    billPayType: '',
                    discountType: '',
                    discountValue: '',
                    totalDiscount: '',
                    settledAmount: '',
                    billStatus: 'complete',
                    tableStatus: ''
                });
            })
            .catch((error) => {
                setLoading(false);
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const settleAndPrint = () => {
        if (loading || success) return;
        if (
            !billData ||
            !billData.subTotal ||
            !billData.tableNo ||
            !billData.billId ||
            !billData.settledAmount ||
            !billData.discountType ||
            (billData.discountType != "none" && !billData.discountValue)
        ) {
            setError("Please Fill All Field");
            return;
        }
        if (billData.settledAmount <= 0) {
            setError("Sattle Amount can not be less than zero");
            return;
        }
        settelBillDataAtPrint(true);
    };
    const saveAndSettle = () => {
        if (loading || success) return;
        if (
            !billData ||
            !billData.subTotal ||
            !billData.tableNo ||
            !billData.billId ||
            !billData.settledAmount ||
            !billData.discountType ||
            (billData.discountType != "none" && !billData.discountValue)
        ) {
            setError("Please Fill All Field");
            return;
        }
        if (billData.settledAmount <= 0) {
            setError("Sattle Amount can not be less than zero");
            return;
        }
        settelBillDataAtPrint(false);
    };
    const saveAndPrint = async () => {
        if (loading || success) return;
        if (
            !billData ||
            !billData.subTotal ||
            !billData.tableNo ||
            !billData.billId ||
            !billData.settledAmount ||
            !billData.discountType ||
            (billData.discountType != "none" && !billData.discountValue)
        ) {
            setError("Please Fill All Field");
            return;
        }
        if (billData.settledAmount <= 0) {
            setError("Sattle Amount can not be less than zero");
            return;
        }
        setLoading(true);
        const upiJson = upiList?.filter((data) => data.onlineId == upiId)[0];
        const customData = {
            billId: billData.billId,
            tableNo: billData.tableNo,
            billPayType: billData.billPayType,
            discountType: billData.discountType,
            discountValue: billData.discountValue,
            totalDiscount:
                billData.discountType == "none"
                    ? 0
                    : billData.subTotal - billData.settledAmount,
            settledAmount: billData.settledAmount,
            accountId: dueFormData.accountId || '',
            dueNote: dueFormData.dueNote || '',
            isOfficial: billTypeCategory['Dine In']?.isOfficial ? true : billData.billPayType == 'online' ? upiJson?.isOfficial ? true : upiId == 'other' ? true : false : false,
            upiJson: upiJson,
            onlineId: upiId,
            billStatus: 'print'
        };
        await axios
            .post(
                `${BACKEND_BASE_URL}billingrouter/updateBillDataWithPrintByID`,
                customData,
                config
            )
            .then(async (res) => {
                if (res?.data && dineinbill?.[0]) {
                    try {
                        const BillComponent = res?.data?.isOfficial ? RestaurantBill : DineInBill;
                        const pickupKotPrint = renderToString(<BillComponent data={res.data} />);
                        const printerDataKot = {
                            printer: dineinbill[0],
                            data: pickupKotPrint,
                        };
                        ipcRenderer.send("set-title", printerDataKot);
                    } catch (rrr) { /* print fail */ }
                }
                setSuccess(true);
                setLoading(false);
                getTableList();
                setOpen(false);
                setBillData({
                    billId: '',
                    tableNo: '',
                    billPayType: '',
                    discountType: '',
                    discountValue: '',
                    totalDiscount: '',
                    settledAmount: '',
                    billStatus: 'complete',
                    tableStatus: ''
                });
            })
            .catch((error) => {
                setLoading(false);
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const printBill = async (billId) => {
        setLoading(true);
        await axios
            .get(
                `${BACKEND_BASE_URL}billingrouter/printTableBill?billId=${billId}`,
                config
            )
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                getTableList();
                if (res?.data && dineinbill?.[0]) {
                    try {
                        const BillComponent = res.data.isOfficial ? RestaurantBill : DineInBill;
                        const pickupKotPrint = renderToString(<BillComponent data={res.data} />);
                        const printerDataKot = {
                            printer: dineinbill[0],
                            data: pickupKotPrint,
                        };
                        ipcRenderer.send("set-title", printerDataKot);
                    } catch (rrr) { /* print fail */ }
                }
            })
            .catch((error) => {
                setError(
                    error.response && error.response.data
                        ? error.response.data
                        : "Network Error ...!!!"
                );
            });
    };
    const updateTable = async () => {
        if (noOfTable) {
            const confirmed = await window.electronAPI.showConfirm('Are you sure you want to update table?', 'Update Table');
            if (confirmed) {
                setLoading(true)
                await axios
                    .get(
                        `${BACKEND_BASE_URL}billingrouter/updateStaticTableNumbers?num=${noOfTable}`,
                        config
                    )
                    .then((res) => {
                        setSuccess(true);
                        getTableList();
                        setIsTable(false);
                    })
                    .catch((error) => {
                        setError(error.response ? error.response.data : "Network Error ...!!!");
                    });
            }
        }
        else {
            setError('enter no of table')
        }

    }
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
    useEffect(() => {
        getTableList();
        getUpiDDl();
        getAccountList();
        getBillCategory();
    }, [])
    return (
        <div>
            <Header />
            <div className='flex justify-between gap-4 pl-6 pr-6 pt-6'>
                <div className='text-lg font-medium pt-1 text-gray-700'>
                    <TableBarIcon />&nbsp;&nbsp;Table View
                </div>
                <div className='flex gap-4'>
                    <div className='dashboardCard'
                        onClick={() => {
                            navigate(`/main/DineIn/${null}/${null}/blank`)
                        }}>
                        Dine In
                    </div>
                    <div className='dashboardCard' onClick={() => {
                        navigate(`/main/Delivery/x`)
                    }}>
                        Delivery
                    </div>
                    <div className='dashboardCard'
                        onClick={() => {
                            navigate(`/main/Pick Up/x`)
                        }}>
                        Pick Up
                    </div>
                    <div className='dashboardCard'
                        onClick={() => {
                            navigate(`/main/Hotel/x`)
                        }}>
                        Hotel
                    </div>
                </div>
            </div>
            <hr className='my-5' style={{ border: '0.5px solid rgba(0,0,0,0.3)' }} />
            <div className='flex justify-between pl-7'>
                <div className='flex gap-4'>
                    {isAddTable ?
                        <>
                            <div>
                                <TextField
                                    id="outlined-required"
                                    size='small'
                                    label="Total Table"
                                    value={noOfTable}
                                    onChange={(e) => {
                                        if ((regexMobile.test(e.target.value) || e.target.value == '') && e.target.value.length < 4) {
                                            setNoOfTable(e.target.value)
                                        }
                                    }}
                                />
                            </div>
                            <div className='flex gap-4'>
                                <div className='btn'
                                    onClick={() => {
                                        updateTable()
                                    }}>
                                    Save
                                </div><div className='btnCancel'
                                    onClick={() => {
                                        setIsTable(false);
                                    }}>
                                    Cancel
                                </div>
                            </div>
                        </> :
                        <div className='addTableBtn'
                            onClick={() => {
                                setIsTable(true);
                                setNoOfTable(tableList.length)
                            }}>
                            + Add Table
                        </div>
                    }
                </div>
                <div className='flex justify-end gap-6 mr-7'>
                    <div className='flex gap-2 self-center'>
                        <div className='blankColor'></div> <div>Blank Table</div>
                    </div>
                    <div className='flex gap-2 self-center'>
                        <div className='printedColor'></div> <div>Print Bill</div>
                    </div>
                    <div className='flex gap-2 self-center'>
                        <div className='runningColor'></div> <div>Running Table</div>
                    </div>
                    <div className='flex gap-2 self-center'>
                        <div className='cancelColor'></div> <div>Cancelled Table</div>
                    </div>
                </div>
            </div>
            <div className='px-8 mt-6'>
                <div>
                    Dine In
                </div>
                <div className='tableWrapper px-2 mt-4 flex gap-5 gap-y-1'>
                    {tableList?.map((data, index) => (
                        <Tooltip title={data.assignCaptain} arrow placement="top" >
                            <div style={{ minHeight: '125px' }}>
                                < div className={data.tableStatus == 'running' ? 'tableIconRunning' : data.tableStatus == 'print' ? 'tableIconPrint' : data.tableStatus == "CancelToken" ? "tableIconCancelToken" : 'tableIcon'} onClick={() => {
                                    navigate(`/main/DineIn/${data.tableId ? data.tableId : null}/${data.billId ? data.billId : null}/${data.tableStatus ? data.tableStatus : null}`)
                                }}>
                                    <div className={data.tableStatus != 'blank' ? 'flex-col pt-1 justify-around gap-2' : 'grid blankIcon content-center'}>
                                        {data.tableStatus != 'blank' && <TimerMinutes startTime={data?.tableStartTime} />}
                                        <div className='my-1'>{data.tableId}</div>
                                        {data.tableStatus != 'blank' && <div className='font-semibold'><CurrencyRupee sx={{ fontSize: '16px' }} />{parseFloat(data.billAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
                                    </div>
                                </div>
                                {data.tableStatus != 'blank' &&
                                    <div className='printWrap flex justify-around'>
                                        {data.tableStatus == 'running' ?
                                            <>
                                                <div className='print' onClick={(e) => { e.stopPropagation(); printBill(data.billId); }}>
                                                    <LocalPrintshopOutlinedIcon />
                                                </div>
                                                <div className='print' onClick={(e) => { e.stopPropagation(); handleSettel(data); }}>
                                                    <SaveOutlinedIcon />
                                                </div>
                                            </> :
                                            data.tableStatus == "CancelToken" ?
                                                <div className='print' onClick={(e) => { e.stopPropagation(); handleCancel(data.billId); }}>
                                                    <ClearIcon />
                                                </div> : <div className='print' onClick={(e) => { e.stopPropagation(); handleSettel(data); }}>
                                                    <SaveOutlinedIcon />
                                                </div>
                                        }
                                    </div>
                                }
                            </div>
                        </Tooltip>
                    ))
                    }
                </div>
            </div>
            <Modal
                open={open}
                // style={{ borderRadius: "10px", overflow: "hidden" }}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <div style={{ fontSize: "18px", marginBottom: "20px" }} className='bg-gray-300 pl-3 flex justify-between pr-3 pt-2 pb-2'>
                            <div>
                                Settel Table No. {billData.tableNo || ""} <span className='font-semibold'>[<CurrencyRupee fontSize='small' />{parseFloat(billData.subTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ]</span>
                            </div>
                            <div className='cursor-pointer' onClick={() =>
                                handleClose()
                            }>
                                <CloseIcon />
                            </div>
                        </div>
                        <div className='pl-3 pr-3 pb-1'>
                            <div className="text-base">
                                <div className="w-full h-full">
                                    <div className="w-full font-semibold">Payment Type</div>
                                    <div className="flex w-full justify-between gap-4 main_div mt-3">
                                        <div>
                                            {(() => {
                                                const lockComplimentaryAsOnly = billData.isOfficial && billData.billPayType === 'complimentary';
                                                const disableComplimentary = billData.isOfficial && ['cash', 'due', 'online'].includes(billData.billPayType);
                                                return (
                                                    <RadioGroup
                                                        className="radio_buttons text-base gap-6"
                                                        value={billData.billPayType}
                                                        onChange={(e) => {
                                                            const next = e.target.value;
                                                            if (lockComplimentaryAsOnly) return;
                                                            if (next === 'complimentary' && disableComplimentary) return;
                                                            if (next == 'due') {
                                                                setOpenDue(true);
                                                            } else {
                                                                setBillData((perv) => ({
                                                                    ...perv,
                                                                    billPayType: next,
                                                                }));
                                                            }
                                                        }}
                                                    >
                                                        <div>
                                                            <FormControlLabel
                                                                value="cash"
                                                                disabled={lockComplimentaryAsOnly}
                                                                control={
                                                                    <Radio
                                                                        name="radio"
                                                                    />
                                                                }
                                                                label="Cash"
                                                            />
                                                        </div>
                                                        <div>
                                                            <FormControlLabel
                                                                value="due"
                                                                disabled={lockComplimentaryAsOnly}
                                                                onClick={() => {
                                                                    if (!lockComplimentaryAsOnly) setOpenDue(true);
                                                                }}
                                                                control={
                                                                    <Radio
                                                                        name="radio"
                                                                    />
                                                                }
                                                                label="Due"
                                                            />
                                                        </div>
                                                        <div>
                                                            <FormControlLabel
                                                                value="online"
                                                                disabled={lockComplimentaryAsOnly}
                                                                onClick={(e) => !lockComplimentaryAsOnly && handleClickO(e)}
                                                                control={
                                                                    <Radio
                                                                        name="radio"
                                                                    />
                                                                }
                                                                label="Online"
                                                            />
                                                        </div>
                                                        <div>
                                                            <FormControlLabel
                                                                value="complimentary"
                                                                disabled={disableComplimentary}
                                                                control={
                                                                    <Radio
                                                                        name="radio"
                                                                    />
                                                                }
                                                                label="Complimentary"
                                                            />
                                                        </div>
                                                    </RadioGroup>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full font-semibold mt-3">Discount</div>
                            <div className="w-full text-base flex justify-between gap-4 mt-3">
                                <div>
                                    <RadioGroup
                                        className="radio_buttons text-base gap-6"
                                        // fullWidth
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
                            </div>
                            <div
                                className="discountPadding w-full text-base flex pb-1 gap-4 mt-3"
                            // style={{ textAlign: "end" }}
                            >
                                <div className="text-base mt-1 w-full">
                                    {"Total Discount : " +
                                        (billData.discountType == "none"
                                            ? 0
                                            : (billData.subTotal - billData.settledAmount).toFixed(
                                                2
                                            ))}
                                </div>
                            </div>
                            <div className="w-full text-base flex pb-1 gap-4 mt-4">
                                <div className="discountPadding flex gap-3">
                                    <div className={` text-base mt-1 `}>
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
                                        sx={{ width: "200px" }}
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
                            <hr style={{ border: '0.5px solid rgba(0,0,0,0.5)' }} className="mt-2" />
                            <div className='w-full text-base flex justify-end gap-4 p-1 mt-1'>
                                <div>
                                    <button
                                        className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                        onClick={() => handleClose()}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {billData.tableStatus === 'running' ? (
                                    <>
                                        <div>
                                            <button
                                                className="text-base button px-2 py-1 rounded-md text-white"
                                                onClick={() => settleAndPrint()}
                                            >
                                                Settle & Print
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className="text-base button px-2 py-1 rounded-md text-white"
                                                onClick={() => saveAndSettle()}
                                            >
                                                Save & Settle
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className="text-base button px-2 py-1 rounded-md text-white"
                                                onClick={() => saveAndPrint()}
                                            >
                                                Save & Print
                                            </button>
                                        </div>
                                    </>
                                ) : billData.tableStatus === 'print' ? (
                                    <>
                                        <div>
                                            <button
                                                className="text-base button px-2 py-1 rounded-md text-white"
                                                onClick={() => saveAndSettle()}
                                            >
                                                Save & Settle
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className="text-base button px-2 py-1 rounded-md text-white"
                                                onClick={() => settleAndPrint()}
                                            >
                                                Settle & Print
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <button
                                            className="text-base button px-2 py-1 rounded-md text-white"
                                            onClick={() => settelBill()}
                                        >
                                            Settle & Save
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
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
                                value={upiId ? upiId : upiList[0]?.onlineId}
                                label="UPI id"
                                defaultValue={upiList[0]?.onlineId}
                                onChange={(e) => setUpiId(e.target.value)}
                            >
                                {
                                    upiList?.map((data) => (
                                        <MenuItem key={data.onlineId} value={data.onlineId}>{data.holderName}</MenuItem>
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
                <Box sx={styleDue}>
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
            <ToastContainer />
        </div >
    )
}

export default Dashboard;
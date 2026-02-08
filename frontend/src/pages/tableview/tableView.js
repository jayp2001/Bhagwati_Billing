import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../url";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TokenBil from "../TokenBill";
import "./tableView.css"
import { green } from "@mui/material/colors";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';

const TableView = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [rows, setRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filter, setFilter] = useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getAllData = async () => {
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/getBillingStaticsData?startDate=&endDate=`, config)
            .then((res) => {
                setRows(res.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const getAllDataByFilter = async () => {
        const startDate = state[0].startDate;
        const endDate = state[0].endDate;
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/getBillingStaticsData?startDate=${startDate}&endDate=${endDate}`, config)
            .then((res) => {
                setRows(res.data);
            })
            .catch((error) => {
                console.error("Error fetching filtered data:", error);
            });
    };

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }
    // const rows = [
    //   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    //   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    //   createData("Eclair", 262, 16.0, 24, 6.0),
    //   createData("Cupcake", 305, 3.7, 67, 4.3),
    //   createData("Gingerbread", 356, 16.0, 49, 3.9),
    // ];
    useEffect(() => {
        getAllData();
    }, []);

    const dueSum = rows?.dueJson?.reduce((sum, item) => sum + parseFloat(item.dueAmt || 0), 0) || 0;
    const onlineSum = rows?.upiJson?.reduce((sum, item) => sum + parseFloat(item.upiAmt || 0), 0) || 0;

    const data = {
        delivery: {
            cancleAmt: 0,
            cashAmt: 370,
            complimentaryAmt: 0,
            discountAmt: 0,
            dueAmt: 0,
            onlineAmt: 0,
        },
        dineIn: {
            cancleAmt: 0,
            cashAmt: 0,
            complimentaryAmt: 0,
            discountAmt: 0,
            dueAmt: 0,
            onlineAmt: 0,
        },
        hotel: {
            cancleAmt: 0,
            discountAmt: 0,
            hotelCash: 0,
            hotelDebit: 0,
        },
        pickUp: {
            cancleAmt: 0,
            cashAmt: 271112,
            complimentaryAmt: 0,
            discountAmt: 66.25,
            dueAmt: 0,
            onlineAmt: 0,
        },
    };

    // return (
    //   <TokenBil data={billdata} />
    // )

    return (
        <div className="bg-gray-200 max-h-screen min-h-screen overflow-y-auto">
            <Header />
            <div className="p-4">
                {/* Date Range Picker Section */}
                <div className="mb-4 flex justify-end items-center gap-4">
                    <div className='dateRange text-center self-center bg-white px-4 py-2 rounded-lg shadow-md cursor-pointer border border-gray-300 hover:border-gray-400 transition-colors' aria-describedby={id} onClick={handleClick}>
                        <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                    </div>
                    <div className='resetBtnWrap self-center'>
                        <button
                            className={`px-3 py-2 rounded-lg transition-colors ${!filter ? 'bg-gray-300 hover:bg-gray-400 text-gray-700' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                            onClick={() => {
                                setFilter(false);
                                getAllData();
                                setState([
                                    {
                                        startDate: new Date(),
                                        endDate: new Date(),
                                        key: 'selection'
                                    }
                                ])
                            }}
                        >
                            <CloseIcon sx={{ stroke: filter ? 'white' : '#374151' }} />
                        </button>
                    </div>

                    <Popover
                        id={id}
                        open={open}
                        style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: 'auto', height: 'auto', borderRadius: '10px' }}>
                            <DateRangePicker
                                ranges={state}
                                onChange={item => { setState([item.selection]) }}
                                direction="horizontal"
                                months={2}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                            />
                            <div className='mt-8 flex justify-end gap-2'>
                                <button
                                    className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors'
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
                                    onClick={() => {
                                        getAllDataByFilter();
                                        setFilter(true);
                                        handleClose();
                                    }}
                                >
                                    Apply
                                </button>
                            </div>
                        </Box>
                    </Popover>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>Categories</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>Cash Amt</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>Due Amt</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>Online Amt</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>Complementy Amt</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>Discount Amt</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>Cancel Amt</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>Total Amt</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* {rows?.map((row) => ( */}
                            <TableRow
                                key={"1"}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">
                                    {"Pick Up"}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["pickUp"] ? rows["pickUp"].cashAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["pickUp"] ? rows["pickUp"].dueAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["pickUp"] ? rows["pickUp"].onlineAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["pickUp"] ? rows["pickUp"].complimentaryAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["pickUp"] ? rows["pickUp"].discountAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["pickUp"] ? rows["pickUp"].cancleAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "16px" }}>
                                    {rows["pickUp"]
                                        ? (rows["pickUp"].cashAmt +
                                            rows["pickUp"].onlineAmt +
                                            rows["pickUp"].dueAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                            </TableRow>
                            <TableRow
                                key={"2"}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">
                                    {"Delivery"}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["delivery"] ? rows["delivery"].cashAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["delivery"] ? rows["delivery"].dueAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["delivery"] ? rows["delivery"].onlineAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["delivery"] ? rows["delivery"].complimentaryAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["delivery"] ? rows["delivery"].discountAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["delivery"] ? rows["delivery"].cancleAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "16px" }}>
                                    {rows["delivery"]
                                        ? (rows["delivery"].cashAmt +
                                            rows["delivery"].onlineAmt +
                                            rows["delivery"].dueAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                            </TableRow>
                            <TableRow
                                key={"2"}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">
                                    {"Hotel"}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["hotel"] ? rows["hotel"].cashAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["hotel"] ? rows["hotel"].dueAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["hotel"] ? rows["hotel"].onlineAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["hotel"] ? rows["hotel"].complimentaryAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["hotel"] ? rows["hotel"].discountAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["hotel"] ? rows["hotel"].cancleAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "16px" }}>
                                    {rows["hotel"]
                                        ? (rows["hotel"].cashAmt +
                                            rows["hotel"].dueAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                            </TableRow>
                            <TableRow
                                key={"2"}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">
                                    {"Dine In"}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["dineIn"] ? rows["dineIn"].cashAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["dineIn"] ? rows["dineIn"].dueAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["dineIn"] ? rows["dineIn"].onlineAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["dineIn"] ? rows["dineIn"].complimentaryAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["dineIn"] ? rows["dineIn"].discountAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right">
                                    {rows["dineIn"] ? rows["dineIn"].cancleAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "16px" }}>
                                    {rows["dineIn"]
                                        ? (rows["dineIn"].cashAmt +
                                            rows["dineIn"].onlineAmt +
                                            rows["dineIn"].dueAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                            </TableRow>
                            <TableRow
                                key={"3"}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell sx={{ fontWeight: 'bold', fontSize: "18px" }} component="th" scope="row">
                                    {"Total"}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "18px" }}>
                                    {rows["pickUp"]
                                        ? (rows["pickUp"].cashAmt + rows["delivery"].cashAmt + rows["hotel"].cashAmt + rows["dineIn"].cashAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "18px" }}>
                                    {rows["pickUp"]
                                        ? (rows["pickUp"].dueAmt + rows["delivery"].dueAmt + rows["hotel"].dueAmt + rows["dineIn"].dueAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "18px" }}>
                                    {rows["pickUp"]
                                        ? (rows["pickUp"].onlineAmt + rows["delivery"].onlineAmt + rows["dineIn"].onlineAmt + rows["hotel"].onlineAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "18px" }}>
                                    {rows["pickUp"]
                                        ? (rows["pickUp"].complimentaryAmt +
                                            rows["delivery"].complimentaryAmt + rows["dineIn"].complimentaryAmt + rows["hotel"].complimentaryAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "18px" }}>
                                    {rows["pickUp"]
                                        ? (rows["pickUp"].discountAmt + rows["delivery"].discountAmt + rows["hotel"].discountAmt + rows["dineIn"].discountAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "18px" }}>
                                    {rows["pickUp"]
                                        ? (rows["pickUp"].cancleAmt + rows["delivery"].cancleAmt + rows["hotel"].cancleAmt + rows["dineIn"].cancleAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: "green", fontSize: "18px" }}>
                                    {rows["pickUp"]
                                        ? (rows["pickUp"].cashAmt +
                                            rows["pickUp"].onlineAmt +
                                            rows["pickUp"].dueAmt +
                                            rows["delivery"].cashAmt +
                                            rows["delivery"].onlineAmt +
                                            rows["delivery"].dueAmt +
                                            rows["dineIn"].cashAmt +
                                            rows["dineIn"].onlineAmt +
                                            rows["dineIn"].dueAmt +
                                            rows["hotel"].cashAmt +
                                            rows["hotel"].dueAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className='col-span-12'>
                <div className='grid grid-cols-2 gap-6 p-4'>
                    <div className='mt-6 analyzeContainer'>
                        <div className='analyzeHeaderGreen flex justify-between px-4 justify-self-center'>
                            <div>
                                Online Payments
                            </div>
                            <div>
                                ₹ {Number(parseFloat(onlineSum || 0).toFixed(2)).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                        </div>
                        <div className='listContainer'>
                            {rows?.upiJson?.length > 0 ? (
                                rows.upiJson.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <div className='flex justify-between py-2'>
                                            <div className='categoryTxt capitalize'>
                                                {data.holderName}
                                            </div>
                                            <div className='categoryTxt'>
                                                ₹ {Number(parseFloat(data.upiAmt || 0).toFixed(2)).toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </div>
                                        </div>
                                        <hr />
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className='flex justify-center items-center min-h-[150px] w-full text-2xl font-semibold text-gray-500 text-center'>
                                    No UPI ID
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='mt-6 analyzeContainer'>
                        <div className='analyzeHeaderRed flex justify-between px-4 justify-self-center'>
                            <div>
                                Today's Due
                            </div>
                            <div>
                                ₹ {Number(parseFloat(dueSum || 0).toFixed(2)).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                        </div>
                        <div className='listContainer'>
                            {rows?.dueJson?.length > 0 ? (
                                rows.dueJson.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <div className='flex justify-between py-2'>
                                            <div className='categoryTxt capitalize'>
                                                {data.customerName}
                                            </div>
                                            <div className='categoryTxt'>
                                                ₹ {Number(parseFloat(data.dueAmt || 0).toFixed(2)).toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </div>
                                        </div>
                                        <hr />
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className='flex justify-center items-center min-h-[150px] w-full text-2xl font-semibold text-gray-500 text-center'>
                                    No Due's
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableView;

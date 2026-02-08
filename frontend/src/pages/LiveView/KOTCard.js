import React, { useState } from "react";
import { Box, CardContent, Divider, Modal } from "@mui/material";
import { Card } from "react-bootstrap";
import PersonIcon from '@mui/icons-material/Person';
import "./css/Cards.css";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";

const KOTCard = ({ data }) => {
    const navigate = useNavigate();
    const [infoPopUpOpen, setInfoPopUpOpen] = useState(false);
    const [infoPopUpData, setInfoPopUpData] = useState();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 0,
    };

    const totalQty = data.itemData.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div className="w-full">
            <Card className="shadow-md rounded-md relative w-full h-full border">
                <CardContent sx={{ padding: 0 }} className="CardContent h-full">
                    <div className="bg-white w-full rounded-md overflow-hidden">
                        {/* Header Section - KOT Style */}
                        <div className={`p-1 text-center text-white font-bold ${data.billType === 'Delivery' ? 'bg-orange-600' :
                            data.billType === 'Hotel' ? 'bg-purple-600' :
                                data.billType === 'Pick Up' ? 'bg-blue-600' :
                                    data.billType === 'Dine In' ? 'bg-green-600' : 'bg-gray-600'
                            }`}>
                            <div className="flex justify-between items-center">
                                <div className="text-xs font-bold">{data?.billType}</div>
                                <div className="flex flex-col items-center">
                                    <div className="text-sm font-bold">{data?.tokenNo}</div>
                                    <div className="text-xs">KOT No.</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-xs font-bold">
                                        <Timer startTime={data?.timeDifference} />
                                    </div>
                                    <div className="text-xs">MM : SS</div>
                                </div>
                            </div>
                        </div>

                        {/* Biller Info Section */}
                        <div className="bg-gray-50 p-2 border-b">
                            <div className="flex items-center">
                                <PersonIcon className="text-gray-600 mr-1 text-sm" />
                                <span className="text-xs font-medium text-gray-700">
                                    {data.cashier}
                                </span>
                                {data.billType === 'Dine In' && data.tableInfo?.tableNo && (
                                    <span className="ml-auto text-xs text-gray-600">
                                        Table No. {data.tableInfo.tableNo}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Customer Details (if any) */}
                        {(data?.customerDetails?.customerName || data?.customerDetails?.mobileNo || data?.hotelDetails?.hotelName) && (
                            <div className="bg-blue-50 p-2 border-b text-xs">
                                {data?.hotelDetails?.hotelName && (
                                    <div className="font-medium">
                                        {data.hotelDetails.hotelName}
                                        {data?.hotelDetails?.roomNo && ` - Room ${data.hotelDetails.roomNo}`}
                                    </div>
                                )}
                                {data?.customerDetails?.customerName && (
                                    <div className="text-gray-700">{data.customerDetails.customerName}</div>
                                )}
                                {data?.customerDetails?.mobileNo && (
                                    <div className="text-gray-700">{data.customerDetails.mobileNo}</div>
                                )}
                            </div>
                        )}

                        {/* Items Section - KOT Table Style (itemName, qty, unit as in KOT.js) */}
                        <div className="p-2">
                            <div className="border border-gray-300 rounded">
                                <div className="bg-gray-100 flex border-b border-gray-300">
                                    <div className="flex-1 p-1 text-sm font-bold border-r border-gray-300">Items</div>
                                    <div className="w-20 p-1 text-sm font-bold text-center border-gray-300">Qty</div>
                                </div>
                                {data.itemData.map((item, index) => (
                                    <div key={index} className="border-b border-gray-300 last:border-b-0">
                                        <div className="flex">
                                            <div className="flex-1 p-1 border-r border-gray-300">
                                                <div className="font-bold text-sm">
                                                    {item.itemName}
                                                </div>
                                                {item.comment && (
                                                    <div className="text-xs mt-1 mb-1" style={{ fontSize: "12px" }}>
                                                        ({item.comment})
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-20 p-1 text-center font-bold text-sm">
                                                {item.qty} {item.unit}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bill Comment Section */}
                        {data.billComment != null && String(data.billComment).trim() !== "" && (
                            <div className="bg-white p-2 border-t border-gray-300">
                                <div className="text-sm text-black">
                                    <span className="font-medium">Note: </span>
                                    <span>{data.billComment}</span>
                                </div>
                            </div>
                        )}

                    </div>
                </CardContent>
            </Card>

            {/* Info Modal - Same as original Cards component */}
            <Modal
                open={infoPopUpOpen}
                onClose={() => setInfoPopUpOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableAutoFocus
            >
                <Box sx={style} className='rounded-md border-none'>
                    <div className="px-4 pb-4">
                        <div className="bg-gray-200 py-3 px-1 rounded-b-md">
                            <div className="billData flex justify-between px-2 items-center">
                                <div className="InfoFirmName">{infoPopUpData?.firmData?.firmName}</div>
                                <div className="billInformation ">
                                    <div className="billNumber">Token No : {infoPopUpData?.tokenNo}</div>
                                </div>
                            </div>
                            <div className="flex justify-between px-2 items-center">
                                <div className="InfoBillType mt-2 ">{infoPopUpData?.billType}</div>
                                <div className={`${infoPopUpData?.billPayType == 'Cancel' ? 'bg-red-600' : 'bg-gray-500'} p-1 px-2 text-white mt-3 rounded-md text-md`}>
                                    {infoPopUpData?.billPayType}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="p-2 flex items-center gap-1">
                                <PersonIcon />{infoPopUpData?.cashier}
                            </div>
                            <div className="p-2 flex items-center gap-1">
                                {infoPopUpData?.tableInfo?.tableNo ? "Table No. " + infoPopUpData?.tableInfo?.tableNo : ''}
                            </div>
                        </div>
                        {infoPopUpData?.customerDetails &&
                            <>
                                <div className="border w-full"></div>
                                <div className="customerDetails p-2">
                                    <div className="text-md font-semibold">
                                        Customer Details
                                    </div>
                                    {infoPopUpData?.customerDetails && infoPopUpData?.customerDetails?.customerName && (
                                        <div className="customerName my-1">{infoPopUpData?.customerDetails?.customerName}</div>
                                    )}
                                    {infoPopUpData?.customerDetails && infoPopUpData?.customerDetails?.mobileNo && (
                                        <div className="customerName my-1">{infoPopUpData?.customerDetails?.mobileNo}</div>
                                    )}
                                    {infoPopUpData?.customerDetails && infoPopUpData?.customerDetails?.address && (
                                        <div className="customerName my-1">{infoPopUpData?.customerDetails?.address}</div>
                                    )}
                                </div>
                            </>
                        }
                        {infoPopUpData?.hotelDetails &&
                            <>
                                <div className="border w-full"></div>
                                <div className="customerDetails p-2">
                                    <div className="text-md font-semibold">
                                        Hotel Details
                                    </div>
                                    {infoPopUpData?.hotelDetails && infoPopUpData?.hotelDetails?.hotelName && (
                                        <div className="customerName my-1">{infoPopUpData?.hotelDetails?.hotelName} {infoPopUpData?.hotelDetails && infoPopUpData?.hotelDetails?.roomNo ? ' - ' + infoPopUpData?.hotelDetails?.roomNo : ''}</div>
                                    )}
                                    {infoPopUpData?.hotelDetails && infoPopUpData?.hotelDetails?.customerName && (
                                        <div className="customerName my-1">{infoPopUpData?.hotelDetails?.customerName}</div>
                                    )}
                                    {infoPopUpData?.hotelDetails && infoPopUpData?.hotelDetails?.phoneNumber && (
                                        <div className="customerName my-1">{infoPopUpData?.hotelDetails?.phoneNumber}</div>
                                    )}
                                </div>
                            </>
                        }
                        <div className="border w-full"></div>
                        <div className="ItemDetails p-2">
                            <div className="text-md font-semibold">
                                Item Details (KOT Format)
                            </div>
                            <div className="my-2 border-gray-300 itemCustomheight">
                                <div className="flex flex-wrap items-center mb-2">
                                    {infoPopUpData?.itemData.map((item, index) => (
                                        <div key={index} className="my-2 text-xs font-semibold w-full border-b border-gray-200 pb-2">
                                            <div className="flex justify-between">
                                                <span>{item.itemName}</span>
                                                <span>{item.qty} {item.unit}</span>
                                            </div>
                                            {item.comment && (
                                                <div className="text-xs text-blue-600 mt-1">
                                                    ({item.comment})
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="border w-full"></div>
                        <div className="text-end flex items-center justify-end my-2 mt-4">Total Qty: {infoPopUpData?.itemData.reduce((acc, item) => acc + item.qty, 0)}</div>
                        <div className="border w-full"></div>
                        <div className="flex items-center justify-end mt-4">
                            <div
                                className="bg-white cursor-pointer border-black flex items-center hover:bg-gray-100 justify-center BackArroIconDiv w-20 gap-2 rounded-lg border"
                                onClick={() => setInfoPopUpOpen(false)}
                            >
                                Close
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default KOTCard;

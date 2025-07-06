import React, { useState } from "react";
import { Box, CardActions, CardContent, Divider, Modal } from "@mui/material";
import { Card } from "react-bootstrap";
import { IoIosCall } from "react-icons/io";
import { GiWaterRecycling } from "react-icons/gi";
import { TbPinned } from "react-icons/tb";
import PersonIcon from '@mui/icons-material/Person';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import "./css/Cards.css";
import StorefrontIcon from "@mui/icons-material/Storefront";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import Timer from "./Timer";
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Cards = ({ data }) => {
  const navigate = useNavigate();
  const [infoPopUpOpen, setInfoPopUpOpen] = useState(false);
  const [infoPopUpData, setInfoPopUpData] = useState()
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
  return (
    <div>
      {/* Delivery Card */}
      <Card
        className="shadow-md  rounded-md relative w-full h-full"
      >
        <CardContent sx={{ padding: 0 }} className="CardContent h-full">
          <div className="absolute" style={{ left: '46%', top: '-7%' }}>
            <div className={` ${data.billType === 'Delivery' ? 'DeliveryColorIcon' : data.billType === 'Hotel' ? 'HotelColorIcon' : data.billType === 'Pick Up' ? 'PickUpColorIcon' : data.billType === 'Dine In' ? 'DineInColorIcon' : ''} rounded-full p-2 flex items-center justify-center`}>
              {data.billType === 'Delivery' ? <DeliveryDiningIcon className="text-2xl textColorIcon" /> :
                data.billType === 'Hotel' ? <ApartmentIcon className="text-2xl textColorIcon" /> :
                  data.billType === 'Pick Up' ? <StorefrontIcon className="text-2xl textColorIcon" /> :
                    data.billType === 'Dine In' ? <RestaurantMenuIcon className="text-2xl textColorIcon" /> : ''}
            </div>
          </div>
          <div className="bg-white w-full rounded-lg overflow-hidden border ">
            <div className={`pt-2 pb-1 px-2 cursor-pointer flex justify-between text-start ${data.billType === 'Delivery' ? 'DeliveryColor' : data.billType === 'Hotel' ? 'HotelColor' : data.billType === 'Pick Up' ? 'PickUpColor' : data.billType === 'Dine In' ? 'DineInColor' : ''}`}
              onClick={() => {
                data.billType === 'Dine In' ? navigate(`/main/DineIn/${data?.tableInfo?.tableNo}/${data.billId}/${data.billStatus}`) : navigate(`/main/${data.billType}/${data.billId}`)
              }}>
              <div>
                <div className="text-xs text-gray">
                  {/* {`${data?.firmData.firmName.slice(
                  0,
                  15
                )}...`} */}
                  Shree Bhagwati
                </div>
                <div className="mt-2 text-xs">
                  {/* KOT: 71 | BILL: {data.billNumber} */}
                  Token No: {data?.tokenNo}
                </div>
              </div>
              <div className="self-center">
                <div className="ml-2 text-black border border-gray-300 mr-14 p-1 rounded-2xl px-3 mt-3 text-xs bg-white">
                  {/* <Timer id={data.billId} billTime={data.timeDifference} /> */}
                  <Timer startTime={data?.timeDifference} />
                </div>
              </div>
              <div className="self-start">
                <div className="flex justify-end">
                  {/* <div className="text-gray-700 text-sm">Paid OTP:</div>
                  <div className="ml-1 text-gray-500 text-sm">1547</div> */}
                  <div className="bg-gray-300 p-1 rounded-md text-xs">
                    {data?.billPayType}
                  </div>
                </div>
                <div>
                  {/* <div className=" text-gray-500 text-xs">173195324584065</div> */}
                  <div className=" text-gray-700 text-sm mt-1 ">{data?.billType}</div>
                </div>
              </div>
            </div>
            {/* <div className=""> */}
            <div className="flex p-2 justify-between text-gray-700">
              <div>
                <div className="flex  items-center">
                  <div className="headr_icon">
                    <PersonIcon className="text-gray-700" />
                  </div>
                  <div className="headr_icon w-full flex justify-between">
                    <div className="text-gray-700 text-sm ml-1">
                      {" "}
                      {data.cashier}
                    </div>
                  </div>
                </div>
              </div>
              {data.billType === 'Dine In' &&
                <div>
                  <div className="flex  items-center">
                    <div className="headr_icon w-full flex justify-between">
                      <div className="text-gray-700 text-sm ml-1">
                        {" "}
                        Table No. {data.tableInfo.tableNo}
                      </div>
                    </div>
                  </div>
                </div>
              }
              {/* <div>
                  <div className="flex items-center">
                    <div className="header_icon">
                      <IoIosCall className="text-gray-700" />
                    </div>
                    <div className="headr_icon">
                      <p className="text-gray-700">7990311863</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="header_icon">
                      <GiWaterRecycling className="text-gray-700" />
                    </div>
                    <div className="headr_icon">
                      <p className="text-gray-700">ARRIVED</p>
                    </div>
                  </div>
                </div> */}
            </div>
            {/* </div> */}
            <div className="bg-gray-100">
              <div className="px-2 flex items-center">
                {/* <div className="flex items-center">
                  <div className="header_icon">
                    <IoIosCall className="text-gray-700" />
                  </div>
                  <div className="headr_icon">
                    <p className="text-gray-700">Call Customer</p>
                  </div>
                  </div> */}
                {(data?.hotelDetails?.hotelName) && (
                  <div className="bg-gray-100 border-t-2 py-2">
                    <div>
                      {data?.hotelDetails?.hotelName && (
                        <div className="headr_icon text-xs">
                          <div className="text-xs font-medium">Hotel : <span className="font-thin ">{data?.hotelDetails?.hotelName} {data?.hotelDetails?.roomNo ? '- ' + data?.hotelDetails?.roomNo : ''}</span></div>
                        </div>
                      )}
                      {(data?.hotelDetails?.customerName || data?.hotelDetails?.phoneNumber) && (
                        <div className="header_icon text-xs ">
                          {data?.hotelDetails?.phoneNumber && `${data?.hotelDetails?.phoneNumber}`}
                          {data?.hotelDetails?.phoneNumber && data?.hotelDetails?.customerName && ' - '}
                          {data?.hotelDetails?.customerName}
                        </div>
                      )}

                    </div>
                  </div>
                )}
                {(data?.customerDetails?.mobileNo || data?.customerDetails?.customerName || data?.customerDetails?.address) && (
                  <div className="bg-gray-100 border-t-2 pt-2">
                    <div>
                      {data?.customerDetails?.mobileNo && (
                        <div className="headr_icon text-xs">
                          {data.customerDetails.mobileNo}
                        </div>
                      )}
                      {(data?.customerDetails?.address || data?.customerDetails?.customerName || data?.customerDetails?.locality) && (
                        <div className="headr_icon text-xs pb-2">
                          {[data?.customerDetails?.customerName ? ` ${data.customerDetails.customerName}` : '', data?.customerDetails?.address ? data.customerDetails.address : '', data?.customerDetails?.locality ? ` ${data.customerDetails.locality}` : ''].filter(data => data).join(', ')}
                          {/* {data?.customerDetails?.customerName ? ` ${data.customerDetails.customerName},` : ''}
                          {data?.customerDetails?.locality ? ` ${data.customerDetails.locality}` + ',' : ''} */}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-300 ">
                {/* <div className="flex flex-wrap items-center mb-2"> */}
                {/* <div className=" my-2 text-sm w-2/4">1x Pau</div>
                  <div className=" my-2 text-sm w-2/4">1x Veg. Sandwich</div>
                  <div className=" my-2 text-sm w-2/4">2x Butter Pau Bhaji</div> */}
                <div
                  className={` ${data?.customerDetails ? 'itemCustomheight my-2 px-2 border-gray-100' : data?.hotelDetails?.hotelInfoId ? 'HotelHeight my-2 px-2' : 'WithoutAddresHeight my-2 px-2'} ${(data?.hotelDetails?.customerName || data?.hotelDetails?.phoneNumber) && data.billType === 'Hotel' ? 'HotelDetailsHeight my-2 px-2' : ''}`}
                >

                  <div className="flex flex-wrap items-start mb-2">
                    {data.itemData.map((item, index) => (
                      <div
                        key={index}
                        className="my-2 text-sm font-meduim w-2/4"
                      >
                        {item.qty} x {item.itemName} ({item.unit})
                      </div>
                    ))}
                  </div>
                </div>
                {/* </div> */}
              </div>
              <div className="flex items-end px-2 justify-end">
                {/* <div className="flex items-center bg-white rounded-t-xl  p-1 ">
                  /<div className="text-gray-700">
                    <IoIosCall className="text-gray-500" />
                  </div>
                  <div className="ml-2 text-gray-500">Swiggy</div>
                </div> */}
                <div className="ml-2 bg-white p-1 rounded-t-xl text-gray-500 border  border-b-0 shadow-md">
                  {" "}
                  &#8377; {(data.settledAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            <div className="flex items-center p-2 justify-between border-t">
              <Tooltip title={data.mobileNo} placement="top" arrow>
                <div className={` ${data.deliveredBy ? "cursor-pointer" : ""} p-2 text-ellipsis rounded-md text-gray-700 text-sm`}>
                  {data.deliveredBy ? <DirectionsBikeIcon fontSize="small" /> : ''} &nbsp;&nbsp;{data.deliveredBy ? data.deliveredBy : ''}
                </div>
              </Tooltip>
              <div className="flex">
                <div
                  className="text-gray-500 hover:bg-slate-200  cursor-pointer p-2 bg-gray-300 rounded-md text-xs"
                  onClick={() => {
                    setInfoPopUpOpen(true);
                    setInfoPopUpData(data);
                  }}
                >
                  Info
                </div>
                <div className={`ml-2 cursor-pointer capitalize font-semibold text-white p-2 rounded-md text-xs ${data?.billStatus?.toLowerCase() == 'print' ? 'printStatus' : data?.billStatus?.toLowerCase() == 'complete' ? 'completeStatus' : data?.billStatus?.toLowerCase() == 'on delivery' ? 'onDeliveryStatus' : data?.billStatus?.toLowerCase() == 'cancel' ? 'cancelStatus' : data?.billStatus?.toLowerCase() == 'running' ? 'runningStatus' : data?.billStatus?.toLowerCase() == 'food ready' ? 'foodReadyStatus' : ''}`}>
                  {data.billStatus}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
                  {/* <Divider orientation="vertical" flexItem /> */}
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
                Item Details
              </div>
              {/* {infoPopUpData?.itemData && infoPopUpData?.itemData?.map((item, index) => (
                <div key={index} className="max-h-56 overflow-auto" >
                  {item.qty}x {item.itemName} ({item.unit})
                </div>
              ))} */}
              <div className="my-2  border-gray-300 itemCustomheight">
                <div className="flex flex-wrap items-center mb-2">
                  {infoPopUpData?.itemData.map((item, index) => (
                    <div
                      key={index}
                      className="my-2 text-xs font-semibold w-2/4"
                    >
                      <li>{item.qty} x {item.itemName} ({item.unit})</li>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border w-full"></div>
            <div className="text-end flex items-center justify-end my-2 mt-4">Total Amount : <CurrencyRupeeIcon className="BackArrowIcon" />{parseFloat(infoPopUpData?.settledAmount).toLocaleString('en-In', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="border w-full"></div>
            <div className="flex items-center justify-end mt-4">
              <div
                className=" bg-white cursor-pointer border-black flex items-center hover:bg-gray-100 justify-center BackArroIconDiv w-20 gap-2 rounded-lg border"
                onClick={() => setInfoPopUpOpen(false)}
              >
                Close
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div >
  );
};

export default Cards;

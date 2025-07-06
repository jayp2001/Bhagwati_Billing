import React from "react";
import "./css/Bill.css";

const HotelBill = (props) => {
  return (
    <div
      className="w-fit h-fit"
      style={{
        width: "260px",
        height: "fit-content",
        fontFamily: "Verdana",
      }}
    >
      <meta charSet="utf-8" />
      <div
        style={{
          width: "260px",
          border: "1px solid black",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <div
          style={{
            paddingTop: "0px",
            paddingBottom: "0px",
            borderBottom: "2px solid black",
          }}
        >
          {props.isEdit &&
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                lineHeight: "24px",
                borderBottom: "1px solid black",
                padding: "5px 0px 5px",
              }}
            >
              New Bill
            </div>}
          <div
            style={{
              fontWeight: "700",
              fontSize: "16px",
              lineHeight: "24px",
              paddingBottom: "6px",
              paddingTop: "0.6rem",
            }}
          >
            {props.data.firmData.firmName}
          </div>
          <div
            style={{ fontSize: "12px", lineHeight: "20px", fontWeight: "500" }}
          >
            {props.data.firmData.firmAddress} - {props.data.firmData.pincode}
          </div>
          <div
            style={{
              fontWeight: "500",
              fontSize: "12px",
              lineHeight: "20px",
              marginBottom: "8px",
              paddingBottom: "4px",
            }}
          >
            PHONE: {props.data.firmData.firmMobileNo} :{" "}
            {props.data.firmData.otherMobileNo}
          </div>
        </div>
        <div style={{ paddingBottom: "0px", borderBottom: "2px solid black" }}>
          <div
            className="name font-medium text-sm"
            style={{
              fontWeight: "500",
              fontSize: "12px",
              paddingTop: "3px",
              paddingBottom: "3px",
            }}
          >
            GSTIN: {props.data.firmData.gstNumber}
          </div>
        </div>
        <div style={{ paddingBottom: "0px", borderBottom: "2px solid black" }}>
          <div
            className="name font-bold text-sm"
            style={{ fontWeight: "700", fontSize: "12px", lineHeight: "20px" }}
          >
            BILL OF SUPPLY
          </div>
        </div>
        <div style={{ paddingBottom: "0px", borderBottom: "2px solid black" }}>
          <div
            className="name font-bold text-sm"
            style={{ fontWeight: "700", fontSize: "12px", lineHeight: "20px" }}
          >
            HOTEL {props?.data?.billPayType?.toUpperCase()}
          </div>
        </div>
        {(props?.data?.customerName || props?.data?.mobileNo) && (
          <div
            style={{
              borderBottom: "1px solid black",
              width: "258px",
              padding: "1px",
            }}
          >
            <div
              style={{
                justifyContent: "space-between",
                fontWeight: "500",
                fontSize: "12px",
                lineHeight: "16px",
                marginTop: "8px",
                marginBottom: "8px",
                paddingRight: "2px",
                paddingLeft: "2px",
                width: "260px",
              }}
            >
              {props?.data?.mobileNo && (
                <div
                  className="text-start upper_right"
                  style={{
                    textAlign: "start",
                    maxWidth: "100%",
                    fontSize: "10p",
                  }}
                >
                  <div>
                    Number:{" "}
                    <span style={{ fontWeight: "700", fontSize: "10p" }}>
                      {props.data.mobileNo}
                    </span>
                  </div>
                </div>
              )}
              {props?.data?.customerName && (
                <div
                  className="text-start upper_right"
                  style={{
                    textAlign: "start",
                    maxWidth: "100%",
                    fontSize: "10p",
                  }}
                >
                  <div>
                    Name:{" "}
                    <span style={{ fontWeight: "700", fontSize: "10p" }}>
                      {props.data.customerName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div style={{ width: "260px", height: "min-content" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
              fontSize: "12px",
              lineHeight: "16px",
              padding: "1px",
              paddingRight: "5px",
              paddingLeft: "5px",
              paddingTop: "7px",
            }}
          >
            <div style={{ textAlign: "start" }}>
              <div style={{ fontSize: "10p" }}>
                Date : {props.data.billDate}
              </div>
            </div>
            <div style={{ textAlign: "start" }}>
              <div style={{ fontSize: "10p" }}>Time: {props.data.billTime}</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
              fontSize: "12px",
              lineHeight: "16px",
              marginTop: "8px",
              paddingRight: "5px",
              paddingLeft: "5px",
            }}
          >
            <div
              className="text-start upper_right"
              style={{ textAlign: "start", maxWidth: "75%", fontSize: "10p" }}
            >
              <div>
                BILL NO:{" "}
                <span style={{ fontWeight: "700", fontSize: "10p" }}>
                  {props.data.officialBillNo}
                </span>
              </div>
            </div>
            <div
              className="text-start upper_right"
              style={{ textAlign: "start", maxWidth: "75%", fontSize: "10p" }}
            >
              <div>
                TOKEN:{" "}
                <span style={{ fontWeight: "700", fontSize: "10p" }}>
                  {props.data.billType == "Pick Up"
                    ? props.data.justToken
                    : props.data.tokenNo}{" "}
                </span>
              </div>
            </div>
            {/* <div
              style={{
                textAlign: "start",
                maxWidth: "34%",
                padding: "2px",
                marginRight: "10px",
              }}
            >
              <div
                style={{
                  padding: "2px",
                }}
              >
                TOKEN NO{" "} {props.data.billType == "Pick Up"
                  ? props.data.justToken
                  : props.data.tokenNo}{" "}
                
              </div> */}
            {/* <div
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  padding: "2px",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: "16px",
                    lineHeight: "18px",
                  }}
                >
                  {props.data.billType == "Pick Up"
                    ? props.data.justToken
                    : props.data.tokenNo}{" "}
                </p>
              </div> */}
            {/* </div> */}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
              fontSize: "12px",
              lineHeight: "16px",
              marginTop: "8px",
              paddingRight: "5px",
              paddingLeft: "5px",
              borderTop: "2px solid black",
            }}
          >
            <div
              className="text-start upper_right"
              style={{ textAlign: "start", maxWidth: "100%", fontSize: "10p" }}
            >
              {/* <div>
                BILL NO:{" "}
                <span style={{ fontWeight: "700", fontSize: "10p" }}>
                  {props.data.billNumber}
                </span>
              </div> */}
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "10p",
                  paddingBottom: "4px",
                }}
              >
                HOTEL :{" "}
                <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                  {props.data.hotelDetails.hotelName}
                </span>
              </div>
              {props?.data?.roomNo && (
                <div style={{ marginTop: "4px", fontSize: "10p" }}>
                  ROOM NO :{" "}
                  <span className="font-bold">{props.data.roomNo}</span>
                </div>
              )}
              {props.data.hotelDetails.hotelAddress && (
                <div
                  style={{
                    marginTop: "4px",
                    textAlign: "start",
                    fontWeight: "100",
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                >
                  ADDRESS :{" "}
                  <span
                    className="text-xs font-thin"
                    style={{ fontSize: "12px" }}
                  >
                    {props.data.hotelDetails.hotelAddress}{" "}
                  </span>
                </div>
              )}
              {props.data.hotelDetails.hotelLocality && (
                <div style={{ marginTop: "4px", fontSize: "10p" }}>
                  LOCALITY :{" "}
                  <span className="font-bold">
                    {props.data.hotelDetails.hotelLocality}
                  </span>
                </div>
              )}
            </div>
            {/* <div
              style={{
                textAlign: "start",
                maxWidth: "34%",
                padding: "2px",
                marginRight: "10px",
              }}
            >
              <div
                style={{
                  padding: "2px",
                }}
              >
                TOKEN NO{" "}
                {props.data.billType == "Pick Up"
                  ? props.data.justToken
                  : props.data.tokenNo}{" "}
              </div>
              <div
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  padding: "2px",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: "16px",
                    lineHeight: "18px",
                  }}
                >
                  {props.data.billType == "Pick Up"
                    ? props.data.justToken
                    : props.data.tokenNo}{" "}
                </p>
              </div>
            </div> */}
          </div>

          {/* <div
            style={{
              marginTop: "4px",
              textAlign: "start",
              fontWeight: "100",
              fontSize: "10px",
              lineHeight: "16px",
            }}
          >
            LOCALITY : {props.data.hotelDetails.hotelLocality}
          </div> */}
        </div>
        <div
          className="main_bill h-min"
          style={{ width: " 260px", height: "min-content" }}
        >
          <table
            className="table-auto w-full"
            style={{
              tableLayout: "auto",
              width: "260px",
              border: "1px solid black",
              borderCollapse: "collapse",
              borderRight: "0px",
              borderLeft: "0px",
              borderBottom: "0px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    textAlign: "start",
                    fontSize: "14px",
                    borderLeft: "0px",
                  }}
                >
                  Particulars
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  Qty
                </th>
                <th
                  className="border py-2 border-e-0 border-black text-center"
                  style={{
                    bprder: "1px solid black",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    textAlign: "center",
                    fontSize: "14px",
                    borderRight: "0px",
                  }}
                >
                  Amt.
                </th>
              </tr>
            </thead>
            <tbody>
              {props?.data?.itemsData?.map((data, index) => (
                <tr>
                  <td
                    style={{
                      border: "1px solid black",
                      width: "60%",
                      padding: "8px 4px 8px 4px",
                      borderLeft: "0px",
                      textAlign: "start",
                      fontSize: "14px",
                    }}
                  >
                    {data.itemName} <br />{" "}
                    {data.comment && (
                      <span className="text-xs" style={{ fontSize: "10px" }}>
                        ({data.comment})
                      </span>
                    )}{" "}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                      width: "20%",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    {data.qty} {data.unit}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                      width: "20%",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      textAlign: "end",
                      paddingRight: "2px",
                      paddingLeft: "2px",
                      fontSize: "12px",
                      borderRight: "0px",
                    }}
                  >
                    {data.price.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    width: "60%",
                    paddingRight: "2px",
                    paddingLeft: "2px",
                    textAlign: "start",
                    borderLeft: "0px",
                  }}
                ></td>
                <td
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    width: "20%",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  Total:
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    width: "20%",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    textAlign: "end",
                    paddingRight: "2px",
                    paddingLeft: "2px",
                    fontSize: "12px",
                    borderRight: "0px",
                  }}
                >
                  {parseFloat(props.data.subTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              {props.data.billComment && (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "start",
                      paddingTop: "7px",
                      paddingBottom: "7px",
                      borderBottom: "1px solid black",
                      fontSize: "14px",
                    }}
                  >
                    {" "}
                    Note: {props.data.billComment}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3">
                  {" "}
                  <hr
                    style={{
                      border: "1px dashed black",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  />
                </td>
              </tr>
              {props.data.discountType != 'none' &&
                < tr className="">
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "end",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Discount: {props.data.totalDiscount.toFixed(2)}
                    {/* {props.data.discountValue.toFixed(2)}{" "}
                    {props.data.discountType == "percentage" ? "%" : "Rs"} ,  */}
                  </td>
                  {/* <td
                  style={{
                    textAlign: "center",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    fontSize: "14px",
                    borderRight: "0px",
                    borderLeft: "0px",
                  }}
                ></td> */}
                </tr>
              }
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "end",
                    borderTop: "1px solid black",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    fontSize: "14px",
                    borderRight: "0px",
                    borderLeft: "0px",
                    fontWeight: "bold",
                    paddingRight: "3px",
                  }}
                >
                  Grand Total Rs. {(parseFloat(props.data.settledAmount)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    borderTop: "1px solid black",
                    paddingTop: "8px",
                    paddingRight: "8px",
                    borderRight: "0px",
                    borderLeft: "0px",
                  }}
                >
                  {props.data.appriciateLine ? props.data.appriciateLine : 'Thank You'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default HotelBill;

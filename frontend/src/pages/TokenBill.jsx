import React from "react";
import "./css/Bill.css";
import { QRCodeSVG } from 'qrcode.react';
const TokenBil = (props) => {
  const customerData =
    props && props.data && props.data.customerDetails
      ? props.data.customerDetails
      : {};
  const itemList =
    props && props.data && props.data.itemsData ? props.data.itemsData : [];
  return (
    <div
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
          overflow: "hidden",
        }}
      >
        {props.isEdit &&
          <div
            style={{ fontWeight: "bold", fontSize: "14px", lineHeight: "24px", borderBottom: '1px solid black', padding: '5px 0px 5px' }}
          >
            New Bill
          </div>}
        <div
          style={{
            padding: "16px 0px 16px 0px",
            borderBottom: "1px solid black",
          }}
        >
          <div
            style={{ fontWeight: "bold", fontSize: "14px", lineHeight: "24px" }}
          >
            SHRI BHAGAWATI
            {/* {props.data.billPayType == 'cash'?'SHRI BHAGAWATI':props.data.firmData.firmName} */}
            <br />
            {props.data.billType}
          </div>
        </div>
        {props.data.billPayType === "complimentary" && (
          <div
            style={{ paddingBottom: "0px", borderBottom: "2px solid black" }}
          >
            <div
              className="name font-bold text-sm"
              style={{
                fontWeight: "700",
                fontSize: "12px",
                lineHeight: "20px",
              }}
            >
              COMPLIMENTARY
            </div>
          </div>
        )}
        <div
          style={{
            padding: "8px 4px 8px 4px ",
            width: "260px",
            height: "min-content",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
              fontSize: "12px",
              lineHeight: "16px",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "start" }}>
              <div style={{ textAlign: "start", fontSize: "12px" }}>
                Date : {props.data.billDate}
              </div>
              <div
                style={{
                  textAlign: "start",
                  marginTop: "6px",
                  fontSize: "12px",
                }}
              >
                <div>Time: {props.data.billTime}</div>
              </div>
              <div style={{ marginTop: "6px", fontSize: "12px" }}>
                Cashier : {props.data.cashier}
              </div>
              {props?.data?.subTokens &&
                <div style={{ marginTop: "6px", fontSize: "12px", maxWidth: '170px' }}>
                  Sub Token : {props.data.subTokens}
                </div>
              }
            </div>

            <div
              style={{
                textAlign: "start",
                maxWidth: "34%",
                padding: "2px",
                marginRight: "10px",
              }}
            >
              <div
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  padding: "2px",
                }}
              >
                TOKEN NO
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
            </div>
          </div>
        </div>
        {customerData &&
          (customerData.mobileNo ||
            customerData.customerName ||
            customerData.address ||
            customerData.locality) ? (
          <div
            style={{
              padding: "8px 4px 8px 4px ",
              width: "260px",
              height: "min-content",
              borderTop: "2px solid black",
            }}
          >
            {customerData.mobileNo && (
              <div
                style={{
                  textAlign: "start",
                  marginTop: "6px",
                  fontSize: "14px",
                }}
              >
                <div>
                  Phone No :{" "}
                  <span style={{ fontWeight: "600" }}>
                    {customerData.mobileNo}
                  </span>{" "}
                </div>
              </div>
            )}
            {customerData.customerName && (
              <div
                style={{
                  textAlign: "start",
                  marginTop: "6px",
                  fontSize: "14px",
                }}
              >
                <div>Name : {customerData.customerName} </div>
              </div>
            )}
            {customerData.address && (
              <div
                style={{
                  textAlign: "start",
                  marginTop: "6px",
                  fontSize: "14px",
                }}
              >
                <div style={{ width: "95%" }}>
                  {" "}
                  Address : {customerData.address}
                </div>
              </div>
            )}
            {customerData.locality && (
              <div
                style={{
                  textAlign: "start",
                  marginTop: "6px",
                  fontSize: "14px",
                }}
              >
                <div>Locality : {customerData.locality}</div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
        <div style={{ width: "260px", height: "min-height" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid black",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    borderLeft: "0px",
                    textAlign: "start",
                    fontSize: "14px",
                  }}
                >
                  Particulars
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    textAlign: "center",
                    width: "20%",
                    fontSize: "14px",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    borderRight: "0px",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  Amt.
                </th>
              </tr>
            </thead>
            <tbody>
              {itemList?.map((item, index) => (
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
                    {item.itemName} <br />{" "}
                    {item.comment && (
                      <span className="text-xs" style={{ fontSize: "10px" }}>
                        ({item.comment})
                      </span>
                    )}{" "}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "4px 0px 4px 0px",
                      textAlign: "center",
                      width: "20%",
                      fontSize: "14px",
                    }}
                  >
                    {item.qty} {item.unit}
                  </td>
                  {/* <td className="border fourth_column py-2 border-e-0 border-black text-end pr-1">121.00</td> */}
                  <td
                    style={{
                      border: "1px solid black",
                      width: "20%",
                      borderRight: "0px",
                      textAlign: "end",
                      paddingRight: "2px",
                      fontSize: "14px",
                    }}
                  >
                    {item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  style={{
                    border: "1px solid black",
                    width: "60%",
                    padding: "4px",
                    borderLeft: "0px",
                    textAlign: "start",
                  }}
                ></td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px 0px 4px 0px",
                    textAlign: "center",
                    fontSize: "12px",
                  }}
                >
                  Total:
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    width: "20%",
                    borderRight: "0px",
                    textAlign: "end",
                    paddingRight: "2px",

                    fontSize: "14px",
                  }}
                >
                  {props.data.subTotal.toFixed(2)}
                </td>
              </tr>
              <tr style={{ padding: "5px" }}>
                <td
                  colSpan="3"
                  style={{
                    border: "1px solid black",
                    padding: "10px 4px 10px 0px",
                    width: "60%",
                    borderLeft: "0px",
                    textAlign: "right",
                    borderRight: "0px",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Verdana", marginLeft: "10px" }}>
                    <span>Total Qty : {itemList.length}</span>
                    <span>Sub Total:{" "}{parseFloat(props.data.subTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                </td>
              </tr>
              {props.data.billPayType != "complimentary" &&
                <tr style={{ padding: "5px" }}>
                  <td
                    colSpan="3"
                    style={{
                      border: "1px solid black",
                      padding: "8px 4px 8px 0px",
                      width: "60%",
                      borderLeft: "0px",
                      textAlign: "right",
                      borderRight: "0px",
                      fontSize: "12px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        margin: "0",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      Pay Type: {props.data.billPayType == "cash" ? "Cash" : ""}
                      {props.data.billPayType == "due" ? "Due" : ""}{" "}
                      {props.data.billPayType == "online" ? "Online" : ""}
                    </p>
                  </td>
                </tr>}
              <tr className="">
                {props.data.discountType == "none" ? (
                  <></>
                ) : (
                  <>
                    <td
                      style={{
                        textAlign: "end",
                        padding: "10px 4px 10px 0px",
                        borderTop: "1px solid black",
                        fontSize: "14px",
                      }}
                      colSpan="4"
                    >
                      <pre style={{ fontFamily: "Verdana" }}>
                        Discount : {props.data.discountValue}{" "}
                        {props.data.discountType == "fixed"
                          ? ""
                          : props.data.discountType == "none"
                            ? ""
                            : "%"}
                        , {props.data.totalDiscount.toFixed(2)}
                      </pre>
                    </td>
                  </>
                )}
              </tr>
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "end",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    padding: "10px 4px 10px 0px",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  <pre style={{ fontFamily: "Verdana", fontSize: "16px" }}>
                    Grand Total Rs. {parseFloat(props.data.settledAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </pre>
                </td>
              </tr>
              {props.data.billComment && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "start" }}>
                    {" "}
                    Note: {props.data.billComment}
                  </td>
                </tr>
              )}
              {
                props.data.upiJson && props.data.billPayType == "online" ? <>
                  <tr style={{ width: '100%' }}>
                    <td
                      colSpan="6"
                      align="center"
                      style={{
                        width: '100%',
                        // display: 'flex',
                        justifyContent: 'center',
                        borderTop: "1px solid black",
                        padding: "8px 0px 8px 0px",
                      }}>
                      <QRCodeSVG
                        value={`upi://pay?pa=${props.data.upiJson.upiId}&pn=${props.data.upiJson.holderName}&tn=${'Restaurent Bill'}&am=${props.data.settledAmount}`}
                        size={148}
                        level="H"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        // borderTop: "1px solid black",
                        padding: "4px 0px 4px 0px",
                        fontSize: "18px",
                        lineHeight: "20px"
                      }}
                    >
                      Scan To Pay
                    </td>
                  </tr></> : <></>
              }
              {props?.data?.footerBill &&
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      fontWeight: "400",
                      borderTop: "1px solid black",
                      padding: "4px 0px 4px 0px",
                      fontSize: "12px",
                      lineHeight: "20px"
                    }}
                  >
                    {props.data.footerBill}
                  </td>
                </tr>
              }
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    borderTop: "1px solid black",
                    padding: "4px 0px 4px 0px",
                  }}
                >
                  {props?.data?.appriciateLine ? props.data.appriciateLine : 'Thank You'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokenBil;

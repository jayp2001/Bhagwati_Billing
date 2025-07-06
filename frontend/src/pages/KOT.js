import React, { useEffect } from "react";
import "./css/Bill.css";
import "./css/RestaurantBill.css";
import { useActionData } from "react-router-dom";

const KOT = (props) => {
  // console.log('props.data', props.data)
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
      <div
        style={{
          width: "260px",
          border: "1px solid black",
          borderCollapse: "collapse",
          textAlign: "center",
          overflow: "hidden",
          borderBottom: props.data.billComment ? "1px solid black" : "0px",
        }}
      >
        <div
          style={{
            padding: "16px 0px 16px 0px",
            borderBottom: "1px solid black",
          }}
        >
          <div
            style={{ fontWeight: "bold", fontSize: "16px", lineHeight: "24px" }}
          >
            <meta charSet="utf-8" />
            {/* {props.data.billPayType == 'cash'?'SHRI BHAGAWATI':props.data.firmData.firmName} */}
            {props.data.billType} - KOT
            <br />
            {props.isEdit ? "( NEW BILL )" : ""}
            <p style={{ fontSize: "14px", margin: "0" }}>
              {props.data.billPayType == "complimentary" ? "Complimentary" : ""}
              {props.data.billPayType == "cash" ? "Cash" : ""}
              {props.data.billPayType == "due" ? "Due" : ""}{" "}
              {props.data.billPayType == "online" ? "Online" : ""}
            </p>
          </div>
        </div>
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
              <div style={{ textAlign: "start", fontSize: "13px" }}>
                Date : {props.data.billDate}
              </div>
              <div
                style={{
                  textAlign: "start",
                  marginTop: "6px",
                  fontSize: "13px",
                }}
              >
                <div>Time: {props.data.billTime}</div>
              </div>
              {props.data.billType == "Dine In" ?
                <div style={{ marginTop: "6px", fontSize: "13px" }}>
                  Captain : {props.data.assignCaptain}
                </div>
                : <div style={{ marginTop: "6px", fontSize: "13px" }}>
                  Cashier : {props.data.cashier}
                </div>
              }
              {props.data.billType == "Dine In" && (
                <div style={{ textAlign: "start", marginTop: "6px" }}>
                  <div>
                    Table No{" "}
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>
                      {props.data.tableNo}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                textAlign: "start",
                maxWidth: "34%",
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
                  borderTop: "0px",
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
              padding: "4px 4px 8px 4px ",
              width: "260px",
              height: "min-content",
              borderTop: "1px solid black",
            }}
          >
            {customerData.mobileNo && (
              <div
                style={{
                  textAlign: "start",
                  marginTop: "2px",
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
                  marginTop: "2px",
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
                  marginTop: "2px",
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
                  marginTop: "2px",
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
        <div className="main_bill h-min">
          <table style={{ borderCollapse: "collapse", width: "260px" }}>
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
                  Items
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    borderRight: "0px",
                    textAlign: "center",
                    width: "30%",
                    fontSize: "14px",
                  }}
                >
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {itemList?.map((item) => (
                <tr>
                  <td
                    style={{
                      border: "1px solid black",
                      minWidth: "65%",
                      maxWidth: "75%",
                      fontWeight: "600",
                      paddingTop: "8px",
                      lineHeight: "21px",
                      paddingLeft: "4px",
                      paddingRight: "4px",
                      paddingBottom: "8px",
                      fontSize: "14px",
                      borderLeft: "0px",
                      textAlign: "start",
                    }}
                  >
                    {item.itemName}{" "}
                    {item.comment && (
                      <div
                        className="text-xs"
                        style={{
                          fontSize: "12px",
                          marginTop: "4px",
                          marginBottom: "6px",
                        }}
                      >
                        ({item.comment})
                      </div>
                    )}{" "}
                  </td>
                  <td
                    style={{
                      padding: "8px 0px 6px 0px",
                      border: "1px solid black",
                      textAlign: "end",
                      minWidth: "25%",
                      maxWidth: "35%",
                      fontSize: "14px",
                      borderRight: "0px",
                    }}
                  >
                    {item.qty} {item.unit}
                  </td>
                </tr>
              ))}
              {/* <tr>
                                <td style={{ border: '1px solid black', width: '60%', padding: '4px', borderLeft: '0px', textAlign: 'start' }}>Panerr Tika Masala <br /> <span className="text-xs">(Small text comment)</span> </td>
                                <td style={{ border: '1px solid black', padding: '4px 0px 4px 0px', textAlign: 'center' }}>99 Full</td>
                            </tr> */}
            </tbody>
          </table>
        </div>
        {props.data.billComment && (
          <div
            style={{
              padding: "2px",
              width: "260px",
              height: "min-content",
            }}
          >
            <div style={{ textAlign: "start", width: "100%" }}>
              <div
                style={{
                  textAlign: "start",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <div>Note: {props.data.billComment}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KOT;

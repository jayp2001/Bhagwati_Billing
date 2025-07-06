import React, { useEffect } from "react";
// import "./css/Bill.css";
// import "./css/RestaurantBill.css";
import { useActionData } from "react-router-dom";

const KOTDineIn = (props) => {
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
        {(props.isEdit || props.isDelete) &&
          <div
            style={{
              padding: "10px 0px 10px 0px",
              borderBottom: "1px solid black",
            }}
          >
            <div
              style={{ fontWeight: "bold", fontSize: "16px", }}
            >
              <meta charSet="utf-8" />
              {props.isEdit ? "Modified" : ""}
              {
                props.isDelete ? "Cancelled" : ""
              }
            </div>
          </div>
        }
        <div
          style={{
            padding: "4px 4px 8px 4px ",
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
              <div
                style={{ fontWeight: "bold", fontSize: "16px", marginBottom: '5px' }}
              >
                {/* {props.data.billType} */}
                Dine In
              </div>
              <div style={{ textAlign: "start", fontSize: "13px" }}>
                {props.data.billDate} {props.data.billTime}
              </div>
              {/* <div style={{ textAlign: "start", fontSize: "13px" }}>
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
              </div> */}
              <div style={{ textAlign: "start", marginTop: "6px" }}>
                <div>
                  KOT No{" "}
                  <span style={{ fontSize: "16px", fontWeight: "700" }}>
                    {props.data.tokenNo}
                  </span>
                </div>
              </div>
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
                Table NO
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
                    lineHeight: "0px",
                  }}
                >
                  {props.data.tableNo}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="main_bill h-min">
          <table style={{ borderCollapse: "collapse", width: "260px" }}>
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid black",
                    borderRight: 'none',
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    borderLeft: "0px",
                    textAlign: "start",
                    fontSize: "14px",
                  }}
                  colSpan='2'
                >
                  <span style={{ fontWeight: 400 }}>Captain :</span> <span>{props.data.assignCaptain}</span>
                </th>
              </tr>
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
                      textDecoration: props.isDelete || item.kotItemStatus == 'cancelled' ? 'Line-through' : 'none',
                      // text-decoration: overline;
                    }}
                  >
                    {item.kotItemStatus && item.kotItemStatus != 'cancelled' ? <span style={{ textTransform: 'capitalize' }}>{'[' + item.kotItemStatus + ']'}</span> : ""}{" "}
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
                      textDecoration: props.isDelete || item.kotItemStatus == 'cancelled' ? 'Line-through' : 'none',
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

export default KOTDineIn;

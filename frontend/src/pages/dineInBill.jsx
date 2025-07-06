import React from "react";
import "./css/Bill.css";
import "./css/RestaurantBill.css";

const DineInBill = (props) => {
    const customerData =
        props && props.data && props.data.customerDetails
            ? props.data.customerDetails
            : {};
    const itemList =
        props && props.data && props.data.itemsData ? props.data.itemsData : [];
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
                        paddingTop: "6px",
                        paddingBottom: "0px",
                        borderBottom: "2px solid black",
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
                            COMPLIMENTARY BILL
                        </div>
                    </div>
                )}
                {customerData &&
                    (customerData.mobileNo ||
                        customerData.customerName ||
                        customerData.address ||
                        customerData.locality) ? (
                    <div
                        style={{
                            padding: "8px 4px 8px 4px ",
                            width: "253px",
                            height: "min-content",
                            borderBottom: '1px solid black'
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
                            {props?.data?.tableNo &&
                                <div style={{ marginTop: "6px", fontSize: "12px", maxWidth: '170px' }}>
                                    Token No : {props.data.billType == "Pick Up"
                                        ? props.data.justToken
                                        : props.data.tokenNo}{" "}
                                </div>
                            }
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
                                TABLE NO
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
                                    {props.data.tableNo}
                                </p>
                            </div>
                        </div>
                    </div>
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
                            borderLeft: "0px",
                            borderRight: "0px",
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
                                        borderLeft: "0px",
                                        textAlign: "start",
                                        borderRight: "0px",
                                        fontSize: "14px",
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
                                    style={{
                                        border: "1px solid black",
                                        borderCollapse: "collapse",
                                        paddingTop: "8px",
                                        paddingBottom: "8px",
                                        textAlign: "center",
                                        fontSize: "14px",
                                    }}
                                >
                                    Price
                                </th>
                                <th
                                    className="border py-2 border-e-0 border-black text-center"
                                    style={{
                                        border: "1px solid black",
                                        paddingTop: "8px",
                                        borderLeft: "0px",
                                        borderRight: "0px",
                                        paddingBottom: "8px",
                                        textAlign: "center",
                                    }}
                                >
                                    Amt.
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemList?.map((item) => (
                                <tr key={item.itemName}>
                                    <td
                                        style={{
                                            border: "1px solid black",
                                            borderCollapse: "collapse",
                                            borderLeft: "0px",
                                            borderRight: "0px",
                                            width: "60%",
                                            padding: "8px 4px 8px 4px",
                                            textAlign: "start",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {item.itemName} ({item.unit}) <br />
                                        {/* {item.comment && (
                                            <span
                                                className="text-xs"
                                                style={{
                                                    fontSize: "8px",
                                                    marginTop: "4px",
                                                    lineHeight: "27px",
                                                }}
                                            >
                                                ({item.comment})
                                            </span>
                                        )}{" "} */}
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
                                        {item.qty}
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
                                        {item.itemPrice.toFixed(2)}
                                    </td>
                                    <td
                                        style={{
                                            border: "1px solid black",
                                            borderCollapse: "collapse",
                                            borderLeft: "0px",
                                            borderRight: "0px",
                                            width: "20%",
                                            paddingTop: "8px",
                                            paddingBottom: "8px",
                                            textAlign: "end",
                                            paddingRight: "2px",
                                            paddingLeft: "2px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {item.price.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ padding: "5px" }}>
                                <td
                                    colSpan="4"
                                    style={{
                                        border: "1px solid black",
                                        padding: "10px 4px 10px 0px",
                                        width: "60%",
                                        borderLeft: "0px",
                                        textAlign: "right",
                                        borderRight: "0px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Verdana", marginLeft: "10px" }}>
                                        <span>Total Qty: {itemList.length}</span>
                                        <span>Sub Total:{" "}{parseFloat(props.data.subTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>

                                </td>
                            </tr>
                            <tr className="">
                                {props.data.discountType === "none" ? (
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
                                                {props.data.discountType === "fixed"
                                                    ? ""
                                                    : props.data.discountType === "none"
                                                        ? ""
                                                        : "%"}
                                                , {props.data.totalDiscount.toFixed(2)}
                                            </pre>
                                        </td>
                                    </>
                                )}
                            </tr>
                            {props.data.billPayType != "complimentary" &&
                                <tr style={{ padding: "5px" }}>
                                    <td
                                        colSpan="4"
                                        style={{
                                            border: "1px solid black",
                                            padding: "8px 4px 8px 0px",
                                            width: "100%",
                                            borderLeft: "0px",
                                            textAlign: "right",
                                            borderRight: "0px",
                                            fontSize: "P",
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
                            <tr>
                                <td
                                    colSpan="4"
                                    style={{
                                        textAlign: "end",
                                        borderTop: "1px solid black",
                                        borderBottom: "1px solid black",
                                        padding: "10px 4px 10px 0px",
                                        fontWeight: "bold",
                                        fontSize: "16px",
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
                            {props?.data?.footerBill &&
                                <tr>
                                    <td
                                        colSpan="4"
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
                                    colSpan="4"
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700",
                                        borderTop: "1px solid black",
                                        padding: "4px 0px 4px 0px",
                                    }}
                                >
                                    {props.data.appriciateLine ? props.data.appriciateLine : 'Thank You'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DineInBill;

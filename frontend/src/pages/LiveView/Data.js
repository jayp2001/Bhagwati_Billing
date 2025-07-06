const data = [
    {
        "billId": "bill_1718967447510_89",
        "billNumber": 89,
        "officialBillNumber": "Not Available",
        "tokenNo": "D12",
        "billComment": null,
        "billDate": "21/06/2024",
        "billPayType": "cash",
        "billStatus": "Print",
        "billTime": "04:27 PM",
        "billType": "Delivery",
        "cashier": "Vikalp",
        "customerDetails": {
            "bwcId": "bwc_1718968455326_12",
            "customerId": "customer_1718399834117",
            "mobileNo": "7859893203"
        },
        "discountType": "none",
        "discountValue": 0,
        "firmData": {
            "firmId": "A",
            "firmName": "Shree Bhagwati Fast Food",
            "gstNumber": "24BDZPC3972L1ZX"
        },
        "itemData": [
            {
                "iwbId": "iwb_1718968455330_0",
                "itemId": "item_1716218327955",
                "itemName": "Butter Masala Toast"
            }
        ],
        "menuStatus": "Offline",
        "settledAmount": 60,
        "totalAmount": 60,
        "totalDiscount": 0
    },
    {
        "billId": "bill_1718967425080_88",
        "billNumber": 88,
        "officialBillNumber": "Not Available",
        "tokenNo": "D11",
        "billComment": null,
        "billDate": "21/06/2024",
        "billPayType": "cash",
        "billStatus": "Print",
        "billTime": "04:27 PM",
        "billType": "Delivery",
        "cashier": "Vikalp",
        "customerDetails": {
            "bwcId": "bwc_1718967425080_11",
            "customerId": "customer_1718399834395",
            "mobileNo": "9898700319"
        },
        "discountType": "none",
        "discountValue": 0,
        "firmData": {
            "firmId": "A",
            "firmName": "Shree Bhagwati Fast Food",
            "gstNumber": "24BDZPC3972L1ZX"
        },
        "itemData": [
            {
                "iwbId": "iwb_1718967425083_0",
                "itemId": "item_1716218327955",
                "itemName": "Butter Masala Toast"
            }
        ],
        "menuStatus": "Offline",
        "settledAmount": 60,
        "totalAmount": 60,
        "totalDiscount": 0
    },
    // {
    //     "billId": "bill_1718967053255_86",
    //     "billNumber": 86,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D10",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "due",
    //     "billStatus": "Print",
    //     "billTime": "04:20 PM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718967053255_10",
    //         "customerId": "customer_1718399832506",
    //         "mobileNo": "8238123995"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718967053257_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 60,
    //     "totalAmount": 60,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718966930638_84",
    //     "billNumber": 84,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D9",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "04:18 PM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718966930638_9",
    //         "customerId": "customer_1718400010514",
    //         "mobileNo": "9898266144"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718966930642_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         },
    //         {
    //             "iwbId": "iwb_1718966930643_1",
    //             "itemId": "item_1716218327956",
    //             "itemName": "Cheese Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 265,
    //     "totalAmount": 265,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718961619262_56",
    //     "billNumber": 56,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D8",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "02:50 PM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718961619262_8",
    //         "customerId": "customer_1718399832006",
    //         "mobileNo": "9835944444"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718961619263_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 845,
    //     "totalAmount": 845,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718960216788_55",
    //     "billNumber": 55,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D7",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "02:26 PM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718960216788_7",
    //         "customerId": "customer_1718399832116",
    //         "mobileNo": "9798979888"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718960216797_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         },
    //         {
    //             "iwbId": "iwb_1718960216798_1",
    //             "itemId": "item_1716218327956",
    //             "itemName": "Cheese Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 32310,
    //     "totalAmount": 32310,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718951255321_54",
    //     "billNumber": 54,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D6",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "11:57 AM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718951255321_6",
    //         "customerId": "customer_1718399832834",
    //         "mobileNo": "9898695200"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718951255330_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 35,
    //     "totalAmount": 35,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718950714180_53",
    //     "billNumber": 53,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D5",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "11:48 AM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718950714180_5",
    //         "customerId": "customer_1718399832834",
    //         "mobileNo": "9898695200"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718950714190_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 35,
    //     "totalAmount": 35,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718950645998_52",
    //     "billNumber": 52,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D4",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "11:47 AM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718950645998_4",
    //         "customerId": "customer_1718399843008",
    //         "mobileNo": "9898231515"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718950646000_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 35,
    //     "totalAmount": 35,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718950517625_51",
    //     "billNumber": 51,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D3",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "11:45 AM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718950517625_3",
    //         "customerId": "customer_1718399832834",
    //         "mobileNo": "9898695200"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718950517630_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 35,
    //     "totalAmount": 35,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718949091590_50",
    //     "billNumber": 50,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D2",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "11:21 AM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718949091590_2",
    //         "customerId": "customer_1718399832819",
    //         "mobileNo": "9825962686"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718949091600_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 35,
    //     "totalAmount": 35,
    //     "totalDiscount": 0
    // },
    // {
    //     "billId": "bill_1718948333520_49",
    //     "billNumber": 49,
    //     "officialBillNumber": "Not Available",
    //     "tokenNo": "D1",
    //     "billComment": null,
    //     "billDate": "21/06/2024",
    //     "billPayType": "cash",
    //     "billStatus": "Print",
    //     "billTime": "11:08 AM",
    //     "billType": "Delivery",
    //     "cashier": "Vikalp",
    //     "customerDetails": {
    //         "bwcId": "bwc_1718948333520_1",
    //         "customerId": "customer_1718399831990",
    //         "mobileNo": "6353464228"
    //     },
    //     "discountType": "none",
    //     "discountValue": 0,
    //     "firmData": {
    //         "firmId": "A",
    //         "firmName": "Shree Bhagwati Fast Food",
    //         "gstNumber": "24BDZPC3972L1ZX"
    //     },
    //     "itemData": [
    //         {
    //             "iwbId": "iwb_1718948333525_0",
    //             "itemId": "item_1716218327955",
    //             "itemName": "Butter Masala Toast"
    //         }
    //     ],
    //     "menuStatus": "Offline",
    //     "settledAmount": 35,
    //     "totalAmount": 35,
    //     "totalDiscount": 0
    // }
]
export default data;
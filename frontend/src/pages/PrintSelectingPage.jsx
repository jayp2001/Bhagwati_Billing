import React, { useEffect, useState } from "react";
import "./css/PrinterSelectingPage.css";
import Header from "../components/Header/Header";
import TextField from "@mui/material/TextField";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from 'axios';
import { BACKEND_BASE_URL } from "../url";
import { ToastContainer, toast } from "react-toastify";
// Use the exposed ipcRenderer from preload script
const ipcRenderer = window.ipcRenderer;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PrintSelectingPage = () => {
  const [categoryList, setCategoryList] = useState([
    {
      categoryId: "pickupkot",
      categoryName: "PickUp KOT",
      printerName: "",
      footer: "Thanks",
    },
    {
      categoryId: "pickupbill",
      categoryName: "PickUp BILL",
      printerName: "",
      footer: "Thanks",
    },
  ]);
  const [assignPrinterPopUp, setAssignPrinterPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectPrinter, setSelectPrinter] = useState({});
  const [marginData, setMarginData] = useState({
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  });
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const printers = JSON.parse(localStorage.getItem("printers"));
  const macAddress = localStorage.getItem("macAddress");

  const handleAssigningPopup = (index, data) => {
    setSelectPrinter({
      ...data,
      index: index,
    });
    setMarginData({
      top: data?.marginTop || '0',
      right: data?.marginRight || '0',
      bottom: data?.marginBottom || '0',
      left: data?.marginLeft || '0',
    });
    setAssignPrinterPopUp(true);
  };

  const getAllData = async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}billingrouter/getPrinterList?macAddress=${macAddress}`, config);
      setCategoryList(response.data);
      localStorage.setItem("printerPreference", JSON.stringify(response.data));
    } catch (error) {
    }
  };

  const handleSetPrinter = async () => {
    try {
      const updatedData = categoryList.map((data, index) =>
        selectPrinter.index === index
          ? {
            ...data,
            printerName: selectPrinter.printerName,
            footer: selectPrinter.footer,
          }
          : data
      );

      const data = {
        printerName: selectPrinter.printerName,
        marginTop: marginData.top,
        marginRight: marginData.right,
        marginBottom: marginData.bottom,
        marginLeft: marginData.left,
        macAddress: macAddress,
        categoryId: selectPrinter.categoryId,
      };

      const response = await axios.post(
        `${BACKEND_BASE_URL}billingrouter/updatePrinterData`,
        data,
        config
      );

      if (response.data === 'Printer Updated Successfully') {
        setSuccess(true);
        setCategoryList(updatedData);
        getAllData();
        handleClose();
      }
    } catch (error) {
      console.error("Error updating printer list:", error);
      setError(true);
    }
  };

  const handleClose = () => {
    setSelectPrinter({});
    setAssignPrinterPopUp(false);
  };
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
      autoClose: 3000,
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
    getAllData();
  }, []);

  return (
    <div>
      <Header />
      <div className="tableContainerWrapper">
        <Table sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}>
          <TableHead className="tableHead">
            <TableRow>
              <TableCell style={{ width: '10px' }}>No.</TableCell>
              <TableCell style={{ width: '13%' }}>Name</TableCell>
              <TableCell>Printer Name</TableCell>
              <TableCell>Top</TableCell>
              <TableCell>Right</TableCell>
              <TableCell>Bottom</TableCell>
              <TableCell>Left</TableCell>
              <TableCell className="headerCentertext">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryList?.map((data, index) => (
              <TableRow key={data.categoryId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{data.categoryName}</TableCell>
                <TableCell>{data.printerName}</TableCell>
                <TableCell className="margins">{data.marginTop}</TableCell>
                <TableCell className="margins">{data.marginRight}</TableCell>
                <TableCell className="margins">{data.marginBottom}</TableCell>
                <TableCell className="margins">{data.marginLeft}</TableCell>
                <TableCell>
                  <div className="flex">
                    <div
                      className="rounded-lg bg-gray-100 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600"
                      onClick={() => handleAssigningPopup(index, data)}
                    >
                      <Tooltip title="Assign Printer">
                        <IconButton>
                          <BorderColorIcon className="text-gray-600 table_icon2" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div className="rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600">
                      <DeleteOutlineOutlinedIcon className="text-gray-600 table_icon2" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal
        open={assignPrinterPopUp}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <div style={{ fontSize: "18px", marginBottom: "20px" }}>
              Select Printer for {selectPrinter.categoryName || ""}
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Printers</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Printers"
                    value={selectPrinter.printerName || ""}
                    onChange={(e) =>
                      setSelectPrinter((prev) => ({
                        ...prev,
                        printerName: e.target.value,
                      }))
                    }
                  >
                    {printers?.map((data) => (
                      <MenuItem key={data} value={data}>
                        {data}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-span-2 textFields">
                <TextField
                  id="outlined-basic"
                  value={marginData.top}
                  label="Top"
                  variant="outlined"
                  onChange={(e) =>
                    setMarginData((prev) => ({
                      ...prev,
                      top: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 textFields">
                <TextField
                  id="outlined-basic"
                  value={marginData.right}
                  label="Right"
                  variant="outlined"
                  onChange={(e) =>
                    setMarginData((prev) => ({
                      ...prev,
                      right: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 textFields">
                <TextField
                  id="outlined-basic"
                  value={marginData.bottom}
                  label="Bottom"
                  variant="outlined"
                  onChange={(e) =>
                    setMarginData((prev) => ({
                      ...prev,
                      bottom: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-2 textFields">
                <TextField
                  id="outlined-basic"
                  value={marginData.left}
                  label="Left"
                  variant="outlined"
                  onChange={(e) =>
                    setMarginData((prev) => ({
                      ...prev,
                      left: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <div className="flex justify-end gap-6 w-1/3">
                <div className="col-span-4 w-full">
                  <button
                    className="addCategorySaveBtn"
                    onClick={() => handleSetPrinter()}
                  >
                    Set
                  </button>
                </div>
                <div className="col-span-4 w-full">
                  <button
                    className="addCategoryCancleBtn"
                    onClick={() => handleClose()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default PrintSelectingPage;

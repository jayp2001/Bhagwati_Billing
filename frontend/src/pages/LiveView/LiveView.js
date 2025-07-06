/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Cards from "./Cards";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import WifiIcon from "@mui/icons-material/Wifi";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CachedIcon from "@mui/icons-material/Cached";
import "./css/LiveView.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import importedData from "./Data";
import TableBarIcon from '@mui/icons-material/TableBar';
import { Badge, Divider, Switch } from "@mui/material";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../url";
import { useNavigate } from "react-router-dom";


const LiveView = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  useEffect(() => {
    const enrichedData = importedData.map((item, index) => ({ ...item, id: index }));
    setData(enrichedData);
    setFilteredData(enrichedData);
  }, []);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const getData = async (tab) => {
    try {
      let url = `${BACKEND_BASE_URL}billingrouter/getLiveViewByCategoryId`;
      if (tab !== "All") {
        url += `?billCategory=${tab}`;
      }
      const response = await axios.get(url, config);
      setData(response.data);
      filterData(searchTerm, response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    getData(selectedTab);

    const intervalId = setInterval(() => {
      !searchTerm && getData(selectedTab);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [selectedTab, searchTerm]);

  const handleSearchChange = (event) => {
    const uppercaseTerm = event.target.value.toUpperCase();
    setSearchTerm(uppercaseTerm);
    filterData(uppercaseTerm, data);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const filterData = (term, dataList) => {
    let filtered = dataList;

    if (term.trim() !== "") {
      filtered = dataList.filter((item) =>
        item.tokenNo && item.tokenNo.toString().includes(term)
      );
    }

    setFilteredData(filtered);
  };
  const navigate = useNavigate();
  return (
    <div className="CustomLiveViewHeight">
      <Header />
      <div className="iconHeader">
        <div className="flex justify-between m-2 px-2 rounded-md border border-black items-center">
          <div className=" flex">
            <div className="flex gap-2 p-4 py-6 text-sm items-center">
              <div className="topHeaderIconDiv">
                <ShoppingCartIcon className="topHeaderIcon" />
              </div>
              <p>Order View</p>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="flex gap-2 p-4 py-6 ml-2 text-sm items-center">
              <div className="topHeaderIconDiv">
                <ShoppingBagIcon className="topHeaderIcon" />
              </div>
              <p>Kot View</p>
            </div>
          </div>
          <div className="p-1 flex items-center w-fit">
            <div
              className={`search-container ${searchBarOpen ? "search-bar-open" : "search-bar-closed"
                }`}
            >
              <div
                className={`cursor-pointer ${!searchBarOpen
                  ? "p-1 bg-white border-black border rounded-md shadow-md"
                  : ""
                  }`}
              >
                {searchBarOpen ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="search"
                      placeholder="Search…"
                      aria-label="search"
                      onChange={handleSearchChange}
                      className={`py-2 anotherSearch input-transition ${searchBarOpen ? "input-visible" : "input-hidden"
                        }`}
                      value={searchTerm}
                    />
                    <CancelIcon onClick={() => setSearchBarOpen(false)} />
                  </div>
                ) : (
                  <SearchIcon onClick={() => setSearchBarOpen(true)} />
                )}
              </div>
            </div>
            <div className="border mx-2 cursor-pointer p-1 reloadIconDiv bg-white border-black rounded-md shadow-md">
              <CachedIcon className="topHeaderIcon" />
            </div>
            <button className=" bg-white cursor-pointer border-black flex items-center BackArroIconDiv hover:bg-gray-200 gap-2 rounded-lg border"
              onClick={() => {
                navigate("/dashboard");
              }}>
              <ArrowBackIcon className="BackArrowIcon" /> Back
            </button>
          </div>
        </div>
        <div className="m-2 flex items-center justify-between bg-gray-200 p-2 rounded-md">
          <div className="flex items-center mr-2">
            <div
              className={`bg-white px-4  pt-3 w-max items-center flex gap-4  rounded-md shadow-md `}
            >
              <div
                className="tab cursor-pointer"
                onClick={() => handleTabChange("All")}
              >
                <div
                  className={`text-center w-fit px-10 border-b-4 ${selectedTab === "All"
                    ? "border-red-600"
                    : "border-transparent"
                    } rounded-sm`}
                >
                  <div>
                    <GridViewIcon />
                  </div>
                  <p className="mt-1">All</p>
                </div>
              </div>
              <div
                className="tab cursor-pointer"
                onClick={() => handleTabChange("Delivery")}
              >
                <div
                  className={`text-center w-fit px-8 border-b-4 ${selectedTab === "Delivery"
                    ? "border-red-600"
                    : "border-transparent"
                    } rounded-sm`}
                >
                  <div>
                    <DeliveryDiningIcon />
                  </div>
                  <p className="mt-1">Delivery</p>
                </div>
              </div>
              <div
                className="tab cursor-pointer"
                onClick={() => handleTabChange("Pick Up")}
              >
                <div
                  className={`text-center w-fit px-8 border-b-4 ${selectedTab === "Pick Up"
                    ? "border-red-600"
                    : "border-transparent"
                    } rounded-sm`}
                >
                  <div>
                    <StorefrontIcon />
                  </div>
                  <p className="mt-1">Pick Up</p>
                </div>
              </div>
              <div
                className="tab cursor-pointer"
                onClick={() => handleTabChange("Hotel")}
              >
                <div
                  className={`text-center w-fit px-8 border-b-4 ${selectedTab === "Hotel"
                    ? "border-red-600"
                    : "border-transparent"
                    } rounded-sm`}
                >
                  <div>
                    <ApartmentIcon />
                  </div>
                  <p className="mt-1">Hotel</p>
                </div>
              </div>
              <div
                className="tab cursor-pointer"
                onClick={() => handleTabChange("Dine In")}
              >
                <div
                  className={`text-center w-fit px-8 border-b-4 ${selectedTab === "Dine In"
                    ? "border-red-600"
                    : "border-transparent"
                    } rounded-sm`}
                >
                  <div>
                    <RestaurantMenuIcon />
                  </div>
                  <p className="mt-1">Dine In</p>
                </div>
              </div>
              {/* <div
                className="tab cursor-pointer"
                onClick={() => handleTabChange("Online")}
              >
                <div
                  className={`text-center w-fit px-8 border-b-4 ${selectedTab === "Online"
                    ? "border-red-600"
                    : "border-transparent"
                    } rounded-sm`}
                >
                  <div>
                    <WifiIcon />
                  </div>
                  <p className="mt-1">Online</p>
                </div>
              </div> */}
            </div>
          </div>
          <div>
            <div className="searchBar">
              <div className="header_search flex ml-2 gap-2 items-center">
                <input
                  type="search"
                  placeholder="Enter Order no."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="popoverSearch"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-8 w-full fiedCardsHeight gapFor20Inch ml-3 px-2 py-6 pb-14">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} className="my-2 minWidth">
              <Cards data={item} />
            </div>
          ))
        ) : (
          <div className="w-full flex justify-center items-center">
            <div className="text-center">
              <RestaurantIcon className="NoDataFoundIcon" /> <br />
              <p className="text-xl mt-1 text-gray-500">
                No Data Found
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveView;

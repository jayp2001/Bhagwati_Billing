/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const lastLoadTime = useRef(0);
  const numPerPage = 20;

  useEffect(() => {
    // Initial data load
    getData(selectedTab, 1, searchTerm);
  }, []);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const getData = async (tab, currentPage = 1, searchWord = "", isLoadMore = false) => {
    if (loading || (isLoadMore && isLoadingMore)) return;

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let url = `${BACKEND_BASE_URL}billingrouter/getLiveViewByCategoryId?page=${currentPage}&numPerPage=${numPerPage}`;

      if (tab !== "All") {
        url += `&billCategory=${tab}`;
      }

      if (searchWord.trim() !== "") {
        url += `&searchWord=${encodeURIComponent(searchWord)}`;
      }

      const response = await axios.get(url, config);
      const newData = response.data || [];

      if (isLoadMore) {
        setData(prevData => [...prevData, ...newData]);
        setFilteredData(prevData => [...prevData, ...newData]);
      } else {
        setData(newData);
        setFilteredData(newData);
      }

      // For live data, always assume there might be more data unless we get an empty response
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (!isLoadMore) {
        setData([]);
        setFilteredData([]);
      }
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setPage(1);
    setData([]);
    setFilteredData([]);
    setHasMore(true);
    getData(selectedTab, 1, searchTerm);
  }, [selectedTab]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchValue) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchTerm(searchValue);
          // Reset pagination and fetch new data
          setPage(1);
          setData([]);
          setFilteredData([]);
          setHasMore(true);
          getData(selectedTab, 1, searchValue);
        }, 500); // 500ms debounce delay
      };
    })(),
    [selectedTab]
  );

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchInputValue(searchValue);
    debouncedSearch(searchValue);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSearchTerm(""); // Clear search when changing tabs
    setSearchInputValue(""); // Clear search input when changing tabs
  };

  // Load more data for infinite scroll
  const loadMore = useCallback(() => {
    const now = Date.now();
    // Prevent multiple calls within 1 second
    if (hasMore && !loading && !isLoadingMore && (now - lastLoadTime.current > 1000)) {
      lastLoadTime.current = now;
      const nextPage = page + 1;
      setPage(nextPage);
      getData(selectedTab, nextPage, searchTerm, true);
    }
  }, [hasMore, loading, isLoadingMore, page, selectedTab, searchTerm]);

  // Auto-refresh data periodically to check for new live data
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only refresh if we're at the end and there's no search term
      if (!hasMore && !searchTerm && !loading && !isLoadingMore) {
        setHasMore(true); // Reset hasMore to allow checking for new data
        const nextPage = page + 1;
        setPage(nextPage);
        getData(selectedTab, nextPage, searchTerm, true);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [hasMore, searchTerm, loading, isLoadingMore, page, selectedTab]);

  // Container scroll handler for infinite scroll
  const handleScroll = useCallback((event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;

    // Trigger when user is 150px from bottom
    if (scrollHeight - scrollTop <= clientHeight + 150 && hasMore && !loading && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, loading, isLoadingMore, loadMore]);

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
                      value={searchInputValue}
                    />
                    <CancelIcon onClick={() => {
                      setSearchBarOpen(false);
                      setSearchInputValue("");
                      setSearchTerm("");
                      setPage(1);
                      setData([]);
                      setFilteredData([]);
                      setHasMore(true);
                      getData(selectedTab, 1, "");
                    }} />
                  </div>
                ) : (
                  <SearchIcon onClick={() => setSearchBarOpen(true)} />
                )}
              </div>
            </div>
            <div className="border mx-2 cursor-pointer p-1 reloadIconDiv bg-white border-black rounded-md shadow-md" onClick={() => {
              setPage(1);
              setData([]);
              setFilteredData([]);
              setHasMore(true);
              getData(selectedTab, 1, searchTerm);
            }}>
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
                  value={searchInputValue}
                  onChange={handleSearchChange}
                  className="popoverSearch"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-wrap gap-x-5 gap-y-8 w-full fiedCardsHeight gapFor20Inch ml-3 px-2 py-6 pb-14"
        onScroll={handleScroll}
        style={{ overflowY: 'auto', height: 'calc(100vh - 200px)' }}
      >
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={`${item.id || index}-${index}`} className="my-2 minWidth">
              <Cards data={item} />
            </div>
          ))
        ) : !loading ? (
          <div className="w-full flex justify-center items-center">
            <div className="text-center">
              <RestaurantIcon className="NoDataFoundIcon" /> <br />
              <p className="text-xl mt-1 text-gray-500">
                No Data Found
              </p>
            </div>
          </div>
        ) : null}

        {(loading || isLoadingMore) && (
          <div className="w-full flex justify-center items-center py-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-sm mt-2 text-gray-500">
                {isLoadingMore ? 'Loading more...' : 'Loading...'}
              </p>
            </div>
          </div>
        )}

        {!hasMore && filteredData.length > 0 && !searchTerm && (
          <div className="w-full flex justify-center items-center py-4 flex-col gap-2">
            <p className="text-sm text-gray-500">End of current data • New orders will appear automatically</p>
            <button
              onClick={() => {
                setHasMore(true);
                const nextPage = page + 1;
                setPage(nextPage);
                getData(selectedTab, nextPage, searchTerm, true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              disabled={loading || isLoadingMore}
            >
              {loading || isLoadingMore ? 'Loading...' : 'Check for New Orders'}
            </button>
          </div>
        )}

        {!hasMore && filteredData.length > 0 && searchTerm && (
          <div className="w-full flex justify-center items-center py-4">
            <p className="text-sm text-gray-500">No more search results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveView;

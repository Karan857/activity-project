import { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import Abi from "../../components/contract/abi2.json";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function Test() {
  const [reserve, setReserve] = useState([]);
  const [join, setJoin] = useState([]);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("latest");
  const [openRows, setOpenRows] = useState({});

  const navigate = useNavigate();

  const contractAddress = "0xc9811A01727735E9c9aE046b7690b2AC9021E1B7";
  const stdID = localStorage.getItem("id");

  useEffect(() => {
    const fetchSmartContract = async () => {
      try {
        const web3 = new Web3("https://rpc.sepolia.org");
        const contract = new web3.eth.Contract(Abi, contractAddress);
        const res = await contract.methods.get().call();
        setJoin(res);
      } catch (err) {
        setError(err);
        console.error(err);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await axios.get("/api/activitys");
        setActivity(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSmartContract();
    fetchActivity();
    setIsLoaded(true);
  }, []);
  const formatDateThai = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  };

  const toggleRow = (actId) => {
    setOpenRows((prev) => ({ ...prev, [actId]: !prev[actId] }));
  };

  const getStatus = (activityID) => {
    const joinEntry = join.find(
      (j) =>
        Number(j.activityId) === activityID &&
        j.studentIds.some((id) => Number(id) === Number(stdID))
    );
    if (joinEntry) {
      return { message: "เข้าร่วมกิจกรรมแล้ว", color: "blue" };
    }
    const reserveEntry = activity.find(
      (r) => r.act_ID === activityID && r.login_ID === stdID
    );
    if (reserveEntry) {
      return { message: "ลงทะเบียนสำเร็จ", color: "green" };
    }
    return { message: "ยังไม่ได้ลงทะเบียน", color: "gray" };
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "latest" ? "oldest" : "latest"));
  };

  const sortItems = (items) => {
    return items.sort((a, b) => {
      const dateA = new Date(a.act_dateStart);
      const dateB = new Date(b.act_dateStart);
      if (sortOrder === "latest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  };

  const filteredItems = activity.filter((item) => {
    const status = getStatus(item.act_ID);
    return (
      item.act_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "default" ||
        (filter === "joinEntry" && status.message === "เข้าร่วมกิจกรรมแล้ว") ||
        (filter === "reserveEntry" && status.message === "ลงทะเบียนสำเร็จ") ||
        (filter === "notjoin" && status.message === "ยังไม่ได้ลงทะเบียน"))
    );
  });

  const sortedItems = sortItems(filteredItems);
  const lastPage = Math.max(0, Math.ceil(sortedItems.length / itemsPerPage) - 1);
  const visibleItems = sortedItems.slice(
    currentPage * itemsPerPage,
    Math.min((currentPage + 1) * itemsPerPage, sortedItems.length)
  );
  

  const pageNumbers = [];
  for (let i = 0; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

  const uniqueVisibleItems = Array.from(
    new Map(visibleItems.map((item) => [item.act_ID, item])).values()
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="mb-10 container mx-auto md:px-20">
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="text-lg font-bold mb-2">ประวัติการทำกิจกรรม</div>
          <div className="flex justify-between">
            <div className="pb-4 items-center">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search"
                  className="block pl-10 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหากิจกรรม"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex pb-4 items-center">
                <label htmlFor="filter-activity-type" className="sr-only">
                  Filter
                </label>
                <div className="relative">
                  <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="text-xs block p-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="default" className="text-center">
                      ทั้งหมด
                    </option>
                    <option value="joinEntry">เข้าร่วมกิจกรรมแล้ว</option>
                    <option value="reserveEntry">ลงทะเบียนสำเร็จ</option>
                    <option value="notjoin">ยังไม่ได้ลงทะเบียน</option>
                  </select>
                </div>
              </div>
              <div className="flex pb-4 items-center">
                <button
                  onClick={handleSortChange}
                  className="block p-2 text-xs border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  วันที่ ({sortOrder === "latest" ? "ใหม่สุด" : "เก่าสุด"})
                </button>
              </div>
            </div>
          </div>
          <table
            className="min-w-full bg-white dark:bg-gray-800"
            style={{ maxHeight: "50vh" }}
          >
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr className="w-96 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 uppercase text-left">
                <th className="px-4 py-3">ชื่อกิจกรรม</th>
                <th className="px-4 py-3">สถานที่</th>
                <th className="px-4 py-3">อาจารย์ผู้จัด</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3 w-2/12">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {uniqueVisibleItems.map((item) => {
                const status = getStatus(item.act_ID);
                return (
                  <>
                    <tr
                      key={item.act_ID}
                      className="text-gray-700 dark:text-gray-400"
                    >
                      <td className="px-4 py-3">
                        {item.act_title} ({item.act_ID})
                      </td>
                      <td className="px-4 py-3">{item.act_location}</td>
                      <td className="px-4 py-3">
                        {item.staff_fname} {item.staff_lname}
                      </td>
                      <td className="px-4 py-3" style={{ color: status.color }}>
                        {status.message}
                      </td>
                      {/* <td className="px-6 py-3">
                        <button
                          className="text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() =>
                            navigate(`/activity/detail2/${item.act_ID}`)
                          }
                        >
                          รายละเอียด
                        </button>
                      </td> */}
                      <td>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRow(item.act_ID)}
                        >
                          {openRows[item.act_ID] ? (
                            <>
                              <KeyboardArrowUpIcon />
                            </>
                          ) : (
                            <>
                              <KeyboardArrowDownIcon />
                            </>
                          )}
                        </IconButton>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openRows[item.act_ID]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              รายละเอียดเพิ่มเติม
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell>รายละเอียด</TableCell>
                                  <TableCell>จำนวนที่รับ</TableCell>
                                  <TableCell>วันที่เริ่ม</TableCell>
                                  <TableCell>วันที่สิ้นสุด</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell component="th" scope="row">
                                    {item.act_desc}
                                  </TableCell>
                                  <TableCell>
                                    {item.act_numStdReserve}/{item.act_numStd}คน
                                  </TableCell>
                                  <TableCell>
                                    {formatDateThai(item.act_dateStart)}
                                  </TableCell>
                                  <TableCell>
                                    {formatDateThai(item.act_dateEnd)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between mt-2">
            <div className="flex gap-2 w-24"></div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
                }
                disabled={currentPage === 0}
                className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  currentPage === 0 ? "cursor-not-allowed" : "hover:bg-blue-200"
                }`}
              >
                ก่อนหน้า
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                    pageNumber === currentPage ? "bg-blue-200" : ""
                  }`}
                >
                  {pageNumber + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prevPage) => Math.min(prevPage + 1, lastPage))
                }
                disabled={currentPage === lastPage}
                className={`px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  currentPage === lastPage
                    ? "cursor-not-allowed"
                    : "hover:bg-blue-200"
                }`}
              >
                ถัดไป
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(+e.target.value);
                  setCurrentPage(0);
                }}
                className="px-3 p-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-500  focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Test;

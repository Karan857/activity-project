import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from "web3";
import Abi from '../../components/contract/abi.json';
import { useNavigate } from 'react-router-dom';

function Test() {
    const [reserve, setReserve] = useState([]);
    const [join, setJoin] = useState([]);
    const [activity, setActivity] = useState([]);
    const [status, setStatus] = useState('ไม่ได้ลงทะเบียน');
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
<<<<<<< HEAD
    const [itemsPerPage, setItemsPerPage] = useState(10);
=======
    const [filter, setFilter] = useState("default");
    const [itemsPerPage, setItemsPerPage] = useState(15);
>>>>>>> 05718313b3f3f3e1be2025e819a787eba9229094
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOrder, setSortOrder] = useState('latest'); // เพิ่ม state สำหรับการเรียงลำดับ
    const [filterStatus, setFilterStatus] = useState('all'); // เพิ่ม state สำหรับการกรองตามสถานะ

<<<<<<< HEAD
    // reserve
    const [reserve, setReserve] = useState([]);
=======
    const navigate = useNavigate(); // Define the navigate function
>>>>>>> 05718313b3f3f3e1be2025e819a787eba9229094

    const contractAddress = '0xF9322B9B17944cf80FA33Be311Ea472375698F90';
<<<<<<< HEAD
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [getAll, setGetAll] = useState([]);
    const [stdID, setStdID] = useState('');

    // Connect to MetaMask 
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                const contractInstance = new web3Instance.eth.Contract(contractAbi, contractAddress);
                setContract(contractInstance);
                return web3Instance; // Return the initialized web3 instance
            } catch (err) {
                console.error(err);
                return null;
            }
        } else {
            alert('Please install MetaMask');
            return null;
        }
    };

    // Function to handle getAll button click
    const handleGetAll = async () => {
        try {
            const web3Instance = await connectWallet();

            if (!web3Instance || !contract) {
                console.error('Contract or web3 not initialized.');
                return;
            }

            const allData = await contract.methods.getAll().call();
            const formattedData = allData[0].map((actID, index) => ({
                actID: Number(actID),
                stdIDs: allData[1][index]
            }));

            setGetAll(formattedData);
            console.log(formattedData);

            // Update activity status based on blockchain data
            const updatedActivity = activity.map(item => {
                const blockchainParticipation = formattedData.find(
                    data => data.actID === item.act_ID && data.stdIDs.includes(BigInt(stdID))
                );
                return {
                    ...item,
                    registrationStatus: blockchainParticipation
                        ? 'เข้าร่วม'
                        : (item.registrationStatus === 'ลงทะเบียนสำเร็จ' ? 'ไม่ได้เข้าร่วม' : 'ยังไม่ได้ลงทะเบียน')
                };
            });

            setActivity(updatedActivity);
        } catch (err) {
            console.error(err);
        }
    };
=======
    const stdID = localStorage.getItem('std_ID');
>>>>>>> 05718313b3f3f3e1be2025e819a787eba9229094

    useEffect(() => {
        const fetchManage = async () => {
            try {
<<<<<<< HEAD
                const activityResponse = await fetch('/api/list/activity');
                const activityData = await activityResponse.json();

                const storedStdID = localStorage.getItem('std_ID');
                setStdID(storedStdID);

                const manageResponse = await axios.get('/api/manage');
                const reserveData = manageResponse.data;
                setReserve(reserveData);

                // Combine activity and reserve data
                const activityWithStatus = activityData.map(activity => {
                    const isRegistered = reserveData.some(
                        reserve => reserve.std_ID === storedStdID && reserve.act_ID === activity.act_ID.toString()
                    );
                    return {
                        ...activity,
                        registrationStatus: isRegistered ? 'ลงทะเบียนสำเร็จ' : 'ยังไม่ได้ลงทะเบียน'
                    };
                });

                setActivity(activityWithStatus);
                setIsLoaded(true);
            } catch (error) {
                setIsLoaded(true);
                setError(error);
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
=======
                const res = await axios.get('/api/manage');
                setReserve(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSmartContract = async () => {
            try {
                const web3 = new Web3('https://rpc.sepolia.org');
                const contract = new web3.eth.Contract(Abi, contractAddress);
                const res = await contract.methods.getAll().call();

                const format = res[0].map((actID, index) => ({
                    actID: Number(actID),
                    stdIDs: res[1][index]
                }));

                setJoin(format);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchActivity = async () => {
            try {
                const res = await axios.get('/api/list/activity');
                setActivity(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchManage();
        fetchSmartContract();
        fetchActivity();
        setIsLoaded(true);
>>>>>>> 05718313b3f3f3e1be2025e819a787eba9229094
    }, []);

    const getStatus = (activityID) => {
        const joinEntry = join.find(j => j.actID == activityID && j.stdIDs.includes(BigInt(stdID)));
        if (joinEntry) {
            return 'เข้าร่วมกิจกรรมแล้ว';
        }
        const reserveEntry = reserve.find(r => r.act_ID == activityID && r.std_ID == stdID);
        if (reserveEntry) {
            return 'ลงทะเบียนสำเร็จ';
        }
        return 'ยังไม่ได้เข้าร่วมกิจกรรม';
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(0);
    };

<<<<<<< HEAD
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const sortedItems = activity.sort((a, b) => {
        if (sortOrder === 'latest') {
            return new Date(b.act_dateStart) - new Date(a.act_dateStart);
        } else {
            return new Date(a.act_dateStart) - new Date(b.act_dateStart);
        }
=======
    const filteredItems = activity.filter((item) => {
        const status = getStatus(item.act_ID);
        return (
            item.act_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === "default" ||
                (filter === "joinEntry" && status === 'เข้าร่วมกิจกรรมแล้ว') ||
                (filter === "reserveEntry" && status === 'ลงทะเบียนสำเร็จ') ||
                (filter === "notjoin" && status === 'ยังไม่ได้เข้าร่วมกิจกรรม'))
        );
>>>>>>> 05718313b3f3f3e1be2025e819a787eba9229094
    });

    const filteredItems = sortedItems.filter((item) => {
        if (filterStatus === 'all') {
            return true; // Show all items
        } else if (filterStatus === 'joined') {
            return item.registrationStatus === 'เข้าร่วม';
        }else if (filterStatus === 'notjoined') {
            return item.registrationStatus === 'ไม่ได้เข้าร่วม';
        } else if (filterStatus === 'registered') {
            return item.registrationStatus === 'ลงทะเบียนสำเร็จ';
        } else if (filterStatus === 'notregistered') {
            return item.registrationStatus === 'ยังไม่ได้ลงทะเบียน';
        } else {
            return true;
        }
    });

    const lastPage = Math.ceil(filteredItems.length / itemsPerPage) - 1;
    const visibleItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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
                            <label htmlFor="table-search" className="sr-only">Search</label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="table-search"
                                    className="pb-2 block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search for activity"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

<<<<<<< HEAD
                        <div className="flex gap-2">
                            <div className="mt-1 pb-4 text-center">
                                <label htmlFor="sortOrder" className="text-xs flex justify-center">เรียงตามวันที่</label>
                                <select
                                    id="sortOrder"
                                    value={sortOrder}
                                    onChange={handleSortChange}
                                    className="block text-center pt-1 pb-1 text-sm rounded-md w-20 bg-gray-200"
                                >
                                    <option value="latest">ล่าสุด</option>
                                    <option value="oldest">เก่าสุด</option>
                                </select>
                            </div>

                            <div className="mt-1 pb-4">
                                <label className="text-xs flex justify-center">กรองตาม</label>
                                <select
                                    id="filterStatus"
                                    value={filterStatus}
                                    onChange={handleFilterChange}
                                    className="block text-center pt-1 pb-1 text-sm rounded-md w-20 bg-gray-200"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    <option value="joined">เข้าร่วมแล้ว</option>
                                    <option value="notjoined">ไม่ได้เข้าร่วม</option>
                                    <option value="registered">ลงทะเบียนแล้ว</option>
                                    <option value="notregistered">ยังไม่ลงทะเบียน</option>
                                </select>
                            </div>
=======
                        <div className="pb-4 items-center">
                            <label htmlFor="filter-activity-type" className="sr-only">Filter</label>
                            <div className="relative mt-1">
                                <select
                                    value={filter}
                                    onChange={handleFilterChange}
                                    className='block p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                >
                                    <option value="default">All</option>
                                    <option value="joinEntry">เข้าร่วมกิจกรรมแล้ว</option>
                                    <option value="reserveEntry">ลงทะเบียนสำเร็จ</option>
                                    <option value="notjoin">ยังไม่ได้เข้าร่วมกิจกรรม</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-1 pb-4">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(+e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="block ps-6 pt-1 pb-1 text-sm rounded-md w-20 bg-gray-200"
                            >
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
>>>>>>> 05718313b3f3f3e1be2025e819a787eba9229094
                        </div>
                    </div>

                    <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <thead className="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex w-full">
                            <tr className="flex w-full">
                                <th scope="col" className="px-6 py-3 w-1/12"></th>
                                <th scope="col" className="px-6 py-3 w-1/12">รหัสกิจกรรม</th>
                                <th scope="col" className="px-6 py-3 w-2/12">ชื่อกิจกรรม</th>
                                <th scope="col" className="px-6 py-3 w-2/12">สถานที่จัดกิจกรรม</th>
                                <th scope="col" className="px-6 py-3 w-2/12">วันที่จัดกิจกรรม</th>
                                <th scope="col" className="px-6 py-3 w-2/12">สถานะการเข้าร่วม</th>
                                <th scope="col" className="px-6 py-3 w-2/12">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600 flex flex-col w-full overflow-y-scroll items-center justify-between">
<<<<<<< HEAD
                            {visibleItems.length === 0 ? (
                                <tr className="border-b-2 flex w-full justify-center py-20">
                                    <td colSpan="6" className="px-6 py-3 text-center">ไม่พบข้อมูล</td>
                                </tr>
                            ) : (
                                visibleItems.map((item, index) => (
                                    <tr key={item.act_ID} className="border-b-2 flex w-full text-center">
                                        <td className="px-6 py-3 w-1/12">{index + 1}</td>
                                        <td className="px-6 py-3 w-1/12">{item.act_ID}</td>
                                        <td className="px-6 py-3 w-2/12">{item.act_title}</td>
                                        <td className="px-6 py-3 w-2/12">{item.act_location}</td>
                                        <td className="px-6 py-3 w-2/12">{item.act_dateStart.slice(0, 10)}</td>
                                        <td className={`px-6 py-3 w-2/12 ${item.registrationStatus === 'ลงทะเบียนสำเร็จ' || item.registrationStatus === 'เข้าร่วม'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}
                                        >
                                            {item.registrationStatus}
                                        </td>
                                        <td className=" py-3 w-2/12">เพิ่มเติม</td>
                                    </tr>
                                ))
                            )}
=======
                            {visibleItems.map(item => (
                                <tr key={item.act_ID} className="border-b-2 flex w-full">
                                    <td className="px-6 py-3 w-1/6">{item.act_ID}</td>
                                    <td className="px-6 py-3 w-1/6">{item.act_title}</td>
                                    <td className="px-6 py-3 w-1/6">{item.act_location}</td>
                                    <td className="px-6 py-3 w-1/6">{item.act_dateStart.slice(0, 10)}</td>
                                    <td className={`px-6 py-3 w-1/6 ${getStatus(item.act_ID) === 'เข้าร่วมกิจกรรมแล้ว' ? 'text-green-500' : getStatus(item.act_ID) === 'ยังไม่ได้เข้าร่วมกิจกรรม' ? 'text-red-500' : ''}`}>
                                        {getStatus(item.act_ID)}
                                    </td>
                                    <td className="px-6 py-3 w-1/6">
                                        <button
                                            className="text-blue-600 dark:text-blue-500 hover:underline"
                                            onClick={() => navigate(`/activity/detail/${item.act_ID}`)} 
                                        >
                                            รายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            ))}
>>>>>>> 05718313b3f3f3e1be2025e819a787eba9229094
                        </tbody>
                    </table>

                    <div className="flex justify-between mt-4">
                        <div>
                            <button
                                onClick={() => {
                                    if (currentPage > 0) {
                                        setCurrentPage(prev => prev - 1);
                                    }
                                }}
                                disabled={currentPage === 0}
                                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Previous
                            </button>
                        </div>

                        <div className="flex space-x-2">
                            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).slice(currentPage, currentPage + 4).map((_, i) => (
                                <button
                                    key={i + currentPage}
                                    onClick={() => setCurrentPage(currentPage + i)}
                                    className={`px-4 py-2 font-medium ${currentPage + i === currentPage ? "text-blue-600 bg-blue-100" : "text-gray-600 bg-gray-100"} border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                                >
                                    {currentPage + i + 1}
                                </button>
                            ))}

                            {currentPage + 4 < lastPage && (
                                <button
                                    onClick={() => {
                                        setCurrentPage(currentPage + 4);
                                    }}
                                    className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                >
                                    ...
                                </button>
                            )}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    if (currentPage < lastPage) {
                                        setCurrentPage(prev => prev + 1);
                                    }
                                }}
                                disabled={currentPage >= lastPage}
                                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Next
                            </button>
                        </div>
<<<<<<< HEAD

                        <button onClick={handleGetAll} className="px-4 py-2 font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                            Get All
                        </button>
                        
                        <div className="mt-1 pb-4">
                            <label className="text-xs flex justify-center text-transparent"> b</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(+e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="block ps-6 pt-1 pb-1 text-sm rounded-md w-20 bg-gray-200"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={500}>500</option>
                            </select>
                        </div>
=======
>>>>>>> 05718313b3f3f3e1be2025e819a787eba9229094
                    </div>
                </div>
            </div>
        );
    }
}

export default Test;

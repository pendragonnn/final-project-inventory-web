"use client";
import React from "react";
import CardDataStats from "@/components/CardDataStats";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Loader from "@/components/common/Loader";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import users from "@/data/user";
import category from "@/data/category";
import item from "@/data/item";
import brand from "@/data/brand";
import supplier from "@/data/supplier";
import outlet from "@/data/outlet";
import {
	getTransactionHeaderReceiving,
	getTransactionHeaderIssuing,
	getTransactionHeaderReturning,
	getForcastTransaction,
} from "@/modules/fetch/index";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import ForecastSection from "../fitur-dashboard/forecasting";
import StockInfo from "../fitur-dashboard/stock-info";
import MostIssued from "../fitur-dashboard/most-issued";
import TransactionTrendsChart from "../fitur-dashboard/trends";
import MostOutletTransactions from "../fitur-dashboard/most-outlet";
import TopItemCategoriesChart from "../fitur-dashboard/most-category";

const Dashboard = () => {
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [totalUser, setTotalUser] = useState([]);
	const [totalCategory, setTotalCategory] = useState([]);
	const [totalItem, setTotalItem] = useState([]);
	const [totalBrand, setTotalBrand] = useState([]);
	const [totalSupplier, setTotalSupplier] = useState([]);
	const [totalOutlet, setTotalOutlet] = useState([]);
	const [totalTransactionReceiving, setTotalTransactionReceiving] = useState(
		[]
	);
	const [totalTransactionIssuing, setTotalTransactionIssuing] = useState([]);
	const [totalTransactionReturning, setTotalTransactionReturning] = useState(
		[]
	);
	const [itemId, setItemId] = useState("");
	const [period, setPeriod] = useState(7);
	const [forecastData, setForecastData] = useState(null);
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const token = Cookies.get("token");

		if (!token) {
			router.push("/forbidden");
			return;
		}

		try {
			const decoded = jwtDecode(token);

			if (!decoded.role) {
				router.push("/forbidden");
				return;
			}

			setUser(decoded.role);
		} catch (err) {
			console.error("Error decoding token:", err);
			router.push("/forbidden");
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await users.getUsers();
				const allRes = await users.getUsers(1, res.data.totalItems);
				setTotalUser(allRes.data.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching user", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await category.getCategory();
				const allRes = await category.getCategory(1, res.data.totalItems);
				setTotalCategory(allRes.data.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await item.getItem();
				const allRes = await item.getItem(1, res.data.totalItems);
				setTotalItem(allRes.data.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await supplier.getSupplier();
				const allRes = await supplier.getSupplier(1, res.data.totalItems);
				setTotalSupplier(allRes.data.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await outlet.getOutlet();
				const allRes = await outlet.getOutlet(1, res.data.totalItems);
				setTotalOutlet(allRes.data.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await getTransactionHeaderReceiving();
				const allRes = await getTransactionHeaderReceiving(1, res.totalItems);
				setTotalTransactionReceiving(allRes.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await getTransactionHeaderReceiving();
				const allRes = await getTransactionHeaderReceiving(1, res.totalItems);
				setTotalTransactionReceiving(allRes.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await getTransactionHeaderIssuing();
				const allRes = await getTransactionHeaderIssuing(1, res.totalItems);
				setTotalTransactionIssuing(allRes.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await getTransactionHeaderReturning();
				const allRes = await getTransactionHeaderReturning(1, res.totalItems);
				setTotalTransactionReturning(allRes.totalItems);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await getForcastTransaction();
				setForecastData(res.data.forecast || null);
				setLoading(false);
			} catch (error) {
				console.log("Error fetching user", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await brand.getBrand();
				const allRes = await brand.getBrand(1, res.data.totalItems);
				const brandData = allRes.data?.data ?? [];
				const uniqueBrandNames = new Set(brandData.map((item) => item.name));
				setTotalBrand(uniqueBrandNames.size);

				setLoading(false);
			} catch (error) {
				console.log("Error fetching brand", error);
			}
		};
		fetchData();
	}, []);

	const countTotalUsers = totalUser;
	const countTotalCategory = totalCategory;
	const countTotalItem = totalItem;
	const countTotalSupplier = totalSupplier;
	const countTotalOutlet = totalOutlet;
	const countTotalTransactionReceiving = totalTransactionReceiving;
	const countTotalTransactionIssuing = totalTransactionIssuing;
	const countTotalTransactionReturning = totalTransactionReturning;

	useEffect(() => {
		setTimeout(() => setLoading(false), 1000);
	}, []);

	// useEffect(() => {
	// 	console.log("useEffect triggered", itemId, period); // Menambahkan log di sini untuk debugging
	// 	if (itemId && period) {
	// 		const fetchForecast = async () => {
	// 			console.log("Fetching forecast...");
	// 			setLoading(true);
	// 			try {
	// 				const res = await getForcastTransaction(itemId, period);
	// 				console.log("Forecast data received:", data);
	// 				setForecastData(res.data.forecast || null); // Pastikan kita set forecast
	// 			} catch (error) {
	// 				console.error("Error fetching forecast data:", error);
	// 			} finally {
	// 				setLoading(false);
	// 			}
	// 		};

	// 		fetchForecast();
	// 	}
	// }, [itemId, period]);

	const handleItemIdChange = (e) => {
		setItemId(e.target.value);
	};

	const handlePeriodChange = (e) => {
		setPeriod(e.target.value);
	};

	if (loading) return <Loader />; // Loader while data is being fetched

	// Pastikan forecastData ada sebelum mencoba menampilkannya
	if (!forecastData) {
		return <div>No forecast data available</div>; // Menampilkan pesan jika tidak ada data
	}

	return (
		<>
			<div className="flex h-screen overflow-hidden">
				{/* <!-- ===== Sidebar Start ===== --> */}
				<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
				{/* <!-- ===== Sidebar End ===== --> */}

				{/* <!-- ===== Content Area Start ===== --> */}
				<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
					{/* <!-- ===== Header Start ===== --> */}
					<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
					{/* <!-- ===== Header End ===== --> */}

					{/* <!-- ===== Main Content Start ===== --> */}
					<main>
						<div className="mx-auto p-4 md:p-6 2xl:py-10">
							<div className="grid grid-cols-3 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5 2xl:gap-4.5">
								<CardDataStats title="Total Users" total={countTotalUsers}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="h-6 w-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
										/>
									</svg>
								</CardDataStats>
								<CardDataStats title="Total Items" total={countTotalItem}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
										/>
									</svg>
								</CardDataStats>
								<CardDataStats title="Total Brand" total={totalBrand || 0}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
										/>
									</svg>
								</CardDataStats>
								<CardDataStats
									title="Total Categories"
									total={countTotalCategory}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6 6h.008v.008H6V6Z"
										/>
									</svg>
								</CardDataStats>
								<CardDataStats
									title="Total Suppliers"
									total={countTotalSupplier}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
										/>
									</svg>
								</CardDataStats>
								<CardDataStats title="Total Outlets" total={countTotalOutlet}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
										/>
									</svg>
								</CardDataStats>
								<CardDataStats
									title="Total Transaction Receiving"
									total={countTotalTransactionReceiving}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
										/>
									</svg>
								</CardDataStats>
								<CardDataStats
									title="Total Transaction Issuing"
									total={countTotalTransactionIssuing}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
										/>
									</svg>
								</CardDataStats>
								<CardDataStats
									title="Total Transaction Returning"
									total={countTotalTransactionReturning}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 text-primary"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
										/>
									</svg>
								</CardDataStats>
							</div>
						</div>
						{/* <div className="overflow-hidden w-full md:w-2/3 mx-auto rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
							<ChartOne />
						</div> */}

						<div className="mx-auto px-6 mb-6">
							<div className="grid grid-cols-5 gap-4">
								{/* Forecast Section (Lebih Besar) */}
								<div className="col-span-3">
									<div className="overflow-hidden w-full rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-15 h-full">
										<ForecastSection />
									</div>
								</div>

								{/* Stock Info + Most Issued */}
								<div className="col-span-2  ">
									<div className="overflow-hidden w-full rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark  mb-3">
										<MostOutletTransactions />
									</div>
									<div className="overflow-hidden w-full rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark  mt-3">
										<TopItemCategoriesChart />
									</div>
								</div>
							</div>
						</div>

						<div className="mx-auto px-6 mb-6">
							<div className="grid grid-cols-5 gap-4">
								{/* Forecast Section (Lebih Besar) */}
								<div className="col-span-3">
									<div className="overflow-hidden w-full rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-15 h-full">
										<TransactionTrendsChart />
									</div>
								</div>

								{/* Stock Info + Most Issued */}
								<div className="col-span-2  ">
									<div className="overflow-hidden w-full rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark  mb-3">
										<StockInfo />
									</div>
									<div className="overflow-hidden w-full rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark  mt-3">
										<MostIssued />
									</div>
								</div>
							</div>
						</div>

						<div className="overflow-hidden w-full md:w-2/3 mx-auto rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-60 md:h-80 mb-10 ">
							<img
								src="/images/dashboard/inventory.jpg"
								alt="Inventory"
								className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
								style={{
									boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
								}}
							/>
						</div>
					</main>
					{/* <!-- ===== Main Content End ===== --> */}
				</div>
				{/* <!-- ===== Content Area End ===== --> */}
			</div>
		</>
	);
};
export default Dashboard;

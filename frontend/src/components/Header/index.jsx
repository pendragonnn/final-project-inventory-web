import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BellIcon } from "lucide-react";
import Item from "@/data/item/index";

const Header = ({ refreshTrigger, ...props }) => {
	const [lowStockCount, setLowStockCount] = useState(0);
	const [lowStockItems, setLowStockItems] = useState([]);
	const [showNotifications, setShowNotifications] = useState(false);
	const [isRead, setIsRead] = useState(false);
	const notificationRef = useRef(null); //
	const [showAll, setShowAll] = useState(false);

	const fetchLowStockItems = async () => {
		const savedIsRead = localStorage.getItem("isReadNotif") === "true";
		setIsRead(savedIsRead);

		try {
			const res = await Item.getItemStock();
			const items = res.data.data;

			const prevLowStockCount = parseInt(
				localStorage.getItem("prevLowStockCount") || "0"
			);
			setLowStockItems(items);
			setLowStockCount(items.length);

			if (items.length > prevLowStockCount) {
				setIsRead(false);
				localStorage.setItem("isReadNotif", "false");
			}

			localStorage.setItem("prevLowStockCount", items.length.toString());
		} catch (error) {
			console.error("Error fetching low stock items:", error);
		}
	};

	useEffect(() => {
		const interval = setInterval(fetchLowStockItems, 5000); // Cek stok setiap 5 detik
		return () => clearInterval(interval); // Hapus interval saat komponen di-unmount
	}, []);

	const handleNotificationClick = () => {
		setShowNotifications(!showNotifications);
		setIsRead(true); // Set notifikasi sebagai sudah dibaca
		localStorage.setItem("isReadNotif", "true"); // Simpan status ke localStorage
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				notificationRef.current &&
				!notificationRef.current.contains(event.target)
			) {
				setShowNotifications(false);
				setShowAll(false);
			}
		};

		if (showNotifications) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showNotifications]);

	return (
		<header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
			<div className="flex flex-grow items-center justify-between lg:justify-end px-4 py-2 shadow-2 md:px-6 2xl:px-11">
				<div className="flex items-center gap-2 sm:gap-4 lg:hidden">
					{/* Hamburger Toggle BTN */}
					<button
						aria-controls="sidebar"
						onClick={(e) => {
							e.stopPropagation();
							props.setSidebarOpen(!props.sidebarOpen);
						}}
						className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
					>
						<span className="relative block h-5.5 w-5.5 cursor-pointer">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
						</span>
					</button>

					<Link className="block flex-shrink-0 lg:hidden" href="/">
						<Image width={40} height={40} src={"/Logo.svg"} alt="Logo" />
					</Link>
				</div>

				<div className="flex items-center gap-3 2xsm:gap-7">
					<ul className="flex items-center gap-2 2xsm:gap-4">
						{/* Dark Mode Toggler */}
						<DarkModeSwitcher />

						{/* Notifikasi Stok Habis */}
						<div className="relative" ref={notificationRef}>
							<button
								className={`relative flex items-center justify-center w-10 h-10 rounded-full ${
									lowStockCount > 0 && !isRead
										? "bg-red-500 text-white"
										: "hover:bg-gray-200 dark:hover:bg-gray-700"
								}`}
								onClick={handleNotificationClick}
							>
								<BellIcon className="w-6 h-6 text-black dark:text-white" />
								{lowStockCount > 0 && !isRead && (
									<span className="absolute -top-1 -right-1 bg-danger text-white text-xs font-bold px-2 py-1 rounded-full">
										{lowStockCount}
									</span>
								)}
							</button>

							{/* Dropdown Notifikasi */}
							{showNotifications && (
								<div className="absolute right-0 mt-2 w-64 bg-white dark:bg-boxdark border border-gray-300 dark:border-strokedark shadow-lg rounded-lg p-3">
									<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
										⚠️ Low Stock Items
									</h4>
									<ul>
										{lowStockItems.length > 0 ? (
											lowStockItems
												.slice(0, showAll ? lowStockItems.length : 5)
												.map((item) => (
													<li
														key={item.id}
														className="text-sm text-gray-600 dark:text-gray-300"
													>
														{item.Brand.name} {item.Brand.type} {item.size} -{" "}
														<strong>{item.stock}</strong> left
													</li>
												))
										) : (
											<p className="text-sm text-gray-500">
												No low stock items
											</p>
										)}
									</ul>
									{lowStockCount > 5 && (
										<button
											className="text-xs text-blue-500 hover:underline mt-2 block"
											onClick={() => setShowAll(!showAll)}
										>
											{showAll
												? "Show Less"
												: `Show More (+${lowStockCount - 5})`}
										</button>
									)}
								</div>
							)}
						</div>
					</ul>

					{/* User Dropdown */}
					<DropdownUser />
				</div>
			</div>
		</header>
	);
};
export default Header;

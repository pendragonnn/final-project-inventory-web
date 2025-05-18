import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
	const router = useRouter();
	const [isTokenExist, setTokenExist] = useState(false);
	const [isRoleExist, setRoleExist] = useState(null);
	const pathname = usePathname();
	const trigger = useRef(null);
	const sidebar = useRef(null);
	let storedSidebarExpanded = "true";
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
	);

	// useEffect(() => {
	// 	const token = jwtDecode(Cookies.get("token"));
	// 	const role = jwtDecode(Cookies.get("token")).role;

	// 	if (!token || !role) router.push("/forbidden");
	// 	setTokenExist(!!token);
	// 	setRoleExist(role);
	// }, []);

	useEffect(() => {
		const token = Cookies.get("token");
		if (!token) {
			router.push("/forbidden");
			return;
		}

		try {
			const decodedToken = jwtDecode(token);
			setTokenExist(true);
			setRoleExist(decodedToken.role);
		} catch (error) {
			console.error("Invalid token:", error);
			router.push("/forbidden");
		}
	}, []);

	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!sidebar.current || !trigger.current) return;
			if (
				!sidebarOpen ||
				sidebar.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setSidebarOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});
	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if (!sidebarOpen || keyCode !== 27) return;
			setSidebarOpen(false);
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	});
	useEffect(() => {
		localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
		if (sidebarExpanded) {
			document.querySelector("body")?.classList.add("sidebar-expanded");
		} else {
			document.querySelector("body")?.classList.remove("sidebar-expanded");
		}
	}, [sidebarExpanded]);
	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-9999 flex h-screen w-60 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
				sidebarOpen ? "translate-x-0" : "-translate-x-full"
			}`}
		>
			{/* <!-- SIDEBAR HEADER --> */}
			<div className="flex items-center justify-between gap-2 px-6 pt-5.5 ">
				<Image
					src="/Logo.png"
					alt="Logo"
					width={500} // Sesuaikan dengan ukuran asli gambar
					height={300} // Sesuaikan dengan ukuran asli gambar
					style={{ width: "100%", height: "auto" }} // Pertahankan rasio aspek
					priority
				/>
				<button
					ref={trigger}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-controls="sidebar"
					aria-expanded={sidebarOpen}
					className="block lg:hidden"
				>
					<svg
						className="fill-current"
						width="20"
						height="18"
						viewBox="0 0 20 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
							fill=""
						/>
					</svg>
				</button>
			</div>
			{/* <!-- SIDEBAR HEADER --> */}

			<div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
				{/* <!-- Sidebar Menu --> */}
				<nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
					{/* <!-- Menu Group --> */}
					<div>
						<h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
							MENU
						</h3>

						<ul className="mb-6 flex flex-col gap-1.5">
							{/* <!-- Menu Item Dashboard --> */}
							<li>
								<Link
									href="/dashboard"
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes("dashboard") && "text-primary"
									}`}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
										/>
									</svg>
									Dashboard
								</Link>
							</li>

							{/* <!-- Menu Item Dashboard --> */}

							{isTokenExist && (isRoleExist == "1" || isRoleExist == "3") && (
								<li>
									<Link
										href="/tablesUsers"
										className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
											pathname.includes("tablesUsers") &&
											"text-primary font-bold text-xl3"
										}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
											/>
										</svg>
										Users
									</Link>
								</li>
							)}

							{isTokenExist && (
								<>
									<li>
										<Link
											href="/tablesCategories"
											className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
												pathname.includes("tablesCategories") &&
												"text-primary font-bold text-xl3"
											}`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
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
											Categories
										</Link>
									</li>

									<li>
										<Link
											href="/tablesBrands"
											className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
												pathname.includes("tablesBrands") &&
												"text-primary font-bold text-xl3"
											}`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
												/>
											</svg>
											Brands
										</Link>
									</li>

									<li>
										<Link
											href="/tablesItems"
											className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
												pathname.includes("tablesItems") &&
												"text-primary font-bold text-xl3"
											}`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
												/>
											</svg>
											Items
										</Link>
									</li>

									<li>
										<Link
											href="/tablesOutlets"
											className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
												pathname.includes("tablesOutlets") &&
												"text-primary font-bold text-xl3"
											}`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
												/>
											</svg>
											Outlets
										</Link>
									</li>

									<li>
										<Link
											href="/tablesSuppliers"
											className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
												pathname.includes("tablesSuppliers") &&
												"text-primary font-bold text-xl3"
											}`}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
												/>
											</svg>
											Suppliers
										</Link>
									</li>

									<SidebarLinkGroup
										activeCondition={
											pathname === "/transaction" ||
											pathname.includes("transaction")
										}
									>
										{(handleClick, open) => {
											return (
												<React.Fragment>
													<Link
														href="#"
														className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
															(pathname === "/transaction" ||
																pathname.includes("transaction")) &&
															"text-primary font-bold text-xl3"
														}`}
														onClick={(e) => {
															e.preventDefault();
															sidebarExpanded
																? handleClick()
																: setSidebarExpanded(true);
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentColor"
															className="w-6 h-6"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
															/>
														</svg>
														Transactions
														<svg
															className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
																open && "rotate-180"
															}`}
															width="20"
															height="20"
															viewBox="0 0 20 20"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
																fill=""
															/>
														</svg>
													</Link>
													{/* <!-- Dropdown Menu Start --> */}
													<div
														className={`translate transform overflow-hidden ${
															!open && "hidden"
														}`}
													>
														<ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
															<li>
																<Link
																	href="/transactions/receiving"
																	className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																		pathname === "/transactions/receiving" &&
																		"text-primary"
																	}`}
																>
																	Receiving
																</Link>
															</li>
															<li>
																<Link
																	href="/transactions/issuing"
																	className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																		pathname === "/transactions/issuing" &&
																		"text-primary"
																	}`}
																>
																	Issuing
																</Link>
															</li>
															<li>
																<Link
																	href="/transactions/returning"
																	className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																		pathname === "/transactions/returning" &&
																		"text-primary"
																	}`}
																>
																	Returning
																</Link>
															</li>
														</ul>
													</div>
													{/* <!-- Dropdown Menu End --> */}
												</React.Fragment>
											);
										}}
									</SidebarLinkGroup>

									<SidebarLinkGroup
										activeCondition={
											pathname === "/reports" || pathname.includes("reports")
										}
									>
										{(handleClick, open) => {
											return (
												<React.Fragment>
													<Link
														href="#"
														className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
															(pathname === "/reports" ||
																pathname.includes("reports")) &&
															"text-primary font-bold text-xl3"
														}`}
														onClick={(e) => {
															e.preventDefault();
															sidebarExpanded
																? handleClick()
																: setSidebarExpanded(true);
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentColor"
															className="w-6 h-6"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
															/>
														</svg>
														Reports
														<svg
															className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
																open && "rotate-180"
															}`}
															width="20"
															height="20"
															viewBox="0 0 20 20"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
																fill=""
															/>
														</svg>
													</Link>
													{/* <!-- Dropdown Menu Start --> */}
													<div
														className={`translate transform overflow-hidden ${
															!open && "hidden"
														}`}
													>
														<ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
															<li>
																<Link
																	href="/reports/receiving"
																	className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																		pathname.startsWith("/reports/receiving") &&
																		"text-primary"
																	}`}
																>
																	Receiving
																</Link>
															</li>
															<li>
																<Link
																	href="/reports/issuing"
																	className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																		pathname.startsWith("/reports/issuing") &&
																		"text-primary"
																	}`}
																>
																	Issuing
																</Link>
															</li>
															<li>
																<Link
																	href="/reports/returning"
																	className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																		pathname.startsWith("/reports/returning") &&
																		"text-primary"
																	}`}
																>
																	Returning
																</Link>
															</li>
														</ul>
													</div>
													{/* <!-- Dropdown Menu End --> */}
												</React.Fragment>
											);
										}}
									</SidebarLinkGroup>
								</>
							)}
						</ul>
					</div>

					{/* <!-- Others Group --> */}
				</nav>
				{/* <!-- Sidebar Menu --> */}
			</div>
		</aside>
	);
};
export default Sidebar;

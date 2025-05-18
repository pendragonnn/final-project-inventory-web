"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getForcastTransaction } from "@/modules/fetch/index";
import { Package, TrendingUp, AlertCircle } from "lucide-react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
	ssr: false,
});
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Brand from "@/data/brand/index";
import Item from "@/data/item/index";

const ForecastSection = () => {
	const [selectedItemName, setSelectedItemName] = useState("");
	const [selectedItemType, setSelectedItemType] = useState("");
	const [selectedItemSize, setSelectedItemSize] = useState("");
	const [selectedItem, setSelectedItem] = useState(null);
	const [brands, setBrands] = useState([]);
	const [items, setItems] = useState([]);
	const [itemId, setItemId] = useState("");
	const [period, setPeriod] = useState(null);
	const [tempItemId, setTempItemId] = useState("");
	const [tempPeriod, setTempPeriod] = useState("");
	const [forecastData, setForecastData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [errorPeriod, setErrorPeriod] = useState(null);
	const [errorItemBrand, setErrorItemBrand] = useState(null);
	const [errorItemType, setErrorItemType] = useState(null);
	const [errorItemSize, setErrorItemSize] = useState(null);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [forecastError, setForecastError] = useState(null);
	const [forecastResult, setForecastResult] = useState(null);

	const confidenceValue = parseFloat(forecastData?.forecast.confidence) || 0;
	const progressBarColor = isDarkMode ? "#4A90E2" : "#3C50E0";
	const trailColor = isDarkMode ? "#2D3748" : "#E5E7EB";
	const textColor = isDarkMode ? "#FFFFFF" : "#3C50E0";

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let hasError = false;

			// Validasi Form
			if (!tempPeriod) {
				setErrorPeriod("Please select a period");
				hasError = true;
			} else {
				setErrorPeriod(null);
			}

			if (!selectedItemName) {
				setErrorItemBrand("Please select a brand");
				hasError = true;
			} else {
				setErrorItemBrand(null);
			}

			if (!selectedItemType) {
				setErrorItemType("Please select an item type");
				hasError = true;
			} else {
				setErrorItemType(null);
			}

			if (!selectedItemSize) {
				setErrorItemSize("Please select an item size");
				hasError = true;
			} else {
				setErrorItemSize(null);
			}

			if (hasError) return;

			// Set item ID dan period jika semua valid
			setTempItemId(selectedItem?.id || "");
			setItemId(selectedItem?.id || "");
			setPeriod(parseInt(tempPeriod));

			// Panggil API Forecasting
			try {
				const data = await getForcastTransaction(
					selectedItem?.id,
					parseInt(tempPeriod)
				);

				if (data?.data?.forecast?.message?.error) {
					throw new Error(data.data.forecast.message.error);
				}

				// Simpan hasil forecasting ke state
				setForecastResult(data.data.forecast);
				setForecastError(null); // Reset error jika sukses
			} catch (error) {
				console.error("Error fetching forecast:", error.message);
				setForecastError(error.message); // Simpan pesan error untuk ditampilkan di UI
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setForecastError(error.message);
		}
	};

	useEffect(() => {
		const fetchForecast = async () => {
			setLoading(true);
			try {
				const data = await getForcastTransaction(itemId, period);
				setForecastData(data.data);
			} catch (error) {
				console.error("Failed to fetch forecast:", error);
			} finally {
				setLoading(false);
			}
		};

		if (itemId) {
			fetchForecast();
		}
	}, [itemId, period]);

	const chartData = forecastData?.forecast.predictedSalesDaily?.map(
		(value, index) => ({
			x: `Day ${index + 1}`,
			y: parseFloat(value),
		})
	);

	useEffect(() => {
		const checkDarkMode = () => {
			setIsDarkMode(document.body.classList.contains("dark"));
		};

		checkDarkMode();

		const observer = new MutationObserver(checkDarkMode);
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	const options = {
		chart: {
			height: 350,
			type: "area",
			toolbar: {
				show: false,
			},
			dropShadow: {
				enabled: true,
				color: "#623CEA14",
				top: 10,
				blur: 4,
				left: 0,
				opacity: 0.1,
			},
		},
		colors: ["#3C50E0"],
		stroke: {
			width: [1],
			curve: "smooth",
		},
		xaxis: {
			type: "category",
			categories:
				chartData && chartData.length > 0
					? chartData.map((item) => item.x)
					: [],
			labels: {
				style: {
					fontSize: "10px",
				},
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			title: {
				text: "Outgoing Stock",
				style: {
					fontSize: "10px",
				},
			},
		},
		grid: {
			xaxis: {
				lines: {
					show: true,
				},
			},
			yaxis: {
				lines: {
					show: true,
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		markers: {
			size: 4,
			colors: "#fff",
			strokeColors: "#3C50E0",
			strokeWidth: 3,
			hover: {
				sizeOffset: 5,
			},
		},
	};

	const series =
		chartData && chartData.length > 0
			? [
					{
						name: "Product Movement",
						data: chartData.map((item) => item.y),
					},
			  ]
			: [];

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await Brand.getBrand();
				setBrands(response.data.data);
			} catch (error) {
				console.error("Error fetching brands:", error);
			}
		};
		const fetchItems = async () => {
			try {
				const response = await Item.getItem();
				setItems(response.data.data);
			} catch (error) {
				console.error("Error fetching items:", error);
			}
		};
		fetchBrands();
		fetchItems();
	}, []);

	const filteredItemTypes = items
		.filter((item) => item.Brand.name === selectedItemName)
		.map((item) => item.Brand.type);

	const filteredSizes = items
		.filter(
			(item) =>
				item.Brand.name === selectedItemName &&
				item.Brand.type === selectedItemType
		)
		.map((item) => item.size);

	const handleItemNameChange = (e) => {
		setSelectedItemName(e.target.value);
		setSelectedItemType("");
		setSelectedItemSize("");
		setSelectedItem(null);
		setErrorItemBrand(null);
		setForecastError(null);
	};

	const handleItemTypeChange = (e) => {
		setSelectedItemType(e.target.value);
		setSelectedItemSize("");
		setSelectedItem(null);
		setErrorItemType(null);
		setForecastError(null);
	};

	const handleItemSizeChange = (e) => {
		const size = e.target.value;
		setSelectedItemSize(size);

		const selected = items.find(
			(item) =>
				item.Brand.name === selectedItemName &&
				item.Brand.type === selectedItemType &&
				String(item.size) === String(size)
		);
		setSelectedItem(selected || null);
		setErrorItemSize(null);
		setForecastError(null);
	};

	const uniqueBrands = [...new Set(items.map((item) => item.Brand.name))];

	return (
		<div className="space-y-6 dark:bg-boxdark dark:text-white">
			{/* Input Form */}
			<div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg">
				<h2 className="text-lg font-semibold mb-6">Forecast Settings</h2>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col md:flex-row gap-4 items-center"
				>
					{/* Item Name */}
					<div className="flex-1">
						<label className="block text-sm font-medium text-black dark:text-white mb-1">
							Item Brand
						</label>
						<select
							className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
							onChange={handleItemNameChange}
							value={selectedItemName}
						>
							<option value="" disabled>
								Select Item
							</option>
							{uniqueBrands.map((brand) => (
								<option key={brand} value={brand}>
									{brand}
								</option>
							))}
						</select>
						<p className="text-sm text-danger mt-2 ms-1">{errorItemBrand}</p>
					</div>

					{/* Item Type */}
					{selectedItemName && (
						<div className="flex-1">
							<label className="block text-sm font-medium text-black dark:text-white mb-1">
								Item Type
							</label>
							<select
								className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
								onChange={handleItemTypeChange}
								value={selectedItemType}
							>
								<option value="" disabled>
									Select Type
								</option>
								{[...new Set(filteredItemTypes)].map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
							<p className="text-sm text-danger mt-2 ms-1">{errorItemType}</p>
						</div>
					)}

					{/* Item Size */}
					{selectedItemType && (
						<div className="flex-1">
							<label className="block text-sm font-medium text-black dark:text-white mb-1">
								Item Size
							</label>
							<select
								className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
								onChange={handleItemSizeChange}
								value={selectedItemSize}
							>
								<option value="" disabled>
									Select Size
								</option>
								{filteredSizes.map((size, idx) => (
									<option key={idx} value={size}>
										{size}
									</option>
								))}
							</select>
							<p className="text-sm text-danger mt-2 ms-1">{errorItemSize}</p>
						</div>
					)}

					{/* Hidden Input for Item ID */}
					{selectedItem && (
						<input
							type="hidden"
							value={selectedItem.id}
							onChange={(e) => setTempItemId(e.target.value)}
						/>
					)}

					<div className="flex-1">
						<label className="block text-sm font-medium text-black dark:text-white mb-1">
							Forecast Period
						</label>
						<select
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
							value={tempPeriod}
							onChange={(e) => {
								setTempPeriod(e.target.value);
								setErrorPeriod(null);
								setForecastError(null);
							}}
						>
							<option value="" disabled>
								Select Period
							</option>
							<option value={"7"}>7 Days</option>
							<option value={"14"}>14 Days</option>
							<option value={"30"}>30 Days</option>
							<option value={"60"}>60 Days</option>
							<option value={"90"}>90 Days</option>
						</select>

						<p className="text-sm text-danger mt-2 ms-1">{errorPeriod}</p>
					</div>
					<div className="flex items-end">
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 mt-4 bg-primary text-white rounded-md hover:bg-navy focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-navy"
						>
							{loading ? "Loading..." : "Update Forecast"}
						</button>
					</div>
				</form>
				{forecastError && (
					<p className="text-warning text-center mt-2">{forecastError}</p>
				)}
			</div>

			{/* Metrics Cards */}

			{/* Chart */}
			<div className="bg-white dark:bg-boxdark p-6 rounded-lg ">
				<h2 className="text-lg font-semibold mb-4 ms-4">
					Daily Stock Movement
				</h2>

				<div className="flex my-auto items-center w-full flex-wrap gap-3 sm:gap-2">
					<div className="flex w-39">
						<span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center ">
							<TrendingUp className="h-4 w-4 text-primary" />
						</span>
						<div className="w-full">
							<p className="font-semibold text-primary">Predict Outgoing</p>
							<p className="text-sm font-medium">
								{forecastData?.forecast.predictedSales || "0"}
							</p>
							<p className="text-xs text-gray-500">
								units over next {period} days
							</p>
						</div>
					</div>
					<div className="flex w-39">
						<span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center ">
							<Package className="h-4 w-4 text-secondary" />
						</span>
						<div className="w-full">
							<p className="font-semibold text-secondary">Current Stock</p>
							<p className="text-sm font-medium">
								{forecastData?.forecast.currentStock || "0"}
							</p>
							<p className="text-xs text-gray-500">units available</p>
						</div>
					</div>
					<div className="flex w-39">
						<span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center">
							<AlertCircle className="h-4 w-4 text-meta-6" />
						</span>
						<div className="w-full">
							<p className="font-semibold text-meta-6">Stock Needed</p>
							<p className="text-sm font-medium">
								{forecastData?.forecast.stockNeeded || "0"}
							</p>
							<p className="text-xs text-gray-500">additional units required</p>
						</div>
					</div>

					<div>
						<div className="flex w-39 p-2">
							<div className="w-full  justify-start">
								<div className="relative flex justify-center ">
									<div className="w-15">
										<CircularProgressbar
											value={confidenceValue}
											text={`${confidenceValue.toFixed(2)}%`}
											strokeWidth={12}
											styles={{
												path: {
													stroke: progressBarColor,
													strokeLinecap: "round",
												},
												trail: {
													stroke: trailColor,
												},
												text: {
													fill: textColor,
													fontSize: "15px",
													fontWeight: "bold",
												},
											}}
										/>
									</div>
								</div>
								<p className="text-xs px-2 text-center text-gray-500 dark:text-gray-400 mt-1">
									forecast accuracy
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="h-[350px]">
					<ReactApexChart
						options={options}
						series={series}
						type="area"
						width="100%"
						height="100%"
					/>
					<div className="text-sm mt-3 text-gray-700 dark:text-gray-300">
						<p>Error Margin: ±{forecastData?.forecast?.errorMargin} units</p>
						<p>
							Prediction Interval: ±{forecastData?.forecast?.predictionInterval}{" "}
							units
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForecastSection;

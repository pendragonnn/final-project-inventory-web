"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getTransactionTrends } from "@/modules/fetch/index";
import {
	AlertCircle,
	ArrowLeftRight,
	LogIn,
	LogOut,
	Package,
	Receipt,
	TrendingUp,
} from "lucide-react";
import Loader from "@/components/common/Loader";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
	ssr: false,
});

const TransactionTrendsChart = () => {
	const [chartData, setChartData] = useState([]);
	const [period, setPeriod] = useState(30); // Default period 30 hari
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [totalIssuing, setTotalIssuing] = useState(0);
	const [totalReceiving, setTotalReceiving] = useState(0);
	const [totalReturning, setTotalReturning] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await getTransactionTrends(period);

				let issuingSum = 0;
				let receivingSum = 0;
				let returningSum = 0;

				// Format data untuk ApexCharts
				const groupedData = data.reduce((acc, transaction) => {
					const date = transaction.date;

					// Konversi ke number agar tidak error di ApexCharts
					const issuing = Number(transaction.Issuing) || 0;
					const receiving = Number(transaction.Receiving) || 0;
					const returning = Number(transaction.Returning) || 0;

					// Tambahkan ke total transaksi
					issuingSum += issuing;
					receivingSum += receiving;
					returningSum += returning;

					if (!acc[date]) {
						acc[date] = { date, Issuing: 0, Receiving: 0, Returning: 0 };
					}

					acc[date].Issuing = issuing;
					acc[date].Receiving = receiving;
					acc[date].Returning = returning;

					return acc;
				}, {});

				setChartData(Object.values(groupedData));

				// Simpan total transaksi ke state
				setTotalIssuing(issuingSum);
				setTotalReceiving(receivingSum);
				setTotalReturning(returningSum);

				setLoading(false);
			} catch (err) {
				console.error("Failed to fetch transaction trends:", err);
				setError("Failed to fetch transaction trends");
				setLoading(false);
			}
		};

		fetchData();
	}, [period]);

	const options = {
		chart: { type: "area", height: 350, toolbar: { show: false } },
		colors: ["#FF5733", "#3C50E0", "#28A745"],
		stroke: { curve: "smooth", width: 2 },
		xaxis: {
			type: "category",
			categories: chartData.map((item) => item.date),
			labels: { style: { fontSize: "10px" } },
		},
		yaxis: {
			title: { text: "Total Transactions", style: { fontSize: "12px" } },
		},
		grid: { yaxis: { lines: { show: true } } },
		dataLabels: { enabled: false },
		markers: { size: 4, strokeColors: "#fff", strokeWidth: 3 },
	};

	const series = [
		{ name: "Issuing", data: chartData.map((item) => item.Issuing || 0) },
		{ name: "Receiving", data: chartData.map((item) => item.Receiving || 0) },
		{ name: "Returning", data: chartData.map((item) => item.Returning || 0) },
	];

	return (
		<div className="w-full p-4 bg-white dark:bg-boxdark  rounded-lg">
			<div className="flex justify-between items-center mb-3">
				<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-2">
					Transaction Trends (Last {period} Days)
				</h3>
				{/* Dropdown untuk memilih periode */}
				<select
					className="rounded-md border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
					value={period}
					onChange={(e) => setPeriod(Number(e.target.value))}
				>
					<option value={7}>Last 7 Days</option>
					<option value={14}>Last 14 Days</option>
					<option value={30}>Last 30 Days</option>
					<option value={60}>Last 60 Days</option>
					<option value={90}>Last 90 Days</option>
				</select>
			</div>

			<div className="flex my-auto items-center w-full flex-wrap gap-3 sm:gap-2 p-4 mb-5">
				<div className="flex w-39">
					<span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center ">
						<LogOut className="h-4 w-4 text-meta-7" />
					</span>
					<div className="w-full">
						<p className="font-semibold text-meta-7">Total Issuing</p>
						<p className="text-sm font-medium">{totalIssuing}</p>
					</div>
				</div>
				<div className="flex w-39">
					<span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center ">
						<LogIn className="h-4 w-4 text-primary" />
					</span>
					<div className="w-full">
						<p className="font-semibold text-primary">Total Receiving</p>
						<p className="text-sm font-medium">{totalReceiving}</p>
					</div>
				</div>
				<div className="flex w-39">
					<span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center">
						<ArrowLeftRight className="h-4 w-4 text-meta-3" />
					</span>
					<div className="w-full">
						<p className="font-semibold text-meta-3">Total Returning</p>
						<p className="text-sm font-medium">{totalReturning}</p>
					</div>
				</div>
			</div>

			{loading ? (
				<Loader />
			) : error ? (
				<p className="text-red-500">{error}</p>
			) : (
				<ReactApexChart
					options={options}
					series={series}
					type="area"
					width="100%"
					height="400px"
				/>
			)}
		</div>
	);
};

export default TransactionTrendsChart;

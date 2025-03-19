import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { getMostCategoryIssued } from "@/modules/fetch/index";
import ReactApexChart from "react-apexcharts"; // Panggil dari file lain

const TopItemCategories = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState(30); // Default periode 30 hari

	// Fetch data dari backend
	useEffect(() => {
		const fetchData = async () => {
			const res = await getMostCategoryIssued(period);
			setData(res.data);
			setLoading(false);
		};

		fetchData();
	}, [period]);

	// Jika data masih loading, tampilkan loading spinner
	if (loading) {
		return <Loader />;
	}

	// Format data untuk chart
	const chartData = {
		series: data.map((item) => parseInt(item.total_quantity)), // Konversi total_quantity ke number
		options: {
			chart: {
				type: "pie",
			},
			labels: data.map((item) => item.category_name), // Label berdasarkan nama kategori
			legend: {
				position: "bottom", // Posisi legend
			},
			tooltip: {
				y: {
					formatter: (value) => `${value} items sold`, // Format tooltip
				},
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200, // Ukuran chart untuk layar kecil
						},
						legend: {
							position: "bottom", // Posisi legend untuk layar kecil
						},
					},
				},
			],
		},
	};

	return (
		<div className="w-full p-4 bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-3">
				<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-2">
					Top Item Categories (Last {period} Days)
				</h3>
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

			{/* Pie Chart */}
			<div className="flex justify-center">
				<ReactApexChart
					options={chartData.options}
					series={chartData.series}
					type="pie"
					width="380"
				/>
			</div>
		</div>
	);
};

export default TopItemCategories;

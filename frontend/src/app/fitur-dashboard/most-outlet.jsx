import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { getMostOutletTransaction } from "@/modules/fetch/index";
import ReactApexChart from "react-apexcharts"; // Panggil dari file lain

const MostOutletTransactions = () => {
	const [data, setData] = useState([]);
	const [size, setSize] = useState(10);
	const [period, setPeriod] = useState(30);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const res = await getMostOutletTransaction(size, period);
			setData(res.data);
			setLoading(false);
		};

		fetchData();
	}, [size, period]);

	if (loading) {
		return <Loader />;
	}

	const chartData = {
		series: [
			{
				data: data.map((item) => item.total),
			},
		],
		options: {
			chart: { type: "bar" },
			plotOptions: {
				bar: {
					horizontal: true,
				},
			},
			xaxis: {
				categories: data.map((item) => item.Outlet?.name),
			},
			yaxis: {
				title: {
					text: "Total Transactions",
				},
			},
			tooltip: {
				y: {
					formatter: (val) => `${val} transactions`,
				},
			},
		},
	};

	return (
		<div className="w-full p-4 bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-3">
				<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 p-2">
					Most Outlet Transactions (Last {period} Days)
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

			{/* Bar Chart */}
			<div className="w-full overflow-x-auto">
				<ReactApexChart
					options={chartData.options}
					series={chartData.series}
					type="bar"
					height={350}
				/>
			</div>
		</div>
	);
};

export default MostOutletTransactions;

import { useState, useEffect } from "react";
import ModalDeleteTransaction from "../Modal/Transaction/ModalDeleteTransaction";

const FormAddTransactionReceiving = ({
	handleSubmit,
	userId,
	userName,
	dataSupplier,
	itemTemporary,
	handleDelete,
}) => {
	const [selectedSupplier, setSelectedSupplier] = useState("");
	const [transactionDate, setTransactionDate] = useState("");

	const isButtonDisabled =
		!itemTemporary.length || !selectedSupplier || !transactionDate;

	const formatIDR = (price) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	console.log("Item Temporary:", itemTemporary);

	return (
		<form
			onSubmit={handleSubmit}
			className="flex-1 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
		>
			<div className="p-6.5 grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Handle By */}
				<div>
					<label className="mb-2.5 block text-black dark:text-white">
						Handle By
					</label>
					<input
						type="text"
						name="user_id"
						value={userId}
						hidden
						className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-graydark"
					/>
					<input
						type="text"
						value={userName}
						readOnly
						className="w-full text-body rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-graydark"
					/>
				</div>

				{/* Information */}
				<div>
					<label className="mb-2.5 block text-black dark:text-white">
						Information
					</label>
					<input
						type="text"
						name="information"
						value="Receiving"
						readOnly
						className="w-full text-body rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
					/>
				</div>
			</div>

			<div className="p-6.5 grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Supplier */}
				<div>
					<label className="mb-2.5 block text-black dark:text-white">
						Supplier
					</label>
					<select
						className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
						name="supplier_id"
						value={selectedSupplier}
						onChange={(e) => setSelectedSupplier(e.target.value)}
					>
						<option value="" disabled>
							Select Supplier
						</option>
						{dataSupplier.map((value) => (
							<option key={value.id} value={value.id}>
								{value.name}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="p-6.5 flex flex-col gap-6">
				{/* Items Table */}
				<div>
					<label className="mb-2.5 block text-black dark:text-white">
						Item
					</label>
					<table className="w-full">
						<thead>
							<tr className="bg-gray-2 text-center dark:bg-meta-4">
								<th className="py-4 px-4 font-medium text-black dark:text-white">
									Item
								</th>
								<th className="py-4 px-4 font-medium text-black dark:text-white">
									Size
								</th>
								<th className="py-4 px-4 font-medium text-black dark:text-white">
									Quantity
								</th>
								<th className="py-4 px-4 font-medium text-black dark:text-white">
									Price per item
								</th>
								<th className="py-4 px-4 font-medium text-black dark:text-white">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{itemTemporary.map((value, i) => (
								<tr key={i}>
									<td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
										<input
											type="text"
											className="w-full rounded border-[1.5px] border-none bg-transparent py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-boxdark dark:disabled:bg-graydark text-center"
											readOnly
											value={`${value?.item_name} ${value?.item_type}`}
										/>
									</td>
									<td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
										<input
											type="text"
											className="w-full rounded border-[1.5px] border-none bg-transparent py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-boxdark dark:disabled:bg-graydark text-center"
											readOnly
											value={value.size}
										/>
									</td>
									<td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
										<input
											type="text"
											className="w-full rounded border-[1.5px] border-none bg-transparent py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-boxdark dark:disabled:bg-graydark text-center"
											readOnly
											value={value.quantity}
										/>
									</td>
									<td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
										<input
											type="text"
											className="w-full rounded border-[1.5px] border-none bg-transparent py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-boxdark dark:disabled:bg-graydark text-center"
											readOnly
											value={formatIDR(value.price_item)}
										/>
									</td>
									<td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
										<ModalDeleteTransaction
											open={`open-${i}`}
											value={value}
											handleDelete={() => handleDelete(i)}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Date Picker */}
				<div className=" rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
					<div className="border-b border-stroke py-4 dark:border-strokedark">
						<h3 className="font-medium text-black dark:text-white">Date</h3>
					</div>
					<div className="flex flex-col gap-5.5 p-6.5">
						<div>
							<label className="mb-3 block text-black dark:text-white">
								Date picker
							</label>
							<div className="relative">
								<input
									value={transactionDate}
									onChange={(e) => setTransactionDate(e.target.value)}
									type="date"
									required
									name="transaction_date"
									className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className={`flex justify-center rounded p-3 font-medium transition ${
						isButtonDisabled
							? "bg-primary/50 text-gray cursor-not-allowed"
							: "bg-primary text-white cursor-pointer"
					}`}
					disabled={isButtonDisabled}
				>
					Add Transaction
				</button>
			</div>
		</form>
	);
};

export default FormAddTransactionReceiving;

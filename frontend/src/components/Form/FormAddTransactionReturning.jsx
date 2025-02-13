import ModalDeleteTransaction from "../Modal/Transaction/ModalDeleteTransaction";
import { useState } from "react";

const FormAddTransactionReturning = ({
	handleSubmit,
	userId,
	userName,
	dataSupplier,
	dataOutlet,
	itemTemporary,
	handleDelete,
	dataItem,
}) => {
	const [returnType, setReturnType] = useState("");
	const [selectedOutlet, setSelectedOutlet] = useState("");
	const [selectedSupplier, setSelectedSupplier] = useState("");
	const [transactionDate, setTransactionDate] = useState("");

	const hasInvalidQuantity =
		returnType === "supplier" &&
		itemTemporary.some((value) => {
			const itemStock =
				dataItem.find((item) => item.id === value.item_id)?.stock || 0;
			return value.quantity > itemStock;
		});

	const isButtonDisabled =
		!itemTemporary.length ||
		hasInvalidQuantity ||
		!returnType ||
		(returnType === "outlet" && !selectedOutlet) ||
		(returnType === "supplier" && !selectedSupplier) ||
		!transactionDate;

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
						value="Returning"
						readOnly
						className="w-full text-body rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
					/>
				</div>
			</div>

			<div className="p-6.5 grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Other input fields */}
				<div>
					<label className="mb-2.5 block text-black dark:text-white">
						Select Return Type
					</label>
					<select
						className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
						value={returnType}
						required
						onChange={(e) => setReturnType(e.target.value)}
					>
						<option value="" disabled>
							Select
						</option>
						<option value="outlet">Return to Outlet</option>
						<option value="supplier">Return to Supplier</option>
					</select>
				</div>

				{/* Dynamic dropdown for Outlet */}
				{returnType === "outlet" && (
					<div>
						<label className="mb-2.5 block text-black dark:text-white">
							Select Outlet
						</label>
						<select
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
							name="outlet_id"
							required
							value={selectedOutlet}
							onChange={(e) => setSelectedOutlet(e.target.value)}
						>
							<option value="" disabled>
								Select Outlet
							</option>
							{dataOutlet.map((outlet) => (
								<option key={outlet.id} value={outlet.id}>
									{outlet.name}
								</option>
							))}
						</select>
					</div>
				)}

				{/* Dynamic dropdown for Supplier */}
				{returnType === "supplier" && (
					<div>
						<label className="mb-2.5 block text-black dark:text-white">
							Select Supplier
						</label>
						<select
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
							name="supplier_id"
							required
							value={selectedSupplier}
							onChange={(e) => setSelectedSupplier(e.target.value)}
						>
							<option value="" disabled>
								Select Supplier
							</option>
							{dataSupplier.map((supplier) => (
								<option key={supplier.id} value={supplier.id}>
									{supplier.name}
								</option>
							))}
						</select>
					</div>
				)}
			</div>

			<div className="p-6.5 flex flex-col gap-6">
				<label className="block text-black dark:text-white">Item</label>
				<table className="w-full table-auto border-collapse">
					<thead>
						<tr className="bg-gray-2 text-center dark:bg-meta-4">
							<th className="py-4 px-5 font-medium text-black dark:text-white">
								Item
							</th>
							<th className="py-4 px-5 font-medium text-black dark:text-white">
								Reason
							</th>
							<th className="py-4 px-5 font-medium text-black dark:text-white">
								Quantity
							</th>
							<th className="py-4 px-5 font-medium text-black dark:text-white">
								Price per item
							</th>
							<th className="py-4 px-5 font-medium text-black dark:text-white">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{itemTemporary.map((value, i) => {
							const itemStock =
								dataItem.find((item) => item.id === value.item_id)?.stock || 0;

							return (
								<tr key={i} className="text-center">
									<td className="border-b border-[#eee] py-4 px-5 dark:border-strokedark">
										<input
											type="text"
											className="w-full rounded border-[1.5px] border-none bg-transparent py-2 font-medium outline-none transition focus:border-primary dark:bg-boxdark dark:disabled:bg-graydark text-center"
											required
											readOnly
											name="item_id"
											value={`${value.item_name} ${value.item_type}`}
										/>
									</td>
									<td className="border-b border-[#eee] py-4 px-5 dark:border-strokedark">
										<input
											type="text"
											className="w-full rounded border-[1.5px] border-none bg-transparent py-2 font-medium outline-none transition focus:border-primary dark:bg-boxdark dark:disabled:bg-graydark text-center text-ellipsis"
											required
											readOnly
											name="reason"
											value={value.reason}
										/>
									</td>
									<td className="border-b border-[#eee] py-4 px-5 dark:border-strokedark">
										<input
											type="text"
											className="w-full rounded border-[1.5px] border-none bg-transparent py-2 font-medium outline-none transition focus:border-primary dark:bg-boxdark dark:disabled:bg-graydark text-center"
											required
											readOnly
											name="quantity"
											value={value.quantity}
										/>
										{returnType === "supplier" &&
											value.quantity > itemStock && (
												<p className="text-danger text-xs">
													{`Not enough stock! Available stock: ${itemStock}`}{" "}
												</p>
											)}
									</td>
									<td className="border-b border-[#eee] py-4 px-5 dark:border-strokedark">
										<input
											type="text"
											className="w-full rounded border-[1.5px] border-none bg-transparent py-2 font-medium outline-none transition focus:border-primary dark:bg-boxdark dark:disabled:bg-graydark text-center"
											required
											readOnly
											name="price"
											value={value.price_item}
										/>
									</td>
									<td className="border-b border-[#eee] py-4 px-5 dark:border-strokedark">
										<div className="flex items-center justify-center gap-2">
											<ModalDeleteTransaction
												open={`open-${i}`}
												value={value}
												handleDelete={() => handleDelete(i)}
											/>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* <!-- Time and date --> */}
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

export default FormAddTransactionReturning;

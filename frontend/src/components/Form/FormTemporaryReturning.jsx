import React, { useState, useEffect } from "react";
import Brand from "@/data/brand/index";
import Item from "@/data/item/index";

const FormTemporaryReturning = ({ handleAdd, dataItem }) => {
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemPrice, setSelectedItemPrice] = useState("");
	const [selectedItemType, setSelectedItemType] = useState("");
	const [quantity, setQuantity] = useState(""); // Menyimpan jumlah input dari user
	const [reason, setReason] = useState(""); // Mengatur state reason
	const [message, setMessage] = useState("");
	const [isOtherReason, setIsOtherReason] = useState(false);
	const [selectedItemName, setSelectedItemName] = useState("");
	const [selectedItemSize, setSelectedItemSize] = useState("");
	const [brands, setBrands] = useState([]);
	const [items, setItems] = useState([]);

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await Brand.getBrand();
				setBrands(response.data.data);
			} catch (error) {
				console.error("Error fetching brands:", error);
			}
		};
		fetchBrands();
	}, []);

	// Fetch item data
	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await Item.getItem();
				setItems(response.data.data);
			} catch (error) {
				console.error("Error fetching items:", error);
			}
		};
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

	const handleItemNameChange = (event) => {
		const itemName = event.target.value;
		setSelectedItemName(itemName);
		resetSelections();
	};

	const handleItemTypeChange = (event) => {
		const itemType = event.target.value;
		setSelectedItemType(itemType);
		resetSelections();
	};

	const handleItemSizeChange = (event) => {
		const size = event.target.value;
		setSelectedItemSize(size);

		const selected = items.find((item) => {
			return (
				item.Brand &&
				item.Brand.name === selectedItemName &&
				item.Brand.type === selectedItemType &&
				String(item.size) === String(size)
			);
		});

		setSelectedItem(selected || null);
	};

	const handleQuantityChange = (event) => {
		setQuantity(event.target.value);
	};

	const handleReasonChange = (event) => {
		const selectedReason = event.target.value;

		if (selectedReason === "Other") {
			setIsOtherReason(true);
			setReason(""); // Kosongkan reason agar input teks dapat diisi
		} else {
			setIsOtherReason(false);
			setReason(selectedReason); // Set reason dari opsi yang dipilih
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!selectedItem || quantity <= 0) {
			setMessage(
				"Please select valid item details and enter a valid quantity."
			);
			return;
		}

		handleAdd({
			item_id: selectedItem.id,
			item_name: selectedItem.Brand.name,
			item_type: selectedItem.Brand.type,
			size: selectedItem.size,
			quantity: parseInt(quantity),
			price_item: selectedItem.price,
			reason: reason,
		});

		resetForm();
	};

	const resetSelections = () => {
		setSelectedItemSize("");
		setSelectedItem(null);
	};

	const resetForm = () => {
		setSelectedItemName("");
		setSelectedItemType("");
		setSelectedItemSize("");
		setSelectedItem(null);
		setReason("");
		setIsOtherReason(false);
		setQuantity("");
		setMessage("");
	};

	const uniqueBrands = [
		...new Set(
			items
				.map((item) => {
					return brands.find((brand) => brand.id === item.brand_id)?.name;
				})
				.filter(Boolean)
		),
	];

	return (
		<form onSubmit={handleSubmit} className="flex-1">
			<div className="p-6.5 mb-4.5 flex flex-col gap-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div>
					<label className="mb-2.5 block text-black dark:text-white">
						Item
					</label>
					<select
						className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
						onChange={handleItemNameChange}
						value={selectedItemName}
						required
					>
						<option value="">Select Item Name</option>
						{uniqueBrands.map((brandName) => (
							<option key={brandName} value={brandName}>
								{brandName}
							</option>
						))}
					</select>
				</div>

				{selectedItemName && (
					<div>
						<label className="mb-2.5 block text-black dark:text-white">
							Item Type
						</label>
						<select
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
							onChange={handleItemTypeChange}
							value={selectedItemType}
							required
						>
							<option value="">Select Item Type</option>
							{[...new Set(filteredItemTypes)].map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>
				)}

				{selectedItemType && (
					<div>
						<label className="mb-2.5 block text-black dark:text-white">
							Item Size
						</label>
						<select
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
							onChange={handleItemSizeChange}
							value={selectedItemSize}
							required
						>
							<option value="">Select Item Size</option>
							{filteredSizes.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
						{selectedItem && (
							<div className="mt-2">
								<p className="text-md text-gray-600 dark:text-gray-400">
									Available stock: {selectedItem.stock}
								</p>
							</div>
						)}
					</div>
				)}

				<div className="">
					<label className="mb-2.5 block text-black dark:text-white">
						Reason
					</label>
					<select
						className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
						name="reason"
						value={isOtherReason ? "Other" : reason}
						onChange={handleReasonChange}
						required
					>
						<option value="">Select a reason</option>
						<option value="Damaged">Damaged</option>
						<option value="Defective">Defective</option>
						<option value="Wrong Item Sent">Wrong Item Sent</option>
						<option value="Incomplete Packaging">Incomplete Packaging</option>
						<option value="Other">Other</option>
					</select>

					{/* Tampilkan input teks jika "Other" dipilih */}
					{isOtherReason && (
						<input
							type="text"
							name="otherReason"
							placeholder="Enter your reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							className="mt-7 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
							required
						/>
					)}
					<p className="text-danger fw-bold">{message}</p>
				</div>

				<div className="">
					<label className="mb-2.5 block text-black dark:text-white">
						Quantity
					</label>
					<input
						type="number"
						name="quantity"
						required
						value={quantity}
						onChange={handleQuantityChange}
						placeholder="Enter your Quantity"
						className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
					/>
					<p className="text-danger fw-bold">{message}</p>
				</div>

				{selectedItem && (
					<div>
						<label className="mb-2.5 block text-black dark:text-white">
							Price per item
						</label>
						<input
							type="text"
							value={selectedItem.price}
							readOnly
							name="price"
							className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
						/>
					</div>
				)}

				<button
					type="submit"
					className={`flex justify-center rounded p-3 font-medium ${
						!selectedItem || !reason || quantity <= 0
							? "bg-primary/50 text-gray cursor-not-allowed"
							: "bg-primary text-white cursor-pointer"
					}`}
				>
					Add Item
				</button>
			</div>
		</form>
	);
};

export default FormTemporaryReturning;

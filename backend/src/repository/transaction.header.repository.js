const models = require("../../models");
const TransactionsHeaders = models.TransactionHeader;
const TransactionDetail = models.TransactionDetail;
const Item = models.Item;
const User = models.User;
const Outlet = models.Outlet;
const Supplier = models.Supplier;
const { Op } = require("sequelize");

const findsTransactionHeader = async (page, size) => {
	const offset = (page - 1) * size;
	const transactionHeadersAll = await TransactionsHeaders.findAll();
	const dataLength = transactionHeadersAll.length;
	const transactionHeaders = await TransactionsHeaders.findAll({
		offset: offset,
		limit: size,
		attributes: {
			exclude: ["outlet_id"], // Exclude the 'outlet_id' field
		},
		include: [
			{
				model: User,
				attributes: ["full_name"],
			},
			{
				model: Outlet,
				attributes: ["name"],
			},
			{
				model: Supplier,
				attributes: ["name"],
			},
		],
		where: {
			supplier_id: {
				[Op.ne]: null, // Memastikan supplier_id tidak sama dengan null
			},
		},
	});
	return { transactionHeaders, dataLength };
};

const findsTransactionHeaderReceiving = async (page, size) => {
	const offset = (page - 1) * size;

	// Menggunakan count untuk menghitung jumlah data berdasarkan kondisi
	const dataLength = await TransactionsHeaders.count({
		where: {
			information: "Receiving",
		},
	});

	const transactionReceiving = await TransactionsHeaders.findAll({
		offset: offset,
		order: [["id", "DESC"]],
		limit: size,
		include: [
			{
				model: User,
				attributes: ["full_name"],
			},
			{
				model: Supplier,
				attributes: ["name"],
			},
		],
		where: {
			information: "Receiving",
		},
	});

	return { transactionReceiving, dataLength };
};

const findsTransactionHeaderIssuing = async (page, size) => {
	const offset = (page - 1) * size;

	// Menggunakan count untuk menghitung jumlah data berdasarkan kondisi
	const dataLength = await TransactionsHeaders.count({
		where: {
			information: "Issuing",
		},
	});

	const transactionIssuing = await TransactionsHeaders.findAll({
		offset: offset,
		limit: size,
		order: [["id", "DESC"]],
		// attributes: {
		// 	exclude: ["supplier_id"],
		// },
		include: [
			{
				model: User,
				attributes: ["full_name"],
			},
			{
				model: Outlet,
				attributes: ["name"],
			},
		],
		where: {
			information: "Issuing",
		},
	});

	return { transactionIssuing, dataLength };
};

const findsTransactionHeaderReturning = async (page, size) => {
	const offset = (page - 1) * size;

	// Menghitung jumlah total data
	const dataLength = await TransactionsHeaders.count({
		where: {
			information: "Returning",
		},
	});
	// Query untuk mengambil data
	const transactionReturning = await TransactionsHeaders.findAll({
		offset: offset,
		limit: size,
		order: [["id", "DESC"]],
		include: [
			{
				model: User,
				attributes: ["full_name"], // Nama user
			},
			{
				model: Outlet,
				attributes: ["id", "name"], // Menampilkan ID dan nama outlet
			},
			{
				model: Supplier,
				attributes: ["id", "name"], // Menampilkan ID dan nama supplier
			},
		],
		where: {
			information: "Returning",
		},
	});

	return { transactionReturning, dataLength };
};

const findTransactionHeaderById = async (id) => {
	const transactionHeader = await TransactionsHeaders.findOne({
		include: [
			{
				model: TransactionDetail,
				include: [
					{
						model: Item,
					},
				],
			},
		],
		where: {
			id,
		},
	});
	return transactionHeader;
};

function generateNewId(existingIds) {
	const maxNumber = existingIds.reduce((max, id) => {
		const currentNumber = parseInt(id.split("-")[1], 10);
		return currentNumber > max ? currentNumber : max;
	}, 0);

	const newNumber = maxNumber + 1;
	const newId = `TH-${String(newNumber).padStart(4, "0")}`;

	return newId;
}

const createTransactionHeader = async (transactionHeaderData) => {
	try {
		const existingIds = await TransactionsHeaders.findAll({
			attributes: ["id"],
		});

		const newId = generateNewId(
			existingIds.map((transactionHeader) => transactionHeader.id)
		);

		const transactionHeader = await TransactionsHeaders.create({
			id: newId,
			user_id: transactionHeaderData.user_id,
			outlet_id: transactionHeaderData.outlet_id,
			supplier_id: transactionHeaderData.supplier_id,
			transaction_date: transactionHeaderData.transaction_date,
			information: transactionHeaderData.information,
		});

		return transactionHeader;
	} catch (error) {
		throw error;
	}
};

function generateDetailNewId(existingIds) {
	const maxNumber = existingIds.reduce((max, id) => {
		const currentNumber = parseInt(id.split("-")[1], 10);
		return currentNumber > max ? currentNumber : max;
	}, 0);

	const newNumber = maxNumber + 1;
	const newId = `TD-${String(newNumber).padStart(4, "0")}`;

	return newId;
}

const createTransactionDetail = async (transactionDetailData, header_id) => {
	try {
		const existingIds = await TransactionDetail.findAll({
			attributes: ["id"],
		});

		const newId = generateDetailNewId(
			existingIds.map((transactionDetail) => transactionDetail.id)
		);

		// Ambil header transaksi
		const transactionHeader = await TransactionsHeaders.findOne({
			where: { id: header_id },
			attributes: ["information", "outlet_id", "supplier_id"],
		});

		if (!transactionHeader) {
			throw new Error("Transaction header not found");
		}

		// Ambil stok item dari tabel Items
		const items = await Item.findOne({
			where: { id: transactionDetailData.item_id },
			attributes: ["stock"],
		});

		if (!items) {
			throw new Error("Item not found");
		}

		const stockBefore = items.stock;
		let stockAfter;

		// Logika perubahan stok untuk retur
		if (transactionHeader.information.toLowerCase() === "returning") {
			if (transactionHeader.outlet_id) {
				// Jika dikirim ke outlet, stok bertambah
				stockAfter = stockBefore + transactionDetailData.quantity;
			} else if (transactionHeader.supplier_id) {
				// Jika dikirim ke supplier, stok berkurang
				stockAfter = stockBefore - transactionDetailData.quantity;

				if (stockAfter < 0) {
					throw new Error("Cannot return more than available stock");
				}
			} else {
				throw new Error(
					"Invalid return transaction: neither outlet_id nor supplier_id is specified"
				);
			}
		} else if (transactionHeader.information.toLowerCase() === "issuing") {
			// Logika untuk issuing
			stockAfter = stockBefore - transactionDetailData.quantity;

			if (stockAfter < 0) {
				throw new Error("Insufficient stock for item");
			}
		} else if (transactionHeader.information.toLowerCase() === "receiving") {
			// Logika untuk receiving
			stockAfter = stockBefore + transactionDetailData.quantity;
		} else {
			throw new Error("Invalid transaction information");
		}

		// Perbarui stok item di tabel Items
		await Item.update(
			{ stock: stockAfter },
			{ where: { id: transactionDetailData.item_id } }
		);

		// Buat detail transaksi dengan alasan (reason) jika ada
		const transactionDetail = await TransactionDetail.create({
			id: newId,
			header_id: header_id,
			item_id: transactionDetailData.item_id,
			quantity: transactionDetailData.quantity,
			price_item: transactionDetailData.price_item,
			stock_before: stockBefore,
			stock_after: stockAfter,
			reason: transactionDetailData.reason, // Alasan retur
		});

		return transactionDetail;
	} catch (error) {
		throw error;
	}
};

const editTransactionHeader = async (id, transactionHeaderData) => {
	const updatedTransactionHeader = await TransactionsHeaders.update(
		{
			user_id: transactionHeaderData.user_id,
			outlet_id: transactionHeaderData.outlet_id,
			supplier_id: transactionHeaderData.supplier_id,
			transaction_date: transactionHeaderData.transaction_date,
			information: transactionHeaderData.information,
		},
		{
			where: {
				id: id,
			},
			returning: true,
		}
	);

	return updatedTransactionHeader;
};

const deleteTransactionHeader = async (id) => {
	const transactionHeader = await TransactionsHeaders.destroy({
		where: {
			id,
		},
	});
	return transactionHeader;
};

const calculateMovingAverage = async (itemId, period = 7) => {
	const today = new Date();
	const pastDate = new Date();
	pastDate.setDate(today.getDate() - period);

	// Ambil data transaksi issuing
	const transactions = await TransactionDetail.findAll({
		include: [
			{
				model: TransactionsHeaders,
				attributes: ["information"],
				where: {
					information: "Issuing",
				},
			},
		],
		where: {
			item_id: itemId,
			createdAt: {
				[Op.between]: [pastDate, today],
			},
		},
		attributes: ["quantity", "createdAt"],
		order: [["createdAt", "ASC"]],
	});

	// Ambil stok saat ini dari tabel Item
	const item = await Item.findOne({
		where: { id: itemId },
		attributes: ["stock"],
	});

	if (!item) {
		return {
			average: null,
			predictedSales: null,
			stockNeeded: null,
			additionalStockNeeded: null,
			message: "Item not found",
		};
	}

	const currentStock = item.stock; // Stok saat ini dari database

	if (transactions.length === 0) {
		return {
			average: null,
			predictedSales: null,
			stockNeeded: null,
			message: "No transaction data available for this item",
		};
	}

	// Hitung rata-rata barang keluar per hari
	const total = transactions.reduce((sum, t) => sum + t.quantity, 0);
	const movingAverage = (total / transactions.length).toFixed(2);

	// Prediksi transaksi issuing dalam periode ke depan
	const predictedSales = (movingAverage * period).toFixed(2);

	// Hitung stok yang perlu disiapkan agar stok tidak habis
	const stockNeeded = Math.max(0, Math.ceil(predictedSales - currentStock));

	return {
		average: movingAverage,
		predictedSales: predictedSales,
		stockNeeded: stockNeeded, // Estimasi total barang keluar dalam periode yang dipilih
		currentStock: currentStock,
		message: "Forecast based on available data",
	};
};

module.exports = {
	findsTransactionHeader,
	findTransactionHeaderById,
	findsTransactionHeaderIssuing,
	findsTransactionHeaderReceiving,
	findsTransactionHeaderReturning,
	createTransactionHeader,
	editTransactionHeader,
	deleteTransactionHeader,
	createTransactionDetail,
	calculateMovingAverage,
};

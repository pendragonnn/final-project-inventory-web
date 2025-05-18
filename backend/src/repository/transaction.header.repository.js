const models = require("../../models");
const TransactionsHeaders = models.TransactionHeader;
const TransactionDetail = models.TransactionDetail;
const Item = models.Item;
const User = models.User;
const Brand = models.Brand;
const Outlet = models.Outlet;
const Category = models.Category;
const Supplier = models.Supplier;
const { Op, Sequelize, where } = require("sequelize");
const axios = require("axios");

const findsTransactionHeader = async (page, size) => {
	const offset = (page - 1) * size;
	const transactionHeadersAll = await TransactionsHeaders.findAll();
	const dataLength = transactionHeadersAll.length;
	const transactionHeaders = await TransactionsHeaders.findAll({
		offset: offset,
		limit: size,
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
				model: TransactionDetail,
				attributes: ["item_id", "quantity"],
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

const findMostIssuedItems = async (size) => {
	const items = await TransactionDetail.findAll({
		attributes: [
			"item_id",
			[Sequelize.fn("SUM", Sequelize.col("quantity")), "total_issued"],
		],
		include: [
			{
				model: Item,
				attributes: ["size"], // Ambil stok dari Item
				include: [
					{
						model: Brand,
						attributes: ["name", "type", "image_url"], // Nama ada di Brand
					},
				],
			},
			{
				model: TransactionsHeaders,
				attributes: [],
				where: { information: "Issuing" }, // Hanya transaksi Issuing
			},
		],
		group: ["item_id", "Item.id", "Item->Brand.id"],
		order: [[Sequelize.literal("total_issued"), "DESC"]],
		limit: size,
	});

	return items;
};

const findTransactionTrends = async (period = 30) => {
	const transactions = await TransactionsHeaders.findAll({
		attributes: [
			[Sequelize.fn("DATE", Sequelize.col("transaction_date")), "date"],
			"information",
			[Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
		],
		where: {
			transaction_date: {
				[Op.gte]: Sequelize.literal(`CURRENT_DATE - INTERVAL '${period} DAY'`),
			},
		},
		group: ["date", "information"],
		order: [["date", "ASC"]],
		raw: true, // Supaya hasilnya berupa array biasa, bukan instance Sequelize
	});

	// Proses data agar lebih rapi
	const formattedData = {};
	transactions.forEach(({ date, information, total }) => {
		if (!formattedData[date]) {
			formattedData[date] = { date, Receiving: 0, Issuing: 0, Returning: 0 };
		}
		formattedData[date][information] = total;
	});

	return Object.values(formattedData);
};

const mostTransactionsOutletCount = async (size, period = 30) => {
	const outlets = await TransactionsHeaders.findAll({
		attributes: [
			"outlet_id",
			[Sequelize.fn("COUNT", Sequelize.col("TransactionHeader.id")), "total"],
		],
		where: {
			information: "Issuing",
			transaction_date: {
				[Op.gte]: Sequelize.literal(`CURRENT_DATE - INTERVAL '${period} DAY'`),
			},
		},
		include: [
			{
				model: Outlet,
				attributes: ["name", "address", "phone"],
			},
		],
		group: ["TransactionHeader.outlet_id", "Outlet.id"],
		order: [[Sequelize.literal("total"), "DESC"]],
		limit: size,
		raw: true,
		nest: true,
	});

	return outlets;
};

const getTopItemCategories = async (period) => {
	try {
		// Hitung batasan tanggal berdasarkan periode
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - period);

		const data = await TransactionDetail.findAll({
			attributes: [
				[Sequelize.col("Item.Brand.category_id"), "category_id"], // Ambil category_id dari Brand
				[Sequelize.fn("SUM", Sequelize.col("quantity")), "total_quantity"], // Total barang yang terjual
			],
			include: [
				{
					model: Item,
					attributes: [], // Tidak perlu ambil item name, karena fokus ke kategori
					include: {
						model: Brand,
						attributes: [], // Tidak perlu ambil brand name, hanya category_id
						include: {
							model: Category,
							attributes: ["name"], // Hanya ambil nama kategori
						},
					},
				},
				{
					model: TransactionsHeaders,
					attributes: [], // Tidak perlu ambil tanggalnya, hanya buat filter
					where: {
						transaction_date: { [Op.gte]: startDate },
					},
				},
			],
			group: [
				"Item.Brand.category_id",
				"Item.Brand.Category.id", // Tambahkan id ke GROUP BY
				"Item.Brand.Category.name", // Group berdasarkan name
			],
			order: [[Sequelize.literal("total_quantity"), "DESC"]],
			limit: 5, // Ambil 5 kategori terlaris
			raw: true,
			nest: true,
		});

		// Format ulang respons untuk menghilangkan id
		const formattedData = data.map((item) => ({
			category_id: item.category_id,
			total_quantity: item.total_quantity,
			category_name: item.Item.Brand.Category.name,
		}));

		return formattedData;
	} catch (error) {
		console.error("Error fetching top item categories:", error);
		throw error;
	}
};

const featureMachineLearning = async (itemId, period = 7) => {
	const today = new Date();
	const pastDate = new Date();
	pastDate.setDate(today.getDate() - period);
	pastDate.setHours(0, 0, 0, 0); // Set waktu ke awal hari

	const transactions = await TransactionDetail.findAll({
		include: [
			{
				model: TransactionsHeaders,
				as: "TransactionHeader", // Tambahkan alias sesuai asosiasi
				attributes: ["information", "transaction_date"],
				where: {
					information: "Issuing",
					transaction_date: {
						[Op.between]: [pastDate, today],
					},
				},
			},
		],
		where: {
			item_id: itemId,
		},
		attributes: ["quantity"],
		order: [
			[
				{ model: TransactionsHeaders, as: "TransactionHeader" },
				"transaction_date",
				"ASC",
			],
		],
	});

	const item = await Item.findOne({
		where: { id: itemId },
		attributes: ["stock"],
	});

	if (!item) {
		return {
			average: null,
			predictedSales: null,
			stockNeeded: null,
			message: "Item not found",
		};
	}

	const currentStock = item.stock;

	const transactionData = transactions.map((t) => ({
		date: new Date(t.TransactionHeader.transaction_date).getTime(),
		quantity: t.quantity,
	}));

	const X = transactionData.map(
		(t) => new Date(t.date).toISOString().split("T")[0]
	);
	const y = transactionData.map((t) => t.quantity);

	try {
		const response = await axios.post("http://localhost:5000/predict", {
			X,
			y,
			period,
			currentStock,
			model: "prophet", // atau "sarima"
		});

		if (response.data.error) {
			return {
				average: (
					y.reduce((sum, quantity) => sum + quantity, 0) / y.length
				).toFixed(2),
				predictedSales: null,
				stockNeeded: null,
				message: response.data.message,
			};
		}
		console.log(response.data);

		const predictedSales = parseFloat(
			response.data.forecast.predictedSales
		).toFixed(2);

		const confidence = parseFloat(response.data.forecast.confidence);
		const errorMargin = parseFloat(response.data.forecast.errorMargin);
		const predictionInterval = parseFloat(
			response.data.forecast.predictionInterval
		);

		const stockNeeded = Math.max(0, Math.ceil(predictedSales - currentStock));

		const forecast = response.data.forecast;
		return {
			average: (
				y.reduce((sum, quantity) => sum + quantity, 0) / y.length
			).toFixed(2),
			predictedSales: predictedSales,
			predictedSalesDaily: forecast.predictedSalesDaily.map((dailySale) =>
				parseFloat(dailySale).toFixed(2)
			),
			stockNeeded: stockNeeded,
			currentStock: currentStock,
			confidence: confidence.toFixed(4),
			errorMargin: errorMargin.toFixed(4),
			predictionInterval: predictionInterval.toFixed(4),
			message: "Forecast based on available data and ML model",
		};
	} catch (error) {
		console.error(
			"Error from Flask:",
			error.response ? error.response.data : error.message
		);
		return {
			average: (
				y.reduce((sum, quantity) => sum + quantity, 0) / y.length
			).toFixed(2),
			predictedSales: null,
			stockNeeded: null,
			message: error.response ? error.response.data : error.message,
		};
	}
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
	featureMachineLearning,
	findMostIssuedItems,
	findTransactionTrends,
	mostTransactionsOutletCount,
	getTopItemCategories,
};

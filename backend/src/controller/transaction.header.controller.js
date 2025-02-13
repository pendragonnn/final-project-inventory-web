const {
	getAllTransactionHeader,
	getTransactionHeaderById,
	getTransactionHeaderReceiving,
	getTransactionHeaderIssuing,
	insertTransactionHeader,
	deleteTransactionHeaderById,
	editTransactionHeaderById,
	getTransactionHeaderReturning,
	getStockForecast,
} = require("../service/transaction.header.service");

const {
	getItemById,
	decreaseStock,
	increaseStock,
} = require("../service/item.service");

const {
	insertTransactionDetail,
} = require("../service/transaction.detail.service");

const { error } = require("../schema/category.schema");

const allTransactionHeader = async (req, res) => {
	const page = req.query.page || 1;
	const size = req.query.size || 10;
	try {
		const { transactionHeaders, dataLength } = await getAllTransactionHeader(
			page,
			size
		);
		res.status(200).json({
			data: transactionHeaders,
			totalItems: transactionHeaders.length,
			currentPage: parseInt(page),
			totalPages: Math.ceil(dataLength / (size === "all" ? dataLength : size)), // Adjust totalPages calculation
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const alltransactionReceiving = async (req, res) => {
	const page = req.query.page || 1;
	const size = req.query.size || 10;

	try {
		const { transactionReceiving, dataLength } =
			await getTransactionHeaderReceiving(page, size);

		res.status(200).json({
			data: transactionReceiving,
			totalItems: dataLength,
			currentPage: parseInt(page),
			totalPages: Math.ceil(dataLength / size),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const alltransactionIssuing = async (req, res) => {
	const page = req.query.page || 1;
	const size = req.query.size || 10;

	try {
		const { transactionIssuing, dataLength } =
			await getTransactionHeaderIssuing(page, size);

		res.status(200).json({
			data: transactionIssuing,
			totalItems: dataLength,
			currentPage: parseInt(page),
			totalPages: Math.ceil(dataLength / size),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const alltransactionReturning = async (req, res) => {
	const page = req.query.page || 1;
	const size = req.query.size || 10;

	try {
		const { transactionReturning, dataLength } =
			await getTransactionHeaderReturning(page, size);

		res.status(200).json({
			data: transactionReturning,
			totalItems: dataLength,
			currentPage: parseInt(page),
			totalPages: Math.ceil(dataLength / size),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const transactionHeaderById = async (req, res) => {
	try {
		const transactionHeaderId = req.params.id;
		const transactionHeader = await getTransactionHeaderById(
			transactionHeaderId
		);

		if (!transactionHeader) {
			return res.status(404).json({ message: "Transaction Header Not Found" });
		}

		res.status(200).json({ data: transactionHeader });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const postTransactionHeader = async (req, res) => {
	try {
		const newTransactionHeaderData = req.body;

		const transactionHeader = await insertTransactionHeader(
			newTransactionHeaderData
		);

		const allTransactionDetail = [];

		const detail = newTransactionHeaderData.Detail;
		for (let i of detail) {
			const item = await getItemById(i.item_id);
			if (
				transactionHeader.information.toLowerCase() !== "receiving" && // Abaikan validasi jika "receiving"
				i.quantity > item.stock &&
				!(
					transactionHeader.information.toLowerCase() === "returning" &&
					transactionHeader.outlet_id != null
				)
			) {
				return res.status(400).send("Quantity must not exceed stock");
			}
		}

		// Jangan lakukan update stok di sini
		for (let i of detail) {
			const transactiondetail = await insertTransactionDetail(
				i,
				transactionHeader.id
			);

			// Hanya masukkan detail transaksi
			allTransactionDetail.push(transactiondetail);
		}

		res.status(200).json({
			data: {
				...transactionHeader.dataValues,
				Detail: allTransactionDetail,
			},
			message: "Successful Added Transaction Header",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateTransactionHeader = async (req, res) => {
	const transactionHeaderId = req.params.id;
	const transactionHeaderData = req.body;

	if (!transactionHeaderData) {
		return res.status(400).send("Data Musth Have Value");
	}

	try {
		const transactionHeader = await editTransactionHeaderById(
			transactionHeaderId,
			transactionHeaderData
		);
		if (!transactionHeader) {
			return res.status(400).json({
				message: "Transaction Header Not Found or Already Added",
			});
		}

		res.status(200).json({
			data: transactionHeader,
			message: "Successfull Update Transaction Header!",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const removeTransactionHeader = async (req, res) => {
	try {
		const transactionHeaderId = req.params.id;

		await deleteTransactionHeaderById(transactionHeaderId);
		res.status(200).json({ message: "Successful Delete Transaction Header!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const stockForecast = async (req, res) => {
	try {
		const { period } = req.query;
		const itemId = req.params.itemId;

		const forecast = await getStockForecast(itemId, parseInt(period) || 7);

		res.status(200).json({
			itemId,
			forecast,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	allTransactionHeader,
	alltransactionReceiving,
	alltransactionIssuing,
	alltransactionReturning,
	transactionHeaderById,
	postTransactionHeader,
	updateTransactionHeader,
	removeTransactionHeader,
	stockForecast,
};

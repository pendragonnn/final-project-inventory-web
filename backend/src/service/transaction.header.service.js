const {
	findsTransactionHeader,
	findTransactionHeaderById,
	findsTransactionHeaderIssuing,
	findsTransactionHeaderReceiving,
	createTransactionHeader,
	deleteTransactionHeader,
	editTransactionHeader,
	findsTransactionHeaderReturning,
	calculateMovingAverage,
} = require("../repository/transaction.header.repository");

const getAllTransactionHeader = async (page, size) => {
	const transactionHeader = await findsTransactionHeader(page, size);
	return transactionHeader;
};

const getTransactionHeaderReceiving = async (page, size) => {
	const transactionReceiving = await findsTransactionHeaderReceiving(
		page,
		size
	);
	return transactionReceiving;
};

const getTransactionHeaderIssuing = async (page, size) => {
	const transactionIssuing = await findsTransactionHeaderIssuing(page, size);
	return transactionIssuing;
};

const getTransactionHeaderReturning = async (page, size) => {
	const transactionReturning = await findsTransactionHeaderReturning(
		page,
		size
	);
	return transactionReturning;
};

const getTransactionHeaderById = async (id) => {
	const transactionHeader = await findTransactionHeaderById(id);

	if (!transactionHeader) {
		throw Error("Transaction Header Not Found");
	}

	return transactionHeader;
};

const insertTransactionHeader = async (newTransactionHeaderData) => {
	try {
		// Memastikan bahwa fungsi createTransactionHeader mengembalikan header yang dibuat
		const transactionHeader = await createTransactionHeader(
			newTransactionHeaderData
		);

		return transactionHeader; // Pastikan untuk mengembalikan header yang dibuat
	} catch (error) {
		throw error;
	}
};

const editTransactionHeaderById = async (id, newTransactionHeader) => {
	try {
		await getTransactionHeaderById(id);

		const transactionHeader = await editTransactionHeader(
			id,
			newTransactionHeader
		);
		return transactionHeader;
	} catch (err) {
		return null;
	}
};

const deleteTransactionHeaderById = async (id) => {
	try {
		await getTransactionHeaderById(id);
		await deleteTransactionHeader(id);
	} catch (err) {
		throw err;
	}
};

const getStockForecast = async (itemId, period) => {
	if (!itemId) {
		throw new Error("Item Id is required");
	}

	return await calculateMovingAverage(itemId, period || 7);
};

module.exports = {
	getAllTransactionHeader,
	getTransactionHeaderById,
	getTransactionHeaderReceiving,
	getTransactionHeaderIssuing,
	getTransactionHeaderReturning,
	insertTransactionHeader,
	editTransactionHeaderById,
	deleteTransactionHeaderById,
	getStockForecast,
};

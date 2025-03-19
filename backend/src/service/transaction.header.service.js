const {
	findsTransactionHeader,
	findTransactionHeaderById,
	findsTransactionHeaderIssuing,
	findsTransactionHeaderReceiving,
	createTransactionHeader,
	deleteTransactionHeader,
	editTransactionHeader,
	findsTransactionHeaderReturning,
	featureMachineLearning,
	findMostIssuedItems,
	findTransactionTrends,
	mostTransactionsOutletCount,
	getTopItemCategories,
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

const getMostSoldItem = async (size) => {
	const transactionIssuing = await findMostIssuedItems(size);
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

const getTransactionTrends = async (period) => {
	const transactionTrends = await findTransactionTrends(period);
	return transactionTrends;
};

const mostOutlet = async (size, period) => {
	const outlets = await mostTransactionsOutletCount(size, period);
	return outlets;
};

const mostCategory = async (period) => {
	const category = await getTopItemCategories(period);
	return category;
};

const getStockForecast = async (itemId, period) => {
	if (!itemId) {
		throw new Error("Item Id is required");
	}

	return await featureMachineLearning(itemId, period || 7);
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
	getMostSoldItem,
	getTransactionTrends,
	mostOutlet,
	mostCategory,
};

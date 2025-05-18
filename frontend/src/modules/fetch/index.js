import { instance } from "../axios/index";

async function createTransactionHeader(data) {
	try {
		const res = await instance.post("/transaction-header", data);
		return res.data;
	} catch (err) {
		throw new Error(err.response.data);
	}
}

async function getTransactionHeader(page, size) {
	const payload = {
		page: page,
		size: size,
	};

	try {
		const res = await instance.get(`/transaction-header`, {
			params: payload,
		});
		return res.data;
	} catch (err) {
		throw new Error(err.response.data);
	}
}

async function getTransactionHeaderReceiving(page, size) {
	const payload = {
		page: page,
		size: size,
	};

	try {
		const res = await instance.get(`/transaction-header/receiving`, {
			params: payload,
		});
		return res.data;
	} catch (err) {
		throw new Error(err.response.data);
	}
}

async function getTransactionHeaderIssuing(page, size) {
	const payload = {
		page: page,
		size: size,
	};

	try {
		const res = await instance.get(`/transaction-header/issuing`, {
			params: payload,
		});
		return res.data;
	} catch (err) {
		throw new Error(err.response.data);
	}
}

async function getTransactionHeaderReturning(page, size) {
	const payload = {
		page: page,
		size: size,
	};

	try {
		const res = await instance.get(`/transaction-header/returning`, {
			params: payload,
		});
		return res.data;
	} catch (err) {
		throw new Error(err.response.data);
	}
}

async function getTransactionHeaderById(id) {
	try {
		const res = await instance(`/transaction-header/${id}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
}

async function getTransactionDetailById(id) {
	try {
		const res = await instance(`/transaction-detail/${id}`);
		return res.data;
	} catch (err) {
		throw new Error(err.response.data);
	}
}

async function getForcastTransaction(itemId, period) {
	try {
		const res = await instance.get(
			`/transaction-detail/Forecast/${itemId}?period=${period}`
		);

		return res.data;
	} catch (error) {
		const errorMessage = error.response ? error.response.data : error.message;
		console.error("Error while fetching forecast:", errorMessage);
		throw new Error(errorMessage);
	}
}

async function mostItemIssued(size) {
	const payload = {
		size: size,
	};
	try {
		const res = await instance.get(`/transaction-header/most-issued`, {
			params: payload,
		});

		return res.data;
	} catch (error) {
		console.log(error);
		throw new Error(error.response.data);
	}
}

async function getTransactionTrends(period) {
	const payload = {
		period,
	};
	try {
		const res = await instance.get(`/transaction-header/trends`, {
			params: payload,
		});

		return res.data.data;
	} catch (error) {
		throw new Error(error.response.data);
	}
}

async function getMostOutletTransaction(size, period) {
	const payload = {
		size,
		period,
	};
	try {
		const res = await instance.get(`/transaction-header/most-outlet`, {
			params: payload,
		});

		return res.data;
	} catch (error) {
		throw new Error(error.response.data);
	}
}

async function getMostCategoryIssued(period) {
	const payload = {
		period,
	};
	try {
		const res = await instance.get(`/transaction-header/most-categories`, {
			params: payload,
		});

		return res.data;
	} catch (error) {
		throw new Error(error.response.data);
	}
}

async function deleteTransactionHeader(id) {
	try {
		const res = await instance.delete(`/transaction-header/${id}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	createTransactionHeader,
	getTransactionHeader,
	getTransactionHeaderReceiving,
	getTransactionHeaderIssuing,
	getTransactionHeaderReturning,
	getTransactionHeaderById,
	getTransactionDetailById,
	deleteTransactionHeader,
	getForcastTransaction,
	mostItemIssued,
	getTransactionTrends,
	getMostOutletTransaction,
	getMostCategoryIssued,
};

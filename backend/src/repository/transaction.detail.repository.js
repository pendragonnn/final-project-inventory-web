const models = require("../../models");
const TransactionDetail = models.TransactionDetail;
const TransactionHeader = models.TransactionHeader;
const Item = models.Item;
const Outlet = models.Outlet;
const Supplier = models.Supplier;
const User = models.User;
const Category = models.Category;
const Brand = models.Brand;

const findsTransactionDetail = async (page, size) => {
	const offset = (page - 1) * size;
	const transactionDetailsAll = await TransactionDetail.findAll({
		order: [["id", "DESC"]],
		include: [
			{
				model: Item,
			},
		],
	});
	const dataLength = transactionDetailsAll.length;
	const transactionDetails = await TransactionDetail.findAll({
		offset: offset,
		limit: size,
		order: [["id", "DESC"]],
		include: [
			{
				model: Item,
			},
		],
	});
	return { transactionDetails, dataLength };
};

const findTransactionDetailById = async (id) => {
	const transactionDetail = await TransactionHeader.findOne({
		include: [
			{
				model: TransactionDetail,
				include: [
					{
						model: Item,
						attributes: ["price", "description", "size", "brand_id"],
						include: [
							{
								model: Brand,
								attributes: ["name", "type", "image_url", "category_id"],
								include: [
									{
										model: Category,
										attributes: ["name"],
									},
								],
							},
						],
					},
				],
			},
			{
				model: User,
				attributes: ["full_name"],
			},
			{
				model: Outlet,
				attributes: ["name", "phone", "address"],
			},
			{
				model: Supplier,
				attributes: ["name", "phone", "address"],
			},
		],
		where: {
			id,
		},
	});

	return transactionDetail;
};

module.exports = {
	findTransactionDetailById,
	findsTransactionDetail,
};

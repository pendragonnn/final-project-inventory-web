const models = require("../../models");
const Suppliers = models.Supplier;

const findSuppliers = async (page, size) => {
  const offset = (page - 1) * size;
  const suppliersAll = await Suppliers.findAll();
  const dataLength = suppliersAll.length;
  const suppliers = await Suppliers.findAll({
    offset: offset,
    limit: size,
    order: [["id", "DESC"]],
  });
  return { suppliers, dataLength };
};

const findSupplierById = async (id) => {
  const supplier = await Suppliers.findOne({
    where: {
      id,
    },
  });
  return supplier;
};

const findSupplierByName = async (name) => {
  const supplier = await Suppliers.findOne({
    where: {
      name: name,
    },
    returning: true,
  });

  return supplier;
};

const findSupplierByPhone = async (phone) => {
  const supplier = await Suppliers.findOne({
    where: {
      phone,
    },
    returning: true,
  });

  return supplier;
};

const createSupplier = async (supplierData) => {
  try {
    const existingIds = await Suppliers.findAll({ attributes: ["id"] });

    const newId = generateNewId(existingIds.map((supplier) => supplier.id));

    const supplier = await Suppliers.create({
      id: newId,
      name: supplierData.name,
      address: supplierData.address,
      phone: supplierData.phone,
    });

    return supplier;
  } catch (error) {
    throw error;
  }
};

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `O-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

const editSupplier = async (id, updatedFields) => {
  const { name, address, phone } = updatedFields;
  const supplier = await Suppliers.findByPk(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  const updatedData = {};

  if (name !== undefined && name !== supplier.name) {
    updatedData.name = name;
  }

  if (address !== undefined) {
    updatedData.address = address;
  }

  if (phone !== undefined && phone !== supplier.phone) {
    updatedData.phone = phone;
  }

  if (Object.keys(updatedData).length === 0) {
    return supplier;
  }

  const updatedSuppliers = await Suppliers.update(updatedData, {
    where: {
      id: id,
    },
    returning: true,
  });

  return updatedSuppliers[1][0];
};

const deleteSupplier = async (id) => {
  const supplier = await Suppliers.destroy({
    where: {
      id,
    },
  });
  return supplier;
};

module.exports = {
  findSuppliers,
  findSupplierById,
  findSupplierByName,
  findSupplierByPhone,
  createSupplier,
  editSupplier,
  deleteSupplier,
};

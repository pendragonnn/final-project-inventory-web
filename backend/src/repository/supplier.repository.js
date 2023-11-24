const models = require("../../models");
const Suppliers = models.Supplier;

const findSuppliers = async (page, size) => {
  const offset = (page - 1) * size;
  const suppliersAll = await Suppliers.findAll();
  const dataLength = suppliersAll.length;
  const suppliers = await Suppliers.findAll({
    offset: offset,
    limit: size,
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
      name,
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
  const newId = `S-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

const editSupplier = async (id, supplierData) => {
  const updatedSuppliers = await Suppliers.update(
    {
      name: supplierData.name,
      address: supplierData.address,
      phone: supplierData.phone,
    },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  );

  return updatedSuppliers;
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

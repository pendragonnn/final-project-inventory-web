const {
  findSuppliers,
  findSupplierById,
  createSupplier,
  findSupplierByName,
  findSupplierByPhone,
  editSupplier,
  deleteSupplier,
} = require("../repository/supplier.repository");

const getAllSuppliers = async (page, size) => {
  const supplier = await findSuppliers(page, size);
  return supplier;
};

const getSupplierById = async (id) => {
  const supplier = await findSupplierById(id);

  if (!supplier) {
    throw Error("Supplier Not Found");
  }
  return supplier;
};

const insertSupplier = async (newSupplier) => {
  const supplierName = await findSupplierByName(newSupplier.name);
  const supplierPhone = await findSupplierByPhone(newSupplier.phone);

  if (supplierName) {
    throw new Error("Supplier Name Already Added");
  }
  if (supplierPhone) {
    throw new Error("Supplier Phone Already Added");
  }

  const supplier = await createSupplier(newSupplier);

  return supplier;
};

const editSupplierById = async (id, newSupplier) => {
  try {
    const supplierName = await findSupplierByName(newSupplier.name);
    const supplierPhone = await findSupplierByPhone(newSupplier.phone);

    if (supplierName) {
      throw new Error("Supplier Name Already Added");
    }
    if (supplierPhone) {
      throw new Error("Supplier Phone Already Added");
    }

    await getSupplierById(id);

    const supplier = await editSupplier(id, newSupplier);
    return supplier;
  } catch (err) {
    return null;
  }
};

const deleteSupplierById = async (id) => {
  try {
    await getSupplierById(id);

    await deleteSupplier(id);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  insertSupplier,
  editSupplierById,
  deleteSupplierById,
};

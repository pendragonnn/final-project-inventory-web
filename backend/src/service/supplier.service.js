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
    const existingSupplier = await getSupplierById(id);

    if (!existingSupplier) {
      throw new Error("Supplier Not Found");
    }

    const supplierName = await findSupplierByName(newSupplier.name);
    const outletPhone = await findSupplierByPhone(newSupplier.phone);

    if (supplierName && supplierName.id !== id) {
      throw new Error("Supplier Name Already Added");
    }

    if (outletPhone && outletPhone.id !== id) {
      throw new Error("Supplier Phone Already Added");
    }

    const updatedSupplier = await editSupplier(id, newSupplier);
    return updatedSupplier;
  } catch (err) {
    throw new Error(err.message);
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

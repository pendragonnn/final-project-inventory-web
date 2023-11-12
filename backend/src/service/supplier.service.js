const {
  findSuppliers,
  findSupplierById,
  createSupplier,
  findSupplierByName,
  findSupplierByPhone,
  editSupplier,
  deleteSupplier,
} = require("../repository/supplier.repository");

const getAllSuppliers = async () => {
  const supplier = await findSuppliers();
  return supplier;
};

const getSupplierById = async (id) => {
  const supplier = await findSupplierById(id);

  if (!supplier) {
    throw Error("Supplier not found");
  }
  return supplier;
};

const insertSupplier = async (newSupplier) => {
  const supplierName = await findSupplierByName(newSupplier.supplier);
  const supplierPhone = await findSupplierByPhone(newSupplier.phone);

  if (supplierName) {
    throw new Error("Name sudah Terdaftar");
  }
  if (supplierPhone) {
    throw new Error("Nomor telepon sudah Terdaftar");
  }

  const supplier = await createSupplier(newSupplier);

  return supplier;
};

const editSupplierById = async (id, newSupplier) => {
  try {
    const supplierName = await findSupplierByName(newSupplier.supplier);
    const supplierPhone = await findSupplierByPhone(newSupplier.phone);

    if (supplierName) {
      throw new Error("Name sudah Terdaftar");
    }
    if (supplierPhone) {
      throw new Error("Nomor telepon sudah Terdaftar");
    }

    await getSupplierById(id);

    const supplier = await editSupplier(id, newSupplier);
    return supplier;
  } catch (err) {
    console.error(err); // Tambahkan log untuk melihat kesalahan
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

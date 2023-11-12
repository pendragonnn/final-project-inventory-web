const models = require("../../models");
const Suppliers = models.Supplier;

const findSuppliers = async () => {
  const suppliers = await Suppliers.findAll();

  return suppliers;
};

const findSupplierById = async (id) => {
  const supplier = await Suppliers.findOne({
    where: {
      id,
    },
  });
  return supplier;
};

const findSupplierByName = async (supplier) => {
  const suppliers = await Suppliers.findOne({
    where: {
      supplier,
    },
  });

  return suppliers;
};

const findSupplierByPhone = async (phone) => {
  const supplier = await Suppliers.findOne({
    where: {
      phone,
    },
  });

  return supplier;
};

const createSupplier = async (supplierData) => {
  try {
    // Mengambil semua ID yang sudah ada
    const existingIds = await Suppliers.findAll({ attributes: ["id"] });

    // Membuat ID baru dengan format "O-XXXX"
    const newId = generateNewId(existingIds.map((supplier) => supplier.id));

    // Menambahkan outlet baru
    const supplier = await Suppliers.create({
      id: newId,
      supplier: supplierData.supplier,
      address: supplierData.address,
      phone: supplierData.phone,
    });

    return supplier;
  } catch (error) {
    console.error("Gagal membuat supplier:", error);
    throw error;
  }
};

// Fungsi untuk membuat ID baru dengan format "O-XXXX"
function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `O-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

const editSupplier = async (id, supplierData) => {
  const updatedSuppliers = await Suppliers.update(
    {
      supplier: supplierData.supplier,
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

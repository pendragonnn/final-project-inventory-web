const {
  getAllSuppliers,
  getSupplierById,
  insertSupplier,
  editSupplierById,
  deleteSupplierById,
} = require("../service/supplier.service");

const allSuppliers = async (req, res) => {
  const suppliers = await getAllSuppliers();
  res.json(suppliers);
};

const supplierById = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await getSupplierById(supplierId);

    res.send(supplier);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const postSupplier = async (req, res) => {
  try {
    const newSupplierData = req.body;

    const supplier = await insertSupplier(newSupplierData);

    res.json({
      data: supplier,
      message: "Supplier berhasil ditambahkan",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateSupplier = async (req, res) => {
  const supplierId = req.params.id;
  const supplierData = req.body;

  if (!(supplierData.name && supplierData.address && supplierData.phone)) {
    return res.status(400).send("Data harus diisi semua");
  }

  try {
    const supplier = await editSupplierById(supplierId, supplierData);
    if (!supplier) {
      return res
        .status(400)
        .json({ Error: "Data sudah ada atau supplier tidak ditemukan" });
    }

    res.send({
      data: supplier,
      message: "supplier berhasil diupdate!",
    });
  } catch (error) {
    console.error(error); // Tambahkan log untuk melihat kesalahan
    return res.status(500).json({ Error: "Terjadi kesalahan server" });
  }
};

const removeSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;

    await deleteSupplierById(supplierId);
    res.send("Data berhasil dihapus");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  allSuppliers,
  supplierById,
  postSupplier,
  updateSupplier,
  removeSupplier,
};

const {
  getAllSuppliers,
  getSupplierById,
  insertSupplier,
  editSupplierById,
  deleteSupplierById,
} = require("../service/supplier.service");

const allSuppliers = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10
  try {
    const { suppliers, dataLength} = await getAllSuppliers(page, size);
    res.status(200).json({ 
      data: suppliers,
      totalItems: suppliers.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const supplierById = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await getSupplierById(supplierId);

    if(!supplier) {
      return res.status(404).json({ message: "Supplier tidak ditemukan"})
    }

    res.status(200).json({ data: supplier });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const postSupplier = async (req, res) => {
  try {
    const newSupplierData = req.body;

    const supplier = await insertSupplier(newSupplierData);

    res.status(200).json({ data: supplier, message: "Supplier berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const updateSupplier = async (req, res) => {
  const supplierId = req.params.id;
  const supplierData = req.body;

  if (!supplierData) {
    return res.status(400).send("Data harus diisi semua");
  }

  try {
    const supplier = await editSupplierById(supplierId, supplierData);
    if (!supplier) {
      return res
        .status(400)
        .json({ message: "Data sudah ada atau Supplier tidak ditemukan" });
    }

    res.status(200).json({
      data: supplier,
      message: "Supplier berhasil diupdate!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

const removeSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;

    await deleteSupplierById(supplierId);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = {
  allSuppliers,
  supplierById,
  postSupplier,
  updateSupplier,
  removeSupplier,
};

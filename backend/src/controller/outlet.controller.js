const {
  getAllOutlets,
  getOutletById,
  insertOutlet,
  editOutletById,
  deleteOutletById,
} = require("../service/outlet.service");

const allOutlets = async (req, res) => {
  const outlets = await getAllOutlets();
  res.json(outlets);
};

const outletById = async (req, res) => {
  try {
    const outletId = req.params.id;
    const outlet = await getOutletById(outletId);

    res.send(outlet);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const postOutlet = async (req, res) => {
  try {
    const newOutletData = req.body;

    const outlet = await insertOutlet(newOutletData);

    res.json({
      data: outlet,
      message: "Outlet berhasil ditambahkan",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateOutlet = async (req, res) => {
  const outletId = req.params.id;
  const outletData = req.body;

  if (!(outletData.name && outletData.address && outletData.phone)) {
    return res.status(400).send("Data harus diisi semua");
  }

  try {
    const outlet = await editOutletById(outletId, outletData);
    if (!outlet) {
      return res
        .status(400)
        .json({ Error: "Data sudah ada atau Outlet tidak ditemukan" });
    }

    res.send({
      data: outlet,
      message: "Outlet berhasil diupdate!",
    });
  } catch (error) {
    console.error(error); // Tambahkan log untuk melihat kesalahan
    return res.status(500).json({ Error: "Terjadi kesalahan server" });
  }
};

const removeOutlet = async (req, res) => {
  try {
    const outletId = req.params.id;

    await deleteOutletById(outletId);
    res.send("Data berhasil dihapus");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  allOutlets,
  outletById,
  postOutlet,
  updateOutlet,
  removeOutlet,
};

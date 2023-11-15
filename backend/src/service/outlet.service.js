const {
  findOutlets,
  findOutletById,
  createOutlet,
  findOutletByName,
  findOutletByPhone,
  editOutlet,
  deleteOutlet,
} = require("../repository/outlet.repository");

const getAllOutlets = async (page, size) => {
  const outlets = await findOutlets(page, size);
  return outlets;
};

const getOutletById = async (id) => {
  const outlet = await findOutletById(id);

  if (!outlet) {
    throw Error("Outlet tidak ditemukan");
  }
  return outlet;
};

const insertOutlet = async (newOutlet) => {
  const outletName = await findOutletByName(newOutlet.name);
  const outletPhone = await findOutletByPhone(newOutlet.phone);

  if (outletName) {
    throw new Error("Name sudah Terdaftar");
  }
  if (outletPhone) {
    throw new Error("Nomor telepon sudah Terdaftar");
  }

  const outlet = await createOutlet(newOutlet);

  return outlet;
};

const editOutletById = async (id, newOutlet) => {
  try {
    const outletName = await findOutletByName(newOutlet.name);
    const outletPhone = await findOutletByPhone(newOutlet.phone);

    if(outletName) {
      throw new Error("Nama sudah Terdaftar");
    }
    if(outletPhone) {
      throw new Error("Nomor telepon sudah Terdaftar");
    }

    await getOutletById(id);

    const outlet = await editOutlet(id, newOutlet);
    return outlet;
  } catch (err) {
    return null;
  }
};

const deleteOutletById = async (id) => {
  try {
    await getOutletById(id);

    await deleteOutlet(id);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllOutlets,
  getOutletById,
  insertOutlet,
  editOutletById,
  deleteOutletById,
};

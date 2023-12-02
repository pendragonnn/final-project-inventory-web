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
    throw Error("Outlet Not Found");
  }
  return outlet;
};

const insertOutlet = async (newOutlet) => {
  const outletName = await findOutletByName(newOutlet.name);
  const outletPhone = await findOutletByPhone(newOutlet.phone);

  if (outletName) {
    throw new Error("Outlet Name Already Added");
  }
  if (outletPhone) {
    throw new Error("Outlet Phone Already Added");
  }

  const outlet = await createOutlet(newOutlet);

  return outlet;
};

const editOutletById = async (id, newOutlet) => {
  try {
    const existingOutlet = await getOutletById(id);

    if (!existingOutlet) {
      throw new Error("Outlet Not Found");
    }

    const outletName = await findOutletByName(newOutlet.name);
    const outletPhone = await findOutletByPhone(newOutlet.phone);

    if (outletName && outletName.id !== id) {
      throw new Error("Outlet Name Is Already");
    }

    if (outletPhone && outletPhone.id !== id) {
      throw new Error("Outlet Phone Is  Already ");
    }

    const updatedOutlet = await editOutlet(id, newOutlet);
    return updatedOutlet;
  } catch (err) {
    throw new Error(err.message);
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

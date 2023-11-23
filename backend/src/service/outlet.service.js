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
    const outletName = await findOutletByName(newOutlet.name);
    const outletPhone = await findOutletByPhone(newOutlet.phone);

    if(outletName) {
      throw new Error("Outlet Name Already Added");
    }
    if(outletPhone) {
      throw new Error("Outlet Phone Already Added");
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

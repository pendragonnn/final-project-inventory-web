const models = require("../../models");
const Outlets = models.Outlet;

const findOutlets = async () => {
  const outlets = await Outlets.findAll();

  return outlets;
};

const findOutletById = async (id) => {
  const outlet = await Outlets.findOne({
    where: {
      id,
    },
  });
  return outlet;
};

const findOutletByName = async (name) => {
  const outlet = await Outlets.findOne({
    where: {
      name,
    },
  });

  return outlet;
};

const findOutletByPhone = async (phone) => {
  const outlet = await Outlets.findOne({
    where: {
      phone,
    },
  });

  return outlet;
};

const createOutlet = async (outletData) => {
  try {
    // Mengambil semua ID yang sudah ada
    const existingIds = await Outlets.findAll({ attributes: ["id"] });

    const newId = generateNewId(existingIds.map((outlet) => outlet.id));

    const outlet = await Outlets.create({
      id: newId,
      name: outletData.name,
      address: outletData.address,
      phone: outletData.phone,
    });

    return outlet;
  } catch (error) {
    console.error("Gagal membuat outlet:", error);
    throw error;
  }
};

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `O-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

const editOutlet = async (id, outletData) => {
  const updatedOutlets = await Outlets.update(
    {
      name: outletData.name,
      address: outletData.address,
      phone: outletData.phone,
    },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  );

  return updatedOutlets;
};

const deleteOutlet = async (id) => {
  const outlet = await Outlets.destroy({
    where: {
      id,
    },
  });
  return outlet;
};

module.exports = {
  findOutlets,
  findOutletById,
  findOutletByName,
  findOutletByPhone,
  createOutlet,
  editOutlet,
  deleteOutlet,
};

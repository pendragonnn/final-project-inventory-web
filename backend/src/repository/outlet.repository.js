const models = require("../../models");
const Outlets = models.Outlet;

const findOutlets = async (page, size) => {
  const offset = (page - 1) * size;
  const outletsAll = await Outlets.findAll();
  const dataLength = outletsAll.length;
  const outlets = await Outlets.findAll({
    offset: offset,
    limit: size,
    order: [["id", "DESC"]],
  });
  return { outlets, dataLength };
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
      name: name,
    },
    returning: true,
  });

  return outlet;
};

const findOutletByPhone = async (phone) => {
  const outlet = await Outlets.findOne({
    where: {
      phone,
    },
    returning: true,
  });

  return outlet;
};

const createOutlet = async (outletData) => {
  try {
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

const editOutlet = async (id, updatedFields) => {
  const { name, address, phone } = updatedFields;
  const outlet = await Outlets.findByPk(id);

  if (!outlet) {
    throw new Error("Outlet not found");
  }

  const updatedData = {};

  if (name !== undefined && name !== outlet.name) {
    updatedData.name = name;
  }

  if (address !== undefined) {
    updatedData.address = address;
  }

  if (phone !== undefined && phone !== outlet.phone) {
    updatedData.phone = phone;
  }

  if (Object.keys(updatedData).length === 0) {
    // Tidak ada perubahan yang perlu diperbarui
    return outlet; // Mengembalikan data outlet tanpa melakukan update
  }

  const updatedOutlets = await Outlets.update(updatedData, {
    where: {
      id: id,
    },
    returning: true,
  });

  return updatedOutlets[1][0];
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

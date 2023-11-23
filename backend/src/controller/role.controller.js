const {
  getAllRoles,
  getRoleById,
} = require("../service/role.service");

const allRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();
    res.status(200).json({ data: roles}) 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const roleById = async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await getRoleById(roleId);

    if(!role) {
      return res.status(404).json({ message: "Role Not Found"})
    }

    res.status(200).json({ data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  allRoles,
  roleById,
};

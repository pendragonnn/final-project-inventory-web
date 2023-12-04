const {
  getAllOutlets,
  getOutletById,
  insertOutlet,
  editOutletById,
  deleteOutletById,
} = require("../service/outlet.service")

const allOutlets = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10
  try {
    const { outlets, dataLength } = await getAllOutlets(page, size)
    res.status(200).json({
      data: outlets,
      totalItems: dataLength,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const outletById = async (req, res) => {
  try {
    const outletId = req.params.id
    const outlet = await getOutletById(outletId)

    if (!outlet) {
      return res.status(404).json({ message: "Outlet Not Found" })
    }

    res.status(200).json({ data: outlet })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const postOutlet = async (req, res) => {
  try {
    const newOutletData = req.body

    const outlet = await insertOutlet(newOutletData)

    res.status(200).json({ data: outlet, message: "Successful Adding Outlet!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateOutlet = async (req, res) => {
  const outletId = req.params.id
  const outletData = req.body

  try {
    const outlet = await editOutletById(outletId, outletData)
    if (!outlet) {
      return res
        .status(400)
        .json({ message: "Outlet Not Found or Already Added" })
    }

    res.status(200).json({
      data: outlet,
      message: "Successfull Update Outlet!",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeOutlet = async (req, res) => {
  try {
    const outletId = req.params.id

    await deleteOutletById(outletId)
    res.status(200).json({ message: "Successful Delete Outlet!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  allOutlets,
  outletById,
  postOutlet,
  updateOutlet,
  removeOutlet,
}

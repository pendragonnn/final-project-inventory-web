const {
  getAllCategories,
  getCategoryById,
  insertCategory,
  editCategoryById,
  deleteCategoryById
} = require("../service/category.service");

const allCategories = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10
  try {
    const { categories, dataLength } = await getAllCategories(page, size);
    res.status(200).json({ 
      data: categories,
      totalItems: categories.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size)
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const categoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if(!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan"})
    }

    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postCategory = async (req, res) => {
  try {
    const newCategoryData = req.body;

    const category = await insertCategory(newCategoryData);

    res.status(200).json({ data: category, message: "Kategori berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const categoryData = req.body;

  if (!categoryData) {
    return res.status(400).json({ message: "Data harus diisi semua" });
  }

  try {
    const category = await editCategoryById(categoryId, categoryData);

    res.status(200).json({
      data: category,
      message: "Kategori berhasil diupdate!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    await deleteCategoryById(categoryId);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  allCategories,
  categoryById,
  postCategory,
  updateCategory,
  removeCategory,
};

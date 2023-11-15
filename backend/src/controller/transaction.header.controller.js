const {
  getAllTransactionHeader,
  getTransactionHeaderById,
  insertTransactionHeader,
  deleteTransactionHeaderById,
  editTransactionHeaderById,
} = require("../service/transaction.header.service");

const allTransactionHeader = async (req, res) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  try {
    const { transactionHeaders, dataLength } = await getAllTransactionHeader(
      page,
      size
    );
    res.status(200).json({
      data: transactionHeaders,
      totalItems: transactionHeaders.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const transactionHeaderById = async (req, res) => {
  try {
    const transactionHeaderId = req.params.id;
    const transactionHeader = await getTransactionHeaderById(
      transactionHeaderId
    );

    if (!transactionHeader) {
      return res
        .status(404)
        .json({ message: "Header transaksi tidak ditemukan" });
    }

    res.status(200).json({ data: transactionHeader });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postTransactionHeader = async (req, res) => {
  try {
    const newTransactionHeaderData = req.body;

    const transactionHeader = await insertTransactionHeader(
      newTransactionHeaderData
    );

    res
      .status(200)
      .json({
        data: transactionHeader,
        message: "Header transaksi berhasil ditambahkan",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransactionHeader = async (req, res) => {
  const transactionHeaderId = req.params.id;
  const transactionHeaderData = req.body;

  if (!transactionHeaderData) {
    return res.status(400).send("Data harus diisi semua");
  }

  try {
    const transactionHeader = await editTransactionHeaderById(
      transactionHeaderId,
      transactionHeaderData
    );
    if (!transactionHeader) {
      return res
        .status(400)
        .json({
          message: "Data sudah ada atau Transaction Header tidak ditemukan",
        });
    }

    res.status(200).json({
      data: transactionHeader,
      message: "Transaction Header berhasil diupdate!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeTransactionHeader = async (req, res) => {
  try {
    const transactionHeaderId = req.params.id;

    await deleteTransactionHeaderById(transactionHeaderId);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  allTransactionHeader,
  transactionHeaderById,
  postTransactionHeader,
  updateTransactionHeader,
  removeTransactionHeader,
};

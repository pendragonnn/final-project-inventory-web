const handleItem = {
  generateNewId: function (existingIds) {
    const maxNumber = existingIds.reduce((max, item) => {
      const currentNumber = parseInt(item.id.split("-")[1], 10);
      return currentNumber > max ? currentNumber : max;
    }, 0);

    const newNumber = maxNumber + 1;
    const newId = `I-${String(newNumber).padStart(4, "0")}`;

    return newId;
  }
};

module.exports = handleItem;

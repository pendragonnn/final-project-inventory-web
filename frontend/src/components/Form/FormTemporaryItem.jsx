const FormTemporaryItem = ({ handleAdd, dataItem }) => {
  return (
    <form onSubmit={handleAdd} className="flex-1 ">
      <div className="p-6.5 mb-4.5 flex flex-col gap-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Item
          </label>
          <select
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
            name="a"
          >
            {dataItem.map((value, idx) => (
              <option key={value.id} value={idx}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <label className="mb-2.5 block text-black dark:text-white">
            Quantity
          </label>
          <input
            type="number"
            name="b"
            required
            placeholder="Enter your Quantity"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="flex  justify-center rounded bg-primary p-3 font-medium text-gray"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default FormTemporaryItem;

import ModalDeleteTransaction from "../Modal/Transaction/ModalDeleteTransaction"

const FormAddTransactionIsuing = ({
  handleSubmit,
  userId,
  dataOutlet,
  itemTemporary,
  handleDelete,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div className="p-6.5 mb-4.5 flex flex-col gap-6">
        <div className="">
          <label className="mb-2.5 block text-black dark:text-white">
            User Id
          </label>
          <input
            type="text"
            name="user_id"
            value={userId}
            placeholder={userId}
            readOnly
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-graydark"
          />
        </div>

        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Outlet
          </label>
          <select
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
            name="outlet_id"
          >
            {dataOutlet.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2.5 block text-black dark:text-white">
            Item
          </label>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-2 text-center dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white ">
                  Item
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white ">
                  Quantity
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white ">
                  Price per item
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {itemTemporary.map((value, i) => (
                <tr key={i} className="">
                  <td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
                    <input
                      type="text"
                      className="w-full rounded border-[1.5px] border-none bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-boxdark dark:disabled:bg-graydark text-center"
                      required
                      readOnly
                      name="item_id"
                      value={value.item_name}
                    />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark w-[10px]">
                    <input
                      type="text"
                      className="w-full rounded border-[1.5px] border-none py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-boxdark dark:disabled:bg-graydark"
                      required
                      readOnly
                      name="quantity"
                      value={value.quantity}
                    />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark ">
                    <input
                      type="text"
                      className="w-full rounded border-[1.5px] border-none bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary text-center active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-boxdark dark:disabled:bg-graydark"
                      required
                      readOnly
                      name="price"
                      value={value.price_item}
                    />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
                    <div className="flex items-center justify-center gap-2">
                      <ModalDeleteTransaction
                        open={`open-${i}`}
                        value={value}
                        handleDelete={() => handleDelete(i)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="">
          <label className="mb-2.5 block text-black dark:text-white">
            Information
          </label>
          <input
            type="text"
            name="information"
            value="Isuing"
            readOnly
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        {/* <!-- Time and date --> */}
        <div className=" rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Time and date
            </h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Date picker
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  name="transaction_date"
                  className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex  justify-center rounded bg-primary p-3 font-medium text-gray"
        >
          Add Transaction
        </button>
      </div>
    </form>
  )
}

export default FormAddTransactionIsuing

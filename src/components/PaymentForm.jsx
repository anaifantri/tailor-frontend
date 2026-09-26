import BcaSvg from "@/Assets/Svg/BcaSvg";
import BniSvg from "@/Assets/Svg/BniSvg";
import BriSvg from "@/Assets/Svg/BriSvg";

export default function PaymenForm({ data, action }) {
  return (
    <div>
      <div className="flex items-start">
        <label className="w-32">Type Pembayaran</label>
        <label>:</label>
        <div>
          <div className="flex items-center">
            <input
              name="payment_method"
              value={"Cash"}
              onClick={action}
              type="radio"
              defaultChecked={data.payment_method == "Cash" ? true : false}
              className="flex ml-2"
            />
            <label className="flex ml-1">Cash</label>
          </div>
          <div className="flex items-center">
            <input
              name="payment_method"
              value={"Card"}
              defaultChecked={data.payment_method == "Card" ? true : false}
              onClick={action}
              type="radio"
              className="flex ml-2"
            />
            <label className="flex ml-1">Card</label>
          </div>
          <div className="mt-2">
            <label className="flex ml-2">Transfer</label>
            <div className="flex items-center">
              <input
                name="payment_method"
                value={"Transfer-BCA"}
                defaultChecked={
                  data.payment_method == "Transfer-BCA" ? true : false
                }
                onClick={action}
                type="radio"
                className="flex ml-2"
              />
              <BcaSvg w={"50px"} h={"50px"} c={"ml-2"} />
              <input
                name="payment_method"
                value={"Transfer-BNI"}
                defaultChecked={
                  data.payment_method == "Transfer-BNI" ? true : false
                }
                onClick={action}
                type="radio"
                className="flex ml-4"
              />
              <BniSvg w={"50px"} h={"50px"} c={"ml-2"} />
              <input
                name="payment_method"
                value={"Transfer-BRI"}
                defaultChecked={
                  data.payment_method == "Transfer-BRI" ? true : false
                }
                onClick={action}
                type="radio"
                className="flex ml-4"
              />
              <BriSvg w={"50px"} h={"50px"} c={"ml-2"} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-2">
        <label className="w-32">Tgl. Bayar</label>
        <label>:</label>
        <input
          name="payment_date"
          defaultValue={data.payment_date}
          onChange={action}
          type="date"
          className="ml-2 px-2"
        />
      </div>
      <div className="flex items-center mt-2">
        <label className="w-32">Nominal Bayar</label>
        <label>:</label>
        <input
          name="amount_paid"
          placeholder="Input Nominal"
          defaultValue={data.amount_paid}
          type="number"
          className="ml-2 px-2 spinner-disabled w-48"
          onChange={action}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="flex items-start mt-2">
        <label className="w-32">Keterangan</label>
        <label>:</label>
        <textarea
          name="payment_notes"
          defaultValue={data.payment_notes}
          placeholder="Input keterangan"
          onChange={action}
          className="ml-2 w-64 border rounded-lg px-2"
        ></textarea>
      </div>
    </div>
  );
}

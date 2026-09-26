import GoldLogo from "@/components/GoldLogo";

export default function HeaderOrder({ orderNumber }) {
  return (
    <div className="flex-all-center w-full border-2 border-slate-700 bg-slate-800 rounded-3xl h-28 mt-4 shadow-lg font-sans text-sm tracking-widest">
      <div className="grid grid-cols-3 gap-4 w-full h-full p-4">
        <div className="flex col-span-2 items-center">
          <GoldLogo />
        </div>
        <div>
          <div className="flex-all-center">
            <span className="font-bold text-lg col-span-1 text-brand-accent">
              NOTA PESANAN
            </span>
          </div>
          <div className="flex-all-center mt-1">
            <label className="text-slate-300 text-md col-span-1">
              No. {orderNumber}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

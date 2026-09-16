export default function OrderNotes() {
  const notes = [
    "Lebih dari 2 bulan barang tidak diambil, segala kehilangan / kerusakan dan lain-lain diluar tanggung jawab kami",
    "Dengan nota tersebut barang bisa diterima",
    "Kehilangan nota pengambilan bukan tanggung jawab kami",
  ];
  return (
    <div>
      <span className="flex mt-2 font-semibold">Catatan :</span>
      {notes.map((note, index) => (
        <div className="flex" key={index}>
          <span className="flex w-2">{index + 1}.</span>
          <span className="flex text-left ml-2 max-w-150">{note}</span>
        </div>
      ))}
    </div>
  );
}

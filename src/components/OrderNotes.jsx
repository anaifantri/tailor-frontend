export default function OrderNotes() {
  const notes = [
    "Barang yang tidak diambil lebih dari 2 bulan berada di luar tanggung jawab kami jika terjadi kehilangan, kerusakan, atau risiko lainnya",
    "Pengambilan barang wajib menyertakan nota ini",
    "Kehilangan nota pengambilan bukan merupakan tanggung jawab kami",
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

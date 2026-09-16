import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();
  console.error(error);

  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Kode Error dengan Efek Gradasi */}
        <p className="text-base font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block">
          404 Error
        </p>

        {/* Judul Utama */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Halaman Tidak Ditemukan
        </h1>

        {/* Deskripsi */}
        <p className="mt-6 text-base leading-7 text-gray-600 max-w-md mx-auto">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin URL
          salah ketik atau halaman telah dipindahkan.
        </p>

        {/* Tombol Aksi */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
          >
            Kembali ke Beranda
          </Link>

          {/* <a
            href="/support" // Arahkan ke halaman kontak/support Anda jika ada
            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 flex items-center gap-1 transition-colors duration-200"
          >
            Hubungi Support <span aria-hidden="true">&rarr;</span>
          </a> */}
        </div>
      </div>
    </main>
  );
}

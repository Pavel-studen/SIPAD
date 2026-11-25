<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIPAD — Dashboard Praktisi</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;">

    <!-- Header / Navbar -->
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-md relative z-10">
        <!-- Logo -->
        <div class="text-white font-bold text-2xl">SIPAD</div>
        <!-- Admin name -->
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-Montserrat font-[18.369px] font-bold font-[700px] line-normal">AdminPAD123</div>
        </div>
    </header>

    <main class="w-full max-w-6xl mx-auto px-4 py-8">
        @if(session('success'))
            <div class="mb-4 p-4 text-green-800 border-l-4 border-green-600 bg-green-100 rounded-md">
                {{ session('success') }}
            </div>
        @endif

        <section>
            <h2 class="text-[#486284] text-lg font-bold mb-2 uppercase tracking-wide">Input Detail Proyek</h2>
            <p class="text-xs text-gray-500 mb-4 italic">*Silakan ketik manual detail informasi proyek untuk PAD.</p>
            <form action="{{ route('practitioner.simpanProyek') }}" method="POST" class="flex flex-col gap-4">
                @csrf
                <div class="mb-4">
                    <label class="block text-sm font-medium text-[#308242] mb-1">1. Nama Proyek</label>
                    <input type="text" name="nama_proyek" required placeholder="Type nama proyek (misal: E-Commerce Smart Village)" class="w-1/2 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242]">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-[#308242] mb-1">2. Project Owner (PO)</label>
                    <input type="text" name="project_owner" required placeholder="Type nama PO (misal: Ir. Hendra S.T., M.Eng.)" class="w-1/2 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242]">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-[#308242] mb-1">3. Nama Mitra Proyek</label>
                    <input type="text" name="mitra_proyek" required placeholder="Type nama mitra/perusahaan (misal: PT. Digital Solusindo)" class="w-1/2 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242]">
                </div>

                <button type="submit" class="bg-[#308242] text-white px-6 py-2 rounded-md font-bold hover:bg-green-700 w-fit">
                    Simpan Detail Proyek</button>
            </form>
        </section>
        
        <div class="flex gap-4 mt-12 mb-8">
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition">Rincian Mahasiswa</button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition">Pengaduan</button>
            <button class="flex-1 border border-[#308242] text-[#308242] font-bold py-3 rounded-md hover:bg-green-50 transition">Input Proyek</button>
        </div>
    </main>
</body>
</html>
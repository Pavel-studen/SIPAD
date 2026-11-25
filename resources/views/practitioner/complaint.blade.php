<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIPAD — Daftar Pengaduan</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
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
        <div class="text-center mb-10">
            <h1 class="text-[42px] font-bold text-[#486284] mb-2">List Aduan</h1>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-sm border border-black/10 min-h-[400px]">
            <div class="mb-6 relative">
                <h2 class="text-[#2D3748] text-center text-[20px] font-bold leading-[76px] tracking-[0.5px]">Daftar Mahasiswa</h2>
            </div>
            <!-- Table for displaying team list -->
            <div class="overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <table class="w-full text-center border-collapse">
                    <thead class="bg-[#8DD99D]">
                        <tr class="h-[89px] text-gray-900">
                            <th class="p-4 font-bold align-middle">NIM</th>
                            <th class="p-4 font-bold align-middle">Nama Mahasiswa</th>
                            <th class="p-4 font-bold align-middle">Alasan</th>
                            <th class="p-4 font-bold align-middle">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-200 hover:bg-gray-50 h-[70px]">
                            <td class="p-4 text-black-700 font-medium">2201923</td>
                            <td class="p-4 text-black-700 font-medium">Michael Harold</td>
                            <td class="p-4 text-black-700 font-medium">Bolos kuliah</td>
                            <td class="p-4 text-black-700 font-medium">
                                <button class="px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-semibold hover:bg-green-200">
                                    Detail</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex gap-4 mt-12 mb-8">
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition">Rincian Mahasiswa</button>
            <button class="flex-1 border border-[#308242] text-[#308242] font-bold py-3 rounded-md hover:bg-green-50 transition">Pengaduan</button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition">Input Proyek</a></button>
        </div>
    </main>
</body>
</html>
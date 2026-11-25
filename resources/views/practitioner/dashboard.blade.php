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

        <div class="text-center mb-10">
            <!-- Greeting message -->
            <h1 class="text-[42px] font-bold text-[#486284] mb-2">Selamat Datang</h1>
        </div>

        <!-- Ringkasan Statistik -->
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border-2 border-[#B8E4C7]">
            <form action="{{ route('practitioner.dashboard') }}" method="GET" class="flex-1 flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-3 flex items-center text-[#308242]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/>
                        </svg>
                    </span>
                    <input type="text" name="search" value="{{ $search ?? '' }}"
                           placeholder="Cari NIM / Nama..."
                           class="w-full pl-10 pr-4 py-2.5 border border-[#9CD6B0] rounded-lg text-sm focus:outline-none focus:border-[#308242] focus:ring-1 focus:ring-[#308242]">
                </div>
                <button type="submit" class="bg-[#308242] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition cursor-pointer">Cari</button>
                @if(!empty($search))
                    <a href="{{ route('practitioner.dashboard') }}" class="px-4 py-2.5 border border-[#9CD6B0] text-[#486284] rounded-lg text-sm font-semibold hover:bg-[#EDF9F1] text-center transition">Reset</a>
                @endif
            </form>

            <!-- Ringkasan Total Mahasiswa -->
            <div class="bg-[#D4F1DF] border border-[#9CD6B0] rounded-lg px-5 py-2 flex items-center justify-between md:justify-center gap-3 shrink-0">
                <span class="text-xs font-bold text-[#308242] ">Total:</span>
                <span class="text-xl font-bold text-[#308242]">24<span class="text-xs font-semibold text-[#308242]">Mahasiswa</span></span>
            </div>
        </div>

        <div class="overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <table class="w-full text-center border-collapse">
                    <thead class="bg-[#8DD99D]">
                        <tr class="h-[89px] text-gray-900">
                            <th class="p-4 font-bold align-middle">NIM</th>
                            <th class="p-4 font-bold align-middle">Nama Mahasiswa</th>
                            <th class="p-4 font-bold align-middle">Role Utama</th>
                            <th class="p-4 font-bold align-middle">Role Sekunder</th>
                            <th class="p-4 font-bold align-middle">Score</th>
                            <th class="p-4 font-bold align-middle">Status</th>
                            <th class="p-4 font-bold align-middle">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-200 hover:bg-gray-50 h-[70px]">
                            <td class="p-4 text-black-700 font-medium">2201923</td>
                            <td class="p-4 text-black-700 font-medium">Budi Santoso</td>
                            <td class="p-4 text-black-700 font-medium">UI/UX Designer</td>
                            <td class="p-4 text-black-700 font-medium">Frontend Dev</td>
                            <td class="p-4 text-black-700 font-medium">88/100</td>
                            <td class="p-4 text-black-700 font-medium">Verified</td>
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
            <button class="flex-1 border border-[#308242] text-[#308242] font-bold py-3 rounded-md hover:bg-green-50 transition">Rincian Mahasiswa</button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition">Pengaduan</button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition">Input Proyek</button>
        </div>
    </main>
</body>
</html>

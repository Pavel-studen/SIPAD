<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monitoring - PAD UI/UX</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-white text-neutral-900" style="font-family: 'Montserrat', sans-serif;">
    
    <!-- Header -->
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-sm">
        <div class="text-white font-bold text-2xl">SIPAD</div>
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-medium text-[16px]">
                Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.
            </div>
            <!-- Profil Placeholder -->
            <div class="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-[#308242] font-bold">D</span>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="w-full max-w-5xl mx-auto px-4 py-10">
        
        <!-- Page Title -->
        <h1 class="text-4xl font-bold text-[#486284] text-center mb-10 tracking-wide">
            Monitoring
        </h1>
        
        <!-- 4 Metric Cards Grid -->
        <div class="grid grid-cols-4 gap-4 mb-8">
            <div class="border border-gray-300 rounded-md p-4 flex flex-col justify-center bg-white shadow-sm">
                <span class="text-sm font-semibold text-[#486284]">KRS Mahasiswa</span>
            </div>
            <div class="border border-gray-300 rounded-md p-4 flex flex-col bg-white shadow-sm">
                <span class="text-sm font-semibold text-green-700">Form Selesai</span>
                <span class="text-sm font-medium">76 / 102 (74.2%)</span>
            </div>
            <div class="border border-gray-300 rounded-md p-4 flex flex-col bg-white shadow-sm">
                <span class="text-sm font-semibold text-green-700">Tim Gemastik & LIDM</span>
                <span class="text-sm font-medium">3 Tim (12 Mahasiswa)</span>
            </div>
            <div class="border border-gray-300 rounded-md p-4 flex flex-col bg-white shadow-sm">
                <span class="text-sm font-semibold text-green-700">Status Kunci Data</span>
                <div class="flex items-center gap-2 mt-1">
                    <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span class="text-sm font-medium">Buka</span>
                </div>
            </div>
        </div>

        <!-- Schedule & Settings Section -->
        <div class="space-y-4 mb-10">
            <!-- Row 1: Jadwal Pendaftaran -->
            <div class="flex items-stretch gap-4 h-[50px]">
                <div class="w-1/3 bg-[#D4F1DF] text-[#308242] font-semibold text-sm flex items-center px-4 rounded-md border border-gray-200">
                    Jadwal Pendaftaran
                </div>
                <div class="flex-1 border border-gray-300 rounded-md flex items-center justify-center text-sm font-medium">
                    1 Agustus 2067 - 28 Agustus 2067
                </div>
                <button class="bg-[#308242] text-white px-6 rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                    ✎ Edit
                </button>
            </div>

            <!-- Row 2: Jadwal Rilis Tim -->
            <div class="flex items-stretch gap-4 h-[50px]">
                <div class="w-1/3 bg-[#D4F1DF] text-[#308242] font-semibold text-sm flex items-center px-4 rounded-md border border-gray-200">
                    Jadwal Rilis Tim PAD
                </div>
                <div class="flex-1 border border-gray-300 rounded-md flex items-center justify-center text-sm font-medium">
                    6 September 2067
                </div>
                <button class="bg-[#308242] text-white px-6 rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                    ✎ Edit
                </button>
            </div>

            <!-- Row 3: Kewajiban Role Sekunder -->
            <div class="flex items-stretch gap-4 h-[50px]">
                <div class="w-1/3 bg-[#D4F1DF] text-[#308242] font-semibold text-sm flex items-center px-4 rounded-md border border-gray-200">
                    Kewajiban Role Sekunder (Role 2)
                </div>
                <div class="flex-1 border border-gray-300 rounded-md flex items-center px-4 text-sm font-medium gap-2">
                    <input type="checkbox" checked class="w-4 h-4 text-[#308242] rounded border-gray-300 focus:ring-[#308242]">
                    Aktif (Mahasiswa WAJIB memilih Role Pilihan Kedua)
                </div>
            </div>
        </div>

        <!-- Lock Button -->
        <div class="flex justify-center mb-10">
            <button class="bg-[#308242] text-white font-bold py-3 px-8 rounded-md hover:bg-green-700 transition shadow-sm w-2/3">
                Kunci Semua Data Mahasiswa
            </button>
        </div>

        <!-- System Generation Controls -->
        <div class="border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center gap-4 bg-gray-50">
            <div class="bg-green-100 text-[#308242] font-semibold px-4 py-1 rounded text-sm">
                Siap
            </div>
            <p class="text-sm font-medium">108 Mahasiswa Reguler + 3 Tim Khusus Terkunci</p>
            <button class="border-2 border-[#308242] text-[#308242] font-bold py-2 px-6 rounded-md hover:bg-green-50 transition flex items-center gap-2 mt-2">
                🎲 Jalankan pengacakan tim PAD otomatis
            </button>
        </div>

        <div class="flex gap-4 mt-12 mb-8">
            <button class="flex-1 border border-[#308242] text-[#308242] font-bold py-3 rounded-md hover:bg-green-50 transition"><a href="{{ route('dosen.control') }}">Kontrol</a></button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('dosen.access') }}">User</a></button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('dosen.bypass') }}">Bypass</a></button>
        </div>
        
    </main>
</body>
</html>
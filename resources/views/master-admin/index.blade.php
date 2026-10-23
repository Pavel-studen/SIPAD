<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Admin - PAD UI/UX</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;">
    
    <!-- Top Navbar / Header -->
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-md relative z-10">
        <div class="text-white font-bold text-2xl">SIPAD</div>
        
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-bold text-[13px]">
                AdminPAD123 (MasterAdmin)
            </div>
            <div class="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                <span class="text-[#308242] font-bold text-xl">M</span>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="w-full max-w-6xl mx-auto px-4 py-8">
        
        <!-- Greeting Section -->
        <div class="text-center mb-10">
            <h1 class="text-[42px] font-bold text-[#486284] mb-2">Selamat Datang</h1>
            <p class="text-gray-500 font-medium">Dashboard Master Admin</p>
        </div>
        
        <!-- Table / Content Card -->
        <div class="bg-white p-8 rounded-xl shadow-sm border border-black/10 min-h-[400px]">
            
            <!-- Judul dari Figma -->
            <div class="mb-6 relative">
                <h2 class="text-[#486284] text-center text-[20px] font-bold leading-[76px] tracking-[0.5px]">
                    Daftar Dosen Admin
                </h2>
                <button class="absolute right-0 top-1/2 -translate-y-1/2 bg-[#308242] text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-green-700 transition shadow-sm">
                    + Tambah Admin
                </button>
            </div>
            
            <!-- Table Implementation using Frame 9 Design -->
            <div class="overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <table class="w-full text-center border-collapse">
                    <thead class="bg-[#8DD99D]">
                        <tr class="h-[89px] text-gray-900">
                            <th class="p-4 font-bold align-middle">NIP</th>
                            <th class="p-4 font-bold align-middle">Nama</th>
                            <th class="p-4 font-bold align-middle">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Contoh baris data tabel -->
                        <tr class="border-b border-gray-200 hover:bg-gray-50 h-[70px]">
                            <td class="p-4 text-gray-700 font-medium">123456</td>
                            <td class="p-4 text-gray-700 font-medium">Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.</td>
                            <td class="p-4 text-gray-700 font-medium">
                                <button class="text-blue-600 hover:underline mx-1">Edit</button>
                                <button class="text-red-600 hover:underline mx-1">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    </main>
</body>
</html>
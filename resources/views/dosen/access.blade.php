<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Akses - PAD UI/UX</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;">
    
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-sm">
        <div class="text-white font-bold text-2xl">SIPAD</div>
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-medium text-[16px]">Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.</div>
            <!-- <div class="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-[#308242] font-bold">D</span>
            </div> -->
        </div>
    </header>

    <main class="w-full max-w-6xl mx-auto px-4 py-8 bg-white mt-6 rounded-lg shadow-sm border border-gray-200">
        
        <section class="mb-10">
            <h2 class="text-[#486284] text-lg font-bold mb-4 uppercase tracking-wide">Tambah Stakeholder (Manual Input)</h2>
            
            <div class="flex items-end gap-4 mb-4">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ketik Alamat Email:</label>
                    <input type="email" placeholder="email.user@ugm.ac.id" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#308242] focus:border-[#308242]">
                </div>
                <div class="w-1/3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Peran Akses:</label>
                    <select class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#308242] focus:border-[#308242] bg-white">
                        <option>Praktisi (Dosen Industri)</option>
                        <option>Asisten Praktikum</option>
                    </select>
                </div>
                <button class="bg-[#308242] text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition h-[42px]">+ Tambah Email</button>
            </div>
            
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 font-medium">atau</span>
                <button class="bg-[#308242] text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition">Import File CSV Peserta KRS</button>
            </div>
        </section>

        <hr class="border-gray-200 mb-8">

        <section class="mb-10">
            <h2 class="text-[#486284] text-lg font-bold mb-4 uppercase tracking-wide">Email Terdaftar System</h2>
            
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2 w-1/2">
                    <label class="text-sm font-medium text-[#308242]">Search:</label>
                    <input type="text" placeholder="Cari Email / Nama..." class="w-full border border-gray-300 rounded-md px-4 py-1.5 text-sm focus:ring-[#308242] focus:border-[#308242]">
                </div>
                <div class="flex items-center gap-2">
                    <label class="text-sm font-medium text-[#308242]">Filter:</label>
                    <select class="border border-gray-300 rounded-md px-4 py-1.5 text-sm focus:ring-[#308242] focus:border-[#308242] bg-white">
                        <option>Semua Peran</option>
                    </select>
                </div>
            </div>
            
            <div class="overflow-x-auto border border-gray-200 rounded-lg mb-4">
                <table class="w-full text-left border-collapse text-sm">
                    <thead class="bg-[#8DD99D]">
                        <tr class="text-gray-900">
                            <th class="p-3 font-bold uppercase text-xs">Email</th>
                            <th class="p-3 font-bold uppercase text-xs">Nama / NIM</th>
                            <th class="p-3 font-bold uppercase text-xs">Peran Akses</th>
                            <th class="p-3 font-bold uppercase text-xs">Status Data</th>
                            <th class="p-3 font-bold uppercase text-xs text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="p-3 text-gray-700">pak.budi@praktisi.com</td>
                            <td class="p-3 text-gray-700">Budi Gunawan, M.T.</td>
                            <td class="p-3">
                                <select class="border border-gray-300 rounded px-2 py-1 text-xs w-full bg-white">
                                    <option>Praktisi</option>
                                </select>
                            </td>
                            <td class="p-3">
                                <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold border border-green-200">Verified</span>
                            </td>
                            <td class="p-3 text-center">
                                <button class="text-[#308242] font-bold hover:underline mx-1">Hapus</button>
                            </td>
                        </tr>

                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="p-3 text-gray-700">asdos.dewa@mail.ugm.ac.id</td>
                            <td class="p-3 text-gray-700">Dewa Pratama (Asprak)</td>
                            <td class="p-3">
                                <select class="border border-gray-300 rounded px-2 py-1 text-xs w-full bg-white">
                                    <option>Asprak</option>
                                </select>
                            </td>
                            <td class="p-3">
                                <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold border border-green-200">Verified</span>
                            </td>
                            <td class="p-3 text-center">
                                <button class="text-[#308242] font-bold hover:underline mx-1">Hapus</button>
                            </td>
                        </tr>
                    
                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="p-3 text-gray-700">siti.rahma@mail.ugm.ac.id</td>
                            <td class="p-3 text-gray-700">Siti Rahmawati</td>
                            <td class="p-3">
                                <select class="border border-gray-300 rounded px-2 py-1 text-xs w-full bg-white">
                                    <option>Mahasiswa</option>
                                </select>
                            </td>
                            <td class="p-3">
                                <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold border border-blue-200">Form Filled</span>
                            </td>
                            <td class="p-3 text-center">
                                <button class="text-[#308242] font-bold hover:underline mx-1">Hapus</button>
                            </td>
                        </tr>

                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="p-3 text-gray-700">andi.w@gmail.com</td>
                            <td class="p-3 text-gray-700">Andi Wijaya</td>
                            <td class="p-3">
                                <select class="border border-gray-300 rounded px-2 py-1 text-xs w-full bg-white">
                                    <option>Project Own...</option>
                                </select>
                            </td>
                            <td class="p-3">
                                <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold border border-red-200">Not Submitted</span>
                            </td>
                            <td class="p-3 text-center">
                                <button class="text-[#308242] font-bold hover:underline mx-1">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex justify-between items-center text-sm text-gray-500">
                <span>Showing 1-4 of 24</span>
                <div class="flex items-center gap-1">
                    <button class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">&lt;</button>
                    <button class="px-3 py-1 bg-[#308242] text-white rounded font-medium">1</button>
                    <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">2</button>
                    <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">3</button>
                    <button class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">&gt;</button>
                </div>
            </div>
        </section>

        <hr class="border-gray-200 mb-8">

        <section>
            <h2 class="text-[#486284] text-lg font-bold mb-2 uppercase tracking-wide">Input Detail Proyek</h2>
            <p class="text-xs text-gray-500 mb-4 italic">*Silakan ketik manual detail informasi proyek untuk PAD.</p>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-[#308242] mb-1">1. Nama Proyek</label>
                <input type="text" placeholder="Type nama proyek (misal: E-Commerce Smart Village)" class="w-1/2 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242]">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-[#308242] mb-1">2. Project Owner (PO)</label>
                <input type="text" placeholder="Type nama PO (misal: Ir. Hendra S.T., M.Eng.)" class="w-1/2 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242]">
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-[#308242] mb-1">3. Nama Mitra Proyek</label>
                <input type="text" placeholder="Type nama mitra/perusahaan (misal: PT. Digital Solusindo)" class="w-1/2 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242]">
            </div>
            <div class="pt-2">
            <button type="button" class="w-[320px] h-[44px] bg-[#308242] text-white rounded-md font-semibold flex justify-center items-center hover:bg-green-700 transition shadow-sm">Simpan Detail Proyek</button>
            </div>
        </section>

        <div class="flex gap-4 mt-12 mb-8">
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('dosen.control') }}">Kontrol</a></button>
            <button class="flex-1 border border-[#308242] text-[#308242] font-bold py-3 rounded-md hover:bg-green-50 transition"><a href="{{ route('dosen.access') }}">User</a></button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('dosen.bypass') }}">Bypass</a></button>
        </div>

    </main>
</body>
</html>
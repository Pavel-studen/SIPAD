<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Admin - PAD UI/UX</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;" x-data="{ showModal: false, showAddModal: false, showErrorModal: false, selectedNip: '' }">
    
    <!-- Header -->
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-md relative z-10">
        <!-- Logo -->
        <div class="text-white font-bold text-2xl">SIPAD</div>
        
        <!-- Admin name -->
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-Montserrat font-[18.369px] font-bold font-[700px] line-normal">AdminPAD123 (MasterAdmin)</div>
            <!-- <div class="text-white text-right font-bold text-[18px]">AdminPAD123 (MasterAdmin)</div> -->
            <!-- <div class="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                <span class="text-[#308242] font-bold text-xl">M</span>
            </div> -->
        </div>
    </header>

    <main class="w-full max-w-6xl mx-auto px-4 py-8">
        <div class="text-center mb-10">
            <!-- Greeting message -->
            <h1 class="text-[42px] font-bold text-[#486284] mb-2">Selamat Datang</h1>
            <p class="text-gray-500 font-medium">Dashboard Master Admin</p>
        </div>
        
        <div class="bg-white p-8 rounded-xl shadow-sm border border-black/10 min-h-[400px]">
            <div class="mb-6 relative">
                <h2 class="text-[#486284] text-center text-[20px] font-bold leading-[76px] tracking-[0.5px]">Daftar Dosen Admin</h2>
                <!-- Button for adding new admin -->
                <button @click="showAddModal = true" class="absolute right-0 top-1/2 -translate-y-1/2 bg-[#308242] text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-green-700 transition shadow-sm">
                    + Tambah Admin</button>
            </div>
            <!-- Table for displaying admin list -->
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
                        <tr class="border-b border-gray-200 hover:bg-gray-50 h-[70px]">
                            <td class="p-4 text-black-700 font-medium">568209</td>
                            <td class="p-4 text-black-700 font-medium">Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.</td>
                            <td class="p-4 text-gray-700 font-medium">
                                <!-- <button class="text-blue-600 hover:underline mx-1">Edit</button> -->
                                <button @click="showModal = true" class="text-[#308242] font-bold hover:underline mx-1">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
    <div x-show="showModal" 
         x-cloak
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-100"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0">
         
        <div 
            @click.away="showModal = false"
            class="bg-white w-[737px] h-[269px] rounded-lg border border-[#308242] shadow-2xl p-8 flex flex-col items-center justify-between relative">
            
            <div class="text-center mt-2">
                <h3 class="text-[24px] font-bold text-black mb-3">Cabut Hak Akses?</h3>
                <p class="text-[20px] font-normal text-black leading-snug">Apakah Anda yakin untuk menghilangkan hak<br>akses admin?</p>
            </div>

            <div class="flex items-center justify-center gap-6 w-full mb-2">
                <button @click="showModal = false" type="button" class="w-[180px] h-[45px] border border-gray-400 rounded-md text-gray-700 font-medium text-[16px] hover:bg-gray-100 transition">
                    Tidak</button>

                <button type="submit" class="w-[180px] h-[45px] bg-[#308242] rounded-md text-white font-medium text-[16px] hover:bg-green-800 transition shadow-sm">
                    Iya</button>
            </div>
            
        </div>
    </div>
    <div 
        x-show="showAddModal" 
        x-cloak
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-100"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
    >
        <div @click.away="showAddModal = false" class="bg-white w-[644px] rounded-lg border-2 border-[#308242] shadow-2xl overflow-hidden">
            <div class="px-8 py-5 border-b border-gray-200">
                <h3 class="text-[24px] font-bold text-[#486284]">Input Data</h3>
            </div>

            <div class="p-8">
                <form method="POST" action="{{ route('master-admin.store') }}" class="flex flex-col gap-6">
                    @csrf
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#308242]">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                        </div>
                        <input type="text" name="nama" placeholder="Nama Dosen" required
                            class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#308242] focus:ring-1 focus:ring-[#308242]">
                    </div>

                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#308242]">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                        </div>
                        <input type="email" name="email" placeholder="Email Dosen" required
                            class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#308242] focus:ring-1 focus:ring-[#308242]">
                    </div>

                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#308242] font-bold text-lg">#</div>
                        <input type="text" name="nip" placeholder="NIP Dosen" required
                            class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#308242] focus:ring-1 focus:ring-[#308242]">
                    </div>

                    <div class="mt-2">
                        <button @click.prevent="showAddModal = false; showErrorModal = true" type="submit" class="bg-[#308242] text-white px-6 py-2.5 rounded-md text-[15px] font-bold hover:bg-green-800 transition shadow-sm flex items-center gap-2">
                            <svg class="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                            Terima</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div 
        x-show="showErrorModal" 
        x-cloak
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0"
    >
        <div 
            @click.away="showErrorModal = false"
            class="bg-white w-[737px] h-[331px] rounded-lg border-[3px] border-[#308242] shadow-2xl flex flex-col items-center justify-center relative p-8"
        >
            <div class="mb-4">
                <svg class="w-16 h-16 text-[#308242]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 102 0V7zm-1 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd"></path>
                </svg>
            </div>

            <div class="text-center mb-8">
                <h3 class="text-[28px] font-bold text-[#486284] mb-2">Data Dosen Tidak Ditemukan</h3>
                <p class="text-[20px] font-normal text-gray-700">Periksa ulang data yang Anda masukan</p>
            </div>

            <button 
                @click="showErrorModal = false" 
                type="button"
                class="w-[180px] h-[45px] bg-[#308242] rounded-md text-white font-medium text-[18px] hover:bg-green-800 transition shadow-sm">Oke</button>
        </div>
    </div>
</body>
</html>
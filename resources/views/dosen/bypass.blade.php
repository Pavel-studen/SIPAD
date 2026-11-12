<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pendaftaran Tim Gemastik - SIPAD</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;" x-data="{ showConfirmModal: false }">
    
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-sm">
        <div class="text-white font-bold text-2xl">SIPAD</div>
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-medium text-[16px]">Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.</div>
            <!-- <div class="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-[#308242] font-bold">D</span>
            </div> -->
        </div>
    </header>

    <main class="w-full max-w-5xl mx-auto px-4 py-8 bg-white mt-6 rounded-lg shadow-sm border border-gray-200">
        
        <section class="mb-12">
            <h2 class="text-[#486284] text-sm font-bold mb-6 uppercase tracking-wide">Daftarkan Tim Gemastik/LIDM (Bypass Matching Engine)</h2>
            
            <div class="space-y-4">
                <div class="flex gap-4">
                    <div class="w-1/2">
                        <label class="block text-xs font-semibold text-gray-500 mb-1">Nama Tim</label>
                        <input type="text" placeholder="Tim Software Gemastik A" class="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242]">
                    </div>
                    <div class="w-1/2">
                        <label class="block text-xs font-semibold text-gray-500 mb-1">Kategori Lomba</label>
                        <select class="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242] bg-white">
                            <option>GEMASTIK - Software Development</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1">Anggota Terikat</label>
                    <div class="flex gap-4">
                        <input type="text" placeholder="Typing NIM / Nama Mahasiswa..." class="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-[#308242] focus:border-[#308242]">
                        <button class="bg-[#308242] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition">+ Tambah Anggota</button>
                    </div>
                </div>
                
                <div class="space-y-2 mt-4">
                    <div class="flex justify-between items-center bg-[#D4F1DF] text-[#308242] px-4 py-2 rounded-md text-sm font-medium border border-green-200">
                        <span>2201923 | Budi Santoso (UI/UX)</span>
                        <button class="text-green-700 hover:text-green-900 font-bold">x</button>
                    </div>
                    <div class="flex justify-between items-center bg-[#D4F1DF] text-[#308242] px-4 py-2 rounded-md text-sm font-medium border border-green-200">
                        <span>2201925 | Andi Wijaya (Backend)</span>
                        <button class="text-green-700 hover:text-green-900 font-bold">x</button>
                    </div>
                </div>
                
                <div class="flex justify-center mt-8">
                    <button 
                        @click="showConfirmModal = true"
                        type="button"
                        class="bg-[#308242] text-white px-10 py-3 rounded-md font-bold text-sm hover:bg-green-700 transition">Kunci & Simpan Tim Khusus</button>
                </div>
            </div>
        </section>

        <hr class="border-gray-300 border-dashed mb-8">

        <section class="mb-12">
            <h2 class="text-[#486284] text-sm font-bold mb-4 uppercase tracking-wide">Daftar Tim Gemastik/LIDM</h2>
            <div class="overflow-x-auto border border-gray-300 rounded-lg">
                <table class="w-full text-left border-collapse text-sm">
                    <thead class="bg-[#D4F1DF] text-[#308242]">
                        <tr>
                            <th class="p-3 font-bold uppercase text-xs w-1/4">Nama Tim</th>
                            <th class="p-3 font-bold uppercase text-xs w-1/6">Lomba</th>
                            <th class="p-3 font-bold uppercase text-xs">Anggota</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-t border-gray-200 hover:bg-gray-50 align-top">
                            <td class="p-4 text-gray-800 font-medium">Nasi cumi pak kris</td>
                            <td class="p-4 text-gray-600">GEMASTIK</td>
                            <td class="p-4 text-gray-600">
                                <b>4 Mahasiswa:</b> Misbahul Huda, Huda Misbahul, Huda tanpa Misbahul, Misbahul tanpa Huda
                            </td>
                        </tr>
                        <tr class="border-t border-gray-200 hover:bg-gray-50 align-top">
                            <td class="p-4 text-gray-800 font-medium">Kata huda nama tim nya skibidi toilet jadi kita satuju</td>
                            <td class="p-4 text-gray-600">LIDM</td>
                            <td class="p-4 text-gray-600">
                                <b>3 Mahasiswa:</b> Huda Misbahul, Huda tanpa Misbahul, Misbahul tanpa Huda
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        <div class="flex gap-4 mt-12 mb-8">
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('dosen.control') }}">Kontrol</a></button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('dosen.access') }}">User</a></button>
            <button class="flex-1 border border-[#308242] text-[#308242] font-bold py-3 rounded-md hover:bg-green-50 transition"><a href="{{ route('dosen.bypass') }}">Bypass</a></button>
        </div>
    </main>
    <div
        x-show="showConfirmModal"
        x-cloak
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        x-transition:enter="transition ease-out duration-100"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-100"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0">
        <div
            @click.away="showConfirmModal = false"
            class="bg-white w-[737px] h-[331px] rounded-[15px] border-[3.68px] border-[#308242] shadow-xl p-[48px] flex flex-col items-center justify-between">
            <div class="text-[#308242]">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
            </div>
            <div class="text-center">
                <h3 class="text-[24px] font-bold text-[#486284] mb-2">Konfirmasi Kunci Tim</h3>
                <p class="text-[18px] text-gray-600">Apakah Anda yakin ingin mengunci tim di atas?</p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-center gap-6 w-full">
                <!-- Cancel button -->
                <button 
                    @click="showConfirmModal = false" 
                    type="button"
                    class="w-[140px] h-[45px] border border-gray-400 rounded-md text-gray-700 font-bold text-[16px] hover:bg-gray-100 transition">
                    Tidak</button>

                <!-- Form Submit Action to Laravel -->
                <form method="POST" action="{{ route('special-team.lock') }}">
                    @csrf
                    <!-- Give the team ID if available -->
                    <input type="hidden" name="team_id" value="{{ $teamId ?? '' }}">
                    
                    <button 
                        type="submit"
                        class="w-[140px] h-[45px] bg-[#308242] rounded-md text-white font-bold text-[16px] hover:bg-green-800 transition shadow-sm">
                        Iya</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>

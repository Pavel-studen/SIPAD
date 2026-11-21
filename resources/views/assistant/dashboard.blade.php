<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Asisten Praktikum - SIPAD</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;" x-data="{ isModalOpen: false }">
    
    <!-- Header -->
    <header class="bg-[#0773DF] w-full h-[92px] flex items-center justify-between px-8 shadow-md relative z-10">
        <!-- Logo -->
        <div class="text-white font-bold text-2xl">SIPAD</div>
        
        <!-- Student name -->
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-Roboto font-[18.369px] font-bold font-[700px] line-normal">Michael Harold (123456)</div>
            <div class="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                <span class="text-[#0773DF] font-bold text-xl">M</span>
            </div>
        </div>
    </header>

    <main class="w-full max-w-6xl mx-auto px-4 py-8">
        <!-- Greeting message -->
        <div class="text-center mb-10">
            <h1 class="text-[42px] font-bold text-[#486284] mb-2">Selamat Datang</h1>
        </div>
        
        <div class="bg-white p-8 rounded-xl shadow-sm border border-black/10 min-h-[400px]">
            <div class="mb-6 relative">
                <h2 class="text-[#486284] text-center text-[20px] font-bold leading-[76px] tracking-[0.5px]">Daftar Tim Bimbingan PAD</h2>
            </div>
            <!-- Table for displaying team list -->
            <div class="overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <table class="w-full text-center border-collapse">
                    <thead class="bg-[#C0DDF9]">
                        <tr class="h-[89px] text-gray-900">
                            <th class="p-4 font-bold align-middle">Tim</th>
                            <th class="p-4 font-bold align-middle">Project Owner</th>
                            <th class="p-4 font-bold align-middle">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-200 hover:bg-gray-50 h-[70px]">
                            <td class="p-4 text-black-700 font-medium">Kelompok 3</td>
                            <td class="p-4 text-black-700 font-medium">Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.</td>
                            <td class="p-4 text-black-700 font-medium">
                                <button @click="isModalOpen = true" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-semibold hover:bg-blue-200">
                                    Detail</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
    <div x-show="isModalOpen" 
         style="display: none;" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
         x-transition.opacity>
        
        <!-- Modal Content Box -->
        <div @click.outside="isModalOpen = false" 
             class="bg-white rounded-2xl shadow-xl w-full max-w-2xl border-2 border-[#0773DF] flex flex-col max-h-[90vh]"
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
             x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100">
            
            <!-- Modal Header -->
            <div class="px-8 py-5 border-b border-[#0773DF]">
                <h3 class="text-2xl font-bold text-[#486284]">Detail Kelompok 3</h3>
            </div>
            
            <!-- Modal Body -->
            <div class="p-8 overflow-y-auto space-y-6">
                
                <!-- Role Item: Project Manager -->
                <div>
                    <h4 class="text-lg font-bold text-[#486284]">Project Manager</h4>
                    <div class="mt-2 bg-[#CDE1F8] border border-[#6D9EEB] rounded-md p-3 flex items-center gap-3">
                        <div class="bg-[#0773DF] text-white p-1 rounded shadow-sm flex items-center justify-center w-6 h-6">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
                        </div>
                        <span class="text-sm font-medium text-gray-800">Caroline Emmanuelle</span>
                    </div>
                </div>

                <!-- Role Item: UI/UX -->
                <div>
                    <h4 class="text-lg font-bold text-[#486284]">UI/UX</h4>
                    <div class="mt-2 bg-[#CDE1F8] border border-[#6D9EEB] rounded-md p-3 flex items-center gap-3">
                        <div class="text-[#0773DF] flex items-center justify-center w-6 h-6">
                           <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/></svg>
                        </div>
                        <span class="text-sm font-medium text-gray-800">Michael Harold</span>
                    </div>
                </div>

                <!-- Role Item: Front End -->
                <div>
                    <h4 class="text-lg font-bold text-[#486284]">Front End</h4>
                    <div class="mt-2 bg-[#CDE1F8] border border-[#6D9EEB] rounded-md p-3 flex items-center gap-3">
                        <div class="text-[#0773DF] flex items-center justify-center w-6 h-6">
                           <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </div>
                        <span class="text-sm font-medium text-gray-800">Paul Efraim</span>
                    </div>
                </div>

                <!-- Role Item: Back End -->
                <div>
                    <h4 class="text-lg font-bold text-[#486284]">Back End</h4>
                    <div class="mt-2 bg-[#CDE1F8] border border-[#6D9EEB] rounded-md p-3 flex items-center gap-3">
                        <div class="text-[#0773DF] flex items-center justify-center w-6 h-6">
                           <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 1.79-9 4s4.03 4 9 4 9-1.79 9-4-4.03-4-9-4zm0 13c-4.97 0-9-1.79-9-4v2c0 2.21 4.03 4 9 4s9-1.79 9-4v-2c0 2.21-4.03 4-9 4zm0 5c-4.97 0-9-1.79-9-4v2c0 2.21 4.03 4 9 4s9-1.79 9-4v-2c0 2.21-4.03 4-9 4z"/></svg>
                        </div>
                        <span class="text-sm font-medium text-gray-800">Palava Ganesha</span>
                    </div>
                </div>

                <!-- Divider Line -->
                <hr class="border-t-[3px] border-[#0773DF] my-2 rounded-full">

                <!-- Section: Pengaduan -->
                <div>
                    <h4 class="text-lg font-bold text-[#486284]">Pengaduan</h4>
                    <div class="mt-2 bg-[#CDE1F8] border border-[#6D9EEB] rounded-md p-4 relative">
                        <p class="font-bold text-sm text-gray-900 mb-2">UI/UX - Michael Harold (25/568209/SV/27391)</p>
                        <p class="text-sm text-gray-800 mb-6 leading-relaxed">Michael Harold gapernah kerja nihh, suka ilang ilangan dan kalo udah weekly report selalu ga berangkat</p>
                        <p class="font-bold text-sm text-gray-900">Suka ilang ilangan</p>
                        
                        <!-- Floating Document Icon -->
                        <a href="{{ route('assistant.pengaduan-detail', ['id' => 1]) }}" class="absolute bottom-3 right-3 bg-white p-2 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
                            <svg class="w-6 h-6 text-[#0773DF]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal Footer -->
            <div class="px-8 pb-6 flex justify-end">
                <!-- Tombol Selesai (sekaligus menutup modal) -->
                <button @click="isModalOpen = false" class="px-5 py-2 bg-[#0773DF] text-white rounded-md font-semibold text-sm hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Selesai</button>
            </div>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monitoring - PAD UI/UX</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-white text-neutral-900" style="font-family: 'Montserrat', sans-serif;" x-data="{ showRandomizeModal: false, showEditScheduleModal: false }">
    
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-sm">
        <div class="text-white font-bold text-2xl">SIPAD</div>
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-medium text-[16px]">Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.</div>
            <!-- <div class="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden">
                <span class="text-[#308242] font-bold">D</span>
            </div> -->
        </div>
    </header>

    <main class="w-full max-w-5xl mx-auto px-4 py-10">
        
        <h1 class="text-4xl font-bold text-[#486284] text-center mb-10 tracking-wide">Monitoring</h1>
        
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

        <div class="space-y-4 mb-10">
            <div class="flex items-stretch gap-4 h-[50px]">
                <div class="w-1/3 bg-[#D4F1DF] text-[#308242] font-semibold text-sm flex items-center px-4 rounded-md border border-gray-200">
                    Jadwal Pendaftaran</div>
                <div class="flex-1 border border-gray-300 rounded-md flex items-center justify-center text-sm font-medium">
                    1 Agustus 2067 - 28 Agustus 2067</div>
                <button 
                    @click="showEditScheduleModal = true"
                    class="bg-[#308242] text-white px-6 rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-green-700 transition shadow-sm">
                    ✎ Edit</button>
            </div>

            <div class="flex items-stretch gap-4 h-[50px]">
                <div class="w-1/3 bg-[#D4F1DF] text-[#308242] font-semibold text-sm flex items-center px-4 rounded-md border border-gray-200">
                    Jadwal Rilis Tim PAD</div>
                <div class="flex-1 border border-gray-300 rounded-md flex items-center justify-center text-sm font-medium">
                    6 September 2067</div>
                <button 
                    @click="showEditScheduleModal = true"
                    class="bg-[#308242] text-white px-6 rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-green-700 transition shadow-sm">
                    ✎ Edit</button>
            </div>

            <div class="flex items-stretch gap-4 h-[50px]">
                <div class="w-1/3 bg-[#D4F1DF] text-[#308242] font-semibold text-sm flex items-center px-4 rounded-md border border-gray-200">
                    Kewajiban Role Sekunder (Role 2)</div>
                <div class="flex-1 border border-gray-300 rounded-md flex items-center px-4 text-sm font-medium gap-2">
                    <input type="checkbox" checked class="w-4 h-4 text-[#308242] rounded border-gray-300 focus:ring-[#308242]">
                    Aktif (Mahasiswa WAJIB memilih Role Pilihan Kedua)</div>
            </div>
        </div>

        <div class="flex justify-center mb-10">
            <button class="bg-[#308242] text-white font-bold py-3 px-8 rounded-md hover:bg-green-700 transition shadow-sm w-2/3">Kunci Semua Data Mahasiswa</button>
        </div>

        <div class="border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center gap-4 bg-gray-50">
            <div class="bg-green-100 text-[#308242] font-semibold px-4 py-1 rounded text-sm">Siap</div>
            <p class="text-sm font-medium">108 Mahasiswa Reguler + 3 Tim Khusus Terkunci</p>
            <button
                @click="showRandomizeModal = true"
                type="button"
                class="border-2 border-[#308242] text-[#308242] font-bold py-2 px-6 rounded-md hover:bg-green-50 transition flex items-center gap-2 mt-2">
                🎲 Jalankan pengacakan tim PAD otomatis</button>
        </div>

        <div class="flex gap-4 mt-12 mb-8">
            <button class="flex-1 border border-[#308242] text-[#308242] font-bold py-3 rounded-md hover:bg-green-50 transition"><a href="{{ route('dosen.control') }}">Kontrol</a></button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('dosen.access') }}">User</a></button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('dosen.bypass') }}">Bypass</a></button>
        </div>
    </main>
    <!-- Randomize modal -->
    <div 
        x-show="showRandomizeModal" 
        x-cloak
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0">

        <!-- Modal Container -->
        <div 
            @click.away="showRandomizeModal = false"
            class="bg-white w-[737px] h-[368px] p-[48px] rounded-[14.7px] border-[3.68px] border-[#308242] flex flex-col items-center justify-center gap-[24px]"
            style="box-shadow: -5.9px -11.05px 22.11px 0 rgba(0, 0, 0, 0.15), 2.95px 5.9px 22.11px 0 rgba(0, 0, 0, 0.20);">
            
            <!-- Icon -->
            <div class="text-[#308242]">
                <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </div>

            <!-- Header text -->
            <div class="text-center">
                <h3 class="text-[24px] font-bold text-[#486284] mb-2">Konfirmasi Pengacakan Tim</h3>
                <p class="text-[18px] text-gray-600">Apakah Anda yakin ingin melakukan pengacakan tim secara otomatis? Proses ini akan mengatur ulang susunan tim yang belum dikunci.</p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-center gap-6 w-full mt-4">
                <!-- Cancel button -->
                <button 
                    @click="showRandomizeModal = false" 
                    type="button"
                    class="w-[140px] h-[45px] border border-gray-400 rounded-md text-gray-700 font-bold text-[16px] hover:bg-gray-100 transition">Batal</button>

                <!-- Randomize execution button -->
                <form method="POST" action="{{ route('team.randomize') }}">
                    @csrf
                    <button 
                        type="submit"
                        class="w-[140px] h-[45px] bg-[#308242] rounded-md text-white font-bold text-[16px] hover:bg-green-800 transition shadow-sm">Lanjutkan</button>
                </form>
            </div>

        </div>
    </div>

    <!-- Edit Schedule Modal -->
    <div 
        x-show="showEditScheduleModal" 
        x-cloak
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0">
        <!-- Modal container -->
        <div 
            @click.away="showEditScheduleModal = false"
            class="bg-white w-[737px] rounded-[14.74px] border-[3.68px] border-[#308242] flex flex-col p-[32px_40px] gap-[20px] relative"
            style="box-shadow: -5.9px -11.05px 22.11px 0 rgba(0, 0, 0, 0.15), 2.95px 5.9px 22.11px 0 rgba(0, 0, 0, 0.20);">
            <!-- Header modal -->
            <div class="flex justify-between items-center w-full">
                <h3 class="text-[24px] font-bold text-[#486284]">Ubah Jadwal</h3>
                <!-- Close button -->
                <button @click="showEditScheduleModal = false" class="text-gray-500 hover:text-red-500 border border-gray-300 rounded p-1">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- Information schedule range -->
            <div class="text-sm font-medium text-gray-500">
                Rentang jadwal: 1-28 Agustus 2067
            </div>

            <!-- Update form to Laravel -->
            <form method="POST" action="{{ route('schedule.update') }}" class="w-full flex flex-col items-center">
                @csrf
                @method('PUT')
                
                <!-- Input hidden to store selected dates -->
                <input type="hidden" name="start_date" value="2067-08-01">
                <input type="hidden" name="end_date" value="2067-08-28">

                <!-- Calendar UI -->
                <div class="border border-gray-200 rounded-lg p-4 w-full max-w-[400px] mb-6 shadow-sm">
                    <!-- Month/year navigation -->
                    <div class="flex justify-between items-center mb-4">
                        <button type="button" class="p-1 border border-gray-300 rounded hover:bg-gray-100">&lt;</button>
                        <div class="flex gap-2 font-bold text-gray-700">
                            <span class="border border-gray-300 px-3 py-1 rounded">Agustus</span>
                            <span class="border border-gray-300 px-3 py-1 rounded">2067</span>
                        </div>
                        <button type="button" class="p-1 border border-gray-300 rounded hover:bg-gray-100">&gt;</button>
                    </div>

                    <!-- Days of the week -->
                    <div class="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
                        <div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div><div>Min</div>
                    </div>

                    <!-- Calendar grid -->
                    <div class="grid grid-cols-7 text-center text-sm font-medium gap-y-2">
                        <!-- Row 1: Dates 1-7 -->
                        <div class="bg-[#308242] text-white py-1.5 rounded-l-md">1</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">2</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">3</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">4</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">5</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">6</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">7</div>

                        <!-- Row 2: Dates 8-14 -->
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">8</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">9</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">10</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">11</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">12</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">13</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">14</div>

                        <!-- Row 3: Dates 15-21 -->
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">15</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">16</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">17</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">18</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">19</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">20</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">21</div>

                        <!-- Row 4: Dates 22-28 -->
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">22</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">23</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">24</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">25</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">26</div>
                        <div class="bg-[#C5E9CD] text-[#308242] py-1.5">27</div>
                        <div class="bg-[#308242] text-white py-1.5 rounded-r-md">28</div>

                        <!-- Row 5: Dates outside the range -->
                        <div class="py-1.5 border border-gray-300 rounded text-gray-700">29</div>
                        <div class="py-1.5 border border-gray-300 rounded text-gray-700">30</div>
                        <div class="py-1.5 border border-gray-300 rounded text-gray-700">31</div>
                        <div class="py-1.5 text-gray-300">1</div>
                        <div class="py-1.5 text-gray-300">2</div>
                        <div class="py-1.5 text-gray-300">3</div>
                        <div class="py-1.5 text-gray-300">4</div>
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center justify-center gap-4 w-full">
                    <button 
                        @click="showEditScheduleModal = false" 
                        type="button"
                        class="px-6 py-2 border border-gray-400 rounded-md text-gray-700 font-bold hover:bg-gray-100 transition">Batal</button>
                    <button 
                        type="submit"
                        class="px-6 py-2 bg-[#308242] rounded-md text-white font-bold hover:bg-green-800 transition">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>

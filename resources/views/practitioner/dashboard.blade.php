<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rincian Mahasiswa - SIPAD</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;"
      x-data="practitioner()">

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

        <!-- Welcome Banner & Statistik -->
        <div class="text-center mb-10">
            <!-- Greeting message -->
            <h1 class="text-[42px] font-bold text-[#486284] mb-2">Selamat Datang</h1>
            <p class="text-gray-500 font-medium">Daftar Mahasiswa & Skillset</p>
        </div>

        <!-- Ringkasan Statistik -->
        <div class="flex gap-4">
            <div class="bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-sm">
                <div class="text-xs font-semibold text-gray-500 uppercase">Total Tim</div>
                <div class="text-2xl font-bold text-[#308242]">{{ $teamTotal }} <span class="text-xs font-medium text-gray-500">Tim</span></div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-sm">
                <div class="text-xs font-semibold text-gray-500 uppercase">Total Mahasiswa</div>
                <div class="text-2xl font-bold text-[#486284]">{{ $studentTotal }} <span class="text-xs font-medium text-gray-500">Mhs</span></div>
            </div>
        </div>

        <!-- Filter & Pencarian -->
        <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
            <form action="{{ route('practitioner.dashboard') }}" method="GET" class="flex flex-col sm:flex-row gap-3">
                <input type="text" name="search" value="{{ $search ?? '' }}" 
                       placeholder="Cari berdasarkan nama tim atau nama mahasiswa..." 
                       class="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#308242] focus:ring-1 focus:ring-[#308242]">
                <button type="submit" class="bg-[#308242] text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-green-700 transition">
                    Cari Tim / Mahasiswa
                </button>
                @if(!empty($search))
                    <a href="{{ route('practitioner.dashboard') }}" class="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-md text-sm font-semibold hover:bg-gray-100 text-center">
                        Reset
                    </a>
                @endif
            </form>
        </div>

        <!-- Daftar Tim & Anggota (Grid Cards) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @forelse($teams as $team)
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between">
                <div>
                    <!-- Card Header -->
                    <div class="bg-[#D4F1DF] px-6 py-4 border-b border-green-200 flex justify-between items-center">
                        <div>
                            <h2 class="font-bold text-[#308242] text-lg">{{ $team->name }}</h2>
                            <span class="text-xs font-medium text-green-800">{{ $team->lomba ?? 'Proyek Aplikasi Dasar (Reguler)' }}</span>
                        </div>
                        <span class="bg-white text-[#308242] text-xs font-bold px-3 py-1 rounded-full border border-green-300">
                            {{ $team->members->count() }} Anggota
                        </span>
                    </div>

                    <!-- List Anggota Tim -->
                    <div class="p-6 flex-grow">
                        <ul class="space-y-3">
                            @foreach($team->members as $member)
                            <li class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-green-300 hover:shadow-sm transition bg-gray-50 hover:bg-white group">
                                <div class="flex items-center gap-3">
                                    
                                    <div class="w-10 h-10 rounded-full bg-[#486284] text-white flex items-center justify-center font-bold text-sm">
                                        {{ substr($member->user->name ?? 'U', 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="font-bold text-sm text-gray-800">{{ $member->user->name ?? 'Tanpa Nama' }}</p>

                                        <p class="text-xs font-medium text-gray-500">{{ $member->primary_role ?? 'Belum memilih role' }}</p> 
                                    </div>
                                </div>
                                
                                <button type="button" @click="fetchStudentDetail({{ $member->user->id ?? 0 }})"
                                        class="text-xs bg-white border border-[#308242] text-[#308242] px-4 py-1.5 rounded-md font-bold hover:bg-[#308242] hover:text-white transition shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100">
                                    Detail
                                </button>
                            </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
            @empty
            <div class="col-span-full bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-500">
                Belum ada data tim yang tersedia untuk ditampilkan.
            </div>
            @endforelse
        </div>

        <!-- Paginasi -->
        <div class="mt-8 flex justify-between items-center">
            <div class="text-sm text-gray-500">
                Menampilkan {{ $teams->firstItem() ?? 0 }} - {{ $teams->lastItem() ?? 0 }} dari {{ $teams->total() }} tim
            </div>
            <div>
                {{ $teams->links() }}
            </div>
        </div>
    </main>

    <!-- ========================================== -->
    <!-- POP-UP MODAL: DETAIL MAHASISWA -->
    <!-- ========================================== -->
    <div x-show="showDetailModal" 
         x-cloak
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0">

        <div @click.away="showDetailModal = false" 
             class="bg-white w-full max-w-xl rounded-2xl border-2 border-[#308242] shadow-2xl overflow-hidden">
            
            <!-- Modal Header -->
            <div class="bg-[#308242] px-6 py-4 flex justify-between items-center">
                <h3 class="text-white font-bold text-lg">Detail Profil Mahasiswa</h3>
                <button @click="showDetailModal = false" class="text-white/80 hover:text-white text-2xl font-bold leading-none">&times;</button>
            </div>

            <!-- Loading State saat Fetch API berjalan -->
            <div x-show="isLoading" class="p-12 flex flex-col items-center justify-center gap-3">
                <svg class="animate-spin h-8 w-8 text-[#308242]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span class="text-sm font-medium text-gray-500">Memuat data mahasiswa...</span>
            </div>

            <!-- Error State jika API gagal -->
            <div x-show="!isLoading && errorMessage" class="p-8 text-center">
                <p class="text-red-600 font-semibold text-sm mb-4" x-text="errorMessage"></p>
                <button @click="showDetailModal = false" class="px-5 py-2 bg-gray-200 rounded-md text-sm font-bold text-gray-700">Tutup</button>
            </div>

            <!-- Konten Detail Mahasiswa (Hasil Integrasi API) -->
            <div x-show="!isLoading && !errorMessage && student" class="p-6 space-y-5">
                
                <!-- Identitas Utama -->
                <div class="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div class="w-14 h-14 rounded-full bg-[#D4F1DF] text-[#308242] font-bold text-xl flex items-center justify-center shrink-0"
                         x-text="student?.name ? student.name.charAt(0).toUpperCase() : 'M'">
                    </div>
                    <div>
                        <h4 class="text-xl font-bold text-[#486284]" x-text="student?.name"></h4>
                        <p class="text-sm text-gray-600">
                            <span class="font-semibold" x-text="student?.nim"></span> • <span x-text="student?.email"></span>
                        </p>
                        <span class="inline-block mt-1 bg-green-100 text-[#308242] text-xs font-bold px-2.5 py-0.5 rounded"
                              x-text="student?.team_name"></span>
                    </div>
                </div>

                <!-- Grid Informasi Role & Akademik -->
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span class="block text-xs font-semibold text-gray-400 uppercase">Role Utama (Pilihan 1)</span>
                        <span class="font-bold text-[#308242] mt-0.5 block" x-text="student?.role_utama"></span>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span class="block text-xs font-semibold text-gray-400 uppercase">Role Sekunder (Pilihan 2)</span>
                        <span class="font-bold text-[#486284] mt-0.5 block" x-text="student?.role_sekunder"></span>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span class="block text-xs font-semibold text-gray-400 uppercase">Program Studi</span>
                        <span class="font-medium text-gray-700 mt-0.5 block" x-text="student?.prodi"></span>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span class="block text-xs font-semibold text-gray-400 uppercase">Angkatan</span>
                        <span class="font-medium text-gray-700 mt-0.5 block" x-text="student?.angkatan"></span>
                    </div>
                </div>

                <!-- Keahlian / Tech Stack -->
                <div>
                    <span class="block text-xs font-bold text-gray-500 uppercase mb-2">Keahlian / Tech Stack</span>
                    <div class="flex flex-wrap gap-2">
                        <template x-for="(skill, idx) in (Array.isArray(student?.skills) ? student.skills : [])" :key="idx">
                            <span class="bg-[#D4F1DF] text-[#308242] px-3 py-1 rounded-full text-xs font-semibold" x-text="skill"></span>
                        </template>
                        <template x-if="!student?.skills || student.skills.length === 0">
                            <span class="text-xs text-gray-400 italic">Tidak ada data keahlian.</span>
                        </template>
                    </div>
                </div>

                <!-- Tautan Portofolio & GitHub -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div class="border border-gray-200 rounded-md p-2.5 flex items-center justify-between">
                        <span class="font-semibold text-gray-500">GitHub:</span>
                        <a :href="student?.github_url !== '-' ? student?.github_url : '#'" 
                           target="_blank" 
                           class="text-[#308242] font-bold hover:underline truncate max-w-[160px]"
                           x-text="student?.github_url"></a>
                    </div>
                    <div class="border border-gray-200 rounded-md p-2.5 flex items-center justify-between">
                        <span class="font-semibold text-gray-500">Portofolio:</span>
                        <a :href="student?.portfolio_url !== '-' ? student?.portfolio_url : '#'" 
                           target="_blank" 
                           class="text-[#308242] font-bold hover:underline truncate max-w-[160px]"
                           x-text="student?.portfolio_url"></a>
                    </div>
                </div>

                <!-- Footer Modal -->
                <div class="pt-4 border-t border-gray-200 flex justify-end">
                    <button type="button" @click="showDetailModal = false" 
                            class="bg-[#308242] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-green-700 transition">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Script Alpine.js untuk Integrasi API Fetch -->
    <script>
        function practitionerDashboard() {
            return {
                showDetailModal: false,
                isLoading: false,
                errorMessage: '',
                student: null,

                async openDetailModal(studentId) {
                    this.showDetailModal = true;
                    this.isLoading = true;
                    this.errorMessage = '';
                    this.student = null;

                    try {
                        const response = await fetch(`/practitioner/student/${studentId}/detail`, {
                            headers: {
                                'Accept': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Gagal mengambil data detail mahasiswa.');
                        }

                        const result = await response.json();
                        this.student = result.data;
                    } catch (error) {
                        this.errorMessage = error.message || 'Terjadi kesalahan jaringan.';
                    } finally {
                        this.isLoading = false;
                    }
                }
            }
        }
    </script>
</body>
</html>

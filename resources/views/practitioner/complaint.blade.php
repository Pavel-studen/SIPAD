<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Pengaduan - SIPAD</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100 text-gray-800">

    <!-- Header / Navbar -->
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-md relative z-10">
        <!-- Logo -->
        <div class="text-white font-bold text-2xl">SIPAD</div>
        <!-- Admin name -->
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-Montserrat font-[18.369px] font-bold font-[700px] line-normal">AdminPAD123</div>
        </div>
    </header>

    <main class="max-w-6xl mx-auto p-6">
        <div class="text-center mb-10">
            <h1 class="text-[42px] font-bold text-[#486284] mb-2">List Aduan</h1>
            <p class="text-gray-500 font-medium">Daftar Mahasiswa</p>
        </div>

        <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead class="bg-gray-50 border-b border-gray-200 text-gray-600">
                        <tr>
                            <th class="p-4 font-semibold">Tanggal</th>
                            <th class="p-4 font-semibold">Pelapor</th>
                            <th class="p-4 font-semibold">Alasan</th>
                            <th class="p-4 font-semibold">Deskripsi</th>
                            <th class="p-4 font-semibold text-center">Bukti</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        @forelse($complaintList as $complaint)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="p-4 whitespace-nowrap text-gray-500">{{ $complaint->created_at->format('d/m/Y H:i') }}</td>
                            <td class="p-4 font-medium text-gray-800">{{ $complaint->reporter->name ?? 'Anonim' }}</td>
                            <td class="p-4 text-gray-700 font-medium">{{ $complaint->alasan }}</td>
                            <td class="p-4 text-gray-600 max-w-xs truncate">{{ $complaint->deskripsi }}</td>
                            <td class="p-4 text-center">
                                @if($complaint->file_bukti_path)
                                    <a href="{{ asset('storage/' . $pengaduan->file_bukti_path) }}" target="_blank" 
                                       class="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200">
                                        Lihat File
                                    </a>
                                @else
                                    <span class="text-gray-400 text-xs italic">Tidak ada</span>
                                @endif
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="p-8 text-center text-gray-500">Belum ada pengaduan yang masuk.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div class="mt-6">
            {{ $complaintList->links() }}
        </div>
    </main>

</body>
</html>
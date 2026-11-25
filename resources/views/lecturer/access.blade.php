<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Akses - SIPAD</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;">
    
    <header class="bg-[#308242] w-full h-[92px] flex items-center justify-between px-8 shadow-sm">
        <div class="text-white font-bold text-2xl">SIPAD</div>
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-medium text-[16px]">Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.</div>
        </div>
    </header>

    <main class="w-full max-w-6xl mx-auto px-4 py-8 bg-white mt-6 rounded-lg shadow-sm border border-gray-200">
        
        <section class="mb-10">
            <h2 class="text-[#486284] text-lg font-bold mb-4 uppercase tracking-wide">Tambah Stakeholder (Manual Input)</h2>
            
            <form action="{{ route('lecturer.tambahEmail') }}" method="POST" class="flex gap-4 items-end">
                @csrf
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ketik Alamat Email:</label>
                    <input type="email" name="email" required placeholder="email.user@ugm.ac.id" class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#308242] focus:border-[#308242]">
                </div>
                <div class="w-1/3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Peran Akses:</label>
                    <select class="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#308242] focus:border-[#308242] bg-white">
                        <option value="praktisi">Praktisi (Dosen Industri)</option>
                        <option value="asprak">Asisten Praktikum</option>
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="po">Project Owner</option>
                    </select>
                </div>
                <button type="submit" class="bg-[#308242] text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition h-[42px]">
                    + Tambah Email</button>
            </form>
            
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 font-medium">atau</span>
                <form action="{{ route('lecturer.importCSV') }}" method="POST" enctype="multipart/form-data" class="mt-4">
                    @csrf
                    <input type="file" name="csv_file" id="csv_upload" accept=".csv" class="hidden" onchange="this.form.submit()">
                    <label for="csv_upload" class="bg-[#308242] text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                        Import File CSV Peserta KRS</label>
                </form>
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
                        @forelse($stakeholders as $item)
                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="p-3 text-sm">{{ $item->email }}</td>
                            <td class="p-3 text-sm">{{ $item->name }}</td>
                            <td class="p-3 text-sm">{{ $item->role }}</td>
                            <td class="p-3 text-sm">
                                @if($item->status == 'Verified')
                                    <span class="text-green-600 font-medium">Verified</span>
                                @else
                                    <span class="text-red-500 font-medium">Not Submitted</span>
                                @endif
                            </td>
                            <td class="p-3 text-sm text-center">
                                <form action="{{ route('lecturer.hapusEmail', $item->id) }}" method="POST" onsubmit="return confirm('Hapus data ini?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-gray-600 font-semibold hover:text-red-600">Hapus</button>
                                </form>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="p-4 text-center text-gray-500">Belum ada email terdaftar.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="flex justify-between items-center mt-4">
                <div class="text-sm text-gray-500">
                    Menampilkan {{ $stakeholders->firstItem() ?? 0 }} - {{ $stakeholders->lastItem() ?? 0 }} dari {{$stakeholders->total() }} data
                </div>
                <div class="flex justify-end">
                    {{ $stakeholders->links() }}
                </div>
            </div>
        </section>

        <div class="flex gap-4 mt-12 mb-8">
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('lecturer.control') }}">Kontrol</a></button>
            <button class="flex-1 border border-[#308242] text-[#308242] font-bold py-3 rounded-md hover:bg-green-50 transition"><a href="{{ route('lecturer.access') }}">User</a></button>
            <button class="flex-1 bg-[#308242] text-white font-bold py-3 rounded-md hover:bg-green-700 transition"><a href="{{ route('lecturer.bypass') }}">Bypass</a></button>
        </div>

    </main>
</body>
</html>

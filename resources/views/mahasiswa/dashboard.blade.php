<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mahasiswa - SIPAD</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-gray-50 text-neutral-900" style="font-family: 'Montserrat', sans-serif;">
    
    <!-- Header -->
    <header class="bg-[#0773DF] w-full h-[92px] flex items-center justify-between px-8 shadow-md relative z-10">
        <!-- Logo -->
        <div class="text-white font-bold text-2xl">SIPAD</div>
        
        <!-- Student name -->
        <div class="flex items-center gap-4">
            <div class="text-white text-right font-Roboto font-[18.369px] font-bold font-[700px] line-normal">Michael Harold (123456)</div>
            <!-- <div class="text-white text-right font-bold text-[18px]">Michael Harold (123456)</div> -->
            <div class="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                <span class="text-[#0773DF] font-bold text-xl">M</span>
            </div>
        </div>
    </header>

    <main class="w-full max-w-6xl mx-auto px-4 py-8">
        <div class="text-center mb-10">
            <!-- Greeting message -->
            <h1 class="text-[42px] font-bold text-[#486284] mb-2">Hai! Hari ini mau lakuin apa?</h1>
            <p class="text-gray-500 font-medium">Dashboard Mahasiswa</p>
        </div>
        
        <div class="bg-white p-8 rounded-xl shadow-sm border border-black/10 min-h-[400px]">
            <div class="mb-6 relative">
                <h2 class="text-[#486284] text-center text-[20px] font-bold leading-[76px] tracking-[0.5px]">Tim PAD kamu belum ada nih, Tunggu ya! :)</h2>
            </div>
            <!-- Table for displaying team list -->
            <div class="overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <table class="w-full text-center border-collapse">
                    <thead class="bg-[#C0DDF9]">
                        <tr class="h-[89px] text-gray-900">
                            <th class="p-4 font-bold align-middle">NIM</th>
                            <th class="p-4 font-bold align-middle">Nama</th>
                            <th class="p-4 font-bold align-middle">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-200 hover:bg-gray-50 h-[70px]">
                            <td class="p-4 text-black-700 font-medium">-</td>
                            <td class="p-4 text-black-700 font-medium">-</td>
                            <td class="p-4 text-gray-700 font-medium">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="flex gap-4 mt-12 mb-8">
            <button class="flex-1 bg-[#0773DF] text-white font-bold py-3 rounded-md hover:bg-blue-700 transition">Pilih Peran</button>
            <button class="flex-1 bg-[#0773DF] text-white font-bold py-3 rounded-md hover:bg-blue-700 transition">Hasil Role</button>
            <button class="flex-1 bg-[#0773DF] text-white font-bold py-3 rounded-md hover:bg-blue-700 transition">Pengaduan</button>
        </div>
    </main>
</body>
</html>

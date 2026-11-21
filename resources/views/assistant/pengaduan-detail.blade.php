<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Pengaduan - SIPAD</title>
    @vite('resources/css/app.css')
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-white text-neutral-900" style="font-family: 'Montserrat', sans-serif;">
    
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

    <main class="w-full max-w-4xl mx-auto px-4 py-10 relative">
        <!-- Title Container -->
        <div class="border-2 border-[#CDE1F8] py-4 mb-8 text-center w-full max-w-xl mx-auto">
            <h1 class="text-[32px] font-bold text-[#486284]">Detail Pengaduan</h1>
        </div>
        
        <!-- Main Content Box -->
        <div class="border border-[#CDE1F8] p-8 max-w-3xl mx-auto flex flex-col gap-4">
            
            <!-- Field 1: Nama -->
            <div class="bg-[#CDE1F8] p-4 flex items-center gap-4 text-[#486284] font-semibold border border-[#9AC2F4]">
                <svg class="w-6 h-6 text-[#0773DF]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                Michael Harold
            </div>

            <!-- Field 2: NIM -->
            <div class="bg-[#CDE1F8] p-4 flex items-center gap-4 text-[#486284] font-semibold border border-[#9AC2F4]">
                <svg class="w-6 h-6 text-[#0773DF]" fill="currentColor" viewBox="0 0 24 24"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H4V6h16v12zM5 10h4v2H5v-2zm0 4h14v2H5v-2zm6-4h8v2h-8v-2z"/></svg>
                25/568209/SV/27391
            </div>

            <!-- Field 3: Alasan Singkat -->
            <div class="bg-[#CDE1F8] p-4 flex items-center gap-4 text-[#486284] font-semibold border border-[#9AC2F4]">
                <svg class="w-6 h-6 text-[#0773DF]" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
                Orangnya cringe banget
            </div>

            <!-- Field 4: Lampiran -->
            <div class="bg-[#CDE1F8] p-4 flex items-center gap-4 text-[#486284] font-semibold border border-[#9AC2F4]">
                <svg class="w-6 h-6 text-[#0773DF]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>
                <div class="flex gap-2">
                    <button class="bg-white px-3 py-1 text-sm rounded border flex items-center gap-2"><svg class="w-4 h-4 text-[#0773DF]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>Gambar doksli.jpg</button>
                    <button class="bg-white px-3 py-1 text-sm rounded border flex items-center gap-2"><svg class="w-4 h-4 text-[#0773DF]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>Foto doksli.jpg</button>
                </div>
            </div>

            <!-- Field 5: Deskripsi Lanjut -->
            <div class="bg-[#CDE1F8] p-4 text-[#486284] font-semibold border border-[#9AC2F4]">
                <div class="flex items-center gap-4 mb-2">
                    <svg class="w-6 h-6 text-[#0773DF]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    Deskripsi lanjut
                </div>
                <div class="bg-white p-4 h-32 rounded border border-[#9AC2F4] text-sm font-normal">
                    Dia tuh cringe banget kerjaannya asbun dan makan nasi telor ceplok setiap pagi, dia juga suka ugal ugalan kalo naik motor dan minum susu 1 liter tiap hari nya
                </div>
            </div>

            <!-- Action Button -->
            <div class="flex justify-end mt-4">
                <a href="{{ route('assistant.dashboard') }}" class="bg-[#0773DF] text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-blue-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    Kembali</a>
            </div>
        </div>
    </main>
</body>
</html>
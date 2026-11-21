<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>SIPAD — Portal Mahasiswa</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/student/app.js'])
</head>
<body class="bg-white text-[#181C1F] antialiased selection:bg-[#C0DDF9] selection:text-[#045DDA]">
    <script>
        window.__SIPAD_CONFIG__ = {
            initialSection: @json($initialSection ?? 'pilih-peran'),
            isLocal: @json(app()->environment('local')),
            apiBase: '/api/v1'
        };
    </script>

    <div id="sipad-app" class="min-h-dvh flex flex-col bg-white text-[#181C1F] relative overflow-x-hidden">
        <div class="min-h-dvh flex items-center justify-center">
            <div class="flex flex-col items-center gap-3 text-[#486284]">
                <div class="w-9 h-9 rounded-full border-4 border-[#C0DDF9] border-t-[#0773DF] animate-spin"></div>
                <span class="text-sm font-semibold tracking-wide">Memuat Portal SIPAD...</span>
            </div>
        </div>
    </div>
</body>
</html>

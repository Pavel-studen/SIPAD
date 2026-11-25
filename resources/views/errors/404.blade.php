<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>404 Not found! — SIPAD</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css'])
</head>
<body class="bg-white text-[#181C1F] min-h-dvh flex flex-col antialiased selection:bg-[#C0DDF9] selection:text-[#045DDA]">
    <!-- Top Header matching UI_404.png -->
    <header class="bg-[#0773DF] text-white h-[60px] sm:h-[68px] w-full shrink-0 shadow-xs">
        <div class="max-w-[1280px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-3">
            <a
                href="/"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-[3px] border border-white/75 bg-white/15 hover:bg-white/25 transition shrink-0"
                title="Kembali ke Beranda SIPAD"
            >
                <span class="font-mono font-bold text-[14px] sm:text-[16px] tracking-[0.16em] text-white">SIPAD</span>
            </a>

            <div id="sipad-404-header-right" class="flex items-center gap-2.5 sm:gap-3.5">
                <a
                    href="/landing"
                    class="bg-white hover:bg-[#F0F7FF] text-[#181C1F] font-mono font-bold text-[12px] sm:text-[13px] px-5 sm:px-7 py-1.5 rounded-[5px] transition shadow-2xs"
                >
                    LOGIN
                </a>
            </div>
        </div>
    </header>

    <!-- Main 404 Message Area -->
    <main class="flex-1 flex items-center justify-center px-6 sm:px-10 py-14">
        <div class="w-full max-w-[760px]">
            <h1 class="text-[36px] sm:text-[48px] font-bold text-[#486284] tracking-tight leading-tight">
                404 Not found!
            </h1>
            <p class="mt-2.5 text-[15px] sm:text-[17px] text-[#8FA2B7] font-normal">
                Nothing but dead flowers here....
            </p>
            <div class="mt-7">
                <a
                    href="/"
                    class="inline-flex items-center gap-2 border border-[#83B9EF] hover:border-[#0773DF] hover:bg-[#F0F7FF] text-[#486284] hover:text-[#0773DF] text-[13px] font-semibold px-4 py-2 rounded-[6px] min-h-[40px] transition"
                >
                    <span>&larr; Kembali ke Beranda</span>
                </a>
            </div>
        </div>
    </main>

    <!-- Bottom Footer matching UI_404.png -->
    <footer class="py-5 px-4 text-center text-[13px] sm:text-[14px] font-medium text-[#486284] shrink-0">
        Made with <span class="text-red-500" aria-label="love">&#10084;&#65039;</span> by Tim PAD 5
    </footer>

    <script>
        (async function () {
            try {
                const token = window.localStorage.getItem('sipad_auth_token');
                if (!token) return;

                const res = await fetch('/api/v1/auth/me', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (!res.ok) return;

                const json = await res.json();
                const user = json && json.data ? json.data : null;
                if (!user) return;

                const container = document.getElementById('sipad-404-header-right');
                if (!container) return;

                const name = user.name || 'Pengguna';
                const role = user.role_label || 'Mahasiswa';
                const idCode = (user.student_profile && user.student_profile.nim) ? user.student_profile.nim : '';
                const tag = idCode ? role + ' - ' + idCode : role;

                const wrapper = document.createElement('a');
                wrapper.href = '/';
                wrapper.className = 'flex items-center gap-2.5 sm:gap-3.5 py-1.5 pl-2 pr-1 rounded-full hover:bg-white/10 transition min-h-[44px]';

                const labelDesktop = document.createElement('span');
                labelDesktop.className = 'hidden sm:inline font-mono text-[12px] md:text-[13px] font-medium text-white truncate max-w-[300px] md:max-w-[460px]';
                labelDesktop.textContent = name + ' (' + tag + ')';

                const labelMobile = document.createElement('span');
                labelMobile.className = 'sm:hidden font-mono text-[11.5px] font-medium text-white truncate max-w-[140px]';
                labelMobile.textContent = name;

                const avatarWrap = document.createElement('span');
                avatarWrap.className = 'w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-white overflow-hidden shrink-0 border border-white/70 shadow-xs flex items-center justify-center';

                if (user.avatar_link) {
                    const img = document.createElement('img');
                    img.src = user.avatar_link;
                    img.alt = 'Foto profil';
                    img.className = 'w-full h-full object-cover';
                    avatarWrap.appendChild(img);
                } else {
                    avatarWrap.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#0773DF" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>';
                }

                const chevron = document.createElement('span');
                chevron.className = 'text-white/95';
                chevron.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="m6 9 6 6 6-6"/></svg>';

                wrapper.appendChild(labelDesktop);
                wrapper.appendChild(labelMobile);
                wrapper.appendChild(avatarWrap);
                wrapper.appendChild(chevron);

                container.replaceChildren(wrapper);
            } catch (e) {
                // Keep default LOGIN button on any error
            }
        })();
    </script>
</body>
</html>

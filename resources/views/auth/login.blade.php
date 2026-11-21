<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - SIPAD</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-50 flex items-center justify-center h-screen">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 class="text-2xl font-bold text-[#0773DF] mb-6">Login SIPAD</h1>
        
        <p class="text-gray-600 mb-8">Silakan login menggunakan email akun UGM Anda.</p>
        
        <button onclick="loginWithGoogle()" class="inline-block w-full py-3 px-4 bg-[#0773DF] text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Login dengan Google SSO</button>
    </div>

    <script>
        function loginWithGoogle(){
            // Take respons JSON response from API route
            fetch('/api/auth/google', {
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Check success status and URL available
                if (data.status === 'success' && data.url) {
                    // Redirect browser to URL Google OAuth
                    window.location.href = data.url;
                } else {
                    alert('Gagal mendapatkan URL dari server.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat menghubungi server API.');
            });
        }
    </script>
</body>
</html>
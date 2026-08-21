# ExecuTrain CMS

Content Management System (React + Vite + Ant Design + Tailwind) untuk ExecuTrain — di-recreate dari project original (Next.js → Vite).

## Tech Stack

- **React 19** + **Vite 8** + **TypeScript**
- **Ant Design (antd v6)** — komponen UI
- **Tailwind CSS v4** — styling
- **TanStack React Query** — data fetching
- **react-router-dom v7** — routing (dengan protected routes)
- **react-hot-toast** — notifikasi

## Struktur

```
cms/
├── vite.config.ts             # Proxy /api → API Express
├── index.html
└── src/
    ├── main.tsx               # Entry point (AuthProvider, QueryProvider, Router)
    ├── App.tsx                # Route definitions
    ├── lib/
    │   ├── axios.ts           # Axios client (Bearer token interceptor)
    │   ├── auth.tsx           # AuthContext + reducer + checkAuth
    │   ├── tanstack.tsx       # QueryClientProvider
    │   ├── constants.ts       # Token keys, API base
    │   ├── menu.ts            # DefaultMenu / SuperMenu (role-based)
    │   └── utils.ts
    ├── hooks/
    │   └── useAuth.ts         # useLogin, useLogout
    ├── services/
    │   └── auth.ts            # API login call
    ├── components/
    │   ├── ProtectedRoute.tsx # Guard halaman yang butuh login
    │   ├── Sidebar.tsx        # Layout sidebar + menu + logout
    │   ├── Form.tsx           # Input wrapper (antd)
    │   ├── Notification.tsx
    │   └── LoadingPage.tsx
    └── pages/
        ├── Login.tsx          # Halaman login
        ├── MainLayout.tsx     # Layout utama (Sidebar + Outlet)
        └── Dashboard.tsx      # Dashboard placeholder
```

## Setup

1. **Salin env**
   ```bash
   cp .env.example .env
   ```
   Di development, `/api` diproxy oleh Vite ke `http://localhost:8000` (lihat `vite.config.ts`).

2. **Install**
   ```bash
   npm install
   ```

3. **Jalankan**
   ```bash
   npm run dev        # http://localhost:5174
   npm run build      # type-check + build produksi
   npm run preview    # preview build
   ```

## Auth Flow (terintegrasi dengan API)

1. **Login** (`/login`): submit username/password → `POST /api/v2/auth/login` → access_token disimpan di localStorage + cookie.
2. **checkAuth** (`AuthProvider` di `main.tsx`): saat app load, jika ada token → `GET /api/v2/auth/me` untuk validasi & set user.
3. **ProtectedRoute**: halaman di dalam `MainLayout` hanya tampil jika `state.hasLogin === true`, selain niat redirect ke `/login`.
4. **Logout**: hapus token lokal → redirect `/login`.

Semua request axios otomatis menyisipkan `Authorization: Bearer <token>` via interceptor. Jika API mengembalikan 401, token lokal dibersihkan.

## Menambah Modul

Setiap modul (mis. Product) mengikuti pola halaman CMS original:
- `src/pages/<module>/` → halaman list + editor
- `src/services/<module>.ts` → fungsi API
- `src/hooks/use<Module>.ts` → React Query hooks
- Tambahkan route di `src/App.tsx` + item menu di `src/lib/menu.ts`

Struktur menu & sidebar sudah mengikuti referensi CMS original (`DefaultMenu` untuk ADMIN, `SuperMenu` untuk SUPERADMIN).
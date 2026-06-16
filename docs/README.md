# Smart Factory Automation — API Documentation

RESTful API untuk monitoring produksi dan inventaris pabrik.

## 📁 Files di Folder Ini

| File | Fungsi |
|------|--------|
| `openapi.yaml` | Spesifikasi OpenAPI 3.0.3 — bisa di-import ke Swagger UI, Stoplight, Postman, atau generator code |
| `postman/collection.postman_collection.json` | Postman collection lengkap dengan 15 request + contoh response |
| `postman/environment.postman_environment.json` | Postman environment (base_url) |
| `README.md` | Panduan ini |

## 🚀 Quick Start

### 1. Persiapan

Pastikan Docker container SQL Server sudah jalan:
```bash
docker ps | grep sql_server
```

Kalau belum:
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Bintangridwan8" \
  -p 1433:1433 --name sql_server \
  -d mcr.microsoft.com/azure-sql-edge
```

Install dependencies & seed:
```bash
cd apps/web
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 2. Jalankan Dev Server

```bash
cd apps/web
npm run dev
```

Server listening di `http://localhost:3000`.

## 🧪 Cara Pakai

### Opsi A: Postman (Recommended)

1. Buka Postman
2. **Import Collection**: File → Import → pilih `postman/collection.postman_collection.json`
3. **Import Environment**: Import → pilih `postman/environment.postman_environment.json`
4. Pilih environment "Smart Factory - Local" di kanan atas
5. Klik request manapun → klik **Send**

Semua request sudah include:
- ✓ Header `Content-Type: application/json` (kalau perlu)
- ✓ Body JSON contoh yang siap pakai
- ✓ Contoh response di tab "Tests" / "Preview"

> **Tidak perlu setup token bearer / auth** — endpoint public untuk testing.

### Opsi B: Swagger UI (Online)

1. Buka https://editor.swagger.io/
2. **File → Import File** → pilih `openapi.yaml`
3. Swagger UI akan render semua endpoint + schema + contoh payload
4. Klik **"Try it out"** untuk test langsung (ganti server URL ke `http://localhost:3000`)

### Opsi C: Redocly (HTML statis, lebih cantik)

```bash
npx @redocly/cli preview-docs docs/openapi.yaml
```

Buka browser ke URL yang ditampilkan. Bisa di-share ke tim tanpa backend.

### Opsi D: VS Code Extension

Install extension **"OpenAPI (Swagger) Editor"** atau **"Swagger Viewer"**, buka `openapi.yaml` di VS Code, klik kanan → "Preview Swagger".

## 📋 Daftar Endpoint

### 1. Products (`/api/products`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/products` | List semua produk |
| `POST` | `/api/products` | Tambah produk baru |

**Contoh request POST:**
```json
{
  "ProductName": "Bearing SKF 6203-2RS",
  "Unit": "pcs",
  "MinStock": 200
}
```

**Response 201:**
```json
{
  "ProductID": 1011,
  "ProductName": "Bearing SKF 6203-2RS",
  "MinStock": 200,
  "Unit": "pcs"
}
```

**Response 400 (validasi):**
```json
{
  "error": "Validasi gagal",
  "details": [
    { "field": "ProductName", "message": "Nama produk tidak boleh kosong" }
  ]
}
```

### 2. Production Logs (`/api/production-logs`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/production-logs` | Catat produksi + auto inventory IN |

**Behavior:** Setiap POST akan insert ke 2 tabel (ProductionLogs + InventoryMovements) dalam 1 transaksi atomic. Jika gagal, rollback.

**Contoh request POST:**
```json
{
  "product_id": 1002,
  "quantity": 500,
  "operator_name": "Budi Santoso"
}
```

**Response 201:**
```json
{
  "LogID": 1010,
  "ProductID": 1002,
  "Quantity": 500,
  "ProductionDate": "2026-06-16T08:37:32.997Z",
  "OperatorName": "Budi Santoso"
}
```

**Response 404 (product tidak ada → rollback):**
```json
{
  "error": "Produk dengan ID 99999 tidak ditemukan"
}
```

### 3. Inventory Movements (`/api/inventory/movements`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/inventory/movements` | List semua history (include data produk) |
| `GET` | `/api/inventory/movements?type=IN` | Filter hanya IN |
| `GET` | `/api/inventory/movements?type=OUT` | Filter hanya OUT |
| `POST` | `/api/inventory/movements` | Catat mutasi OUT (stok validasi) |

**Contoh request POST (OUT):**
```json
{
  "product_id": 1002,
  "quantity": 50,
  "movement_type": "OUT"
}
```

**Response 422 (stok tidak cukup):**
```json
{
  "error": "Stok tidak mencukupi. Stok saat ini: 1050, diminta: 999999"
}
```

### 4. Dashboard (`/api/dashboard/summary`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/dashboard/summary` | Agregasi: total_products, total_production_today, low_stock_alerts |

**Response 200:**
```json
{
  "total_products": 9,
  "total_production_today": 1477,
  "low_stock_alerts": [
    {
      "ProductID": 1007,
      "ProductName": "Bearing SKF 6203",
      "Unit": "pcs",
      "MinStock": 200,
      "CurrentStock": 0
    }
  ]
}
```

## 🗄️ Database

**Engine:** Microsoft SQL Server (Azure SQL Edge Docker)
**Host:** `localhost:1433`
**Database name:** `InventoryDB`
**Schema:** Lihat `apps/web/prisma/schema.prisma`

### Tabel Utama

| Tabel | Kolom Penting | Relasi |
|-------|---------------|--------|
| `Products` | ProductID, ProductName, MinStock, Unit | 1-to-many → ProductionLogs, InventoryMovements |
| `ProductionLogs` | LogID, ProductID, Quantity, OperatorName, ProductionDate | many-to-1 → Products |
| `InventoryMovements` | MovementID, ProductID, MovementType, Quantity, MovementDate | many-to-1 → Products |

### Product ID di DB Real

Karena SQL Server `IDENTITY` column auto-increment, ID di database lokal **dimulai dari 1002** (bukan 1). Jika ingin reset dan mulai dari 1:

```bash
# Drop database (HATI-HATI: hapus semua data)
docker exec sql_server /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "Bintangridwan8" \
  -Q "DROP DATABASE InventoryDB;"

# Re-create
cd apps/web
npx prisma db push
npx prisma db seed
```

## 🛠️ Troubleshooting

### Error: "ECONNREFUSED 127.0.0.1:1433"
SQL Server container belum jalan. Jalankan:
```bash
docker start sql_server
# atau kalau container belum ada:
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Bintangridwan8" \
  -p 1433:1433 --name sql_server -d mcr.microsoft.com/azure-sql-edge
```

### Error: "PrismaClientInitializationError"
Pastikan `apps/web/.env` ada dengan DATABASE_URL yang benar. Copy dari `apps/web/.env.example` jika ada.

### Error: "Stok tidak mencukupi" saat test OUT
Pastikan produk punya IN movement lebih dulu. Jalankan `POST /api/production-logs` untuk tambah stok.

### Postman import gagal
Pastikan Postman versi terbaru. File format v2.1.

## 📚 Referensi

- OpenAPI spec: `docs/openapi.yaml`
- Postman collection: `docs/postman/collection.postman_collection.json`
- Test integration: `apps/web/tests/api.test.ts` (16 test pass)
- CI pipeline: `.github/workflows/ci.yml`

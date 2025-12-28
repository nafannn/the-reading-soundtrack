# 🎧 THE READING SOUNDTRACK

**UAS II3160 – Teknologi Sistem Terintegrasi**  
**Nama:** Nurul Na'im Natifah  
**NIM:** 18223106  
**Kelas:** K-02  

---

## 1. Deskripsi Layanan 📖🎶

**The Reading Soundtrack** merupakan layanan terintegrasi yang menghubungkan **Book Catalog Service** dan **Music Catalog Service** untuk menciptakan pengalaman membaca yang lebih imersif. Sistem ini dirancang agar pengguna dapat menikmati rekomendasi musik yang sesuai dengan suasana dan karakter buku yang sedang dibaca.

Layanan ini memanfaatkan **Gemini AI** sebagai komponen analisis utama untuk menerjemahkan deskripsi buku menjadi profil suasana seperti mood, genre, dan tingkat energi. Profil tersebut kemudian digunakan untuk mencari musik yang paling relevan melalui layanan katalog musik.

Sebagai bagian dari arsitektur microservice, sistem ini tidak menyimpan data buku maupun musik secara langsung. Seluruh data diambil melalui komunikasi antarlayanan menggunakan REST API, sehingga sistem tetap modular, scalable, dan mudah dikembangkan.

---

## 2. Arsitektur Sistem 🔗

Sistem ini berperan sebagai **orchestrator service** yang menghubungkan beberapa layanan utama:

- **Book Catalog Service** → Menyediakan data buku  
- **Gemini AI Service** → Menganalisis karakter dan suasana buku  
- **Music Catalog Service** → Menyediakan rekomendasi musik  

Alur kerja sistem:
1. Pengguna memilih buku dari katalog.
2. Sistem mengambil data buku dari Book Service.
3. Deskripsi buku dianalisis oleh Gemini AI.
4. Hasil analisis digunakan untuk mencari musik yang sesuai.
5. Rekomendasi musik ditampilkan kepada pengguna.

---

## 3. Akses Layanan 🌐

Layanan dapat diakses melalui endpoint berikut:

https://<domain-integrated-service>


Endpoint ini menangani seluruh proses orkestrasi antar layanan.

---

## 4. Fitur Utama ✨

| Fitur | Deskripsi |
|------|-----------|
| Integrasi Buku & Musik | Menghubungkan data buku dengan rekomendasi musik |
| Analisis Berbasis AI | Menggunakan Gemini AI untuk memahami suasana buku |
| Orkestrasi Layanan | Mengelola komunikasi antar microservice |
| Web Interface | Menyediakan antarmuka sederhana untuk pengguna |
| Arsitektur Modular | Mudah dikembangkan dan diintegrasikan |

---

## 5. Contoh Endpoint 🔌

### 🔹 Rekomendasi Musik Berdasarkan Buku
GET /api/soundtrack/:bookId

Contoh:
/api/soundtrack/12

Endpoint ini akan:
- Mengambil detail buku berdasarkan ID
- Menganalisis karakter buku menggunakan AI
- Menghasilkan rekomendasi musik yang sesuai

---

## 6. Contoh Response 📦

```json
{
  "success": true,
  "data": {
    "book": {
      "title": "The Silent Forest",
      "genre": "Mystery"
    },
    "musicProfile": {
      "mood": "dark",
      "energy": "low"
    },
    "recommendations": [
      {
        "title": "Midnight Echoes",
        "artist": "Lunar Waves"
      }
    ]
  }
}
```
---

## 7. Catatan Tambahan 📝

- Sistem ini tidak menyimpan data pengguna.
- Seluruh komunikasi dilakukan melalui REST API.
- Dirancang agar mudah dikembangkan untuk fitur lanjutan seperti personalisasi rekomendasi.







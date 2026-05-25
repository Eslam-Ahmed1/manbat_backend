# 🔬 Plant Disease Detection API — توثيق كامل

**Base URL:** `http://localhost:3000/api/scans`  
**المصادقة:** مطلوبة على جميع الـ endpoints  
**Header:** `Authorization: Bearer <token>`

---

## الـ Endpoints

| Method | Path | الوظيفة |
|--------|------|---------|
| `POST` | `/api/scans` | تشخيص صورة نبات |
| `GET` | `/api/scans` | سجل التشخيصات للمستخدم |
| `GET` | `/api/scans/:id` | تفاصيل تشخيص محدد |

---

## POST `/api/scans` — تشخيص صورة

### الـ Request

```
POST /api/scans
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| الحقل | النوع | مطلوب | الوصف |
|-------|-------|--------|-------|
| `plantImage` | file | ✅ | صورة 
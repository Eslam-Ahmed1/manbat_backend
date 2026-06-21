# Remote Config

إدارة متغيرات البيئة من لوحة الأدمن بدون إعادة تشغيل السيرفر.

---

## الأولوية

```
DB (admin)  →  .env  →  default value
```

---

## Endpoints

**Base:** `/api/admin/config` — يتطلب Admin token

### GET `/api/admin/config`
عرض جميع الـ configs (القيم الحساسة مخفية جزئياً).

```json
{
  "data": [
    {
      "key": "GEMINI_API_KEY",
      "value": "AIza****yXz",
      "description": "Google Gemini API Key",
      "isActive": true
    }
  ]
}
```

---

### POST `/api/admin/config`
إضافة أو تحديث config — يُطبَّق فوراً على السيرفر الجاري.

```json
{
  "key": "GEMINI_API_KEY",
  "value": "AIzaSy...",
  "description": "Google Gemini API Key"
}
```

---

### DELETE `/api/admin/config/:key`
حذف config من DB — السيرفر يرجع لقيمة `.env` تلقائياً.

```
DELETE /api/admin/config/GEMINI_API_KEY
```

---

## المفاتيح المدعومة

| Key | الوصف |
|-----|-------|
| `GEMINI_API_KEY` | Google Gemini AI |
| `SCAN_DETECTION_MODE` | `gemini_only` \| `plant_model_only` \| `hybrid` |
| `GEMINI_SCAN_ENABLED` | `true` / `false` — تفعيل Gemini في المسح |
| `PLANT_MODEL_ENABLED` | `true` لتفعيل النموذج المُدرَّب |
| `PLANT_MODEL_URL` | عنوان HF Space (افتراضي: `https://mahmoudtharwat-plant-disease-api.hf.space`) |
| `PLANT_MODEL_ALWAYS_ATTEMPT` | `true` = استدعاء النموذج دائماً (أكاديمي) مع fallback لـ Gemini |
| `PLANT_MODEL_API_KEY` | مفتاح اختياري لخدمة النموذج |
| `PLANT_MODEL_CONFIDENCE_THRESHOLD` | عتبة الثقة الإجمالية (افتراضي `0.75`) |
| `PLANT_MODEL_DISEASE_CONFIDENCE_THRESHOLD` | عتبة ثقة كل مرض (افتراضي `0.7`) |
| `PLANT_MODEL_SUPPORTED_PLANTS` | نباتات مدعومة مفصولة بفاصلة: `tomato,peach` |
| `PLANT_MODEL_TIMEOUT_MS` | مهلة الطلب بالميلي ثانية |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary |
| `CLOUDINARY_API_KEY` | Cloudinary |
| `CLOUDINARY_API_SECRET` | Cloudinary |
| `JWT_SECRET` | JWT signing secret |

---

## ملاحظات

- القيم المحتوية على `API_KEY / SECRET / TOKEN / URI` تُخفى في الـ response
- عند الحذف من DB، السيرفر يستخدم قيمة `.env` كـ fallback تلقائياً
- عند بدء السيرفر، يتم تحميل قيم DB فوق `.env` تلقائياً

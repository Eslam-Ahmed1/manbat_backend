# Admin — التحكم في نماذج التشخيص

**Base:** `/api/admin/scan-detection`  
**Auth:** Admin Bearer token

---

## GET `/api/admin/scan-detection`

عرض الإعدادات الحالية.

**Response:**
```json
{
  "message": "Scan detection settings retrieved",
  "data": {
    "mode": "hybrid",
    "plantModel": {
      "enabled": true,
      "url": "https://mahmoudtharwat-plant-disease-api.hf.space",
      "confidenceThreshold": 0.75,
      "diseaseConfidenceThreshold": 0.7,
      "alwaysAttempt": true,
      "supportedPlants": []
    },
    "gemini": {
      "enabled": true,
      "model": "gemini-2.5-flash"
    },
    "availableModes": {
      "gemini_only": "Gemini فقط — لا يُستدعى نموذج HF",
      "plant_model_only": "نموذج HF فقط — بدون Gemini",
      "hybrid": "HF أولاً ثم Gemini عند الحاجة"
    },
    "description": "HF أولاً ثم Gemini عند الحاجة (توفير تكلفة)"
  }
}
```

---

## PUT `/api/admin/scan-detection`

تحديث الوضع — يُطبَّق فوراً بدون إعادة تشغيل السيرفر.

### Gemini فقط
```json
{
  "mode": "gemini_only"
}
```

### النموذج الخاص (HF) فقط
```json
{
  "mode": "plant_model_only",
  "plantModelUrl": "https://mahmoudtharwat-plant-disease-api.hf.space",
  "confidenceThreshold": 0.75
}
```

### تكاملي (موصى به للتوفير)
```json
{
  "mode": "hybrid",
  "plantModelUrl": "https://mahmoudtharwat-plant-disease-api.hf.space",
  "confidenceThreshold": 0.75,
  "diseaseConfidenceThreshold": 0.7,
  "alwaysAttempt": true,
  "supportedPlants": ["apple", "tomato", "peach", "grape", "potato"]
}
```

| الحقل | النوع | الوصف |
|--------|------|--------|
| `mode` | enum | **مطلوب** — `gemini_only` \| `plant_model_only` \| `hybrid` |
| `plantModelUrl` | string | رابط HF Space |
| `confidenceThreshold` | number | 0–1 |
| `diseaseConfidenceThreshold` | number | 0–1 |
| `alwaysAttempt` | boolean | استدعاء HF دائماً (أكاديمي) |
| `supportedPlants` | string[] | فلتر النباتات |
| `geminiEnabled` | boolean | في `hybrid` فقط |

---

## أوضاع التشغيل

| الوضع | HF | Gemini |
|--------|-----|--------|
| `gemini_only` | ❌ | ✅ دائماً |
| `plant_model_only` | ✅ فقط | ❌ — فشل HF = خطأ 422/503 |
| `hybrid` | ✅ أولاً | ✅ عند الحاجة |

مسار `POST /api/scans` للمستخدم **لم يتغيّر**.

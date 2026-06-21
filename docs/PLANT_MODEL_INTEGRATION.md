# دمج نموذج Hugging Face مع Gemini

## API النموذج (الفعلي)

```bash
curl -X POST 'https://mahmoudtharwat-plant-disease-api.hf.space/predict' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@image.jpeg;type=image/jpeg'
```

**نجاح:**
```json
{
  "status": "success",
  "disease": "Apple___Black_rot",
  "confidence": 0.9039872288703918
}
```

**خطأ:**
```json
{
  "status": "error",
  "message": "الصورة غير واضحة أو قد لا تنتمي للنباتات المدعومة."
}
```

---

## التفعيل في `.env`

```env
PLANT_MODEL_ENABLED=true
PLANT_MODEL_URL=https://mahmoudtharwat-plant-disease-api.hf.space

# عتبة الثقة (0–1)
PLANT_MODEL_CONFIDENCE_THRESHOLD=0.75

# استدعاء النموذج دائماً (متطلب أكاديمي) — الافتراضي true
PLANT_MODEL_ALWAYS_ATTEMPT=true

# نباتات مدعومة (اختياري — فارغ = الكل)
# PLANT_MODEL_SUPPORTED_PLANTS=apple,tomato,peach,grape,potato
```

**بدون `PLANT_MODEL_ENABLED=true`** → Gemini فقط (لا تغيير في السلوك).

---

## مسار العمل

```
صورة → HF model (multipart file)
         ├─ success + مرض في DB + ثقة عالية → نتيجة بدون Gemini ✅
         ├─ success + healthy → []
         ├─ error / غير واضح / غير مربوط بـ DB → Gemini (fallback)
         └─ PLANT_MODEL معطّل → Gemini فقط
```

شكل `detectedDiseases` **لم يتغيّر**.

---

## ربط التسميات

`Apple___Black_rot` → يُحوَّل عبر `app/config/plantModelHfMap.ts` إلى اسم في MongoDB (مثل `Black Rot`).

لإضافة تسمية جديدة عدّل الملف:

```ts
"Apple___Black_rot": "Apple Scab",
```

---

## حقول إضافية في `summary`

```json
{
  "detectionSource": "custom_model",
  "customModelUsed": true,
  "geminiUsed": false,
  "plantType": "apple",
  "modelConfidence": 0.904
}
```

| detectionSource | المعنى |
|-----------------|--------|
| `custom_model` | HF كفى وحده |
| `gemini` | Gemini فقط |
| `hybrid` | HF اُستدعي ثم Gemini |

---

## الملفات

| الملف | الدور |
|--------|------|
| `app/services/plantModel.ts` | multipart + parsing HF |
| `app/config/plantModelHfMap.ts` | ربط التسميات |
| `app/services/diseaseDetection.ts` | المنطق الهجين |
| `app/services/scan.ts` | المسار الحالي |

# 🦠 توثيق واجهة برمجة التطبيقات للأمراض والعلاجات (Diseases & Treatments API)

مرحباً بك في توثيق الـ APIs الخاصة بـ **الأمراض (Diseases)**، **العلاجات (Treatments)**، و**تشخيص النباتات بالذكاء الاصطناعي (AI Scans)**.

---

## 📌 جدول المحتويات
1. [روابط العلاجات العامة والمخصصة (Treatments API)](#1-روابط-العلاجات-العامة-والمخصصة-treatments-api)
2. [روابط تشخيص الأمراض بالذكاء الاصطناعي (AI Plant Scans)](#2-روابط-تشخيص-الأمراض-بالذكاء-الاصطناعي-ai-plant-scans)
3. [روابط إدارة الأمراض للمشرفين (Admin Disease Management)](#3-روابط-إدارة-الأمراض-للمشرفين-admin-disease-management)
4. [روابط إدارة العلاجات للمشرفين (Admin Treatment Management)](#4-روابط-إدارة-العلاجات-للمشرفين-admin-treatment-management)
5. [التحكم في إعدادات ونماذج الفحص (Admin Scan Settings)](#5-التحكم-في-إعدادات-ونماذج-الفحص-admin-scan-settings)

---

## 1. روابط العلاجات العامة والمخصصة (Treatments API)
تتيح هذه الروابط العامة قراءة العلاجات المرتبطة بالأمراض والمنتجات المقترحة من المتجر.

### أ. الحصول على جميع العلاجات
جلب قائمة بجميع العلاجات المسجلة في النظام مع تفاصيل الأمراض المرتبطة بها.
* **الرابط:** `GET /api/treatments`
* **المصادقة:** لا تتطلب (عامة)
* **نموذج الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Treatments retrieved successfully",
  "data": [
    {
      "_id": "65b00abc1122334455667788",
      "name": "Fungicide Spray",
      "instructions": "Spray on leaves early morning once a week.",
      "disease_ids": [
        {
          "_id": "65b00111222333444555666",
          "name": "Tomato Powdery Mildew"
        }
      ]
    }
  ]
}
```

---

### ب. الحصول على تفاصيل علاج معين
جلب تفاصيل علاج محدد عبر الـ ID الخاص به مع الأمراض المرتبطة به كاملة.
* **الرابط:** `GET /api/treatments/:id`
* **المصادقة:** لا تتطلب (عامة)
* **نموذج الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Treatment retrieved successfully",
  "data": {
    "_id": "65b00abc1122334455667788",
    "name": "Fungicide Spray",
    "instructions": "Spray on leaves early morning once a week.",
    "disease_ids": [
      {
        "_id": "65b00111222333444555666",
        "name": "Tomato Powdery Mildew",
        "description": "A fungal disease that affects a wide range of plants..."
      }
    ]
  }
}
```

---

### ج. الحصول على علاجات مرض معين (بواسطة Disease ID)
جلب جميع العلاجات المرتبطة بمرض محدد.
* **الرابط:** `GET /api/treatments/disease/:diseaseId`
* **المصادقة:** لا تتطلب (عامة)
* **نموذج الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Treatments retrieved successfully",
  "data": [
    {
      "_id": "65b00abc1122334455667788",
      "name": "Fungicide Spray",
      "instructions": "Spray on leaves early morning once a week.",
      "disease_ids": ["65b00111222333444555666"]
    }
  ]
}
```

---

### د. الحصول على علاجات لمجموعة أمراض معاً
إرسال قائمة بـ IDs لأمراض متعددة والحصول على العلاجات المرتبطة بها دفعة واحدة.
* **الرابط:** `POST /api/treatments/diseases`
* **المصادقة:** لا تتطلب (عامة)
* **جسم الطلب (Request Body):**
```json
{
  "disease_ids": [
    "65b00111222333444555666",
    "65b00222333444555666777"
  ]
}
```
* **نموذج الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Treatments retrieved successfully",
  "data": [
    {
      "_id": "65b00abc1122334455667788",
      "name": "Fungicide Spray",
      "instructions": "Spray on leaves early morning...",
      "disease_ids": [
        { "_id": "65b00111222333444555666", "name": "Tomato Powdery Mildew" }
      ]
    }
  ]
}
```

---

## 2. روابط تشخيص الأمراض بالذكاء الاصطناعي (AI Plant Scans)
تمكن هذه الروابط المستخدمين المسجلين من تشخيص صور النباتات المصابة، والحصول على أسماء الأمراض، العلاجات والمنتجات المناسبة المتوفرة بالمتجر.

### أ. تشخيص صورة نبات
رفع صورة للنبات لتحليلها ومعرفة المرض والعلاج.
* **الرابط:** `POST /api/scans`
* **المصادقة:** مطلوبة (`Authorization: Bearer <TOKEN>`)
* **نوع المحتوى:** `multipart/form-data`
* **المدخلات:**
  * `plantImage` (ملف صورة - File): صورة النبات المراد تشخيصه.
* **نموذج الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Scan completed",
  "data": {
    "scan": {
      "_id": "65b00fff1122334455667788",
      "user_id": "65afa000...",
      "status": "completed",
      "image_url": "https://res.cloudinary.com/...",
      "disease_ids": [
        {
          "_id": "65b00111222333444555666",
          "name": "Tomato Leaf Mold",
          "description": "Fungal disease causing pale green patches on upper leaf surfaces..."
        }
      ],
      "scan_date": "2026-05-25T11:00:00.000Z"
    },
    "detectedDiseases": [
      {
        "disease": {
          "_id": "65b00111222333444555666",
          "name": "Tomato Leaf Mold",
          "description": "Fungal disease causing pale green patches..."
        },
        "treatment": {
          "_id": "65b00abc1122334455667788",
          "name": "Copper Fungicide",
          "instructions": "Apply every 7-10 days."
        },
        "products": [
          {
            "_id": "65afe999...",
            "name": "Copper Spray Fungicide 500ml",
            "description": "Effective against leaf mold and mildews",
            "price": 20.00,
            "discount": 0,
            "discountedPrice": 20.00,
            "quantity": 15,
            "image_url": "https://...",
            "status": "in_stock"
          }
        ],
        "hasProducts": true
      }
    ],
    "summary": {
      "totalDiseases": 1,
      "totalTreatments": 1,
      "totalAvailableProducts": 1,
      "hasAllProducts": true,
      "detectionSource": "gemini",
      "detectionMode": "hybrid",
      "customModelUsed": false,
      "geminiUsed": true,
      "plantType": "Tomato",
      "modelConfidence": 0.95
    }
  }
}
```

---

### ب. جلب سجل التشخيصات للمستخدم
الحصول على قائمة بجميع التشخيصات السابقة التي قام بها المستخدم.
* **الرابط:** `GET /api/scans`
* **المصادقة:** مطلوبة (`Authorization: Bearer <TOKEN>`)
* **معاملات التصفية (Query Parameters - اختياري):**
  * `page` (number): رقم الصفحة (الافتراضي `1`)
  * `limit` (number): عدد العناصر بالصفحة (الافتراضي `10`)
* **نموذج الاستجابة الناجحة (200 OK):**
```json
{
  "message": "get plants scand history, completed",
  "data": {
    "scans": [
      {
        "_id": "65b00fff1122334455667788",
        "status": "completed",
        "image_url": "https://...",
        "disease_ids": [ ... ],
        "detectedDiseases": [ ... ],
        "scan_date": "2026-05-25T11:00:00.000Z"
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalScans": 1
  }
}
```

---

### ج. تفاصيل تشخيص محدد بواسطة الـ Scan ID
جلب تفاصيل فحص معين بالكامل باستخدام الـ ID الخاص بالفحص.
* **الرابط:** `GET /api/scans/:id`
* **المصادقة:** مطلوبة (`Authorization: Bearer <TOKEN>`)
* **نموذج الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Scan details retrieved",
  "data": {
    "scan": {
      "_id": "65b00fff1122334455667788",
      "user_id": "65afa000...",
      "status": "completed",
      "image_url": "https://...",
      "disease_ids": [ ... ]
    },
    "detectedDiseases": [ ... ],
    "summary": {
      "totalDiseases": 1,
      "totalTreatments": 1,
      "totalAvailableProducts": 1,
      "hasAllProducts": true
    }
  }
}
```

---

## 3. روابط إدارة الأمراض للمشرفين (Admin Disease Management)
*🔑 تتطلب هذه الروابط مصادقة مشرف (JWT Token مع دور Admin).*
* **مسار الرابط الرئيسي:** `/api/admin/diseases`

### أ. الحصول على جميع الأمراض (مع Pagination)
* **الرابط:** `GET /api/admin/diseases`
* **Query Parameters:** `page` (الافتراضي 1), `limit` (الافتراضي 10)
* **الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Diseases retrieved successfully",
  "data": {
    "diseases": [
      {
        "_id": "65b00111222333444555666",
        "name": "Tomato Powdery Mildew",
        "description": "Fungal disease creating white powdery spots on leaves."
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalDiseases": 1
  }
}
```

---

### ب. إضافة مرض جديد
* **الرابط:** `POST /api/admin/diseases`
* **جسم الطلب (Request Body):**
```json
{
  "name": "Apple Scab",
  "description": "Fungal disease causing olive-green to black spots on leaves and fruit."
}
```
* **الاستجابة الناجحة (201 Created):**
```json
{
  "message": "Disease created successfully",
  "data": {
    "_id": "65b00222333444555666777",
    "name": "Apple Scab",
    "description": "Fungal disease causing olive-green to black spots on leaves and fruit.",
    "__v": 0
  }
}
```

---

### ج. تعديل مرض موجود
* **الرابط:** `PUT /api/admin/diseases/:id`
* **جسم الطلب (Request Body):**
```json
{
  "description": "Updated detailed description for Apple Scab..."
}
```
* **الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Disease updated successfully",
  "data": {
    "_id": "65b00222333444555666777",
    "name": "Apple Scab",
    "description": "Updated detailed description for Apple Scab..."
  }
}
```

---

### د. حذف مرض
*⚠️ لا يمكن حذف مرض مستخدم حالياً في أي علاج.*
* **الرابط:** `DELETE /api/admin/diseases/:id`
* **الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Disease deleted successfully"
}
```

---

## 4. روابط إدارة العلاجات للمشرفين (Admin Treatment Management)
*🔑 تتطلب هذه الروابط مصادقة مشرف (JWT Token مع دور Admin).*
* **مسار الرابط الرئيسي:** `/api/admin/treatments`

### أ. الحصول على جميع العلاجات (مع Pagination)
* **الرابط:** `GET /api/admin/treatments`
* **الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Treatments retrieved successfully",
  "data": {
    "treatments": [
      {
        "_id": "65b00abc1122334455667788",
        "name": "Copper Fungicide",
        "instructions": "Apply every 7-10 days.",
        "disease_ids": [
          {
            "_id": "65b00111222333444555666",
            "name": "Tomato Powdery Mildew"
          }
        ]
      }
    ],
    "currentPage": 1,
    "totalPages": 1,
    "totalTreatments": 1
  }
}
```

---

### ب. إضافة علاج جديد
* **الرابط:** `POST /api/admin/treatments`
* **جسم الطلب (Request Body):**
```json
{
  "name": "Sulfur Dusting",
  "instructions": "Dust dry leaves carefully. Do not apply in temperature above 32C.",
  "disease_ids": ["65b00111222333444555666"]
}
```
* **الاستجابة الناجحة (201 Created):**
```json
{
  "message": "Treatment created successfully",
  "data": {
    "_id": "65b00xyz1122334455667788",
    "name": "Sulfur Dusting",
    "instructions": "Dust dry leaves carefully. Do not apply in temperature above 32C.",
    "disease_ids": ["65b00111222333444555666"],
    "__v": 0
  }
}
```

---

### ج. تعديل علاج موجود
* **الرابط:** `PUT /api/admin/treatments/:id`
* **جسم الطلب (Request Body):**
```json
{
  "instructions": "Updated dusting instructions...",
  "disease_ids": ["65b00111222333444555666", "65b00222333444555666777"]
}
```
* **الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Treatment updated successfully",
  "data": {
    "_id": "65b00xyz1122334455667788",
    "name": "Sulfur Dusting",
    "instructions": "Updated dusting instructions...",
    "disease_ids": [ ... ]
  }
}
```

---

### د. حذف علاج
*⚠️ لا يمكن حذف العلاج إذا كان هناك منتج متجر مرتبط به.*
* **الرابط:** `DELETE /api/admin/treatments/:id`
* **الاستجابة الناجحة (200 OK):**
```json
{
  "message": "Treatment deleted successfully"
}
```

---

## 5. التحكم في إعدادات ونماذج الفحص (Admin Scan Settings)
تمكّن هذه الواجهة المشرف من تغيير طريقة عمل نظام الفحص بين Gemini، أو النموذج المخصص (HuggingFace Model)، أو الدمج الهجين للتوفير في التكاليف.

* **روابط الإعدادات:**
  * جلب الإعدادات الحالية: `GET /api/admin/scan-detection`
  * تعديل الإعدادات: `PUT /api/admin/scan-detection`
* **مزيد من التفاصيل:** يرجى مراجعة ملف التوثيق المخصص: [ADMIN_SCAN_DETECTION_API.md](file:///j:/Programming/Node%20js/manbat_backend/docs/ADMIN_SCAN_DETECTION_API.md)

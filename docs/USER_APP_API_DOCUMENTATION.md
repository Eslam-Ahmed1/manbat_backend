# 📱 توثيق واجهة برمجة التطبيقات لتطبيق المستخدم العادي (User App API Documentation)

مرحباً بك في التوثيق الشامل لجميع روابط (Endpoints) واجهة برمجة التطبيقات الخاصة بـ **تطبيق المستخدم العادي** لتطبيق "منبت" (Manbat). 

تم تصميم هذه الواجهات لتمكين تطبيق الهاتف أو واجهة الويب الخاصة بالمستخدم من إتمام جميع العمليات الأساسية من تسجيل الحساب، تصفح النباتات والمقالات، تشخيص الأمراض بالذكاء الاصطناعي، تصفح المتجر وإضافة المنتجات لعربة التسوق، إتمام الطلبات، والمحادثة مع طبيب النباتات الذكي.

---

## 📌 الفهرس
1. [الإعدادات العامة والمصادقة](#-الإعدادات-العامة-والمصادقة)
2. [المصادقة وإدارة الحساب (`/api/authentication`)](#1-المصادقة-وإدارة-الحساب-apiauthentication)
3. [الملف الشخصي للمستخدم (`/api/user`)](#2-الملف-الشخصي-للمستخدم-apiuser)
4. [النباتات وتصنيفاتها (`/api/catalog` & `/api/plants`)](#3-النباتات-وتصنيفاتها-apicatalog-apiplants)
5. [المقالات التثقيفية والتعليمية (`/api/articles`)](#4-المقالات-التثقيفية-والتعليمية-apiarticles)
6. [تشخيص الأمراض بالذكاء الاصطناعي (`/api/scans`)](#5-تشخيص-الأمراض-بالذكاء-الاصطناعي-apiscans)
7. [الأدوية وعلاجات الأمراض (`/api/treatment`)](#6-الأدوية-وعلاجات-الأمراض-apitreatment)
8. [متجر المنتجات والمستلزمات الزراعية (`/api/product`)](#7-متجر-المنتجات-والمستلزمات-الزراعية-apiproduct)
9. [عربة التسوق (`/api/cart`)](#8-عربة-التسوق-apicart)
10. [طلب المنتجات والشراء (`/api/orders`)](#9-طلب-المنتجات-والشراء-apiorders)
11. [مساعد طبيب النباتات الذكي (`/api/AI_chat`)](#10-مساعد-طبيب-النباتات-الذكي-apiai_chat)

---

## ⚙️ الإعدادات العامة والمصادقة

* **العنوان الأساسي للخدمة (Base URL):** `http://localhost:3000` (أو عنوان السيرفر السحابي الفعلي)
* **بروتوكول المصادقة:** يتم استخدام **JWT (JSON Web Tokens)** للتحقق من هوية المستخدم.
* **طريقة إرسال التوكن:** يجب تضمين التوكن في جميع الطلبات التي تتطلب صلاحيات المستخدم داخل الـ Headers بالشكل التالي:
  ```http
  Authorization: Bearer <TOKEN_HERE>
  ```
* **تنسيق البيانات:** يتم إرسال واستقبال جميع البيانات بتنسيق **JSON**، ما عدا روابط رفع الصور التي تستخدم `multipart/form-data`.

---

## 1. المصادقة وإدارة الحساب (`/api/authentication`)

مسار الروابط يبدأ بـ: `/api/authentication`

### أ. تسجيل حساب جديد (Register)
* **الرابط:** `POST /register`
* **المصادقة:** لا تتطلب
* **جسم الطلب (Request Body):**
  ```json
  {
    "name": "أحمد محمد",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
* **الاستجابة الناجحة (21 Created):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### ب. تسجيل الدخول (Login)
* **الرابط:** `POST /login`
* **المصادقة:** لا تتطلب
* **جسم الطلب (Request Body):**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### ج. التحقق من التوكن وجلب بيانات الحساب الأساسية
* **الرابط:** `GET /user`
* **المصادقة:** مطلوبة (Bearer Token)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "_id": "65afa000...",
    "name": "أحمد محمد",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2026-05-19T14:30:16.000Z"
  }
  ```

### د. تغيير كلمة المرور (Change Password)
* **الرابط:** `PUT /change-password`
* **المصادقة:** مطلوبة (Bearer Token)
* **جسم الطلب (Request Body):**
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

---

## 2. الملف الشخصي للمستخدم (`/api/user`)

مسار الروابط يبدأ بـ: `/api/user`

### أ. عرض الملف الشخصي للمستخدم (Get Profile)
* **الرابط:** `GET /profile`
* **المصادقة:** مطلوبة (Bearer Token)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Profile retrieved successfully",
    "data": {
      "_id": "65afa000...",
      "name": "أحمد محمد",
      "email": "user@example.com",
      "phone": "01234567890",
      "address": "123 شارع النيل، القاهرة، مصر"
    }
  }
  ```

### ب. تحديث الملف الشخصي للمستخدم (Update Profile)
* **الرابط:** `PUT /profile`
* **المصادقة:** مطلوبة (Bearer Token)
* **جسم الطلب (Request Body - حقول اختيارية):**
  ```json
  {
    "name": "أحمد محمد محمود",
    "phone": "01099887766",
    "address": "456 شارع الثورة، الجيزة، مصر"
  }
  ```
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Profile updated successfully",
    "data": {
      "_id": "65afa000...",
      "name": "أحمد محمد محمود",
      "email": "user@example.com",
      "phone": "01099887766",
      "address": "456 شارع الثورة، الجيزة، مصر"
    }
  }
  ```

---

## 3. النباتات وتصنيفاتها (`/api/catalog` & `/api/plants`)

تتيح هذه الروابط للمستخدم تصفح النباتات المتاحة ومجموعاتها حسب الأقسام الحيوية.

### أ. الحصول على جميع أقسام الكتالوج (Get Categories)
* **الرابط:** `GET /api/catalog/categories`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Categories retrieved successfully",
    "data": [
      {
        "_id": "65afab11...",
        "name": "الخضروات",
        "createdAt": "2026-05-19T14:30:16.000Z"
      },
      {
        "_id": "65afab22...",
        "name": "نباتات الزينة",
        "createdAt": "2026-05-19T14:30:16.000Z"
      }
    ]
  }
  ```

### ب. الحصول على النباتات التابعة لقسم معين (Plants by Category)
* **الرابط:** `GET /api/catalog/categories/:id/plants`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Plants retrieved successfully",
    "data": [
      {
        "_id": "65afbb22...",
        "name": "طماطم",
        "category_id": "65afab11...",
        "image_url": "https://res.cloudinary.com/...",
        "createdAt": "2026-05-19T14:30:16.000Z"
      }
    ]
  }
  ```

### ج. الحصول على جميع النباتات مع تفاصيل القسم (All Plants)
* **الروابط المتاحة:** 
  * `GET /api/catalog/plants`
  * `GET /api/plants`
* **المصادقة:** لا تتطلب (عام)
* **معاملات التصفية الاختيارية (Query Params):**
  * `page` (number): رقم الصفحة (الافتراضي: 1)
  * `limit` (number): عدد العناصر (الافتراضي: 10)
  * `search` (string): بحث بالاسم
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Plants retrieved successfully",
    "data": {
      "plants": [
        {
          "_id": "65afbb22...",
          "name": "طماطم",
          "image_url": "https://res.cloudinary.com/...",
          "category_id": {
            "_id": "65afab11...",
            "name": "الخضروات"
          }
        }
      ],
      "currentPage": 1,
      "totalPages": 1,
      "totalPlants": 1
    }
  }
  ```

### د. الحصول على تفاصيل نبات معين بالكامل (Plant by ID)
* **الروابط المتاحة:**
  * `GET /api/catalog/plants/:id`
  * `GET /api/plants/:id`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Plant retrieved successfully",
    "data": {
      "_id": "65afbb22...",
      "name": "طماطم",
      "image_url": "https://res.cloudinary.com/...",
      "category_id": {
        "_id": "65afab11...",
        "name": "الخضروات"
      }
    }
  }
  ```

---

## 4. المقالات التثقيفية والتعليمية (`/api/articles`)

مسار الروابط يبدأ بـ: `/api/articles`

### أ. الحصول على قائمة المقالات (Retrieve Articles)
* **الرابط:** `GET /`
* **المصادقة:** لا تتطلب (عام)
* **معاملات الاستعلام الاختيارية (Query Parameters):**
  * `page` (number): رقم الصفحة (الافتراضي: `1`)
  * `limit` (number): عدد المقالات بالصفحة (الافتراضي: `10`)
  * `search` (string): للبحث في العنوان، الملخص والمحتوى.
  * `tag` (string): فلترة المقالات حسب وسم معين.
  * `type` (string): إذا كان `"general"` يجلب فقط المقالات العامة غير المرتبطة بنبات معين (`plant_id = null`).
  * `plantId` أو `plant_id` (string): لفلترة المقالات التابعة لنبات معين بواسطة الـ ID الخاص به.
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Articles retrieved successfully",
    "data": {
      "articles": [
        {
          "_id": "65afbc18...",
          "title": "رعاية نبات الطماطم وسقايته",
          "summary": "نصائح وإرشادات حول ري الطماطم ونوع التربة المناسبة...",
          "content": "نص المقال الكامل هنا...",
          "image_url": "https://res.cloudinary.com/...",
          "plant_id": {
            "_id": "65afbb22...",
            "name": "طماطم"
          },
          "tags": ["طماطم", "ري", "زراعة"],
          "status": "published",
          "published_at": "2026-05-19T14:30:16.000Z"
        }
      ],
      "currentPage": 1,
      "totalPages": 3,
      "totalArticles": 28
    }
  }
  ```

### ب. الحصول على المقالات العامة فقط (General Articles)
* **الرابط:** `GET /general`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "General articles retrieved successfully",
    "data": {
      "articles": [
        {
          "_id": "65afbc99...",
          "title": "أساسيات الري المنزلي للنباتات",
          "plant_id": null,
          "tags": ["ري", "منزلي"]
        }
      ]
    }
  }
  ```

### ج. الحصول على مقالات نبات معين (Plant Articles)
* **الروابط المتاحة (تدعم الاخطاء الإملائية وتنوع المسميات):**
  * `GET /plants/:plantId` (الأساسي)
  * `GET /plant/:plantId` (المفرد)
  * `GET /plant_id/:plant_id` (Snake Case)
  * `GET /api/plants/:plantId/articles` (رابط فرعي مباشر)
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Plant articles retrieved successfully",
    "data": {
      "articles": [
        {
          "_id": "65afbc18...",
          "title": "رعاية نبات الطماطم وسقايته",
          "plant_id": "65afbb22..."
        }
      ],
      "currentPage": 1,
      "totalPages": 1,
      "totalArticles": 1
    }
  }
  ```

### د. تفاصيل مقال معين بواسطة الـ ID
* **الرابط:** `GET /:id`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Article retrieved successfully",
    "data": {
      "_id": "65afbc18...",
      "title": "رعاية نبات الطماطم وسقايته",
      "content": "المحتوى الكامل للمقال هنا بالتفصيل...",
      "plant_id": {
        "_id": "65afbb22...",
        "name": "طماطم"
      }
    }
  }
  ```

---

## 5. تشخيص الأمراض بالذكاء الاصطناعي (`/api/scans`)

مسار الروابط يبدأ بـ: `/api/scans`

### أ. فحص وتشخيص صورة نبات مصاب (Analyze Plant Image)
* **الرابط:** `POST /`
* **المصادقة:** مطلوبة (Bearer Token)
* **نوع المحتوى (Content-Type):** `multipart/form-data`
* **المدخلات في الـ Form-Data:**
  * `plantImage` (ملف صورة - File): صورة ورقة النبات المصاب المراد تشخيصها.
* **الاستجابة الناجحة (200 OK):**
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
            "name": "عفن أوراق الطماطم (Tomato Leaf Mold)",
            "description": "مرض فطري يسبب بقع خضراء باهتة على السطح العلوي للأوراق..."
          }
        ],
        "scan_date": "2026-05-25T11:00:00.000Z"
      },
      "detectedDiseases": [
        {
          "disease": {
            "_id": "65b00111222333444555666",
            "name": "عفن أوراق الطماطم (Tomato Leaf Mold)",
            "description": "مرض فطري يسبب بقع خضراء باهتة..."
          },
          "treatment": {
            "_id": "65b00abc1122334455667788",
            "name": "مبيد فطري نحاسي (Copper Fungicide)",
            "instructions": "رش الأوراق المصابة كل 7-10 أيام صباحاً."
          },
          "products": [
            {
              "_id": "65afe999...",
              "name": "بخاخ مبيد فطري نحاسي 500 مل",
              "description": "فعال جداً ضد عفن الأوراق والبياض الدقيقي",
              "price": 20.00,
              "discount": 0,
              "discountedPrice": 20.00,
              "quantity": 15,
              "image_url": "https://res.cloudinary.com/...",
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
        "plantType": "Tomato",
        "modelConfidence": 0.95
      }
    }
  }
  ```

### ب. عرض سجل عمليات الفحص والتشخيص للمستخدم
* **الرابط:** `GET /`
* **المصادقة:** مطلوبة (Bearer Token)
* **معاملات التصفية الاختيارية (Query Params):**
  * `page` (number): رقم الصفحة (الافتراضي: 1)
  * `limit` (number): عدد الفحوصات في الصفحة (الافتراضي: 10)
* **الاستجابة الناجحة (200 OK):**
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

### ج. تفاصيل فحص معين بواسطة الـ ID
* **الرابط:** `GET /:id`
* **المصادقة:** مطلوبة (Bearer Token)
* **الاستجابة الناجحة (200 OK):**
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

## 6. الأدوية وعلاجات الأمراض (`/api/treatment`)

مسار الروابط يبدأ بـ: `/api/treatment`

### أ. الحصول على كافة العلاجات المسجلة في النظام
* **الرابط:** `GET /`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Treatments retrieved successfully",
    "data": [
      {
        "_id": "65b00abc1122334455667788",
        "name": "بخاخ مبيد فطري",
        "instructions": "قم برش الأوراق في الصباح الباكر مرة أسبوعياً.",
        "disease_ids": [
          {
            "_id": "65b00111222333444555666",
            "name": "البياض الدقيقي في الطماطم"
          }
        ]
      }
    ]
  }
  ```

### ب. تفاصيل علاج معين بواسطة الـ ID
* **الرابط:** `GET /:id`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Treatment retrieved successfully",
    "data": {
      "_id": "65b00abc1122334455667788",
      "name": "بخاخ مبيد فطري",
      "instructions": "قم برش الأوراق في الصباح الباكر مرة أسبوعياً.",
      "disease_ids": [
        {
          "_id": "65b00111222333444555666",
          "name": "البياض الدقيقي في الطماطم",
          "description": "مرض فطري يظهر على هيئة مسحوق أبيض على سطح الأوراق..."
        }
      ]
    }
  }
  ```

### ج. الحصول على علاجات لمرض معين (بواسطة Disease ID)
* **الرابط:** `GET /disease/:diseaseId`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Treatments retrieved successfully",
    "data": [
      {
        "_id": "65b00abc1122334455667788",
        "name": "بخاخ مبيد فطري",
        "instructions": "...",
        "disease_ids": ["65b00111222333444555666"]
      }
    ]
  }
  ```

### د. الحصول على علاجات لعدة أمراض معاً (Batch Query)
* **الرابط:** `POST /diseases`
* **المصادقة:** لا تتطلب (عام)
* **جسم الطلب (Request Body):**
  ```json
  {
    "disease_ids": [
      "65b00111222333444555666",
      "65b00222333444555666777"
    ]
  }
  ```
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Treatments retrieved successfully",
    "data": [
      {
        "_id": "65b00abc1122334455667788",
        "name": "بخاخ مبيد فطري ونحاسي",
        "instructions": "...",
        "disease_ids": [ ... ]
      }
    ]
  }
  ```

---

## 7. متجر المنتجات والمستلزمات الزراعية (`/api/product`)

مسار الروابط يبدأ بـ: `/api/product`

### أ. عرض قائمة المنتجات مع الفلترة والبحث (Get Products)
* **الرابط:** `GET /`
* **المصادقة:** لا تتطلب (عام)
* **معاملات الاستعلام الاختيارية (Query Parameters):**
  * `page` (number): رقم الصفحة (الافتراضي 1)
  * `limit` (number): عدد المنتجات في الصفحة (الافتراضي 10)
  * `search` (string): كلمة للبحث في اسم المنتج أو الوصف.
  * `category` (string): فلترة حسب قسم المنتج (مثل: "مبيدات", "أسمدة").
  * `sort` (string): ترتيب المنتجات (`price_asc` للأرخص، `price_desc` للأغلى، `newest` للأحدث).
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Products retrieved successfully",
    "data": {
      "products": [
        {
          "_id": "65afe999...",
          "name": "سماد عضوي فائق الجودة",
          "description": "غذاء مثالي لجميع أنواع النباتات المنزلية...",
          "price": 25.00,
          "quantity": 100,
          "discount": 10,
          "discountedPrice": 22.50,
          "image_url": "https://res.cloudinary.com/...",
          "category": "أسمدة",
          "status": "in_stock",
          "createdAt": "2026-05-19T17:36:00.000Z"
        }
      ]
    }
  }
  ```

### ب. عرض تفاصيل منتج معين بالكامل مع المقترحات (Product by ID)
* **الرابط:** `GET /:id`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Product retrieved successfully",
    "data": {
      "product": {
        "_id": "65afe999...",
        "name": "سماد عضوي فائق الجودة",
        "description": "...",
        "price": 25.00,
        "discountedPrice": 22.50
      },
      "relatedProducts": [
        {
          "_id": "65afea22...",
          "name": "مغذي نيتروجين سائل للنبات",
          "price": 15.00,
          "discountedPrice": 15.00,
          "image_url": "https://..."
        }
      ]
    }
  }
  ```

### ج. الحصول على المنتجات المميزة (Featured Products)
* **الرابط:** `GET /featured`
* **المصادقة:** لا تتطلب (عام)
* **معاملات الاستعلام الاختيارية (Query Parameters):**
  * `limit` (number): أقصى عدد للمنتجات المميزة (الافتراضي 6).
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Featured products retrieved successfully",
    "data": [
      {
        "_id": "65afe999...",
        "name": "سماد عضوي فائق الجودة",
        "price": 25.00,
        "is_featured": true
      }
    ]
  }
  ```

### د. جلب جميع تصنيفات وأقسام المنتجات (Product Categories)
* **الرابط:** `GET /categories`
* **المصادقة:** لا تتطلب (عام)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Product categories retrieved successfully",
    "data": [
      "أسمدة",
      "مبيدات",
      "أدوات زراعية",
      "بذور"
    ]
  }
  ```

---

## 8. عربة التسوق (`/api/cart`)

مسار الروابط يبدأ بـ: `/api/cart`
*🔑 جميع هذه الروابط تتطلب تسجيل الدخول وتمرير الـ Token.*

### أ. عرض عربة التسوق الحالية للمستخدم (Get Cart)
* **الرابط:** `GET /`
* **المصادقة:** مطلوبة (Bearer Token)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Cart retrieved successfully",
    "data": {
      "_id": "65aff111...",
      "user_id": "65afa000...",
      "items": [
        {
          "product_id": {
            "_id": "65afe999...",
            "name": "سماد عضوي فائق الجودة",
            "price": 25.00,
            "image_url": "https://..."
          },
          "quantity": 2,
          "price": 25.00
        }
      ],
      "total_price": 50.00
    }
  }
  ```

### ب. إضافة منتج لعربة التسوق أو زيادة كميته (Add to Cart)
* **الرابط:** `POST /add`
* **المصادقة:** مطلوبة (Bearer Token)
* **جسم الطلب (Request Body):**
  ```json
  {
    "product_id": "65afe999...",
    "quantity": 1,
    "price": 25.00
  }
  ```
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Item added to cart",
    "data": {
      "_id": "65aff111...",
      "items": [
        {
          "product_id": "65afe999...",
          "quantity": 3,
          "price": 25.00
        }
      ],
      "total_price": 75.00
    }
  }
  ```

### ج. إزالة منتج بالكامل من عربة التسوق (Remove from Cart)
* **الرابط:** `POST /remove`
* **المصادقة:** مطلوبة (Bearer Token)
* **جسم الطلب (Request Body):**
  ```json
  {
    "product_id": "65afe999..."
  }
  ```
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Item removed from cart",
    "data": {
      "_id": "65aff111...",
      "items": [],
      "total_price": 0.00
    }
  }
  ```

---

## 9. طلب المنتجات والشراء (`/api/orders`)

مسار الروابط يبدأ بـ: `/api/orders`
*🔑 جميع هذه الروابط تتطلب تسجيل الدخول وتمرير الـ Token.*

### أ. إنشاء طلب شراء جديد (Place Order)
يقوم بتحويل المنتجات الموجودة في عربة التسوق الحالية إلى طلب شراء رسمي، ثم يقوم بإفراغ عربة التسوق.
* **الرابط:** `POST /`
* **المصادقة:** مطلوبة (Bearer Token)
* **جسم الطلب (Request Body):**
  ```json
  {
    "shipping_address": "123 شارع النيل، القاهرة، مصر"
  }
  ```
* **الاستجابة الناجحة (201 Created):**
  ```json
  {
    "message": "Order placed successfully",
    "data": {
      "_id": "65b00222...",
      "user_id": "65afa000...",
      "items": [
        {
          "product_id": "65afe999...",
          "quantity": 2,
          "price": 25.00
        }
      ],
      "total_amount": 50.00,
      "shipping_address": "123 شارع النيل، القاهرة، مصر",
      "status": "pending",
      "createdAt": "2026-05-25T14:30:00.000Z"
    }
  }
  ```

### ب. عرض سجل الطلبات الخاصة بالمستخدم (Get User Orders)
عرض قائمة بجميع الطلبات السابقة التي قام بها المستخدم.
* **الرابط:** `GET /`
* **المصادقة:** مطلوبة (Bearer Token)
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "message": "Orders retrieved successfully",
    "data": [
      {
        "_id": "65b00222...",
        "total_amount": 50.00,
        "shipping_address": "123 شارع النيل، القاهرة، مصر",
        "status": "pending",
        "createdAt": "2026-05-25T14:30:00.000Z"
      }
    ]
  }
  ```

---

## 10. مساعد طبيب النباتات الذكي (`/api/AI_chat`)

مسار الروابط يبدأ بـ: `/api/AI_chat`
*🔑 جميع هذه الروابط تتطلب تسجيل الدخول وتمرير الـ Token.*

المساعد الذكي مهيأ ليكون طبيباً مختصاً بالنباتات، وسيجيب فقط عن الأسئلة المتعلقة بالنباتات وأمراضها وطرق رعايتها.

### أ. بدء جلسة محادثة جديدة (Start New Chat)
يبدأ جلسة محادثة فارغة ويرجع الـ ID الفريد للمحادثة الجديدة لربط الرسائل بها.
* **الرابط:** `GET /new_chat`
* **المصادقة:** مطلوبة (Bearer Token)
* **الاستجابة الناجحة (201 Created):**
  ```json
  {
    "chat_Id": "65b00ccc1122334455667788"
  }
  ```

### ب. الحصول على قائمة بجميع معرفات محادثات المستخدم (Get Chat IDs)
يرجع معرفات جميع جلسات المحادثة السابقة الخاصة بالمستخدم مرتبة من الأحدث للأقدم لعرضها في القائمة الجانبية مثلاً.
* **الرابط:** `GET /chat_ids`
* **المصادقة:** مطلوبة (Bearer Token)
* **الاستجابة الناجحة (201 Created):**
  ```json
  [
    {
      "_id": "65b00ccc1122334455667788"
    },
    {
      "_id": "65b00bbb1122334455667788"
    }
  ]
  ```

### ج. إرسال رسالة إلى المساعد الذكي والحصول على الرد (Send Message)
إرسال رسالة نصية ضمن المحادثة لتوليد الإجابة من الذكاء الاصطناعي.
* **الرابط:** `POST /:chat_id/messages`
* **المصادقة:** مطلوبة (Bearer Token)
* **جسم الطلب (Request Body):**
  ```json
  {
    "content": "عندي شجرة طماطم أوراقها صفراء، ما المشكلة؟"
  }
  ```
* **الاستجابة الناجحة (200 OK):**
  ```json
  {
    "aiMessage": "اصفرار أوراق الطماطم يمكن أن ينتج عن عدة أسباب مثل: زيادة الري، نقص النيتروجين، أو الإصابة بمرض عفن الجذور. يُنصح بالتحقق من رطوبة التربة وإضافة سماد غني بالنيتروجين."
  }
  ```

### د. جلب جميع الرسائل في محادثة معينة (Get Chat Messages)
جلب قائمة مرتبة زمنياً بكل الرسائل المتبادلة (المرسلة والمستقبلة) داخل جلسة محادثة معينة.
* **الرابط:** `GET /:chat_id/messages`
* **المصادقة:** مطلوبة (Bearer Token)
* **الاستجابة الناجحة (200 OK):**
  ```json
  [
    {
      "_id": "65b00d111222333444555666",
      "chat_id": "65b00ccc1122334455667788",
      "sender": "user",
      "content": "عندي شجرة طماطم أوراقها صفراء، ما المشكلة؟",
      "sent_at": "2026-05-25T15:00:00.000Z"
    },
    {
      "_id": "65b00d111222333444555667",
      "chat_id": "65b00ccc1122334455667788",
      "sender": "ai",
      "content": "اصفرار أوراق الطماطم يمكن أن ينتج عن عدة أسباب...",
      "sent_at": "2026-05-25T15:00:05.000Z"
    }
  ]
  ```

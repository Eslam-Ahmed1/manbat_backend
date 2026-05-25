# 🛒 Manbut Store - توثيق API كامل

**Base URL:** `http://localhost:3000/api`

**المصادقة:** معظم endpoints تتطلب JWT token في الـ header:
```
Authorization: Bearer <token>
```

---

## 📑 الفهرس

1. [Authentication](#1-authentication)
2. [Products](#2-products)
3. [Product Categories](#3-product-categories)
4. [Cart](#4-cart)
5. [Orders](#5-orders)
6. [Catalog (Plants)](#6-catalog-plants)
7. [User Profile](#7-user-profile)
8. [Error Responses](#8-error-responses)
9. [Data Models](#9-data-models)

---

## 1. Authentication

**Base:** `/api/authentication`  
**المصادقة:** غير مطلوبة (إلا لـ `/user`)

---

### POST `/api/authentication/register`
تسجيل مستخدم جديد.

**Body:**
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Validation:**
- `name`: نص، 2 أحرف على الأقل
- `email`: بريد إلكتروني صالح
- `password`: نص، 8 أحرف على الأقل

**Response `201`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | `user exist` |
| 422 | Validation error |

---

### POST `/api/authentication/login`
تسجيل الدخول.

**Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
| Code | Message |
|------|---------|
| 401 | `Email or Password Incorrect` |

---

### GET `/api/authentication/user`
جلب بيانات المستخدم الحالي من الـ token.

**Headers:** `Authorization: Bearer <token>` ✅

**Response `200`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "role": "user",
  "iat": 1700000000,
  "exp": 1700432000
}
```

> ملاحظة: يرجع payload الـ JWT مباشرة (ليس من DB).

---

## 2. Products

**Base:** `/api/product`  
**المصادقة:** غير مطلوبة (public)

---

### GET `/api/product`
جلب جميع المنتجات مع فلترة وترتيب وتصفح.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | بحث في الاسم والوصف | `?search=مبيد` |
| `category` | ObjectId | فلترة بالفئة | `?category=64f1...` |
| `inStock` | boolean | المنتجات المتوفرة فقط | `?inStock=true` |
| `minPrice` | number | الحد الأدنى للسعر | `?minPrice=50` |
| `maxPrice` | number | الحد الأقصى للسعر | `?maxPrice=200` |
| `sort` | string | الترتيب | `?sort=price_asc` |
| `page` | number | رقم الصفحة | `?page=2` |
| `limit` | number | عدد النتائج | `?limit=10` |

**قيم `sort` المتاحة:**
- `price_asc` - السعر من الأقل للأعلى
- `price_desc` - السعر من الأعلى للأقل
- `newest` - الأحدث أولاً (افتراضي)

**Response `200`:**
```json
{
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "مبيد فطري - TopFungus Pro",
        "description": "مبيد فطري واسع الطيف",
        "price": 180,
        "discount": 10,
        "discountedPrice": 162,
        "quantity": 45,
        "status": "in_stock",
        "image_url": "https://...",
        "treatment_id": {
          "_id": "...",
          "name": "مبيد فطري",
          "instructions": "رش مرتين أسبوعياً"
        },
        "product_category_id": {
          "_id": "...",
          "name": "مبيدات فطرية"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 48
  }
}
```

**قيم `status` الممكنة:**
- `in_stock` - متوفر (quantity > 10)
- `low_stock` - مخزون منخفض (quantity 1-10)
- `out_of_stock` - نفذ المخزون (quantity = 0)

---

### GET `/api/product/:id`
جلب منتج واحد مع المنتجات المشابهة.

**Response `200`:**
```json
{
  "message": "Product retrieved successfully",
  "data": {
    "product": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "مبيد فطري - TopFungus Pro",
      "description": "مبيد فطري واسع الطيف",
      "price": 180,
      "discount": 10,
      "discountedPrice": 162,
      "quantity": 45,
      "status": "in_stock",
      "image_url": "https://...",
      "treatment_id": {
        "_id": "...",
        "name": "مبيد فطري",
        "instructions": "رش مرتين أسبوعياً"
      },
      "product_category_id": {
        "_id": "...",
        "name": "مبيدات فطرية"
      }
    },
    "relatedProducts": [
      {
        "_id": "...",
        "name": "مبيد فطري - FungiStop",
        "price": 95,
        "discount": 0,
        "discountedPrice": 95,
        "status": "in_stock",
        "image_url": "https://...",
        "product_category_id": { "name": "مبيدات فطرية" }
      }
    ]
  }
}
```

> المنتجات المشابهة: منتجات من نفس الفئة (حتى 4 منتجات).

**Errors:**
| Code | Message |
|------|---------|
| 404 | `Product not found` |

---

### GET `/api/product/featured`
جلب المنتجات المميزة (الأعلى خصماً والأحدث).

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 6 | عدد المنتجات |

**Response `200`:**
```json
{
  "message": "Featured products retrieved successfully",
  "data": [
    {
      "_id": "...",
      "name": "مبيد فطري - TopFungus Pro",
      "price": 180,
      "discount": 25,
      "discountedPrice": 135,
      "status": "in_stock",
      "image_url": "https://...",
      "product_category_id": { "name": "مبيدات فطرية" }
    }
  ]
}
```

---

### GET `/api/product/categories`
جلب جميع فئات المنتجات.

**Response `200`:**
```json
{
  "message": "Product categories retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "مبيدات فطرية",
      "description": "مبيدات لعلاج الأمراض الفطرية",
      "image_url": "https://...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 3. Product Categories

**Base:** `/api/product/categories`  
**المصادقة:** غير مطلوبة (public)

> إدارة الفئات (إضافة/تعديل/حذف) متاحة فقط عبر Admin API.  
> راجع [ADMIN_API_DOCUMENTATION.md](./ADMIN_API_DOCUMENTATION.md)

---

## 4. Cart

**Base:** `/api/cart`  
**المصادقة:** مطلوبة ✅

---

### GET `/api/cart`
جلب سلة التسوق للمستخدم الحالي.

> إذا لم تكن هناك سلة، يتم إنشاؤها تلقائياً.

**Response `200`:**
```json
{
  "message": "Cart retrieved successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "user_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [
      {
        "_id": "...",
        "product_id": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
          "name": "مبيد فطري - TopFungus Pro",
          "price": 180,
          "discount": 10,
          "discountedPrice": 162,
          "image_url": "https://...",
          "quantity": 45,
          "status": "in_stock"
        },
        "quantity": 2,
        "price": 162
      }
    ],
    "total_price": 324,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### POST `/api/cart/add`
إضافة منتج إلى السلة.

> إذا كان المنتج موجوداً في السلة، يتم زيادة الكمية.

**Body:**
```json
{
  "product_id": "64f1a2b3c4d5e6f7a8b9c0d3",
  "quantity": 2,
  "price": 162
}
```

> ملاحظة: يجب إرسال `price` من الـ client (استخدم `discountedPrice` إذا كان هناك خصم).

**Response `200`:**
```json
{
  "message": "Item added to cart",
  "data": {
    "_id": "...",
    "user_id": "...",
    "items": [
      {
        "product_id": { ... },
        "quantity": 2,
        "price": 162
      }
    ],
    "total_price": 324
  }
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | `Missing required fields: product_id, quantity, price` |

---

### POST `/api/cart/remove`
إزالة منتج من السلة بالكامل.

**Body:**
```json
{
  "product_id": "64f1a2b3c4d5e6f7a8b9c0d3"
}
```

**Response `200`:**
```json
{
  "message": "Item removed from cart",
  "data": {
    "_id": "...",
    "items": [],
    "total_price": 0
  }
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | `Missing product_id in request body` |
| 404 | `Cart not found` |

---

## 5. Orders

**Base:** `/api/orders`  
**المصادقة:** مطلوبة ✅

---

### POST `/api/orders`
إنشاء طلب جديد من السلة الحالية.

> يتم تفريغ السلة تلقائياً بعد إنشاء الطلب.

**Body:**
```json
{
  "shipping_address": "123 شارع النيل، القاهرة، مصر"
}
```

**Response `201`:**
```json
{
  "message": "Order placed successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "user_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "items": [
      {
        "product_id": "64f1a2b3c4d5e6f7a8b9c0d3",
        "quantity": 2,
        "price": 162
      }
    ],
    "total_amount": 324,
    "shipping_address": "123 شارع النيل، القاهرة، مصر",
    "status": "pending",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | `Shipping address is required` |
| 400 | `Cannot place an order with an empty cart` |

---

### GET `/api/orders`
جلب جميع طلبات المستخدم الحالي.

**Response `200`:**
```json
{
  "message": "Orders retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "user_id": "...",
      "items": [
        {
          "product_id": {
            "_id": "...",
            "name": "مبيد فطري - TopFungus Pro",
            "price": 180,
            "image_url": "https://..."
          },
          "quantity": 2,
          "price": 162
        }
      ],
      "total_amount": 324,
      "shipping_address": "123 شارع النيل، القاهرة، مصر",
      "status": "pending",
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

**حالات الطلب:**
| Status | المعنى |
|--------|--------|
| `pending` | قيد الانتظار |
| `processing` | قيد المعالجة |
| `shipped` | تم الشحن |
| `delivered` | تم التسليم |
| `cancelled` | ملغي |

---

## 6. Catalog (Plants)

**Base:** `/api/catalog`  
**المصادقة:** غير مطلوبة (public)

---

### GET `/api/catalog/categories`
جلب جميع فئات النباتات.

**Response `200`:**
```json
{
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "نباتات زهرية"
    }
  ]
}
```

---

### GET `/api/catalog/categories/:id/plants`
جلب النباتات حسب الفئة.

**Response `200`:**
```json
{
  "message": "Plants retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "الورد",
      "image_url": "https://...",
      "category_id": "64f1a2b3c4d5e6f7a8b9c0d2"
    }
  ]
}
```

**Errors:**
| Code | Message |
|------|---------|
| 404 | `Category not found` |

---

### GET `/api/catalog/plants`
جلب جميع النباتات مع تفاصيل الفئة.

**Response `200`:**
```json
{
  "message": "Plants retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "الورد",
      "image_url": "https://...",
      "category_id": {
        "_id": "...",
        "name": "نباتات زهرية"
      }
    }
  ]
}
```

---

### GET `/api/catalog/plants/:id`
جلب نبات واحد بالتفصيل.

**Response `200`:**
```json
{
  "message": "Plant retrieved successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "الورد",
    "image_url": "https://...",
    "category_id": {
      "_id": "...",
      "name": "نباتات زهرية"
    }
  }
}
```

**Errors:**
| Code | Message |
|------|---------|
| 404 | `Plant not found` |

---

## 7. User Profile

**Base:** `/api/user`  
**المصادقة:** مطلوبة ✅

---

### GET `/api/user/profile`
جلب بيانات الملف الشخصي.

**Response `200`:**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "role": "user",
    "address": "123 شارع النيل، القاهرة",
    "phone": "01012345678",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT `/api/user/profile`
تحديث الملف الشخصي.

> لا يمكن تغيير كلمة المرور من هذا الـ endpoint.

**Body (جميع الحقول اختيارية):**
```json
{
  "name": "Ahmed Mohamed",
  "address": "456 شارع الهرم، الجيزة",
  "phone": "01098765432"
}
```

**Response `200`:**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "_id": "...",
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "address": "456 شارع الهرم، الجيزة",
    "phone": "01098765432"
  }
}
```

---

## 8. Error Responses

جميع الـ endpoints ترجع أخطاء بهذا الشكل:

```json
{
  "message": "وصف الخطأ"
}
```

### أكواد الأخطاء الشائعة:

| Code | المعنى |
|------|--------|
| `400` | Bad Request - بيانات خاطئة أو ناقصة |
| `401` | Unauthorized - token غير موجود أو منتهي |
| `403` | Forbidden - لا تملك الصلاحية |
| `404` | Not Found - العنصر غير موجود |
| `422` | Validation Error - بيانات غير صالحة |
| `500` | Internal Server Error - خطأ في الخادم |

---

## 9. Data Models

### User
```typescript
{
  _id: ObjectId,
  name: string,           // required
  email: string,          // required, unique
  password: string,       // hashed, never returned
  role: "user" | "admin", // default: "user"
  address?: string,
  phone?: string,
  created_at: Date
}
```

### Product
```typescript
{
  _id: ObjectId,
  name: string,                    // required
  description?: string,
  price: number,                   // required
  discount: number,                // 0-100, default: 0
  discountedPrice: number,         // virtual: price * (1 - discount/100)
  quantity: number,                // required
  status: "in_stock" | "low_stock" | "out_of_stock", // virtual
  image_url?: string,
  treatment_id?: ObjectId,         // ref: Treatment
  product_category_id?: ObjectId,  // ref: ProductCategory
  createdAt: Date,
  updatedAt: Date
}
```

### ProductCategory
```typescript
{
  _id: ObjectId,
  name: string,       // required, unique
  description?: string,
  image_url?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```typescript
{
  _id: ObjectId,
  user_id: ObjectId,  // ref: User, unique (one cart per user)
  items: [
    {
      product_id: ObjectId, // ref: Product
      quantity: number,     // min: 1
      price: number         // السعر وقت الإضافة
    }
  ],
  total_price: number,      // محسوب تلقائياً
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```typescript
{
  _id: ObjectId,
  user_id: ObjectId,  // ref: User
  items: [
    {
      product_id: ObjectId, // ref: Product
      quantity: number,
      price: number         // السعر وقت الطلب
    }
  ],
  total_amount: number,
  shipping_address: string,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 سير عملية الشراء الكاملة

```
1. تسجيل / دخول
   POST /api/authentication/register
   POST /api/authentication/login
   → احفظ الـ token

2. تصفح المنتجات
   GET /api/product?search=مبيد&inStock=true
   GET /api/product/:id

3. إضافة للسلة
   POST /api/cart/add
   { product_id, quantity, price: discountedPrice }

4. مراجعة السلة
   GET /api/cart

5. إتمام الطلب
   POST /api/orders
   { shipping_address: "..." }
   → السلة تُفرَّغ تلقائياً

6. متابعة الطلبات
   GET /api/orders
```

---

## 🧪 أمثلة cURL

### تسجيل الدخول:
```bash
curl -X POST http://localhost:3000/api/authentication/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpass123"}'
```

### جلب المنتجات مع فلترة:
```bash
curl "http://localhost:3000/api/product?search=مبيد&inStock=true&sort=price_asc&page=1&limit=10"
```

### إضافة للسلة:
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id":"64f1...","quantity":2,"price":162}'
```

### إنشاء طلب:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"shipping_address":"123 شارع النيل، القاهرة"}'
```

---

## 🔐 ملاحظات الأمان

- الـ token صالح لمدة **5 أيام**
- كلمات المرور مشفرة بـ **bcrypt** (salt rounds: 10)
- الـ JWT secret يجب أن يكون في `.env` كـ `SECRET_TOKEN`
- لا يمكن تغيير كلمة المرور عبر `/api/user/profile`
- السعر في السلة يُحفظ وقت الإضافة (لا يتأثر بتغيير السعر لاحقاً)

---

**آخر تحديث:** مايو 2026 | **الإصدار:** 1.0.0

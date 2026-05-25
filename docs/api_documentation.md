# Manbut Backend API Documentation

Welcome to the Manbut API documentation. This document details the endpoints related to **Articles & Plants** (including the newly added plant-to-article relations) and the **Store / Shop** functionality (Catalog, Products, Cart, and Orders).

---

## 🍃 Articles & Plants API

These endpoints allow you to query informational articles. We have added full support for retrieving articles by plant ID (`plant_id`), including plural/singular variations, snake_case/camelCase query parameters, and robust typo-tolerant fallbacks (e.g., `palnt_id`).

### 1. Retrieve Articles (with Filtering & Search)
Get a paginated list of published articles.

* **Endpoint:** `GET /api/articles`
* **Query Parameters (Optional):**
  * `page` (number): Page number (default: `1`)
  * `limit` (number): Items per page (default: `10`)
  * `search` (string): Text search across article title, summary, and content
  * `tag` (string): Filter by specific article tag
  * `type` (string): Set to `"general"` to only get articles without any associated plant (`plant_id = null`)
  * `plantId` OR `plant_id` OR `palnt_id` (string): Filter articles specifically belonging to a given Plant ID
* **Success Response (200 OK):**
  ```json
  {
    "message": "Articles retrieved successfully",
    "data": {
      "articles": [
        {
          "_id": "65afbc18...",
          "title": "Caring for Tomatoes",
          "summary": "Tips for watering and soil...",
          "content": "Full article content here...",
          "image_url": "https://res.cloudinary.com/...",
          "plant_id": {
            "_id": "65afbb22...",
            "name": "Tomato",
            "image_url": "https://..."
          },
          "tags": ["tomato", "watering"],
          "status": "published",
          "published_at": "2026-05-19T14:30:16.000Z",
          "createdAt": "2026-05-19T14:30:16.000Z",
          "updatedAt": "2026-05-19T14:30:16.000Z"
        }
      ],
      "currentPage": 1,
      "totalPages": 3,
      "totalArticles": 28
    }
  }
  ```

---

### 2. Retrieve Articles by Plant ID (Route Parameters)
Direct endpoints to fetch all articles belonging to a specific plant. These routes are fully aliased to handle all naming conventions and typos.

* **Endpoints:**
  * `GET /api/articles/plants/:plantId` (Standard plural)
  * `GET /api/articles/plant/:plantId` (Singular)
  * `GET /api/articles/plant_id/:plant_id` (Snake case param)
  * `GET /api/articles/palnt_id/:palnt_id` (Typo fallback)
  * `GET /api/plants/:plantId/articles` (Direct sub-route)
  * `GET /api/plants/:plant_id/articles` (Direct snake case)
  * `GET /api/plants/:palnt_id/articles` (Direct typo fallback)
* **Success Response (200 OK):**
  ```json
  {
    "message": "Plant articles retrieved successfully",
    "data": {
      "articles": [
        {
          "_id": "65afbc18...",
          "title": "Caring for Tomatoes",
          "content": "...",
          "plant_id": "65afbb22..."
        }
      ],
      "currentPage": 1,
      "totalPages": 1,
      "totalArticles": 1
    }
  }
  ```

---

### 3. Retrieve Article by ID
Get the full details of a specific article.

* **Endpoint:** `GET /api/articles/:id`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Article retrieved successfully",
    "data": {
      "_id": "65afbc18...",
      "title": "Caring for Tomatoes",
      "content": "...",
      "plant_id": {
        "_id": "65afbb22...",
        "name": "Tomato"
      }
    }
  }
  ```

---

## 🛍️ Store / Shop API

The e-commerce store is divided into four main sections: **Catalog** (public categories and plants), **Products** (items available for purchase), **Shopping Cart** (user carts), and **Orders** (checkout and history).

---

### 🏛️ Catalog Section (`/api/catalog`)

These public endpoints offer read-only access to plant information sorted by categories.

#### 1. Get All Categories
* **Endpoint:** `GET /api/catalog/categories`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Categories retrieved successfully",
    "data": [
      {
        "_id": "65afab11...",
        "name": "Vegetables",
        "createdAt": "..."
      }
    ]
  }
  ```

#### 2. Get Plants by Category ID
* **Endpoint:** `GET /api/catalog/categories/:id/plants`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Plants retrieved successfully",
    "data": [
      {
        "_id": "65afbb22...",
        "name": "Tomato",
        "category_id": "65afab11...",
        "image_url": "https://..."
      }
    ]
  }
  ```

#### 3. Get All Plants (with Category Details)
* **Endpoint:** `GET /api/catalog/plants`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Plants retrieved successfully",
    "data": {
      "plants": [
        {
          "_id": "65afbb22...",
          "name": "Tomato",
          "category_id": {
            "_id": "65afab11...",
            "name": "Vegetables"
          }
        }
      ],
      "currentPage": 1,
      "totalPages": 1,
      "totalPlants": 1
    }
  }
  ```

#### 4. Get Plant by ID
* **Endpoint:** `GET /api/catalog/plants/:id`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Plant retrieved successfully",
    "data": {
      "_id": "65afbb22...",
      "name": "Tomato",
      "category_id": {
        "_id": "65afab11...",
        "name": "Vegetables"
      }
    }
  }
  ```

---

### 📦 Products Section (`/api/product`)

These endpoints display store inventory, categories, and special featured products.

#### 1. Get All Products (with filters)
* **Endpoint:** `GET /api/product`
* **Query Parameters (Optional):** `page`, `limit`, `search`, `category`, `sort`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Products retrieved successfully",
    "data": {
      "products": [
        {
          "_id": "65afe999...",
          "name": "Organic Fertilizer",
          "description": "Premium plant food...",
          "price": 25.00,
          "quantity": 100,
          "discount": 10,
          "image_url": "https://..."
        }
      ]
    }
  }
  ```

#### 2. Get Product By ID
Retrieves details of a single product as well as related recommendations.
* **Endpoint:** `GET /api/product/:id`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Product retrieved successfully",
    "data": {
      "product": {
        "_id": "65afe999...",
        "name": "Organic Fertilizer",
        "price": 25.00
      },
      "relatedProducts": [
        {
          "_id": "65afea22...",
          "name": "Liquid Nitrogen booster",
          "price": 15.00
        }
      ]
    }
  }
  ```

#### 3. Get Featured Products
* **Endpoint:** `GET /api/product/featured`
* **Query Parameters (Optional):** `limit` (default `6`)
* **Success Response (200 OK):**
  ```json
  {
    "message": "Featured products retrieved successfully",
    "data": [...]
  }
  ```

#### 4. Get Product Categories
* **Endpoint:** `GET /api/product/categories`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Product categories retrieved successfully",
    "data": [...]
  }
  ```

---

### 🛒 Shopping Cart Section (`/api/cart`)
*🔑 Requires JWT Auth Token in Request Headers (`Authorization: Bearer <TOKEN>`)*

#### 1. Get Current User Cart
* **Endpoint:** `GET /api/cart`
* **Success Response (200 OK):**
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
            "name": "Organic Fertilizer",
            "price": 25.00
          },
          "quantity": 2,
          "price": 25.00
        }
      ],
      "total_price": 50.00
    }
  }
  ```

#### 2. Add Item to Cart
Adds or increments a product in the user's active shopping cart.
* **Endpoint:** `POST /api/cart/add`
* **Request Body (Required):**
  ```json
  {
    "product_id": "65afe999...",
    "quantity": 2,
    "price": 25.00
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "Item added to cart",
    "data": { ...updatedCart... }
  }
  ```

#### 3. Remove Item from Cart
Removes a product completely from the user's shopping cart.
* **Endpoint:** `POST /api/cart/remove`
* **Request Body (Required):**
  ```json
  {
    "product_id": "65afe999..."
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "Item removed from cart",
    "data": { ...updatedCart... }
  }
  ```

---

### 💳 Orders Section (`/api/orders`)
*🔑 Requires JWT Auth Token in Request Headers (`Authorization: Bearer <TOKEN>`)*

#### 1. Place a New Order
Converts the active cart items into a purchase order and empties the cart.
* **Endpoint:** `POST /api/orders`
* **Request Body (Required):**
  ```json
  {
    "shipping_address": "123 Nile Street, Cairo, Egypt"
  }
  ```
* **Success Response (201 Created):**
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
      "shipping_address": "123 Nile Street, Cairo, Egypt",
      "status": "pending",
      "createdAt": "2026-05-19T17:36:00.000Z"
    }
  }
  ```

#### 2. Get User Order History
Retrieves all orders placed by the currently logged-in user.
* **Endpoint:** `GET /api/orders`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Orders retrieved successfully",
    "data": [
      {
        "_id": "65b00222...",
        "total_amount": 50.00,
        "status": "pending",
        "createdAt": "..."
      }
    ]
  }
  ```

---

## 🛠️ Admin Management API
*🔑 Requires JWT Auth Token with Admin Role in Headers (`Authorization: Bearer <TOKEN>`)*

### 1. Programmatic Database Seeding
Trigger the sequential execution of all biological categories, plants, diseases, treatments, products, and admin seed scripts directly from the admin dashboard to populate mock data.

* **Endpoint:** `POST /api/admin/seed-database`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Database seeded successfully!",
    "logs": "Starting Categories Seeding...\n🌱 Starting categories seeding...\n✅ Connected to MongoDB\n...\n🎉 Database seeded successfully!"
  }
  ```
* **Failure Response (500 Internal Server Error):**
  ```json
  {
    "message": "Database seeding failed!",
    "error": "Error details...",
    "logs": "Partial execution logs..."
  }
  ```


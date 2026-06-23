/**
 * ربط تسميات نموذج Hugging Face (PlantVillage style)
 * مثل Apple___Black_rot → اسم مرض في MongoDB
 * null = نبات سليم (healthy)
 */
export const HF_DISEASE_MAP = {
    // Apple
    Apple___Apple_scab: "Apple Scab",
    Apple___Black_rot: "Black Rot",
    "Apple___Cedar_apple_rust": "Rust",
    Apple___healthy: null,
    // Blueberry
    Blueberry___healthy: null,
    // Cherry
    "Cherry_(including_sour)___Powdery_mildew": "Powdery Mildew",
    "Cherry_(including_sour)___healthy": null,
    // Corn
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "Corn Gray Leaf Spot",
    "Corn_(maize)___Common_rust": "Leaf Rust",
    "Corn_(maize)___Northern_Leaf_Blight": "Corn Northern Leaf Blight",
    "Corn_(maize)___healthy": null,
    // Grape
    Grape___Black_rot: "Grape Black Rot",
    "Grape___Esca_(Black_Measles)": "Dieback",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "Leaf Spot",
    Grape___healthy: null,
    // Orange / Citrus
    "Orange___Haunglongbing_(Citrus_greening)": "Citrus Greening",
    Orange___healthy: null,
    // Peach
    Peach___Bacterial_spot: "Bacterial Spot",
    Peach___healthy: null,
    // Pepper
    "Pepper,_bell___Bacterial_spot": "Bacterial Spot",
    "Pepper,_bell___healthy": null,
    // Potato
    Potato___Early_blight: "Early Blight",
    Potato___Late_blight: "Late Blight",
    Potato___healthy: null,
    // Raspberry & Soybean
    Raspberry___healthy: null,
    Soybean___healthy: null,
    // Squash
    Squash___Powdery_mildew: "Powdery Mildew",
    // Strawberry
    Strawberry___Leaf_scorch: "Sunscald",
    Strawberry___healthy: null,
    // Tomato
    Tomato___Bacterial_spot: "Bacterial Spot",
    Tomato___Early_blight: "Early Blight",
    Tomato___Late_blight: "Late Blight",
    Tomato___Leaf_Mold: "Gray Mold",
    Tomato___Septoria_leaf_spot: "Septoria Leaf Spot",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Nutrient Deficiency",
    Tomato___Target_Spot: "Early Blight",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Tomato Yellow Leaf Curl Virus",
    Tomato___Tomato_mosaic_virus: "Tomato Mosaic Virus",
    Tomato___healthy: null,
};

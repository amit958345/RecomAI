# RecomAI – AI-Powered E-Commerce Product Recommendation System

RecomAI is an AI-powered e-commerce product recommendation system that helps users discover similar products based on product descriptions.

The system uses **TF-IDF (Term Frequency–Inverse Document Frequency)** and **Cosine Similarity** to analyze product descriptions and recommend relevant products.

## Features

- Browse available products.
- Search products by name or category.
- AI-based similar product recommendations.
- Product similarity scores.
- Product images and pricing.
- Shopping cart with quantity management.
- Cart persistence using browser LocalStorage.
- Checkout summary (demonstration only; no real payment processing).

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend tooling | Vite |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn |
| Data Processing | Pandas, NumPy |
| Recommendation Algorithm | TF-IDF, Cosine Similarity |
| Database | SQLite |
| API | REST API |

## How the Recommendation System Works

1. Product descriptions are collected from the SQLite database.
2. TF-IDF converts textual descriptions into numerical feature vectors.
3. Cosine Similarity calculates similarity between product vectors.
4. Similarity scores are sorted in descending order.
5. The system returns the top two similar products, excluding the selected product.

## Project Structure

```text
RecomAI/
│
├── api.py
├── database.py
├── main.py
├── products.py
├── products.db
├── recommend.py
├── test_database.py
├── .gitignore
├── README.md
│
└── frontend/
    ├── public/
    │   └── images/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Installation and Setup

### Prerequisites

- Python 3.14
- Node.js and npm
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/amit958345/RecomAI.git
cd RecomAI
```

### 2. Set Up the Python Backend

Create and activate a virtual environment:

```powershell
py -3.14 -m venv venv314
.\venv314\Scripts\Activate.ps1
```

Install the required Python packages:

```bash
python -m pip install fastapi uvicorn pandas numpy scikit-learn
```

### 3. Start the Backend Server

From the main project directory:

```bash
python -m uvicorn api:app --reload
```

Backend URL:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

### 4. Set Up the React Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

Keep both backend and frontend servers running while using the application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Welcome message |
| GET | `/products` | Retrieve all products |
| GET | `/products/{product_id}` | Retrieve a specific product |
| GET | `/search?q={query}` | Search products |
| GET | `/recommendations/{product_id}` | Get AI-based recommendations |

## Sample Recommendation

For the selected product **Nike Running Shoes**, the system may return:

| Recommended Product | Similarity |
|---|---:|
| Adidas Sports Shoes | 0.79 |
| Puma Running Shoes | 0.79 |

*Similarity scores represent textual similarity, not a probability of purchase.*

## Database

RecomAI uses SQLite to store product information, including:

- Product ID
- Product name
- Category
- Price
- Description

The included `products.db` file contains the project's sample product data.

## Future Scope

- Larger product datasets.
- Personalized recommendations based on user behavior.
- Collaborative filtering.
- Hybrid recommendation algorithms.
- User authentication and recommendation history.

## Project Information

**Project Name:** RecomAI – AI-Powered E-Commerce Product Recommendation System

**Category:** Machine Learning / Full Stack Development

**GitHub Repository:** https://github.com/amit958345/RecomAI

---

Developed as an academic and learning project.

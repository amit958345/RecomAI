
import sqlite3
from fastapi import FastAPI, HTTPException
from recommend import recommend_products
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Welcome to the E-Commerce Recommendation System!"}

@app.get("/products")
def get_products():
    connection = sqlite3.connect("products.db")
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()
    cursor.execute("SELECT * FROM products")

    products = [dict(row) for row in cursor.fetchall()]

    connection.close()

    return products

@app.get("/products/{product_id}")
def get_product(product_id: int):
    connection = sqlite3.connect("products.db")
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()
    cursor.execute(
        "SELECT * FROM products WHERE id = ?",
        (product_id,)
    )

    product = cursor.fetchone()

    connection.close()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return dict(product)


@app.get("/search")
def search_products(q: str):
    connection = sqlite3.connect("products.db")
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    search_term = f"%{q}%"

    cursor.execute(
        """
        SELECT * FROM products
        WHERE name LIKE ? OR category LIKE ?
        """,
        (search_term, search_term)
    )

    results = [dict(row) for row in cursor.fetchall()]

    connection.close()

    return results


@app.get("/recommendations/{product_id}")
def get_recommendations(product_id: int):
    connection = sqlite3.connect("products.db")
    cursor = connection.cursor()

    cursor.execute(
        "SELECT name FROM products WHERE id = ?",
        (product_id,)
    )

    product = cursor.fetchone()
    connection.close()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )
    recommendations = recommend_products(product[0])

    return {
        "product": product[0],
        "recommendations": recommendations
    }

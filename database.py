
import sqlite3
from products import products

connection = sqlite3.connect("products.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    category TEXT,
    price REAL,
    description TEXT
)
""")

print("Products table created successfully!")


for product in products:
    cursor.execute(
        """
        INSERT OR IGNORE INTO products
        (id, name, category, price, description)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            product["id"],
            product["name"],
            product["category"],
            product["price"],
            product["description"]
        )
    )

connection.commit()

print("Products inserted successfully!")


cursor.execute("SELECT * FROM products")

saved_products = cursor.fetchall()

print("\nProducts stored in the database:")

for product in saved_products:
    print(product)


connection.close()

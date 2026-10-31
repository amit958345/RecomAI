
import sqlite3
import pandas as pd

connection = sqlite3.connect("products.db")

df = pd.read_sql_query("SELECT * FROM products", connection)

print("Products loaded from SQLite:")
print(df)

connection.close()

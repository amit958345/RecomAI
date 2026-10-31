import sqlite3
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

print("Recommendation engine libraries imported successfully!")

connection = sqlite3.connect("products.db")

df = pd.read_sql_query("SELECT * FROM products", connection)

connection.close()
print("\nProducts available for recommendations:")
print(df[["name", "description"]])

# Convert product descriptions into numerical features
tfidf = TfidfVectorizer()

tfidf_matrix = tfidf.fit_transform(df["description"])

print("\nTF-IDF conversion completed!")
print("Matrix shape:", tfidf_matrix.shape)

# Calculate similarity between all products
similarity_matrix = cosine_similarity(tfidf_matrix)

print("\nProduct similarity matrix:")
print(similarity_matrix)

def recommend_products(product_name, number_of_recommendations=2):
    # Find the selected product
    matching_products = df[df["name"] == product_name]

    if matching_products.empty:
        print(f"Product '{product_name}' was not found.")
        return

    product_index = matching_products.index[0]

    # Get similarity scores for this product
    similarity_scores = list(enumerate(similarity_matrix[product_index]))

    # Sort products by similarity, highest first
    similarity_scores = sorted(
        similarity_scores,
        key=lambda item: item[1],
        reverse=True
    )

    # Exclude the selected product itself
    similarity_scores = [
        item for item in similarity_scores
        if item[0] != product_index
    ]

    # Select the top recommendations
    top_products = similarity_scores[:number_of_recommendations]

    # Store recommended products in a list
    recommendations = []

    for index, score in top_products:
        recommendations.append({
            "id": int(df.iloc[index]["id"]),
            "name": df.iloc[index]["name"],
            "category": df.iloc[index]["category"],
            "price": float(df.iloc[index]["price"]),
            "similarity": round(float(score), 2)
        })

    return recommendations


# Test recommendations for every product
for product_name in df["name"]:
    print(f"\nRecommendations for {product_name}:")
    recommend_products(product_name)

# Test an invalid product name
print("\nTesting an invalid product name:")
recommend_products("iPhone 99")

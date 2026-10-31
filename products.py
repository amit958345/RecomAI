import pandas as pd

products = [
   {
    "id": 1,
    "name": "Nike Running Shoes",
    "category": "Footwear",
    "price": 3000,
    "description": "Running shoes for sports, jogging and fitness"
},
    {
        "id": 2,
        "name": "Adidas Sports Shoes",
        "category": "Footwear",
        "price": 2800,
        "description": "Sports shoes for running, training and fitness"
    },
    {
        "id": 3,
        "name": "Samsung Headphones",
        "category": "Electronics",
        "price": 2000,
        "description": "Wireless headphones for music and entertainment"
    },
    {
        "id": 4,
        "name": "Sony Headphones",
        "category": "Electronics",
        "price": 2500,
        "description": "Headphones for music, gaming and entertainment"
    },
    {
        "id": 5,
        "name": "Puma Running Shoes",
        "category": "Footwear",
        "price": 2700,
        "description": "Running shoes for jogging, sports and training"
    }
]

df = pd.DataFrame(products)

print(df)

print("\nProducts in the Footwear category:")

footwear = df[df["category"] == "Footwear"]

print(footwear)

print("\nProduct descriptions:")

print(df[["name", "description"]])
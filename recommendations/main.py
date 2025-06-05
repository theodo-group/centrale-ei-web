from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import pandas as pd

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

@app.post("/recommend")
async def get_recommendations(user_data: dict):
    def your_algorithm(data):
        
        return ["item1", "item2", "item3"]
    recommendations = your_algorithm(user_data)
    return {"recommendations": recommendations}

from contextlib import contextmanager
@contextmanager

def get_db_connection(db_path="backend/database.sqlite3"):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # Pour accéder aux colonnes par nom
    try:
        yield conn
    finally:
        conn.close()

def get_all_movies():
    with get_db_connection() as conn:
        cursor = conn.execute("SELECT * FROM movie")
        return [dict(row) for row in cursor.fetchall()]

def get_movies_by_genre(genre):
    with get_db_connection() as conn:
        cursor = conn.execute(
            "SELECT * FROM movie WHERE genre LIKE ?", 
            (f"%{genre}%",)
        )
        return [dict(row) for row in cursor.fetchall()]


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import pandas as pd

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

@app.post("/recommend")

from contextlib import contextmanager
@contextmanager

def get_db_connection(db_path="/Users/Eleve/Desktop/CS 1er année/ST4 Data Web/centrale-ei-web/backend/database.sqlite3"):
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

def get_like_movies():
    with get_db_connection() as conn:
        cursor = conn.execute("SELECT id, genre_ids FROM movie WHERE like = 1")
        return [dict(row) for row in cursor.fetchall()]

def get_dislike_movies():
    with get_db_connection() as conn:
        cursor = conn.execute("SELECT id,genre_ids FROM movie WHERE like = -1")
        return [dict(row) for row in cursor.fetchall()]

def get_genre():
    with get_db_connection() as conn:
        cursor = conn.execute("SELECT tmdb FROM genre")
        return [dict(row) for row in cursor.fetchall()]

def recommend_movies():
    genre= get_genre()
    for genres in genre:
        genres['count'] = 0
    all_movies = get_all_movies()
    like_movies = get_like_movies()
    dislike_movies = get_dislike_movies()
    for like_movie in like_movies:
        genre[like_movie[genre_ids]]+=1
    for dislike_movie in dislike_movies:
        genre[dislike_movie[genre_ids]]-=1
    genre_def = max(genre, key=lambda x: x['count'])   
    with get_db_connection() as conn:
        cursor = conn.execute("SELECT * FROM movie WHERE genre LIKE '%genre_def%'ORDER BY vote_average DESCLIMIT 5")
        return [dict(row) for row in cursor.fetchall()]

    
    return recommended.to_dict(orient='records')
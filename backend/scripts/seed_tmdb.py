import os
import sqlite3
import requests
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv('DATABASE_NAME', 'database.sqlite3')
TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TOTAL_PAGES = 10  # about 20 movies per page

BASE_URL = "https://api.themoviedb.org/3"

HEADERS = {
    "Authorization": f"Bearer {TMDB_API_KEY}",
    "Content-Type": "application/json;charset=utf-8"
}


def fetch_genres():
    url = f"{BASE_URL}/genre/movie/list?language=fr-FR"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()["genres"]


def fetch_movies_from_page(page):
    url = f"{BASE_URL}/movie/popular?language=fr-FR&page={page}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()["results"]


def insert_genres(cursor, genres):
    for genre in genres:
        cursor.execute(
            "INSERT OR IGNORE INTO Genre (id, name) VALUES (?, ?)",
            (genre["id"], genre["name"])
        )


def insert_movies_with_genres(cursor, movies):
    for movie in movies:
        cursor.execute("""
            INSERT OR IGNORE INTO Movie (
                id, title, original_title, overview, release_date,
                poster_path, backdrop_path, vote_average, vote_count,
                popularity, original_language
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            movie["id"],
            movie["title"],
            movie.get("original_title"),
            movie.get("overview"),
            movie.get("release_date"),
            movie.get("poster_path"),
            movie.get("backdrop_path"),
            movie.get("vote_average"),
            movie.get("vote_count"),
            movie.get("popularity"),
            movie.get("original_language"),
        ))

        for genre_id in movie.get("genre_ids", []):
            cursor.execute("""
                INSERT OR IGNORE INTO Movie_genres (MovieId, GenreId) VALUES (?, ?)
            """, (movie["id"], genre_id))


def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("Recover genres...")
    genres = fetch_genres()
    insert_genres(cursor, genres)

    for page in range(1, TOTAL_PAGES + 1):
        print(f"Download films (page {page})")
        movies = fetch_movies_from_page(page)
        insert_movies_with_genres(cursor, movies)

    conn.commit()
    cursor.close()
    conn.close()
    print("Import complete. All movies and genres have been inserted into the database.")


if __name__ == "__main__":
    main()

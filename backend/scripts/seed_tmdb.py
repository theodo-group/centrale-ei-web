import os
import sqlite3
import requests
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv('DATABASE_NAME', 'database.sqlite3')
TMDB_API_KEY = os.getenv('TMDB_API_KEY')
# Limites fixées selon la demande
TOTAL_TOP_RATED_PAGES = 100  # 20 films par page * 100 pages = 2000 films
MOVIES_PER_GENRE = 200
MOVIES_PER_PAGE = 20

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


def fetch_top_rated_movies_page(page):
    url = f"{BASE_URL}/movie/top_rated?language=fr-FR&page={page}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()["results"]


def fetch_top_rated_movies_by_genre(genre_id, page):
    url = f"{BASE_URL}/discover/movie"
    params = {
        "language": "fr-FR",
        "sort_by": "vote_average.desc",
        "vote_count.gte": 50,  # filtre pour éviter films avec trop peu de votes
        "with_genres": genre_id,
        "page": page
    }
    response = requests.get(url, headers=HEADERS, params=params)
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

        # Pour les genres, utiliser genre_ids si présent sinon []
        genre_ids = movie.get("genre_ids", [])
        # Dans certains cas genre_ids peut manquer, alors on met []
        for genre_id in genre_ids:
            cursor.execute("""
                INSERT OR IGNORE INTO Movies_genres (MovieId, GenreId) VALUES (?, ?)
            """, (movie["id"], genre_id))


def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("Récupération des genres...")
    genres = fetch_genres()
    insert_genres(cursor, genres)
    conn.commit()

    print(f"Chargement des {TOTAL_TOP_RATED_PAGES * MOVIES_PER_PAGE} films les mieux notés globaux...")
    for page in range(1, TOTAL_TOP_RATED_PAGES + 1):
        print(f"Page {page} / {TOTAL_TOP_RATED_PAGES} - Top Rated Global")
        movies = fetch_top_rated_movies_page(page)
        insert_movies_with_genres(cursor, movies)
        conn.commit()

    print(f"Chargement des {MOVIES_PER_GENRE} films les mieux notés par genre...")
    pages_per_genre = MOVIES_PER_GENRE // MOVIES_PER_PAGE
    for genre in genres:
        genre_id = genre["id"]
        print(f"Genre {genre['name']} ({genre_id})")
        for page in range(1, pages_per_genre + 1):
            print(f"  Page {page} / {pages_per_genre}")
            movies = fetch_top_rated_movies_by_genre(genre_id, page)
            insert_movies_with_genres(cursor, movies)
            conn.commit()

    cursor.close()
    conn.close()
    print("Import terminé.")


if __name__ == "__main__":
    main()

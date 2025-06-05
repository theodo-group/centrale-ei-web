import requests
import os
import json

TMDB_API_KEY = os.getenv('TMDB_API_KEY')
GENRE_LIST_FILE = 'backend/data/genre_list.json'

def fetch_and_store_genres():
    url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}&language=fr-FR'
    response = requests.get(url)
    if response.status_code == 200:
        genres = response.json().get('genres', [])
        with open(GENRE_LIST_FILE, 'w', encoding='utf-8') as f:
            json.dump(genres, f, ensure_ascii=False, indent=4)
        print("Genres successfully fetched and stored.")
    else:
        print(f"Failed to fetch genres. Status code: {response.status_code}")

def load_genres():
    with open(GENRE_LIST_FILE, 'r', encoding='utf-8') as f:
        genres = json.load(f)
    return genres

def get_genre_vector(genre_ids, all_genres):
    genre_id_set = set(genre_ids)
    return [1 if genre['id'] in genre_id_set else 0 for genre in all_genres]

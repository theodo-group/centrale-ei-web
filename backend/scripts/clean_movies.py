import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()
DB_PATH = os.getenv('DATABASE_NAME', 'database.sqlite3')

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute('DELETE FROM Movie;')
cursor.execute("DELETE FROM sqlite_sequence WHERE name='Movie';")
conn.commit()

print("Movie table emptied without affecting other tables.")

cursor.close()
conn.close()

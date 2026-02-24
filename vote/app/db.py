import os
import psycopg2

POSTGRES_HOST = os.getenv("POSTGRES_HOST", "postgres_db")
POSTGRES_DB = os.getenv("POSTGRES_DB", "votes")
POSTGRES_USER = os.getenv("POSTGRES_USER", "user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")


def get_db_connection():
    conn = psycopg2.connect(
        host=POSTGRES_HOST,
        database=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD
    )
    return conn

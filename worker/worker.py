import redis
import psycopg2
import time
import os
import json

# POSTGRES CONFIG
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")

# REDIS CONFIG
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT"))

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

while True:
    try:
        conn = psycopg2.connect(
            host=POSTGRES_HOST,
            database=POSTGRES_DB,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD
        )
        cursor = conn.cursor()
        print("Worker connected to Postgres")
        break
    except Exception as e:
        print("Waiting for Postgres...", e)
        time.sleep(2)

print("Worker ready, listening to Redis...")

while True:
    _, vote_data = r.blpop("votes_queue")
    vote_data = vote_data.decode("utf-8")
    print(f"DEBUG: Raw vote_data = {vote_data}")

    try:
        vote = json.loads(vote_data)
    except json.JSONDecodeError:
        vote = vote_data

    if isinstance(vote, dict):
        course_id = vote.get("course_id")
        session_id = vote.get("session_id")
    else:
        course_id = int(vote)
        session_id = None

    print(f"DEBUG: course_id = {course_id}, session_id = {session_id}")

    if course_id is None or session_id is None:
        print("ERROR: course_id or session_id is None, skipping")
        continue

    cursor.execute(
        """
        INSERT INTO votes (course_id, session_id)
        VALUES (%s, %s) ON CONFLICT (session_id)
        DO
        UPDATE SET course_id = EXCLUDED.course_id, updated_at = CURRENT_TIMESTAMP
        """,
        (course_id, session_id)
    )
    conn.commit()
    print(f"Processed vote for course_id={course_id}, session_id={session_id}")

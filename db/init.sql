CREATE TABLE courses
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE votes
(
    id         SERIAL PRIMARY KEY,
    course_id  INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO courses (name)
VALUES ('Linux Fundamentals'),
       ('Git Fundamentals'),
       ('Python Fundamentals'),
       ('Docker Fundamentals');
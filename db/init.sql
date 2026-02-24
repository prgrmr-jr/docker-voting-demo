CREATE TABLE courses
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE votes
(
    id         SERIAL PRIMARY KEY,
    course_id  INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses (id)
);

INSERT INTO courses (name)
VALUES ('Linux Fundamentals'),
       ('Git Fundamentals'),
       ('Python Fundamentals'),
       ('Docker Fundamentals');
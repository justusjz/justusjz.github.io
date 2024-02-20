DROP TABLE IF EXISTS Post;

DROP TABLE IF EXISTS Comment;

CREATE TABLE
  Post (postId INTEGER PRIMARY KEY);

CREATE TABLE
  Comment (
    commentId INTEGER PRIMARY KEY,
    postId INTEGER,
    author TEXT,
    content TEXT,
    FOREIGN KEY (postId) REFERENCES Post (postId)
  );
const workerUrl = 'https://justusjz-blog.justus-zorn.workers.dev';

function createComment(comment) {
  const author = document.createElement('h4');
  author.textContent = comment.author;
  const content = document.createElement('p');
  content.textContent = comment.content;
  const elem = document.createElement('div');
  elem.appendChild(author);
  elem.appendChild(content);
  return elem;
}

window.onload = async function () {
  const commentSection = document.getElementById('comments');
  const postId = commentSection.getAttribute('post');
  commentSection.innerHTML = `
<h2>Comments</h2>
<div>
  <input id="comment_author_input" class="inherit-font" type="text" placeholder="Comment as..." spellcheck="false"/>
</div>
<div>
  <textarea id="comment_content_input" class="inherit-font" rows=5 placeholder="Comment..." spellcheck="false"></textarea>
</div>
<button class="inherit-font" onclick="onComment(${postId})">Comment</button>
<div id="comments_loaded"></div>`;
  const authorName = window.localStorage.getItem('authorName');
  if (authorName) {
    const authorElem = document.getElementById('comment_author_input');
    authorElem.value = authorName;
  }
  const response = await fetch(`${workerUrl}/?post=${postId}`);
  const comments = await response.json();
  const commentsElem = document.getElementById('comments_loaded');
  for (const comment of comments) {
    const elem = createComment(comment);
    commentsElem.appendChild(elem);
  }
};

async function onComment(postId) {
  const authorElem = document.getElementById('comment_author_input');
  window.localStorage.setItem('authorName', authorElem.value);
  const contentElem = document.getElementById('comment_content_input');
  const comments = document.getElementById('comments');
  await fetch(`${workerUrl}/?post=${postId}`, {
    method: 'POST',
    body: JSON.stringify({
      author: authorElem.value,
      content: contentElem.value,
    }),
  })
  const comment = createComment({
    author: authorElem.value,
    content: contentElem.value,
  });
  comments.appendChild(comment);
  contentElem.textContent = '';
}

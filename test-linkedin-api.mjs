import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/linkedin',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Total posts:', json.total);
      console.log('Posts array length:', json.posts?.length || 0);
      if (json.posts && json.posts.length > 0) {
        console.log('First post:', json.posts[0].publicationNumber, '-', json.posts[0].title);
        console.log('Last post:', json.posts[json.posts.length-1].publicationNumber, '-', json.posts[json.posts.length-1].title);
      }
    } catch (e) {
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();

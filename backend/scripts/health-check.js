const url = process.env.API_URL || 'http://localhost:1000/api/health';
const res = await fetch(url);
if (!res.ok) process.exit(1);
console.log(await res.json());

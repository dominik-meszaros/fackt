// The homepage test setup (src/data/homeTest.json) as a public file, read by fackt.io/admin/stats.
import homeTest from '../data/homeTest.json';
export const GET = () => new Response(JSON.stringify(homeTest), { headers: { 'Content-Type': 'application/json' } });

// IndexNow: tells Bing (and Yandex, Seznam, Naver) about pages right away instead of waiting for a crawl.
// Run after a deploy is live: `node scripts/indexnow.mjs` sends every URL in the live sitemap,
// or `node scripts/indexnow.mjs /blog/new-post /work/x` sends only those paths.
// The key file lives at public/<key>.txt so search engines can confirm we own fackt.io.
const KEY = 'bd14866430124352891b432586e708e9';
const HOST = 'fackt.io';
const args = process.argv.slice(2);
const urls = args.length
  ? args.map((p) => new URL(p, `https://${HOST}`).toString())
  : [...(await (await fetch(`https://${HOST}/sitemap.xml`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);

/**
 * CLI Link & YouTube Video Reliability Checker
 *
 * Inspects every YouTube video ID and external resource URL defined in
 * src/data/moduleMediaAndNotes.ts and reports dead or unreachable entries.
 *
 * Usage:
 *   npm run check-links
 */

import { MODULE_MEDIA_MAP } from '../src/data/moduleMediaAndNotes';

interface CheckResult {
  kind: 'youtube' | 'url';
  moduleId: string;
  label: string;
  target: string;
  ok: boolean;
  status: string;
}

const REQUEST_TIMEOUT_MS = 10_000;
const CONCURRENCY = 6;

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'user-agent': 'CalcAtlas-LinkChecker/1.0 (+https://github.com/calcatlas)',
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function checkYouTubeId(
  moduleId: string,
  videoId: string,
  title: string,
  youtubeId: string
): Promise<CheckResult> {
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;
  try {
    const res = await fetchWithTimeout(oembedUrl, { method: 'GET' });
    if (res.ok) {
      return {
        kind: 'youtube',
        moduleId,
        label: `${videoId} (${title})`,
        target: watchUrl,
        ok: true,
        status: `HTTP ${res.status}`,
      };
    }
    return {
      kind: 'youtube',
      moduleId,
      label: `${videoId} (${title})`,
      target: watchUrl,
      ok: false,
      status: `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      kind: 'youtube',
      moduleId,
      label: `${videoId} (${title})`,
      target: watchUrl,
      ok: false,
      status: err instanceof Error ? err.message : String(err),
    };
  }
}

async function checkExternalUrl(
  moduleId: string,
  title: string,
  url: string
): Promise<CheckResult> {
  try {
    let res = await fetchWithTimeout(url, { method: 'HEAD' });
    if (res.status === 405 || res.status === 403 || res.status === 400) {
      res = await fetchWithTimeout(url, { method: 'GET' });
    }
    const ok = res.status >= 200 && res.status < 400;
    return {
      kind: 'url',
      moduleId,
      label: title,
      target: url,
      ok,
      status: `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      kind: 'url',
      moduleId,
      label: title,
      target: url,
      ok: false,
      status: err instanceof Error ? err.message : String(err),
    };
  }
}

async function runPool<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let cursor = 0;

  async function worker() {
    while (cursor < tasks.length) {
      const idx = cursor++;
      results[idx] = await tasks[idx]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const tasks: (() => Promise<CheckResult>)[] = [];
  const seenYoutubeIds = new Set<string>();
  const seenUrls = new Set<string>();
  let totalVideoEntries = 0;
  let totalResourceEntries = 0;

  for (const [moduleId, bundle] of Object.entries(MODULE_MEDIA_MAP)) {
    for (const vid of bundle.videos) {
      totalVideoEntries += 1;
      if (seenYoutubeIds.has(vid.youtubeId)) continue;
      seenYoutubeIds.add(vid.youtubeId);
      tasks.push(() => checkYouTubeId(moduleId, vid.id, vid.title, vid.youtubeId));
    }
    for (const res of bundle.externalResources) {
      totalResourceEntries += 1;
      if (seenUrls.has(res.url)) continue;
      seenUrls.add(res.url);
      tasks.push(() => checkExternalUrl(moduleId, res.title, res.url));
    }
  }

  console.log(
    `Checking ${seenYoutubeIds.size} unique YouTube IDs (${totalVideoEntries} entries) and ${seenUrls.size} unique external URLs (${totalResourceEntries} entries)...`
  );

  const results = await runPool(tasks, CONCURRENCY);
  const youtubeResults = results.filter((r) => r.kind === 'youtube');
  const urlResults = results.filter((r) => r.kind === 'url');
  const failures = results.filter((r) => !r.ok);

  const okVideos = youtubeResults.filter((r) => r.ok).length;
  const okUrls = urlResults.filter((r) => r.ok).length;

  console.log(`YouTube videos OK: ${okVideos}/${youtubeResults.length}`);
  console.log(`External URLs OK:  ${okUrls}/${urlResults.length}`);

  if (failures.length > 0) {
    console.error(`\nDead or unreachable links (${failures.length}):`);
    for (const f of failures) {
      console.error(`  [${f.kind}] ${f.moduleId} :: ${f.label} -> ${f.target} (${f.status})`);
    }
    process.exitCode = 1;
  } else {
    console.log('\nAll YouTube videos and external URLs responded cleanly.');
  }
}

main();

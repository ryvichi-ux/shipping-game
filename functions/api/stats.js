/**
 * Cloudflare Pages Function — /api/stats
 *
 * KV namespace binding required: PUZZLE_STATS
 * Add in Cloudflare dashboard → Pages → Settings → Functions → KV Bindings
 *   Variable name: PUZZLE_STATS
 *
 * Keys used:
 *   total_accesses          — total page-load count
 *   total_clears            — total game clears (all levels)
 *   clears_<levelId>        — clears for a specific level
 *   scores_<levelId>        — JSON array of top-10 records [{name,moves,time,date}]
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestGet({ env }) {
  const kv = env.PUZZLE_STATS;
  if (!kv) return json({ error: "KV not configured" }, 503);

  const [accesses, clears, allClearsRaw] = await Promise.all([
    kv.get("total_accesses"),
    kv.get("total_clears"),
    kv.get("all_clears"),
  ]);

  return json({
    accesses: parseInt(accesses ?? "0"),
    clears: parseInt(clears ?? "0"),
    levelClears: allClearsRaw ? JSON.parse(allClearsRaw) : {},
  });
}

export async function onRequestPost({ request, env }) {
  const kv = env.PUZZLE_STATS;
  if (!kv) return json({ error: "KV not configured" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (body.event === "access") {
    const cur = parseInt((await kv.get("total_accesses")) ?? "0");
    await kv.put("total_accesses", String(cur + 1));
    return json({ ok: true });
  }

  if (body.event === "clear") {
    const { levelId, name, moves, time } = body;
    if (!levelId || !name || moves == null || time == null) {
      return json({ error: "Missing fields" }, 400);
    }

    const safeName = String(name).replace(/[<>&"]/g, "").slice(0, 20) || "匿名";

    const [totalRaw, levelRaw, allClearsRaw, scoresRaw] = await Promise.all([
      kv.get("total_clears"),
      kv.get("clears_" + levelId),
      kv.get("all_clears"),
      kv.get("scores_" + levelId),
    ]);

    const newTotal      = parseInt(totalRaw  ?? "0") + 1;
    const newLevelCount = parseInt(levelRaw  ?? "0") + 1;
    const allClears     = allClearsRaw ? JSON.parse(allClearsRaw) : {};
    allClears[String(levelId)] = newLevelCount;

    const scores = scoresRaw ? JSON.parse(scoresRaw) : [];
    scores.push({ name: safeName, moves, time, date: new Date().toISOString() });
    scores.sort((a, b) => a.moves - b.moves || a.time - b.time);

    await Promise.all([
      kv.put("total_clears",      String(newTotal)),
      kv.put("clears_" + levelId, String(newLevelCount)),
      kv.put("all_clears",        JSON.stringify(allClears)),
      kv.put("scores_" + levelId, JSON.stringify(scores.slice(0, 10))),
    ]);

    return json({ ok: true });
  }

  if (body.event === "scores") {
    const { levelId } = body;
    if (!levelId) return json({ error: "Missing levelId" }, 400);
    const raw = await kv.get("scores_" + levelId);
    return json({ scores: raw ? JSON.parse(raw) : [] });
  }

  return json({ error: "Unknown event" }, 400);
}

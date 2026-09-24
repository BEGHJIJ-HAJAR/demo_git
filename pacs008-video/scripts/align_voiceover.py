"""Aligns the episode script (src/ep01/script.json) to recognised words with timestamps.

Usage: python3 scripts/align_voiceover.py <recognised words.json> src/ep01/voiceover-words.json

Each script word is matched to 1-4 consecutive recognised words by dynamic programming on
spelling similarity, so "pacs.008" matches "pax zero zero eight" and "Casablanca" matches
"casa blanca". The output keeps the script's spelling with the recording's timing.
"""
import json
import re
import sys
from difflib import SequenceMatcher

rec_path, out_path = sys.argv[1:3]
script = json.load(open("src/ep01/script.json"))
rec = json.load(open(rec_path))

SPOKEN = {"20022": "twentyohtwentytwo", "pacs008": "pacszerozeroeight", "t2": "teetwo", "target2": "targettwo"}
DIGITS = "zero one two three four five six seven eight nine".split()


def spoken(word):
    w = re.sub(r"[^a-z0-9]", "", word.lower())
    if w in SPOKEN:
        return SPOKEN[w]
    return re.sub(r"\d", lambda m: DIGITS[int(m.group())], w)


def plain(word):
    return re.sub(r"[^a-z0-9]", "", word.lower())


words = [(scene, w) for scene, text in script.items() for w in text.split()]
S, R = len(words), len(rec)
INF = float("inf")
SKIP = 0.9
cost = [[INF] * (R + 1) for _ in range(S + 1)]
back = [[None] * (R + 1) for _ in range(S + 1)]
cost[0][0] = 0
for i in range(S + 1):
    for j in range(R + 1):
        c = cost[i][j]
        if c == INF:
            continue
        if i < S and c + SKIP < cost[i + 1][j]:
            cost[i + 1][j], back[i + 1][j] = c + SKIP, (i, j, 0)
        if j < R and c + SKIP < cost[i][j + 1]:
            cost[i][j + 1], back[i][j + 1] = c + SKIP, (i, j, -1)
        if i < S:
            target = spoken(words[i][1])
            for k in range(1, 5):
                if j + k > R:
                    break
                joined = "".join(plain(r["text"]) for r in rec[j:j + k])
                sim = SequenceMatcher(None, target, joined).ratio()
                nc = c + (1 - sim) + 0.05 * (k - 1)
                if nc < cost[i + 1][j + k]:
                    cost[i + 1][j + k], back[i + 1][j + k] = nc, (i, j, k)

match = [None] * S
i, j = S, R
while i or j:
    pi, pj, k = back[i][j]
    if k > 0:
        match[pi] = (pj, pj + k)
    i, j = pi, pj

out = []
for idx, (scene, w) in enumerate(words):
    m = match[idx]
    if m:
        start, end = rec[m[0]]["start"], rec[m[1] - 1]["end"]
    else:
        start = end = None
    out.append({"scene": scene, "text": w, "start": start, "end": end, "matched": bool(m)})

# interpolate unmatched words between their neighbours
for idx, o in enumerate(out):
    if o["start"] is None:
        prev = next((p["end"] for p in reversed(out[:idx]) if p["end"] is not None), 0)
        nxt = next((n["start"] for n in out[idx + 1:] if n["start"] is not None), prev + 0.3)
        o["start"], o["end"] = prev, max(prev + 0.05, nxt)

captions = [
    {"scene": o["scene"], "text": o["text"], "startMs": round(o["start"] * 1000), "endMs": round(max(o["end"], o["start"] + 0.08) * 1000)}
    for o in out
]
json.dump(captions, open(out_path, "w"), indent=1, ensure_ascii=False)
unmatched = [o["text"] for o in out if not o["matched"]]
print(f"{len(captions)} script words aligned, {len(unmatched)} interpolated: {unmatched}")

"""Word-level timestamps for the voiceover, using sherpa-onnx (offline Zipformer, English).

Usage: python3 scripts/transcribe_voiceover.py <16 kHz mono wav> <model dir> <out.json>
The audio is split at pauses into chunks of < 25 s, each chunk is recognised,
and BPE token timestamps are merged into words.
"""
import json
import sys
import wave

import numpy as np
import sherpa_onnx

wav_path, model_dir, out_path = sys.argv[1:4]

with wave.open(wav_path) as w:
    sr = w.getframerate()
    audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768

# 20 ms frame energy -> silent frames
hop = sr // 50
energy = np.array([np.sqrt(np.mean(audio[i:i + hop] ** 2)) for i in range(0, len(audio) - hop, hop)])
silent = energy < max(0.0015, np.percentile(energy, 20) * 3)

# pause midpoints (>= 200 ms of silence)
pauses, run = [], 0
for i, s in enumerate(silent):
    if s:
        run += 1
    else:
        if run >= 10:
            pauses.append((i - run // 2) * hop)
        run = 0

chunks, start = [], 0
for p in pauses + [len(audio)]:
    if p - start > 22 * sr or p == len(audio):
        cut = max([q for q in pauses if start < q <= p] or [p]) if p - start > 25 * sr else p
        chunks.append((start, cut))
        start = cut
chunks = [(a, b) for a, b in chunks if b > a]

rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{model_dir}/encoder-epoch-99-avg-1.int8.onnx",
    decoder=f"{model_dir}/decoder-epoch-99-avg-1.onnx",
    joiner=f"{model_dir}/joiner-epoch-99-avg-1.int8.onnx",
    tokens=f"{model_dir}/tokens.txt",
    num_threads=4,
    decoding_method="modified_beam_search",
)

words = []
for a, b in chunks:
    stream = rec.create_stream()
    stream.accept_waveform(sr, audio[a:b])
    rec.decode_stream(stream)
    r = stream.result
    offset = a / sr
    for tok, ts in zip(r.tokens, r.timestamps):
        t = offset + ts
        if tok.startswith(("\u2581", " ")) or not words:
            words.append({"text": tok.lstrip("\u2581 "), "start": t})
        else:
            words[-1]["text"] += tok

# a word ends where the next starts (capped), refined by energy: trim trailing silence
for i, wd in enumerate(words):
    nxt = words[i + 1]["start"] if i + 1 < len(words) else len(audio) / sr
    end = min(nxt, wd["start"] + 1.2)
    f0, f1 = int(wd["start"] * sr / hop), int(end * sr / hop)
    while f1 - 1 > f0 + 2 and f1 - 1 < len(silent) and silent[f1 - 1]:
        f1 -= 1
    wd["end"] = round(f1 * hop / sr, 3)
    wd["start"] = round(wd["start"], 3)
    wd["text"] = wd["text"].lower()

json.dump(words, open(out_path, "w"), indent=1)
print(len(words), "words;", " ".join(w["text"] for w in words))

import io, json

EDITS = json.load(io.open('edits.json', encoding='utf-8'))
miss = []
for path, old, new in EDITS:
    s = io.open(path, encoding='utf-8').read()
    if old not in s:
        miss.append((path, old[:70]))
        continue
    io.open(path, 'w', encoding='utf-8').write(s.replace(old, new, 1))
print('applied:', len(EDITS) - len(miss), '/', len(EDITS))
for p, o in miss:
    print('  MISS:', p, '|', o)

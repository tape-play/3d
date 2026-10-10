//map generator
function generateMap(w, h, density = 0.5) {
            w = Math.max(7, Math.floor(w));
            h = Math.max(7, Math.floor(h));

            if (w % 2 === 0) w++;
            if (h % 2 === 0) h++;

            map = Array.from({ length: h }, () => Array(w).fill(1));

            function carveCell(x, y) {
                if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
                    map[y][x] = 0;
                }
            }
            function carveRoom(x1, y1, x2, y2) {
                for (let y = y1; y <= y2; y++) {
                    for (let x = x1; x <= x2; x++) {
                        carveCell(x, y);
                    }
                }
            }

            function carveHorizontalCorridor(x1, x2, y) {
                const from = Math.min(x1, x2);
                const to = Math.max(x1, x2);

                for (let x = from; x <= to; x++) {
                    carveCell(x, y);
                }
            }

            function carveVerticalCorridor(y1, y2, x) {
                const from = Math.min(y1, y2);
                const to = Math.max(y1, y2);

                for (let y = from; y <= to; y++) {
                    carveCell(x, y);
                }
            }

            const rooms = [];
            const roomCount = Math.floor((w * h) * (0.015 + density * 0.025));

            for (let i = 0; i < roomCount; i++) {
                const roomW = 3 + Math.floor(Math.random() * 5);
                const roomH = 3 + Math.floor(Math.random() * 5);

                const x = 1 + Math.floor( Math.random() * Math.max(1, w - roomW - 2));
                const y = 1 + Math.floor(Math.random() * Math.max(1, h - roomH - 2));

                const x2 = Math.min(w - 2, x + roomW);
                const y2 = Math.min(h - 2, y + roomH);

                let overlaps = false;

                for (const room of rooms) {
                    if (x <= room.x2 + 1 && x2 >= room.x1 - 1 && y <= room.y2 + 1 && y2 >= room.y1 - 1) {
                        overlaps = true;
                        break;
                    }
                }

                if (overlaps) {
                    continue;
                }

                carveRoom(x, y, x2, y2);

                rooms.push({
                    x1: x,
                    y1: y,
                    x2: x2,
                    y2: y2,
                    cx: Math.floor((x + x2) / 2),
                    cy: Math.floor((y + y2) / 2)
                });
            }

            if (rooms.length === 0) {
                const cx = Math.floor(w / 2);
                const cy = Math.floor(h / 2);

                carveRoom(
                    cx - 2,
                    cy - 2,
                    cx + 2,
                    cy + 2
                );

                rooms.push({
                    x1: cx - 2,
                    y1: cy - 2,
                    x2: cx + 2,
                    y2: cy + 2,
                    cx,
                    cy
                });
            }

            for (let i = 1; i < rooms.length; i++) {

                const a = rooms[i - 1];
                const b = rooms[i];

                if (Math.random() < 0.5) {
                    carveHorizontalCorridor(a.cx, b.cx, a.cy);
                    carveVerticalCorridor(a.cy, b.cy, b.cx);
                } else {
                    carveVerticalCorridor(a.cy, b.cy, a.cx);
                    carveHorizontalCorridor(a.cx, b.cx, b.cy);
                }
            }

            const extraConnections = Math.floor(rooms.length * (0.2 + density * 0.5));

            for (let i = 0; i < extraConnections; i++) {
                if (rooms.length < 2) {
                    break;
                }

                const a = rooms[Math.floor(Math.random() * rooms.length)];
                const b = rooms[Math.floor(Math.random() * rooms.length)];

                if (a === b) {
                    continue;
                }

                if (Math.random() < 0.5) {
                    carveHorizontalCorridor(a.cx, b.cx, a.cy);
                    carveVerticalCorridor(a.cy, b.cy, b.cx);
                } else {
                    carveVerticalCorridor(a.cy, b.cy, a.cx);
                    carveHorizontalCorridor(a.cx, b.cx, b.cy);
                }
            }

            const openings = Math.floor(w * h * density * 0.015);

            for (let i = 0; i < openings; i++) {
                const x = 1 + Math.floor(Math.random() * (w - 2));
                const y = 1 + Math.floor(Math.random() * (h - 2));

                if (map[y][x] !== 0 && map[y][x - 1] === 0 && map[y][x + 1] === 0) {
                    map[y][x] = 0;
                }

                else if (map[y][x] !== 0 && map[y - 1][x] === 0 && map[y + 1][x] === 0) {
                    map[y][x] = 0;
                }
            }

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    if (map[y][x] !== 0) {
                        map[y][x] = 1 + Math.round(Math.random() * texturesLoaded);
                    }
                }
            }

            const startRoom = rooms[0];
                    
            player.x = startRoom.cx + 0.5;
            player.y = startRoom.cy + 0.5;
            player.angle = 0;
                    
            // Rebuild WebGL geometry for the new map.
            rebuildMapMeshes();
        }

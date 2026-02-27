import csv
import os
import math
import argparse

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data_college')
STATS = ['PTS', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'MP', 'FG', 'FGA', 'FT', 'FTA', 'ORB', 'DRB', 'FG3', 'FG3A', 'FG2', 'FG2A']
COL_RENAMES = {'3P': 'FG3', '3PA': 'FG3A', '2P': 'FG2', '2PA': 'FG2A'}


def load_players():
    players = []
    for fname in sorted(os.listdir(DATA_DIR)):
        if not fname.endswith('.csv'):
            continue
        season = fname.replace('.csv', '')
        with open(os.path.join(DATA_DIR, fname)) as f:
            for row in csv.DictReader(f):
                for old, new in COL_RENAMES.items():
                    if old in row:
                        row[new] = row.pop(old)
                g = int(row.get('G', 0) or 0)
                if g < 10:
                    continue
                p = {'Player': row['Player'], 'Season': season, 'Team': row.get('Team', ''), 'G': g}
                for s in STATS:
                    try:
                        p[s] = float(row.get(s, 0) or 0)
                    except ValueError:
                        p[s] = 0.0
                try:
                    p['FG%'] = float(row.get('FG%', 0) or 0)
                    p['FT%'] = float(row.get('FT%', 0) or 0)
                except ValueError:
                    p['FG%'] = 0.0
                    p['FT%'] = 0.0
                players.append(p)
    return players


def find_similar(players, player_name, season, top_n=20):
    mins = {s: min(p[s] for p in players) for s in STATS}
    maxs = {s: max(p[s] for p in players) for s in STATS}

    def normalize(player):
        vec = []
        for s in STATS:
            r = maxs[s] - mins[s]
            vec.append((player[s] - mins[s]) / r if r > 0 else 0)
        return vec

    def distance(v1, v2):
        return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))

    target = None
    for p in players:
        if p['Player'] == player_name and p['Season'] == season:
            target = p
            break

    if not target:
        print(f"Jugador '{player_name}' no encontrado en temporada '{season}'")
        print("Jugadores disponibles en esa temporada:")
        for p in players:
            if p['Season'] == season:
                print(f"  - {p['Player']} ({p['Team']})")
        return

    target_vec = normalize(target)
    dists = []
    for p in players:
        if p is target:
            continue
        d = distance(target_vec, normalize(p))
        dists.append((d, p))

    dists.sort(key=lambda x: x[0])

    print(f"\n{target['Player']} ({target['Season']}) @ {target['Team']}")
    print(f"PTS={target['PTS']}  REB={target['TRB']}  BLK={target['BLK']}  FG%={target['FG%']}  AST={target['AST']}  MP={target['MP']}  FT%={target['FT%']}  STL={target['STL']}  G={target['G']}")
    print()

    for i, (d, p) in enumerate(dists[:top_n]):
        sim = max(0, 1 - d / 4) * 100
        print(f"{i+1:3d}. {p['Player']:25s} ({p['Season']}) {p['Team']:15s} sim={sim:5.1f}%  PTS={p['PTS']:5.1f}  REB={p['TRB']:4.1f}  BLK={p['BLK']:3.1f}  FG%={p['FG%']:.3f}  AST={p['AST']:3.1f}  MP={p['MP']:5.1f}  FT%={p['FT%']:.3f}  G={p['G']}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Busca jugadores universitarios similares')
    parser.add_argument('--player', default='Aday Mara', help='Nombre del jugador')
    parser.add_argument('--season', default='2025_26', help='Temporada (formato YYYY_YY)')
    parser.add_argument('--top', type=int, default=20, help='Numero de resultados')
    args = parser.parse_args()

    players = load_players()
    print(f"Cargados {len(players)} jugadores")
    find_similar(players, args.player, args.season, args.top)

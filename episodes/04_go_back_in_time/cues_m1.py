"""Sound cue sheet for the Episode 04 first minute (beats 1-9). Levels are dB relative to the narrator (pipeline/mix.py).
Every time is a measured word or beat edge."""
import json
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
T = json.load(open(ROOT / "tools/yta-cloud/video/src/ep04/timing.json"))
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())


def a(b, w, n=1, off=0.0):
    return [x["s"] for x in T["words"] if x["b"] == b and norm(x["w"]) == norm(w)][n - 1] + off


PS = lambda b: T["beats"][b - 1]["s"]
PE = lambda b: T["beats"][b - 1]["e"]
G = lambda n: str(HERE / "sfx_gen" / f"{n}.wav")
S = lambda n: str(ROOT / "sfx" / n)
X = lambda n: str(ROOT / "sfx_extra" / n)
END = json.load(open(HERE / "m1_meta.json"))["END"]
STOP, GO, WORLD = a(1, "stops"), a(3, "street"), a(3, "world")

VOICE = str(HERE / "m1_voice.wav")
LENGTH = END

# (name, start, end, rel_db, fade_in, fade_out)
BEDS = [
    (str(HERE / "score_m1.wav"), 0.0, END, -12, 0.0, 1.2),             # temporary score (swap for the user's tracks)
    (S("rain_bed.mp3"), 0.0, STOP + 0.15, -16, 0.2, 0.15),              # rain, cut dead on the freeze
    ("amb_city_evening_01", 0.0, STOP + 0.15, -24, 0.2, 0.15),
    (S("rain_bed.mp3"), GO, WORLD, -18, 0.05, 0.2),                    # the rain comes back as he breaks away
    (G("tunnel"), WORLD, PE(4) + 0.4, -14, 0.1, 0.5),                  # the time tunnel roar
    ("amb_wind_soft_01", PE(4) + 0.2, PS(5), -20, 0.3, 0.2),           # aerial over the city
    (S("street_dawn.mp3"), a(5, "On"), PS(6), -22, 0.2, 0.3),          # dawn park
    ("amb_cafe_01", PS(6), PS(7), -24, 0.3, 0.4),                       # plaza people
    (S("street_birds.mp3"), PS(7), PS(8), -24, 0.3, 0.3),              # rule 1 park
    ("amb_room_tone_01", PS(8), PS(9), -26, 0.2, 0.2),                 # bedroom
    (S("wind_roof.mp3"), PS(9), END, -20, 0.4, 1.0),                    # rooftop
]

# (name, time, rel_db)
SFX = [
    (S("thunder.mp3"), 0.05, -8),                     # opening strike
    (G("crackle"), 0.05, -14),
    ("whoosh_fast_01", 0.9, -16),
    (X("step_0.wav"), 1.2, -18), (X("step_1.wav"), 1.55, -18), (X("step_2.wav"), 1.9, -18), (X("step_0.wav"), 2.25, -18),
    (G("freeze"), STOP - 0.05, -10),                  # the rain stops
    ("whoosh_medium_02", a(2, "Not"), -20),
    (X("slowmo_boom.wav"), a(2, "Stops"), -14),
    ("sparkle_02", a(2, "glass"), -18),               # drops like broken glass
    (G("crackle_long"), a(3, "Lightning"), -10),      # lightning crawls
    (G("zap"), a(3, "shoulders"), -14),
    (G("zap"), a(3, "street") - 0.05, -10),
    ("whoosh_fast_03", GO, -12),                      # he explodes forward
    (G("tear"), WORLD - 0.6, -7),                     # the world tears open
    (G("crackle"), a(4, "break"), -16),
    ("riser_03", PE(4) - 0.4, -16),
    (S("thunder.mp3"), PS(5) - 1.0, -12),             # strike over the rewriting city
    (G("hit"), a(5, "go"), -8),                       # title slam
    (X("whip.wav"), a(5, "Not"), -16),
    ("glitch_02", a(5, "machine"), -16),              # struck out
    (X("step_1.wav"), a(5, "On", 1, 0.4), -14),       # the first step
    (G("zap"), a(5, "By"), -16),
    (X("swoosh_down.wav"), a(5, "time") - 0.05, -12), # dawn -> day jump
    (G("crackle"), a(5, "time"), -16),
    ("whoosh_medium_01", PS(6) - 0.1, -18),
    ("glitch_01", a(6, "change"), -14),               # the world changes
    ("whoosh_short_02", a(7, "Rule"), -20),
    ("swish_02", a(7, "jog"), -18),
    ("whoosh_fast_02", a(7, "sprint"), -14),
    (G("crackle"), a(7, "Flat"), -12), (G("tear"), a(7, "year") - 0.6, -10),
    ("whoosh_short_01", a(8, "Rule"), -20),
    (G("zap"), a(8, "arrive") - 0.15, -10), (X("slowmo_boom.wav"), a(8, "arrive"), -16),
    ("whoosh_short_03", a(9, "Rule"), -20),
    (G("crackle"), a(9, "scar"), -12), (S("thunder.mp3"), a(9, "scar"), -16),
    (G("crackle_long"), a(9, "hundred") - 0.2, -10), (G("hit"), a(9, "hundred"), -9),
]

"""Sound cue sheet for the whole of Episode 04. Reuses the first-minute cues (cues_m1.py, minus its score and voice), then
beats 10-87. Levels are dB relative to the narrator (pipeline/mix.py). Every time is a measured word or beat edge."""
import importlib.util
import json
import pathlib
import re
import subprocess

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
spec = importlib.util.spec_from_file_location("cues_m1", HERE / "cues_m1.py"); m1 = importlib.util.module_from_spec(spec); spec.loader.exec_module(m1)
T = json.load(open(ROOT / "tools/yta-cloud/video/src/ep04/timing.json"))
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())


def a(b, w, n=1, off=0.0):
    return [x["s"] for x in T["words"] if x["b"] == b and norm(x["w"]) == norm(w)][n - 1] + off


PS = lambda b: T["beats"][b - 1]["s"]
PE = lambda b: T["beats"][b - 1]["e"]
P = lambda b: PS(b) - 0.12
G = lambda n: str(HERE / "sfx_gen" / f"{n}.wav")
S = lambda n: str(ROOT / "sfx" / n)
X = lambda n: str(ROOT / "sfx_extra" / n)
E3 = lambda part, n: str(ROOT / "episodes/03_internet_disappears/parts" / f"sfx_{part}" / n)
END = json.load(open(HERE / "film_meta.json"))["END"]
tStop, tCrack = PE(83) + 0.3, PE(83) + 1.4

VOICE = str(HERE / "film_voice.wav")
LENGTH = END

BEDS = [b for b in m1.BEDS if "score_m1" not in b[0] and b[1] < P(10)]
BEDS = [(n, s, min(e, P(10)), g, fi, fo) for n, s, e, g, fi, fo in BEDS]
BEDS += [
    (str(HERE / "score_stings.wav"), 0.0, END, -12, 0.0, 0.5),               # hits, risers, heartbeats only
    ("amb_wind_soft_02", P(10), P(13), -30, 0.5, 0.5),                       # space hush
    ("amb_city_street_03", P(13), P(19), -24, 0.4, 0.4),                     # Tuesday street
    (E3("B", "B_class.wav"), P(21), P(22), -24, 0.2, 0.2),                   # classroom
    ("amb_school_gym_02", P(22), P(26), -24, 0.2, 0.4),                      # five-a-side
    ("amb_room_tone_02", P(26), P(28), -28, 0.3, 0.3),
    (S("rain_bed.mp3"), P(28), P(31), -20, 0.4, 0.4),                        # memory: the rainy crossing
    ("amb_room_tone_01", P(31), P(33), -28, 0.3, 0.3),
    ("amb_wind_soft_01", P(33), P(37), -22, 0.4, 0.4),                       # river road
    (G("tunnel"), P(37), P(40), -14, 0.3, 0.5),                              # the year rewinding
    ("amb_city_evening_02", P(40), a(44, "Time"), -22, 0.3, 0.3),            # Mill Road
    ("amb_city_evening_02", PS(46), P(51), -24, 0.4, 0.4),
    (S("street_birds.mp3"), P(52), P(54), -26, 0.4, 0.4),                    # morning kitchen
    ("amb_city_street_03", P(54), P(57), -24, 0.3, 0.3),                     # the street, car park
    ("amb_city_street_03", P(61), P(65), -26, 0.3, 0.3),
    ("amb_wind_soft_03", P(65), P(67), -24, 0.3, 0.3),
    ("amb_city_street_03", P(67), P(68), -24, 0.2, 0.2),
    ("amb_room_tone_02", P(68), P(70), -28, 0.2, 0.2),
    ("amb_wind_soft_01", P(70), a(73, "Silence"), -22, 0.4, 0.05),           # the river road again
    (S("street_birds.mp3"), P(75), P(80), -22, 0.4, 0.4),                    # morning
    ("amb_room_tone_02", P(80), PE(83), -28, 0.3, 0.2),
    ("drone_tension_04", tCrack, P(84) - 0.45, -18, 0.3, 0.1),
]


# Music: licensed Pixabay tracks (music/pixabay/credits.json), one per scene mood, low under the voice.
# (track, offset into the track, start, end, rel_db). Each piece is cut once into music_beds/.
MUS = ROOT / "music" / "pixabay"
MUSIC = [
    ("06_mystery_motions_to_dark", 0, 0.0, P(5), -22),                       # cold open: the rain stops
    ("05_wonder_awe_of_discovery", 0, P(5), P(13), -23),                     # the question, the rules, the science
    ("02_happy_happy_upbeat", 0, P(13), P(26), -25),                         # Tuesday, the tests
    ("03_calm_warm_storytelling", 0, P(26), P(28), -24),                     # the cost, the lottery, the photo
    ("04_solemn_sad_piano_emotional_rain_story", 0, P(28), P(36), -22),      # Jamie, the voice note
    ("07_action_action_epic", 0, P(36), P(40), -25),                         # the run back through the year
    ("06_mystery_motions_to_dark", 40, P(40), a(45, "pull"), -23),           # Mill Road, the van
    ("08_hopeful_hopeful", 0, PS(46) + 0.6, P(54), -23),                     # alive; the perfect morning
    ("06_mystery_motions_to_dark", 80, P(54), P(57), -23),                   # the wrong world
    ("03_calm_warm_storytelling", 30, P(57), P(61), -24),                    # butterfly effect, Lorenz
    ("07_action_action_epic", 30, P(61), P(65), -26),                        # fixing it, again and again
    ("06_mystery_motions_to_dark", 110, P(65), P(70), -23),                  # which present? the cracks
    ("10_heartbreak_heartbreaking", 0, P(70), a(73, "Silence"), -22),        # the deal, I'm sorry, the last run
    ("08_hopeful_hopeful", 35, P(75), P(80), -23),                           # morning, he's here
    ("06_mystery_motions_to_dark", 0, P(80), PE(83), -24),                   # the message from your own number
    ("05_wonder_awe_of_discovery", 45, PE(85) + 0.3, END, -22),              # outro
]


def cut(track, off, t0, t1):
    out = HERE / "music_beds" / f"{track}_{off}_{t1 - t0:.1f}.wav"
    if not out.exists():
        out.parent.mkdir(exist_ok=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(off), "-t", f"{t1 - t0 + 0.5:.2f}", "-i", str(MUS / f"{track}.mp3"), "-ar", "48000", "-ac", "2", str(out)], check=True)
    return str(out)


BEDS += [(cut(tr, off, t0, t1), t0, t1, db, 1.2 if t0 > 0 else 0.3, 1.5) for tr, off, t0, t1, db in MUSIC]

SFX = [s for s in m1.SFX if s[1] < P(10)] + [
    # space and GPS
    ("whoosh_medium_03", P(10), -20), ("sparkle_01", a(11, "thirty-eight"), -18), ("text_tick_02", a(11, "correct"), -18), ("glitch_03", a(11, "drift"), -18),
    ("whoosh_short_02", P(12), -20), (S("rewind.mp3"), a(12, "back"), -14), (G("crackle"), a(12, "arguing"), -16),
    # Tuesday, the bus, the run
    ("swish_01", P(13), -20), ("bus_door_01", a(14, "closing") - 0.2, -14), ("whoosh_fast_01", a(14, "You"), -16), (G("crackle"), a(14, "legs"), -16),
    # slow motion, the flash, the catch
    (X("swoosh_down.wav"), a(15, "slows") - 0.1, -12), ("whoosh_medium_02", a(15, "pigeon"), -22), ("splat_soft_01", a(15, "floats"), -22),
    (G("tear"), a(16, "flash") - 0.6, -10), (G("crackle"), a(16, "flash"), -14), (S("rewind.mp3"), a(16, "Ten"), -16),
    ("whoosh_short_01", a(17, "take"), -18), ("splat_soft_02", a(17, "spill"), -18), ("whoosh_fast_03", a(17, "This"), -16), ("catch_thump_01", a(17, "catch"), -12),
    # the tests
    ("bus_door_01", a(20, "Missed"), -16), (G("zap"), a(20, "Run"), -12), ("ding_01", a(20, "Caught"), -18),
    (X("ui_tick.wav"), a(21, "Wrong"), -14), (G("zap"), a(21, "Run"), -12), ("ding_02", a(21, "Right"), -18),
    (G("whistle"), PS(22) + 0.2, -18), (G("zap"), a(22, "Run"), -12), ("ball_hit_02", a(22, "shoot"), -10), ("crowd_gasp_02", a(22, "shoot") + 0.5, -20), ("swish_03", a(22, "shoot") + 0.4, -16),
    # the cost, the lottery
    ("whoosh_short_03", P(26), -22), ("pop_01", a(26, "four"), -16), ("pop_02", a(26, "four") + 0.17, -16), ("pop_03", a(26, "four") + 0.34, -16),
    ("clock_tick_02", a(26, "eleven"), -18), ("sparkle_02", a(27, "lottery"), -18), (S("record_scratch.mp3"), a(27, "second"), -20),
    # Jamie, the voice note
    (E3("E", "E_passby.wav"), a(29, "van"), -12), (G("screech"), a(29, "stop") - 0.3, -16),
    ("notification_ping_03", a(31, "voice"), -20),
    # the run and the rewind
    (G("tear"), a(36, "run") - 0.3, -8), (G("crackle_long"), a(36, "run"), -12),
    (S("paper.mp3"), a(38, "Days"), -16), (S("paper.mp3"), a(38, "pages"), -16), (S("rewind.mp3"), a(38, "Snow"), -16), (S("rewind.mp3"), a(38, "People"), -16),
    ("impact_low_02", a(39, "Winter"), -16), ("impact_low_03", a(39, "Autumn"), -16), ("impact_low_04", a(39, "Summer"), -16), ("impact_low_02", a(39, "Spring"), -16),
    (G("tear"), P(40) - 0.6, -9),
    # Mill Road, the save
    (E3("E", "E_engine.wav"), a(42, "van"), -14), (G("screech"), a(42, "fast") - 0.2, -14), (G("tear"), a(43, "run") - 0.5, -10), (G("crackle_long"), a(43, "run"), -12),
    (X("slowmo_boom.wav"), a(44, "Time"), -10), (G("crackle"), a(45, "reach"), -14), (G("zap"), a(45, "pull"), -8),
    (G("passby"), a(45, "pull") + 0.4, -6), ("body_thud_02", a(45, "pull") + 0.6, -12),
    # home, the car park, the friend
    (G("tear"), P(51) - 0.4, -12), ("ding_03", a(52, "perfect"), -22), ("door_open_01", P(54), -16),
    ("glitch_02", a(55, "car"), -12), (X("step_0.wav"), a(56, "walks"), -20), (X("step_1.wav"), a(56, "walks") + 0.5, -20),
    # butterfly, Lorenz, chaos
    ("sparkle_03", a(57, "butterfly"), -16), (X("ui_tick.wav"), a(58, "typed"), -16), ("glitch_01", a(59, "completely"), -16), ("impact_hit_03", a(60, "chaos"), -14),
    # fixing it
    (G("zap"), P(61) + 0.4, -12), (G("tear"), a(62, "But") - 0.5, -12), ("glitch_03", a(62, "never"), -12), (G("tear"), a(63, "When") - 0.5, -12),
    ("glitch_01", a(63, "holiday"), -14), (G("crackle_long"), a(64, "scar"), -12), (S("thunder.mp3"), a(64, "cracked"), -14),
    # the glitches, déjà vu
    (G("crackle"), a(67, "cracks"), -14), ("clock_tick_01", a(67, "Clocks"), -14), ("glitch_02", a(67, "skip"), -16), ("glitch_03", a(67, "freezes"), -16),
    ("glitch_01", a(67, "stop"), -16), (S("rewind.mp3"), a(68, "already"), -18),
    # the deal, the last run
    (G("crackle_long"), a(72, "sorry"), -16), (G("tear"), a(73, "run") - 0.6, -7), (S("thunder.mp3"), a(73, "Lightning"), -6), (G("crackle_long"), a(73, "Lightning"), -8),
    ("whoosh_fast_04", a(73, "Streaks"), -10),
    # morning, Jamie, the message
    ("pop_04", a(75, "toast"), -16), ("door_open_01", P(77), -22), ("pop_05", a(78, "Oi"), -22),
    (X("phone_buzz.wav"), a(80, "buzzes") - 0.1, -12), (X("phone_buzz.wav"), a(80, "buzzes") + 0.5, -14), ("notification_ping_02", a(80, "One"), -18),
    ("glitch_02", a(81, "Sent"), -12), (X("ui_tick.wav"), a(82, "Don't"), -18),
    # the clocks stop, the crack, the frozen city
    (G("tick"), tStop - 1.0, -12), (G("tick"), tStop, -12), (X("slowmo_boom.wav"), tStop + 0.1, -10), (S("thunder.mp3"), tCrack, -8), (G("crackle_long"), tCrack, -10),
    # teaser, PART 2, the sign-off
    ("glitch_01", PS(84) - 0.15, -10), ("glitch_02", PE(84) + 0.15, -10), ("glitch_03", PE(84) + 0.45, -10), ("glitch_01", PE(84) + 0.75, -10), ("glitch_02", PE(84) + 1.05, -10),
    (G("crackle"), PS(85), -16), ("impact_hit_04", PE(85) + 0.25, -8), ("whoosh_short_01", a(86, "Would"), -20), ("chime_01" if False else S("chime.mp3"), a(87, "In"), -14),
]

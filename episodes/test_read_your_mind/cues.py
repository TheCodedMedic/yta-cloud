"""Sound cue sheet for Episode 06 "What If Everyone Could Read Your Mind?". Levels are dB relative to the narrator (pipeline/mix.py).
Every time is a measured word or beat edge (video/src/ep06/timing.json). Each thought card gets a pop; each spoken-aloud thought a soft ring whoomp."""
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent.parent / "pipeline"))
from cuekit import Cues, synth as G  # noqa: E402

c = Cues("test_mind", HERE)
at, PS, PE, P = c.at, c.PS, c.PE, c.P
VOICE = str(HERE / "master_voiceover.wav")
LENGTH = c.END
T_HOLD = PE(60) + 0.3
T_FL = T_HOLD + 1.5
T_PART2 = PE(62) + 0.3

MUSIC = [
    c.music("playful_01", 4, 0.0, at(3, "turns"), -25),                # the 42, the wig
    c.music("tense_04", 0, at(3, "turns"), at(7, "So,"), -24),         # the whole bus turns
    c.music("wonder_01", 12, at(7, "So,"), P(12), -23),                # title, the rules
    c.music("calm_01", 6, P(12), P(16), -24),                          # Wegner, 6,200 thoughts
    c.music("playful_02", 0, P(16), P(29), -25),                       # teacher, boss, mum, the tests, plus/minus
    c.music("sad_05", 4, P(29), P(31), -22),                           # the girl at the bus stop, you stop getting the bus
    c.music("calm_04", 4, P(31), P(36), -24),                          # the spotlight effect, leaving, the launderette
    c.music("sad_02", 4, P(36), P(41), -23),                           # grandad across the garden
    c.music("tense_03", 20, P(41), P(47), -22),                        # the trap, the interview
    c.music("hopeful_05", 4, P(47), P(52), -23),                       # you stop pushing; the job
    c.music("hopeful_04", 6, P(52), P(58), -23),                       # back on the 42, the girl
    c.music("wonder_03", 10, P(58), T_HOLD + 1.4, -22, fo=0.5),        # she thinks something; rule two breaks
    c.music("mystery_02", 12, T_PART2, LENGTH, -22),                   # PART 2, question, sign-off
]
BEDS = MUSIC + [
    ("amb_bus_interior_01", 0.0, at(7, "So,"), -26, 0.3, 0.4),
    ("pad_calm_01", at(7, "So,"), P(8) + 0.5, -18, 0.4, 0.6),          # under the title hold
    ("amb_city_street_03", P(8), P(9), -28, 0.3, 0.3),
    ("amb_city_evening_01", P(9), P(11), -28, 0.3, 0.3),
    ("amb_room_tone_01", P(11), P(16), -30, 0.3, 0.3),
    ("crowd_murmur_02", P(15), P(16), -26, 0.3, 0.3),
    ("amb_school_gym_04", P(16), P(18), -28, 0.3, 0.3),                # school
    ("amb_cafe_01", P(18), P(20), -26, 0.3, 0.3),
    ("amb_room_tone_02", P(20), P(22), -30, 0.3, 0.3),
    ("amb_wind_soft_01", P(22), P(24), -28, 0.3, 0.3),                 # garden
    ("amb_room_tone_03", P(24), P(27), -30, 0.3, 0.3),
    ("amb_cafe_03", P(27), P(28), -26, 0.3, 0.3),
    ("amb_city_evening_02", P(29), P(30), -26, 0.3, 0.3),
    ("amb_rain_light_01", P(30), P(31), -22, 0.3, 0.4),                # you stop getting the bus
    ("amb_city_street_03", P(31), P(32), -26, 0.3, 0.3),
    ("amb_school_gym_02", P(32), P(33), -28, 0.3, 0.3),
    ("amb_city_evening_01", P(34), P(35), -26, 0.3, 0.3),
    (G("hum"), P(35), at(35, "You"), -26, 0.3, 0.3),                   # the launderette
    ("amb_room_tone_01", at(35, "You"), P(36), -28, 0.3, 0.3),
    ("amb_wind_soft_03", P(36), P(41), -28, 0.3, 0.3),                 # garden at dusk
    ("amb_city_evening_02", P(41), P(43), -26, 0.3, 0.3),
    ("amb_room_tone_02", P(43), P(51), -30, 0.3, 0.3),                 # the interview room
    ("clock_tick_02", at(44, "sit"), P(47), -26, 0.2, 0.3),
    ("amb_city_street_03", P(51), P(52), -26, 0.3, 0.3),
    ("amb_bus_interior_01", P(52), T_HOLD + 1.4, -26, 0.3, 0.2),
    ("drone_tension_01", T_FL, T_PART2, -20, 0.05, 0.2),
]

THOUGHTS = [  # (time a card pops, ring?)
    (at(2, "That"), True), (at(9, "hears"), False), (at(10, "Rule"), False), (at(17, "Your"), True), (at(17, "Then"), False),
    (at(18, "exactly"), True), (at(20, "I"), True), (at(22, "rudest"), True), (at(24, "everyone"), True), (at(25, "Tinfoil,") + 0.2, True),
    (at(26, "sister"), False), (at(27, "lie."), False), (at(28, "I'm"), False), (at(28, "Love"), False), (at(28, "Nearly"), False),
    (at(29, "Every"), False), (at(44, "don't"), False), (at(44, "Three"), True), (at(45, "don't"), False), (at(45, "Three"), True), (at(53, "You"), True),
]
SFX = [(G("pop_hi" if k % 2 else "pop_lo"), t0, -16) for k, (t0, ring) in enumerate(THOUGHTS)] + [(G("whoomp"), t0 + 0.05, -20) for t0, ring in THOUGHTS if ring] + [
    # the bus, the wig, the turn
    ("bus_door_01", 0.4, -20), ("swish_02", at(1, "The"), -22), ("pop_06", at(1, "left."), -20),
    ("swish_03", at(3, "turns") - 0.05, -12), ("whoosh_medium_03", at(3, "turns"), -16), ("crowd_gasp_03", at(3, "turns") + 0.3, -18),
    ("impact_low_02", at(4, "Forty"), -18), ("impact_low_03", at(4, "wig,"), -18), (G("whoomp"), at(6, "No."), -16),
    (G("riser"), at(7, "So,") - 2.0, -16), (G("hit"), at(7, "read"), -10), (G("whoomp"), at(7, "mind?") + 0.3, -14),
    # rules
    ("impact_hit_01", at(8, "Out"), -16), ("text_tick_01", at(9, "Rule"), -18), (G("whoomp"), at(9, "ten"), -14), ("text_tick_02", at(10, "Rule"), -18),
    ("text_tick_03", at(11, "Rule"), -18), ("pop_01", at(11, "harder"), -20), ("pop_02", at(11, "harder") + 0.3, -20), ("pop_03", at(11, "louder"), -18), ("impact_low_04", at(11, "Remember"), -16),
    # science
    ("sparkle_01", at(12, "real."), -20), ("text_tick_04", at(12, "1987,"), -20), ("whoosh_short_01", at(12, "white"), -22),
    ("ding_01", at(13, "rang"), -16), ("ding_02", at(13, "rang") + 0.65, -18), ("ding_03", at(13, "came"), -18), ("ding_04", at(13, "minute."), -18),
    ("text_tick_01", at(14, "2020,"), -20), (G("tick"), at(14, "six"), -18), (G("riser"), at(15, "To") - 1.4, -18), (G("hit"), at(15, "To"), -12),
    # school, café, mum
    ("click_01", at(17, "seven."), -22), ("cup_set_down_03", P(18) + 0.3, -22), ("impact_low_02", P(19), -20), ("splat_soft_01", at(20, "cries."), -22),
    # the tests
    ("swish_01", at(21, "test"), -18), ("text_tick_02", at(22, "Test"), -18), ("footsteps_tile_02", at(22, "step"), -24), ("impact_hit_02", at(22, "flinches."), -16),
    ("text_tick_03", at(24, "Test"), -18), ("clink_glass_01", at(24, "fold"), -22), ("clink_glass_02", at(24, "lose"), -20), ("game_victory_02", at(24, "minutes."), -26),
    ("text_tick_04", at(25, "Test"), -18), ("pop_04", at(25, "Headphones."), -22), ("pop_05", at(25, "hat."), -22), (G("crinkle"), at(25, "Tinfoil,"), -18), ("glitch_01", at(25, "not"), -20),
    # plus / minus
    ("ding_01", at(26, "Plus."), -18), ("ding_02", at(27, "Plus."), -18), ("glitch_02", at(28, "Minus."), -18), ("glitch_03", at(28, "lost"), -20),
    ("glitch_01", at(29, "Minus."), -18), ("impact_low_03", at(29, "hear"), -18), ("bus_door_01", P(30) + 0.2, -22),
    # spotlight, leaving, the launderette, grandad
    ("text_tick_01", at(32, "2000,"), -20), (G("tick"), at(32, "guessed"), -18), (G("tick"), at(32, "Fewer"), -18),
    ("impact_low_04", at(33, "spotlight"), -16), ("whoosh_medium_01", at(33, "Mostly,"), -22), ("door_close_01", at(34, "leave."), -18),
    ("footsteps_tile_01", at(35, "You"), -24), (G("beep"), at(35, "shop"), -22),
    ("door_open_01", P(36) + 0.2, -22), ("impact_low_02", at(37, "hear."), -20), ("impact_low_03", at(39, "crime."), -18), ("impact_low_04", at(40, "remember"), -20),
    # the trap, the interview
    ("heartbeat_01", at(41, "quieter"), -18), ("heartbeat_02", at(41, "Rule"), -16), ("drone_tension_04", P(42), -20), ("heartbeat_03", at(42, "whole"), -14),
    ("door_open_01", at(43, "interview,"), -22), (G("tick"), at(43, "two"), -20), ("heartbeat_04", at(44, "sweating."), -16), ("heartbeat_03", at(45, "money."), -16),
    ("swish_02", at(46, "nearly"), -20), (G("shimmer"), at(46, "remember"), -20), (G("whoomp"), at(47, "stop"), -20),
    ("click_02", at(49, "pen"), -18), (G("shimmer"), at(49, '"We'), -20), ("game_victory_03", at(50, "job."), -18), ("catch_thump_01", at(50, "job.") + 0.2, -20),
    ("sparkle_02", at(51, "hiding"), -20),
    # back on the bus
    ("bus_door_01", P(52) + 0.3, -20), ("swish_03", at(53, "whole"), -18), ("crowd_murmur_01", at(53, "whole"), -24), ("catch_thump_02", at(54, "closes"), -18),
    (G("shimmer"), at(58, "hear"), -18), ("sparkle_03", P(59), -14), (G("whoomp"), P(59), -16),
    (G("riser"), at(60, "Rule") - 1.2, -18), (G("hit"), at(60, "broke."), -10),
    # teaser, PART 2, sign-off
    ("glitch_01", T_FL, -10), ("glitch_02", T_FL + 0.48, -12), ("glitch_03", T_FL + 0.92, -12), ("glitch_01", T_FL + 1.36, -12),
    (G("hit"), T_PART2, -8), ("whoosh_short_02", at(63, "Would"), -22), (G("shimmer"), at(64, "In"), -14),
]

"""Sound cue sheet for the whole Head Start episode (beats 0-31).
Beats 0-8 come from cues_min1.py unchanged; everything below extends it.
Levels are dB relative to the narrator's speech level (see pipeline/mix.py)."""
import importlib.util
import sys

sys.path.insert(0, "/home/user/yta-cloud/pipeline")
from timing import Timing

_spec = importlib.util.spec_from_file_location("cues_min1", "/home/user/yta-cloud/episodes/head_start/cues_min1.py")
_m1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_m1)

T = Timing("/home/user/yta-cloud/episodes/head_start")
a, e, PS, PE, PG = T.at, T.end, T.PS, T.PE, T.PG

VOICE = _m1.VOICE
LENGTH = PG(31) + 0.5

BEDS = list(_m1.BEDS) + [
    # ── beats 9-12: blinks, catches, games, dodgeball
    ("pad_calm_03", PG(8), PS(13), -24, 1.0, 1.0),
    ("amb_cafe_02", PS(9), PS(11), -24, 0.8, 0.6),
    ("amb_room_tone_01", a(9, "blink", 2), a(9, "blink", 2) + 1.15, -14, 0.05, 0.1),      # the dark second: only room tone
    ("keyboard_gaming_01", PS(11), a(11, "Forty"), -22, 0.3, 0.4),
    ("amb_room_tone_03", PS(11), PS(12), -30, 0.3, 0.5),
    ("amb_school_gym_01", PS(12), PS(13), -20, 0.4, 0.8),
    ("amb_school_gym_03", PS(12), PS(13), -24, 0.4, 0.8),
    # ── beats 13-18: the cost
    ("drone_tension_03", PS(13), PS(14), -22, 0.3, 0.6),
    ("pad_calm_02", PS(14), PS(19), -25, 1.0, 1.2),
    ("amb_room_tone_02", PS(14), PS(15), -30, 0.3, 0.3),
    ("amb_cafe_03", PS(15), PS(16), -24, 0.5, 0.5),
    ("amb_bus_interior_01", PS(16), a(16, "A", 3), -20, 0.3, 0.4),
    ("clock_tick_01", a(16, "feels"), a(16, "A", 3), -24, 0.2, 0.3),
    ("amb_cafe_03", PS(17), PS(18), -24, 0.5, 0.8),
    ("amb_city_evening_02", PS(18), PS(19), -24, 0.8, 1.0),
    ("amb_wind_soft_02", PS(18), PS(19), -28, 1.0, 1.0),
    # ── beats 19-26: the platform
    ("amb_train_platform_01", PS(19), PE(26) + 3.0, -21, 1.0, 0.4),
    ("amb_train_platform_03", PS(19), PS(22), -26, 1.0, 1.0),
    ("pad_calm_01", PS(19), PS(21), -26, 1.0, 1.0),
    ("drone_tension_01", PS(21), PS(22), -23, 0.5, 0.3),
    ("train_rumble_approach_01", a(21, "express"), PE(26), -22, 0.3, 0.5),
    ("heartbeat_01", PS(22), PS(26), -21, 0.4, 0.6),
    ("drone_tension_02", PS(22), PS(27), -22, 0.4, 1.0),
    ("clock_tick_03", a(23, "All"), PS(25), -25, 0.2, 0.4),
    ("riser_04", a(25, "You", 2) - 1.0, PE(26) + 0.2, -22, 0.1, 0.3),
    ("train_pass_rush_03", PE(26) - 0.2, PS(27) + 0.4, -10, 0.1, 0.6),                # the express: loud, the one thing in the silence
    # ── beats 27-31: after
    ("amb_train_platform_02", PS(27), PS(29), -22, 0.6, 1.0),
    ("pad_calm_03", PS(27), PS(31), -24, 1.5, 1.0),
    ("amb_cafe_01", PS(29), PS(31), -22, 1.0, 1.0),
    ("amb_city_evening_01", PS(29), PS(31), -28, 1.0, 1.0),
    ("fly_buzz_01", PS(30), a(30, "lands") + 0.2, -22, 0.2, 0.2),
    ("pad_calm_02", PS(31), LENGTH, -20, 0.5, 1.5),
    ("amb_wind_soft_01", PS(31), LENGTH, -30, 1.0, 1.5),
]

SFX = list(_m1.SFX) + [
    # beat 9: blink
    ("click_03", a(9, "blink", 1), -20),
    ("click_02", a(9, "tenth"), -20),
    ("impact_low_03", a(9, "blink", 2), -13),                       # lights out
    ("text_tick_03", a(9, "blink", 2) + 0.25, -24), ("text_tick_03", a(9, "blink", 2) + 0.5, -24), ("text_tick_03", a(9, "blink", 2) + 0.75, -24),
    ("ding_02", a(9, "blink", 2) + 1.0, -20),
    ("whoosh_short_02", a(9, "blink", 2) + 1.15, -16),              # lights back
    ("pop_01", a(9, "less"), -18), ("whoosh_short_01", a(9, "less"), -17),
    # beat 10: toast, ice cream
    ("phone_slide_table_02", a(10, "slides"), -17),
    ("whoosh_fast_02", a(10, "Caught", 1), -14), ("impact_low_02", a(10, "Caught", 1), -13), ("catch_thump_02", a(10, "Caught", 1) + 0.04, -13),
    ("pop_02", a(10, "butter"), -18),
    ("splat_soft_03", a(10, "tips"), -18),
    ("whoosh_fast_03", a(10, "Caught", 2), -14), ("impact_low_02", a(10, "Caught", 2), -13), ("catch_thump_01", a(10, "Caught", 2) + 0.04, -14),
    ("splat_soft_01", a(10, "back"), -19), ("sparkle_01", a(10, "top"), -22), ("pop_02", a(10, "top"), -18),
    # beat 11: games
    ("mouse_click_01", PS(11) + 0.3, -20), ("mouse_click_02", PS(11) + 1.1, -20), ("mouse_click_01", PS(11) + 1.9, -20),
    ("whoosh_medium_01", a(11, "By"), -16),
    ("ding_04", a(11, "see"), -21), ("pop_03", a(11, "see"), -20),
    ("whoosh_fast_01", a(11, "already"), -15), ("sparkle_02", a(11, "already"), -20),
    ("whoosh_short_02", a(11, "Forty"), -16),
    ("text_tick_04", a(11, "Forty"), -20), ("text_tick_04", a(11, "Forty") + 0.3, -20), ("text_tick_04", a(11, "Forty") + 0.6, -20),
    ("game_victory_02", a(11, "row"), -17), ("sparkle_02", a(11, "row"), -20),
    ("whoosh_short_01", a(11, "Your"), -16),
    *[("notification_ping_02", a(11, "fills") + i * 0.22, -19 - (i % 3)) for i in range(8)],
    ("impact_hit_02", a(11, "Hacker"), -13), ("whoosh_fast_02", a(11, "Hacker"), -14),
    # beat 12: dodgeball
    ("whoosh_medium_03", PS(12), -16),
    ("crowd_murmur_01", PS(12), -22),
    ("pop_01", a(12, "nature"), -18),
    ("whoosh_short_03", a(12, "You"), -16),
    ("ball_throw_01", a(12, "stand"), -15), ("ball_throw_03", a(12, "middle"), -15), ("ball_throw_01", a(12, "hands"), -15), ("ball_throw_03", a(12, "pockets"), -15),
    ("whoosh_fast_04", a(12, "stand") + 0.05, -16), ("whoosh_fast_04", a(12, "middle") + 0.05, -16), ("whoosh_fast_04", a(12, "hands") + 0.05, -16), ("whoosh_fast_04", a(12, "pockets") + 0.05, -16),
    ("ball_bounce_01", a(12, "and"), -16), ("ball_bounce_02", a(12, "and") + 0.5, -17), ("ball_bounce_03", a(12, "nobody"), -17),
    ("crowd_gasp_01", a(12, "hits"), -18),
    ("impact_hit_01", a(12, "Not"), -13), ("whoosh_fast_01", a(12, "Not"), -14), ("crowd_gasp_03", a(12, "once"), -17), ("sparkle_02", a(12, "Not") + 0.1, -20),
    # beat 13
    ("whoosh_medium_02", PS(13), -17), ("impact_low_04", a(13, "weird"), -14), ("riser_03", PS(13), -24),
    # beat 14
    ("whoosh_short_01", PS(14), -17),
    ("sparkle_01", a(14, "brain"), -20), ("riser_01", a(14, "burning"), -24),
    ("pop_01", a(14, "gaming"), -18), ("whoosh_short_02", a(14, "gaming"), -17), ("pop_03", a(14, "computer"), -19),
    ("whoosh_medium_01", a(14, "You"), -16),
    *[("clink_plate_02", a(14, "five") + i * 0.14, -18) for i in range(5)],
    ("text_tick_01", a(14, "five"), -20),
    ("pop_02", a(14, "hungry"), -18), ("splat_soft_02", a(14, "hungry") + 0.1, -22),
    # beat 15: loading
    ("whoosh_short_03", PS(15), -17),
    *[("text_tick_02", PS(15) + 0.3 + i * 0.35, -23) for i in range(7)],
    ("whoosh_medium_02", a(15, "Your"), -16),
    ("pop_01", a(15, "guessed"), -18), ("pop_02", a(15, "answered"), -18), ("pop_03", a(15, "head"), -19), ("pop_06", a(15, "bored"), -18),
    # beat 16: bus, school
    ("bus_door_01", PS(16), -18),
    ("pop_04", a(16, "ten"), -19), ("ding_03", a(16, "hour"), -20), ("sparkle_01", a(16, "hour"), -22),
    ("whoosh_medium_03", a(16, "A", 3), -16),
    *[("click_01", a(16, "day") + i * 0.16, -21) for i in range(7)],
    ("impact_hit_03", a(16, "week"), -14), ("whoosh_fast_02", a(16, "week"), -15),
    # beat 17: finishing sentences
    ("whoosh_short_01", PS(17), -17),
    ("pop_01", PS(17), -19), ("pop_02", a(17, "finishing"), -18), ("pop_01", a(17, "Then"), -19), ("pop_02", a(17, "jokes"), -18),
    ("whoosh_medium_01", a(17, "And"), -16),
    ("pop_06", a(17, "stops"), -20), ("swish_03", a(17, "jokes", 2), -22),
    # beat 18: lonely
    ("whoosh_medium_02", PS(18), -17), ("cup_set_down_02", PS(18) + 0.6, -19),
    ("pop_03", a(18, "lonely"), -20),
    # beat 19-20: platform
    ("whoosh_medium_03", PS(19), -15), ("crowd_murmur_02", PS(19), -22),
    ("pop_01", a(19, "Saturday"), -18), ("pop_02", a(19, "early"), -18),
    ("whoosh_short_02", PS(20), -16), ("pop_02", a(20, "packed"), -18),
    ("whoosh_short_01", a(20, "Your"), -16),
    ("pop_01", a(20, "friend"), -19), ("pop_01", a(20, "sister"), -19),
    ("balloon_squeak_01", a(20, "balloon"), -19), ("sparkle_01", a(20, "balloon"), -22),
    # beat 21: slip, steps, train
    ("whoosh_medium_01", PS(21), -16),
    ("balloon_squeak_03", a(21, "slips"), -18), ("swish_01", a(21, "slips"), -19), ("sparkle_03", a(21, "slips") + 0.1, -23),
    ("whoosh_short_03", a(21, "She"), -16),
    ("footsteps_tile_02", a(21, "One"), -16), ("pop_03", a(21, "One"), -20),
    ("footsteps_tile_03", a(21, "Two"), -16), ("pop_03", a(21, "Two"), -20),
    ("impact_low_04", a(21, "edge"), -14), ("pop_02", a(21, "Toward"), -18),
    ("whoosh_fast_03", a(21, "And"), -15),
    ("train_horn_02", a(21, "express"), -12),
    ("pop_02", a(21, "doesn't"), -18),
    # beat 22: everyone / now
    ("whoosh_medium_02", PS(22), -16), ("impact_low_03", PS(22), -14),
    ("pop_04", a(22, "quarter"), -19), ("ding_04", a(22, "quarter"), -22),
    ("whoosh_fast_01", a(22, "You"), -14),
    ("impact_hit_01", a(22, "now"), -12), ("sparkle_02", a(22, "now"), -19), ("ding_01", a(22, "now"), -19),
    # beat 23: geometry, legs, time to think
    ("whoosh_medium_01", PS(23), -16), ("pop_01", a(23, "head"), -18), ("ding_03", a(23, "head"), -21),
    ("whoosh_short_02", a(23, "You"), -16),
    ("pop_03", a(23, "legs", 1), -19), ("pop_03", a(23, "normal"), -19),
    ("footsteps_tile_01", a(23, "run"), -18),
    ("impact_low_04", a(23, "legs", 2), -14), ("pop_06", a(23, "legs", 2), -18),
    ("whoosh_medium_03", a(23, "All"), -16), ("click_02", a(23, "All"), -20),
    ("pop_02", a(23, "time"), -18), ("sparkle_01", a(23, "think"), -22),
    # beat 24: options
    ("whoosh_short_01", PS(24), -17),
    ("pop_01", a(24, "Grab"), -18), ("pop_06", a(24, "Too"), -17), ("pop_01", a(24, "Shout"), -18), ("pop_06", a(24, "won't"), -17),
    ("ding_01", a(24, "one"), -18), ("sparkle_02", a(24, "one"), -20), ("impact_low_03", a(24, "move"), -14),
    # beat 25: the reach
    ("whoosh_medium_02", PS(25), -16),
    ("swish_02", a(25, "reach", 1), -18), ("pop_03", a(25, "sister"), -19),
    ("whoosh_fast_04", a(25, "You", 2), -14),
    ("whoosh_fast_02", a(25, "balloon"), -13), ("impact_low_02", a(25, "balloon"), -11), ("catch_thump_03", a(25, "balloon") + 0.05, -12), ("balloon_squeak_02", a(25, "balloon") + 0.08, -17),
    # beat 26: stops, looks up, train
    ("whoosh_short_03", PS(26), -16),
    ("balloon_squeak_01", a(26, "stops", 1), -18), ("ding_03", a(26, "stops", 1), -21),
    ("pop_01", a(26, "stops", 2), -18), ("footsteps_tile_02", a(26, "stops", 2) - 0.15, -18),
    ("whoosh_short_02", a(26, "She", 2), -17),
    ("sparkle_01", a(26, "up"), -22), ("pop_03", a(26, "you"), -20),
    ("whoosh_fast_01", PE(26) + 0.1, -13), ("impact_low_02", PE(26) + 0.1, -11),
    ("train_horn_03", PE(26) + 0.6, -11),
    ("crowd_gasp_02", PE(26) + 1.4, -18),
    # beat 27: after
    ("whoosh_medium_01", PS(27), -16),
    ("balloon_squeak_02", a(27, "already"), -20), ("pop_02", a(27, "over"), -18),
    ("whoosh_short_01", a(27, "Nobody"), -17), ("crowd_murmur_01", a(27, "Nobody"), -21),
    ("pop_03", a(27, "even"), -20), ("pop_03", a(27, "anything"), -20), ("pop_02", a(27, "happened"), -18),
    ("whoosh_medium_02", a(27, "Except"), -16), ("impact_low_04", a(27, "Except"), -15),
    ("pop_02", a(27, "whole"), -18),
    # beat 28
    ("whoosh_short_02", PS(28), -17),
    ("pop_01", a(28, "looking"), -19), ("swish_03", a(28, "hacker"), -18), ("sparkle_01", a(28, "hacker") + 0.1, -22),
    ("whoosh_short_01", a(28, "He", 2), -17),
    ("pop_01", a(28, "okay"), -18), ("pop_02", a(28, "Tell"), -18), ("ding_02", a(28, "Tell"), -21),
    # beat 29
    ("whoosh_medium_03", PS(29), -16), ("cup_set_down_03", PS(29) + 0.4, -20),
    ("pop_01", a(29, "Slowly"), -18),
    *[("text_tick_02", a(29, "Slowly") + 0.4 + i * 0.5, -24) for i in range(6)],
    ("whoosh_short_03", a(29, "You", 2), -17),
    ("pop_01", a(29, "You", 2), -19),
    ("crowd_gasp_03", a(29, "away"), -22), ("sparkle_02", a(29, "away"), -19), ("pop_04", a(29, "away"), -18),
    # beat 30: the fly
    ("whoosh_medium_01", PS(30), -16),
    ("fly_buzz_pass_02", a(30, "fly"), -16), ("ding_03", a(30, "lands"), -22),
    ("whoosh_short_01", a(30, "you", 1), -17),
    ("sparkle_01", a(30, "all"), -22), ("pop_02", a(30, "all"), -19),
    ("whoosh_short_02", a(30, "So"), -17),
    ("fly_buzz_pass_01", a(30, "go"), -16), ("sparkle_02", a(30, "go") + 0.2, -20), ("pop_02", a(30, "go"), -19),
    # beat 31: end card
    ("whoosh_medium_03", PS(31), -15), ("impact_low_02", PS(31), -13),
    ("pop_01", a(31, "comments"), -18), ("ding_02", a(31, "comments"), -20),
    ("balloon_squeak_01", a(31, "balloon"), -20),
    ("pop_04", a(31, "subscribe"), -17), ("ding_01", a(31, "subscribe"), -18), ("sparkle_02", a(31, "subscribe") + 0.1, -19),
    ("impact_low_03", PG(31) - 1.4, -14),
]

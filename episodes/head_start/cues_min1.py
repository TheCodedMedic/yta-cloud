"""Sound cue sheet for the first minute of Head Start (beats 0-8).
Levels are dB relative to the narrator's speech level (see pipeline/mix.py)."""
import sys
sys.path.insert(0, "/home/user/yta-cloud/pipeline")
from timing import Timing

T = Timing("/home/user/yta-cloud/episodes/head_start")
a, e, PS, PE, PG = T.at, T.end, T.PS, T.PE, T.PG

VOICE = "/home/user/yta-cloud/episodes/head_start/master_voiceover.wav"
LENGTH = PG(8)

# (name, start, end, rel_db, fade_in, fade_out)
BEDS = [
    ("pad_calm_01", 0.0, PS(5), -22, 0.8, 1.0),
    ("amb_cafe_01", 0.0, PS(4), -20, 0.5, 1.0),
    ("amb_city_evening_01", 0.0, PS(4), -27, 0.5, 1.0),
    ("fly_buzz_02", a(0, "It", 1), PS(1), -22, 0.2, 0.3),                 # fly macro
    ("drone_tension_02", a(2, "Before"), a(2, "you've"), -24, 0.2, 0.3),  # friend frozen
    ("drone_tension_01", a(3, "To"), PS(4), -24, 0.3, 0.5),               # slow motion
    ("riser_02", PS(5) - 2.0, PS(5) + 0.5, -22, 0.1, 0.2),                # into the title
    ("pad_calm_02", PS(5), PS(6), -19, 0.3, 0.8),                         # title card swell
    ("pad_calm_03", PS(6), LENGTH, -24, 0.8, 1.0),
    ("amb_room_tone_02", PS(6), LENGTH, -32, 0.5, 1.0),
    ("clock_tick_02", a(6, "quarter"), a(6, "react") + 0.4, -24, 0.1, 0.2),
    ("footsteps_tile_01", a(7, "gap"), a(7, "head"), -26, 0.2, 0.3),
    ("footsteps_tile_01", a(8, "You're", 1), a(8, "And"), -26, 0.2, 0.3),
    ("riser_05", a(8, "superpower") - 1.6, a(8, "superpower"), -21, 0.1, 0.1),
]

SFX = [
    # beat 0: the fly
    ("whoosh_short_01", 0.25, -15),
    ("whoosh_fast_01", a(0, "fight"), -14),                 # the swat
    ("fly_buzz_pass_01", a(0, "fly"), -16),
    ("sparkle_01", a(0, "sees"), -22),                      # rings
    # beat 1: lands on the cup, close your hand
    ("fly_buzz_pass_02", a(1, "one"), -16),
    ("ding_03", a(1, "lands"), -22),
    ("whoosh_fast_02", a(1, "close"), -14),                 # speed-line flash
    ("impact_low_02", a(1, "close"), -12),
    ("catch_thump_01", e(1, "hand"), -13),
    ("sparkle_02", e(1, "hand") + 0.1, -22),
    ("pop_01", a(1, "Gotcha"), -18),
    # beat 2: the phone
    ("phone_slide_table_01", a(2, "slides"), -16),
    ("riser_03", a(2, "off"), -21),
    ("click_01", a(2, "off"), -20),                         # stopwatch "SLOW"
    ("whoosh_medium_01", a(2, "Before"), -15),
    ("whoosh_fast_03", a(2, "caught"), -14),                # flash
    ("impact_low_03", a(2, "caught"), -12),
    ("phone_catch_01", a(2, "caught") + 0.05, -13),
    ("phone_catch_02", a(2, "back"), -16),
    ("coffee_sip_01", a(2, "sip"), -17),
    # beat 3: stare, shrug, slow motion
    ("pop_03", PS(3), -20),
    ("swish_01", a(3, "shrug"), -18),
    ("whoosh_medium_02", a(3, "To"), -15),
    ("riser_01", a(3, "To"), -22),
    ("pop_02", a(3, "slow"), -18),
    ("sparkle_03", a(3, "To") + 0.2, -24),
    ("sparkle_03", a(3, "To") + 1.3, -24),
    ("sparkle_03", a(3, "To") + 2.4, -24),
    # beat 4: brain x10
    ("sparkle_02", a(4, "brain"), -18),
    ("ding_01", a(4, "brain"), -20),
    ("impact_hit_01", a(4, "ten"), -13),
    ("whoosh_short_02", a(4, "ten"), -15),
    # beat 5: title card
    ("whoosh_medium_03", PS(5), -15),
    ("impact_hit_02", PS(5) + 0.45, -13),
    ("impact_low_02", a(5, "was"), -11),
    ("swish_02", PS(5) + 0.9, -20),
    # beat 6: a quarter of a second; eyes -> brain -> muscles
    ("click_02", a(6, "quarter"), -20),
    ("pop_01", a(6, "react"), -18),
    ("whoosh_short_03", a(6, "react"), -16),
    ("swish_03", a(6, "eyes"), -20), ("ding_04", a(6, "eyes"), -22),
    ("swish_03", a(6, "brain"), -20), ("ding_03", a(6, "brain"), -20), ("sparkle_01", a(6, "brain"), -22),
    ("swish_03", a(6, "muscles"), -20), ("ding_04", a(6, "muscles"), -22), ("pop_02", a(6, "move"), -18),
    # beat 7: gold watch, lanes, head start
    ("ding_01", a(7, "two"), -18),
    ("sparkle_02", a(7, "two"), -20),
    ("whoosh_medium_01", a(7, "That"), -16),
    ("pop_04", a(7, "between"), -20),
    ("whoosh_fast_04", a(7, "head"), -14),
    ("impact_low_04", a(7, "head"), -11),
    ("impact_hit_03", a(7, "head") + 0.12, -13),
    ("sparkle_02", a(7, "head") + 0.2, -20),
    # beat 8: brain x10 / arms x1, earlier, superpower
    ("pop_06", PS(8), -20),
    ("whoosh_short_01", a(8, "upgrade"), -16), ("pop_01", a(8, "upgrade"), -18), ("ding_02", a(8, "upgrade"), -20),
    ("whoosh_short_02", a(8, "arms", 1), -16), ("pop_05", a(8, "arms", 1), -18),
    ("whoosh_short_03", a(8, "arms", 1) + 0.4, -22), ("whoosh_short_03", a(8, "arms", 1) + 0.9, -22),
    ("whoosh_medium_02", a(8, "You're", 1), -16),
    ("pop_02", a(8, "faster"), -18),
    ("pop_01", a(8, "earlier", 1), -18), ("ding_01", a(8, "earlier", 1), -20),
    ("whoosh_fast_01", a(8, "superpower"), -14),
    ("impact_low_02", a(8, "superpower"), -12),
    ("sparkle_02", a(8, "superpower") + 0.1, -18),
]

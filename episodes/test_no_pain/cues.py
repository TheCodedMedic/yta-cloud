"""Sound cue sheet for Episode 05 "What If You Couldn't Feel Pain?". Levels are dB relative to the narrator (pipeline/mix.py).
Every time is a measured word or beat edge (video/src/ep05/timing.json)."""
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent.parent / "pipeline"))
from cuekit import Cues, synth as G  # noqa: E402

c = Cues("test_pain", HERE)
at, PS, PE, P = c.at, c.PS, c.PE, c.P
VOICE = str(HERE / "master_voiceover.wav")
LENGTH = c.END
T0 = PE(66) + 1.4                     # the hob-in-the-dark hold ends, the teaser starts
T_PART2 = PE(68) + 0.3

# ─── music: one bed per scene mood, low under the voice; true silence on the hold before the teaser ───
MUSIC = [
    c.music("tense_02", 10, 0.0, at(5, "So"), -24),                   # Saturday, the pan, Mia stops chewing
    c.music("wonder_01", 12, at(5, "So"), P(11), -23),                # title, "none", superpower, the rules
    c.music("sad_03", 6, P(11), P(15), -22),                         # SCN9A, the boy on the coals
    c.music("playful_02", 0, P(15), P(30), -25),                     # the tests, plus and minus
    c.music("tense_04", 0, P(30), P(33), -24),                       # the reflex, the alarm
    c.music("calm_03", 0, P(33), P(44), -24),                        # Jo Cameron, grandad, a life with no warnings
    c.music("tense_03", 20, P(44), P(52), -22),                      # Friday dinner, Theo sees it
    c.music("tense_05", 0, P(52), P(54), -23),                       # the drive, the scan, the doctor
    c.music("sad_01", 0, P(54), P(59), -22),                         # recovery, the lesson
    c.music("hopeful_01", 10, P(59), P(65), -23),                     # dinner, the scar, the punch, the laugh
    c.music("mystery_01", 0, P(65), PE(66) + 0.3, -22, fo=0.4),      # 2 a.m., Theo's message
    c.music("mystery_04", 18, T_PART2, LENGTH, -22),                 # PART 2, the question, the sign-off
]
BEDS = MUSIC + [
    ("amb_room_tone_01", 0.0, P(6), -30, 0.3, 0.4),                  # kitchen
    ("pad_calm_02", at(5, "So"), P(6) + 0.6, -17, 0.4, 0.8),          # under the title hold
    (G("sizzle"), at(1, "pick") - 0.1, P(3), -26, 0.1, 0.6),         # the pan off the flame
    ("amb_wind_soft_01", P(6), P(7), -30, 0.4, 0.4),                 # park
    ("amb_wind_soft_02", P(7), P(8), -26, 0.4, 0.4),                 # rooftop
    ("amb_city_street_03", P(10), P(11), -28, 0.3, 0.3),             # plaza
    ("crowd_murmur_01", P(13), P(14), -26, 0.4, 0.4),                # the street performer
    ("amb_wind_soft_03", P(14), P(15), -28, 0.4, 0.6),               # the empty rooftop
    ("amb_room_tone_02", P(15), P(17), -30, 0.3, 0.3),
    ("amb_cafe_02", P(17), at(17, "Theo"), -30, 0.3, 0.3),           # the shop
    ("amb_room_tone_01", at(17, "Theo"), P(20), -30, 0.3, 0.3),
    (G("drill"), at(21, "drill") - 0.1, P(22), -22, 0.1, 0.3),       # the dentist's drill
    ("amb_school_gym_02", P(22), P(26), -26, 0.3, 0.3),              # five-a-side
    ("amb_school_gym_03", P(26), P(27), -28, 0.3, 0.3),              # the gym
    ("amb_city_street_03", P(28), P(30), -28, 0.3, 0.3),             # park, legend, blister
    ("amb_room_tone_03", P(30), P(33), -30, 0.3, 0.3),
    ("amb_wind_soft_01", P(33), at(33, "A"), -30, 0.3, 0.3),         # Scotland
    ("amb_room_tone_02", P(34), P(41), -30, 0.3, 0.3),
    ("amb_city_evening_02", P(41), P(42), -26, 0.3, 0.3),
    ("amb_room_tone_01", P(42), P(52), -30, 0.3, 0.3),
    (G("car_pass"), at(52, "drives.") - 0.5, at(52, "At"), -22, 0.2, 0.4),
    (G("monitor"), at(52, "looks"), P(57), -28, 0.3, 0.3),           # the hospital monitor
    ("amb_city_street_03", P(57), P(59), -28, 0.3, 0.3),
    ("amb_room_tone_02", P(59), P(65), -30, 0.3, 0.3),
    ("amb_room_tone_03", P(65), T0, -32, 0.3, 0.3),
    (G("hum"), PE(66) + 0.4, T0, -26, 0.3, 0.1),                     # the hob in the dark
    ("drone_tension_02", T0, T_PART2, -20, 0.05, 0.2),               # the teaser
]

SFX = [
    # cold open
    ("cup_set_down_01", 0.35, -22), (G("sizzle"), at(1, "pick") - 0.1, -16), (G("steam"), at(2, "metal"), -22), (G("whoomp"), at(2, "flame"), -18),
    ("clink_plate_01", at(3, "stops"), -18), (G("tick"), at(3, "red"), -18), ("impact_low_02", at(3, "nothing."), -16),
    (G("riser"), at(5, "So") - 2.0, -16), (G("hit"), at(5, "So"), -10), (G("whoomp"), at(5, "couldn't"), -14),
    # none / rules
    ("pop_01", at(6, "stings,"), -22), ("pop_02", at(6, "aches,"), -22), ("pop_03", at(6, "headaches,"), -22), ("pop_04", at(6, "hot"), -22),
    ("impact_hit_01", at(6, "Ever"), -16), ("sparkle_01", at(7, "superpower."), -20),
    ("text_tick_01", at(8, "Rule"), -18), ("splat_soft_01", at(8, "paper"), -22), ("body_thud_01", at(8, "broken"), -20), (G("drill"), at(8, "dentist's"), -26),
    ("text_tick_02", at(9, "Rule"), -18), (G("sizzle"), at(9, "burn"), -26), ("body_thud_02", at(9, "bone"), -20), ("glitch_01", at(9, "message."), -20),
    ("text_tick_03", at(10, "Rule"), -18), ("impact_low_03", at(10, "Remember"), -16),
    # science
    ("whoosh_medium_01", P(11), -22), ("sparkle_02", at(11, "real."), -20),
    ("text_tick_04", at(12, "2006,"), -20), (G("beep"), at(12, "SCN9A.") , -20), ("glitch_02", at(12, "stuck"), -18), (G("rip"), at(12, "off."), -18),
    ("crowd_gasp_01", at(13, "knives"), -22), (G("sizzle"), at(13, "coals"), -24),
    ("impact_low_04", at(14, "fourteen."), -18), ("whoosh_short_01", at(14, "jumped"), -26),
    # back to the kitchen, the tests
    ("whoosh_short_02", P(15), -22), ("pop_05", at(15, "interesting."), -18), ("swish_01", at(16, "test"), -18),
    ("text_tick_01", at(17, "Test"), -18), ("click_01", at(17, "skull"), -18), ("pop_06", at(17, "label."), -22), ("splat_soft_02", at(17, "cries"), -20),
    ("coffee_sip_01", P(19), -22),
    ("text_tick_02", at(20, "Test"), -18), ("door_open_01", at(20, "dentist."), -22),
    ("text_tick_03", at(22, "Test"), -18), ("body_thud_03", at(22, "tackle") + 0.2, -12), ("crowd_gasp_02", at(22, "tackle") + 0.4, -18),
    ("ball_bounce_01", at(22, "ball"), -18), ("footsteps_tile_01", at(22, "walk"), -26),
    ("impact_hit_02", at(23, "wrong"), -18), ("pop_01", P(24) + 0.2, -20),
    # plus / minus
    ("ding_01", at(26, "Plus."), -18), (G("tick"), at(26, "hundred"), -18), ("glitch_03", at(27, "Minus."), -18), ("splat_soft_03", at(27, "bite"), -18),
    ("ding_02", at(28, "Plus."), -18), ("notification_ping_02", at(28, "video."), -18), (G("riser"), at(28, "four") - 1.6, -24), ("game_victory_01", at(28, "views."), -22),
    ("glitch_01", at(29, "Minus."), -18), ("footsteps_tile_02", at(29, "walked"), -26),
    # the reflex, the alarm
    ("whoosh_short_03", P(30), -22), (G("sizzle"), at(30, "hot"), -24),
    (G("whoomp"), at(31, "spine"), -18), ("whoosh_fast_01", at(31, "back"), -14), (G("tick"), at(31, "tenth"), -16),
    (G("bell_ring"), P(32), -16), (G("rip"), at(32, "ripped"), -10), ("impact_hit_03", at(32, "ripped") + 0.15, -14),
    # Jo Cameron
    ("sparkle_03", at(33, "Jo"), -22), ("text_tick_04", at(33, "2019."), -20), (G("sizzle"), at(34, "burns"), -22), ("click_02", at(34, "checks"), -22),
    (G("shimmer"), at(35, "looking"), -22), ("notification_ping_03", P(36) + 0.4, -24),
    # grandad, the trap
    ("cup_set_down_02", P(37) + 0.3, -22), ("footsteps_tile_03", at(37, "limp"), -22), (G("shimmer"), at(39, "Then"), -26),
    ("impact_low_02", at(40, "remember"), -20), (G("whoomp"), at(41, "warnings."), -18),
    ("pop_02", at(42, "skip"), -24), ("pop_03", at(42, "sleep"), -24), (G("sizzle"), at(42, "eat"), -26),
    ("clink_plate_02", P(44) + 0.5, -22), (G("whoomp"), at(44, "wrong."), -16),
    ("heartbeat_01", at(45, "hungry."), -18), ("heartbeat_02", at(45, "cold."), -16), ("heartbeat_03", at(45, "nothing,"), -14),
    ("text_tick_01", at(46, "rule"), -18), ("drone_tension_03", P(47), -22),
    ("impact_low_03", at(48, "grey."), -18), ("impact_low_04", at(50, "scares"), -14),
    (G("riser_long"), at(51, "appendix") - 3.0, -16), (G("hit"), at(51, "appendix"), -10), ("heartbeat_04", at(51, "worst"), -16),
    ("door_open_01", at(52, "At"), -22), ("footsteps_tile_01", at(52, "At") + 0.2, -24),
    ("impact_low_02", at(53, "saved"), -18), (G("whoomp"), at(54, "Recovery"), -18),
    (G("shimmer"), at(55, "finally"), -22), (G("bell_ring"), at(56, "alarm."), -22), ("sparkle_01", at(56, "smoke."), -22),
    ("whoosh_medium_02", P(57), -22), ("click_03", at(58, "check"), -22), ("door_close_01", at(58, "doctor"), -24),
    # dinner, the punch
    ("cutlery_plate_01", P(59) + 0.3, -22), ("pop_04", at(59, "pokes"), -18), ("body_thud_04", at(63, "punches"), -12), ("impact_hit_04", at(63, "punches") + 0.02, -20),
    # 2 a.m., the message, the teaser
    (G("buzz"), at(65, "buzzes.") - 0.1, -14), (G("buzz"), at(65, "Theo.") , -18), ("notification_ping_04", P(66) + 0.2, -18),
    ("text_tick_02", at(66, '"Mate.'), -22), (G("sizzle"), PE(66) + 0.4, -24),
    ("glitch_01", T0, -10), ("glitch_02", T0 + 0.6, -12), ("glitch_03", T0 + 1.1, -12), ("glitch_01", T0 + 1.6, -12),
    (G("hit"), T_PART2, -8), ("whoosh_short_01", at(69, "Would"), -22), (G("shimmer"), at(70, "In"), -14),
]

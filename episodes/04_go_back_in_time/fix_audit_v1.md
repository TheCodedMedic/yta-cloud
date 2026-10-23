# Episode 04 v1: fix audit (2026-10-23)

The user's notes, then every shot where each problem occurs. **(+)** marks problems I found myself.

## 1. Hands frozen in one shape; held objects missing
- **Rig:** every hand is the same half-curl mitten; there are no wrist turns and no gestures.
- **The man's coffee** (`slow`, `coffee`, `spill`, `catch`): the cup floats at a fixed spot in the street, not in his hand.
- **Jamie's phone at the crossing** (`mem-light`, `voice-play`, `there-he-is`, `hood`, `glass`, `headlights`, `foot`, `reach`): his hand is raised, but there is a phone only in `his-phone`.
- **Your phone** (`map`, `late`, `voice-note`, `buzz`, `not-yet`): the arm is raised with nothing in the hand, because the phone is only a 2D overlay.
- **Eating with nothing to eat:**
  - `breakfasts` (hand through the table, no spoon);
  - `morning`, `cereal`, `staring`, `deja-vu`, `deal-brother` (Jamie "eating your cereal" with no spoon or bowl in reach).
- **Other empty hands:**
  - `furnace`: hand up, no food;
  - `hungry`: reaching at a closed fridge;
  - `photo`: the frame floats beside him instead of being in his hands.
- **(+) Gestures:** talkers (`coach`, `mid-sentence`, `early`) all have the same rigid hand; they need open-palm gestures.
- **(+) Running hands:** fists while running are fine; walking hands should be relaxed.

## 2. Sitting on nothing
- **Kitchen, no chairs:** `breakfasts`, `morning`, `cereal`, `staring`, `deja-vu`, `deal-brother`.
- **Bedroom, sinking into the mattress:** `photo` and `voice-note` sit at chair height while the mattress is higher.
- **The kerb:** `kerb` (Mill Road) floats; the kerb is only 12 cm, and the sit pose hovers above it. `met-him` (memory) has the same problem.
- **(+) Classroom:** `maths-wrong` and `maths-right` have 12 students seated with no chairs.

## 3. Facing the wrong way
- **After the save** (`whoa`, `alive`, `early`, `film`, `kerb`): Jamie and you are not turned toward each other.
- **(+) Other pairs:** `here` (kitchen relief), `met-him` (the friend crouched beside you), `deja-vu`.
- **Rule:** in every two-person shot, compute yaw from one position to the other. Never hand-type it.

## 4. The photo wall
- `photo-wall` shows coloured blocks with dots instead of photos.
- **Needed:** real pictures with sky, places and people with faces (a family portrait, a beach holiday, a birthday, mountains, a graduation, a pet), in wooden frames with mats.
- **(+)** The bedroom `photo` of the brothers is the same: crude shapes.

## 5. Empty scenes
- **The car park** (`outside`, `car-park`, `friend`): it reads as an empty gap. The lot sits behind the building line and has almost nothing in it.
- **(+) Kitchen:** bare walls; it needs cabinets, a sink, a kettle, a cereal box, chairs, a fruit bowl, plants and a window frame.
- **(+) Bedroom:** sparse; it needs a wardrobe, bookshelf, laptop, chair, posters, nightstand and curtains.
- **(+) Classroom:** no chairs, no windows, no posters.
- **(+) Toast:** the `toast` shot is a grey box.

## 6. Other problems I found (+)
- Jamie's hood-up reads like a helmet.
- The pigeon's wings are oversized blobs.
- The keeper's dive is a stiff plank.
- In `pitch-right` the ball isn't at the shooting foot.
- In `strangers` extras block the camera.
- The coach's whistle is invisible.
- Extras in the plaza can walk through each other.

# Background music library

All tracks come from [Mixkit](https://mixkit.co/free-stock-music/) (Envato) and are released under the **Mixkit Stock Music Free License** (https://mixkit.co/license/#musicFree): free for commercial and non-commercial projects, explicitly allowed in YouTube videos, podcasts, social media and online ads, no attribution required; not allowed on CDs/DVDs, TV/radio broadcast, in video games, as remixes or music-only tracks, or registered with a rights management service (Content ID). Mixkit says to forward any claim to team@mixkit.co. Freesound (CC0/CC-BY) was the first choice but freesound.org and cdn.freesound.org return HTTP 403 to every request from this cloud VM (API with and without the token, CDN previews), so nothing could be fetched from it; no YouTube or Pixabay downloads were made. Files were converted with ffmpeg to 48 kHz stereo MP3 (128 kbps), peak-normalised to -1 dBFS, and tracks longer than 190 s were cut to 180 s with a 4 s fade so each file stays under 3 MB. Full metadata is in `credits.json` (file, mood, title, author, source_url, license, duration_s, bpm_guess). The BPM is a crude autocorrelation guess, not a measured tempo. Nobody has listened to these tracks: they were chosen from Mixkit mood/genre/instrument tags and checked only for decoding and loudness, so audition each before using it in a published video.

| file | mood | title | author | length |
|---|---|---|---|---|
| `calm_01_sleepy-cat.mp3` | calm | Sleepy Cat | Alejandro Magaña (A. M.) | 119 s |
| `calm_02_sweet-september.mp3` | calm | Sweet September | Arulo | 99 s |
| `calm_03_serene-view.mp3` | calm | Serene View | Arulo | 114 s |
| `calm_04_infinity.mp3` | calm | Infinity | Arulo | 103 s |
| `wonder_01_discover.mp3` | wonder | Discover | Eugenio Mininni | 144 s |
| `wonder_02_forest-mist-whispers.mp3` | wonder | Forest Mist Whispers | Alejandro Magaña (A. M.) | 151 s |
| `wonder_03_vastness.mp3` | wonder | Vastness | Andrew Ev | 180 s |
| `playful_01_comical.mp3` | playful | Comical | Ahjay Stelino | 114 s |
| `playful_02_keep-smiling.mp3` | playful | Keep Smiling | Ahjay Stelino | 106 s |
| `playful_03_happy-and-all-that.mp3` | playful | Happy and All That | Diego Nava | 108 s |
| `playful_04_little-bells.mp3` | playful | Little Bells | Diego Nava | 103 s |
| `tense_01_slow-rain.mp3` | tense | Slow Rain | Alejandro Magaña (A. M.) | 129 s |
| `tense_02_echoes.mp3` | tense | Echoes | Andrew Ev | 180 s |
| `tense_03_vertigo.mp3` | tense | Vertigo | Eugenio Mininni | 180 s |
| `tense_04_sci-fi-score.mp3` | tense | Sci-Fi Score | Arulo | 98 s |
| `tense_05_placeit-world-01.mp3` | tense | PlaceIt World 01 | Lily J | 96 s |
| `sad_01_piano-reflections.mp3` | sad | Piano Reflections | Ahjay Stelino | 180 s |
| `sad_02_classical-vibes-1.mp3` | sad | Classical vibes 1 | Grigoriy Nuzhny | 110 s |
| `sad_03_silent-descent.mp3` | sad | Silent Descent | Eugenio Mininni | 160 s |
| `sad_04_skyline.mp3` | sad | Skyline | Eugenio Mininni | 180 s |
| `sad_05_classical-vibes-5.mp3` | sad | Classical vibes 5 | Grigoriy Nuzhny | 123 s |
| `hopeful_01_a-new-life.mp3` | hopeful | A New Life | Eugenio Mininni | 99 s |
| `hopeful_02_classical-vibes-4.mp3` | hopeful | Classical vibes 4 | Grigoriy Nuzhny | 137 s |
| `hopeful_03_rebecca-on-the-shore.mp3` | hopeful | Rebecca on the Shore | Eugenio Mininni | 112 s |
| `hopeful_04_dreaming-of-you.mp3` | hopeful | Dreaming of You | Michael Ramir C. | 149 s |
| `hopeful_05_driving-ambition.mp3` | hopeful | Driving Ambition | Ahjay Stelino | 102 s |
| `mystery_01_fallen-asper.mp3` | mystery | Fallen (Asper) | Eugenio Mininni | 180 s |
| `mystery_02_unforgiven.mp3` | mystery | Unforgiven | Michael Ramir C. | 134 s |
| `mystery_03_cyberpunk-city.mp3` | mystery | Cyberpunk City | Alejandro Magaña (A. M.) | 100 s |
| `mystery_04_goats.mp3` | mystery | Goats | Eugenio Mininni | 180 s |
| `mystery_05_vampires-in-the-city.mp3` | mystery | Vampires in the City | Michael Ramir C. | 100 s |
| `action_01_epical-drums-02.mp3` | action | Epical Drums 02 | Grigoriy Nuzhny | 123 s |
| `action_02_no-warning.mp3` | action | No Warning | Michael Ramir C. | 114 s |
| `action_03_games-music.mp3` | action | Games Music | Grigoriy Nuzhny | 118 s |

Mood keys: `calm` = calm warm storytelling (soft keys / lo-fi, light beat); `wonder` = wonder / discovery (gentle, bright); `playful` = light upbeat / playful (comedy); `tense` = tense pulse / suspense (low, building); `sad` = sad / emotional piano and strings; `hopeful` = hopeful / warm resolution; `mystery` = mystery / dark ambient (cold teaser); `action` = action / driving.

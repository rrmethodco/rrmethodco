"""Curated sonic profiles for major artists.

Each profile describes the typical sonic footprint of an artist's catalog on
the same 0-1 scales produced by analyzer.py, plus a tempo center/spread.

These are editorial seed values for the MVP. In production these centroids
should be derived from analyzed reference catalogs (30-50 representative
tracks per artist run through the same analyzer), refreshed as artists
release new material.
"""

from dataclasses import dataclass, field


@dataclass
class ArtistProfile:
    name: str
    genres: list[str]
    tempo_center: float
    tempo_spread: float   # tolerance in BPM before penalty kicks in
    energy: float
    danceability: float
    brightness: float
    acousticness: float
    valence: float
    density: float
    minor_share: float    # fraction of catalog in minor keys, 0-1
    audience: str = field(default="")

    def feature_targets(self) -> dict[str, float]:
        return {
            "energy": self.energy,
            "danceability": self.danceability,
            "brightness": self.brightness,
            "acousticness": self.acousticness,
            "valence": self.valence,
            "density": self.density,
        }


ARTIST_PROFILES: list[ArtistProfile] = [
    ArtistProfile(
        name="The Weeknd", genres=["r&b", "synth-pop", "dark pop"],
        tempo_center=100, tempo_spread=25,
        energy=0.62, danceability=0.55, brightness=0.45,
        acousticness=0.15, valence=0.35, density=0.45, minor_share=0.8,
        audience="Night-drive R&B/pop listeners; strong 18-34, playlist-heavy consumption.",
    ),
    ArtistProfile(
        name="Billie Eilish", genres=["alt pop", "bedroom pop", "dark pop"],
        tempo_center=95, tempo_spread=30,
        energy=0.35, danceability=0.45, brightness=0.30,
        acousticness=0.35, valence=0.25, density=0.30, minor_share=0.85,
        audience="Gen-Z alt-pop core; high save rates, lyric-driven engagement.",
    ),
    ArtistProfile(
        name="Drake", genres=["hip-hop", "rap", "r&b"],
        tempo_center=138, tempo_spread=35,
        energy=0.55, danceability=0.65, brightness=0.42,
        acousticness=0.12, valence=0.38, density=0.50, minor_share=0.75,
        audience="Mainstream hip-hop; massive radio reach, mood-playlist crossover.",
    ),
    ArtistProfile(
        name="Taylor Swift", genres=["pop", "singer-songwriter"],
        tempo_center=110, tempo_spread=35,
        energy=0.55, danceability=0.55, brightness=0.50,
        acousticness=0.35, valence=0.50, density=0.40, minor_share=0.3,
        audience="Broad pop; storytelling-forward listeners, extremely high loyalty.",
    ),
    ArtistProfile(
        name="SZA", genres=["r&b", "alt r&b", "neo-soul"],
        tempo_center=90, tempo_spread=30,
        energy=0.45, danceability=0.55, brightness=0.40,
        acousticness=0.30, valence=0.40, density=0.40, minor_share=0.65,
        audience="Alt-R&B core; vibe-playlist heavy, strong late-night listening.",
    ),
    ArtistProfile(
        name="Post Malone", genres=["pop-rap", "pop", "country crossover"],
        tempo_center=115, tempo_spread=35,
        energy=0.58, danceability=0.58, brightness=0.45,
        acousticness=0.25, valence=0.42, density=0.42, minor_share=0.6,
        audience="Genre-fluid mainstream; rap-to-country crossover audience.",
    ),
    ArtistProfile(
        name="Morgan Wallen", genres=["country", "country pop"],
        tempo_center=112, tempo_spread=30,
        energy=0.58, danceability=0.52, brightness=0.48,
        acousticness=0.45, valence=0.48, density=0.40, minor_share=0.35,
        audience="Modern country mainstream; strong US South/Midwest, high repeat listens.",
    ),
    ArtistProfile(
        name="Zach Bryan", genres=["country", "folk", "americana"],
        tempo_center=105, tempo_spread=35,
        energy=0.45, danceability=0.35, brightness=0.42,
        acousticness=0.70, valence=0.40, density=0.32, minor_share=0.4,
        audience="Raw/organic country-folk; lyric-first listeners, vinyl-buyer energy.",
    ),
    ArtistProfile(
        name="Bad Bunny", genres=["reggaeton", "latin trap", "latin pop"],
        tempo_center=96, tempo_spread=20,
        energy=0.68, danceability=0.75, brightness=0.50,
        acousticness=0.12, valence=0.55, density=0.55, minor_share=0.6,
        audience="Global Latin mainstream; dance-forward, party-playlist dominant.",
    ),
    ArtistProfile(
        name="Dua Lipa", genres=["dance pop", "disco pop"],
        tempo_center=118, tempo_spread=15,
        energy=0.72, danceability=0.78, brightness=0.58,
        acousticness=0.08, valence=0.65, density=0.50, minor_share=0.5,
        audience="Dance-pop mainstream; workout/party playlists, global reach.",
    ),
    ArtistProfile(
        name="Travis Scott", genres=["rap", "trap", "psychedelic rap"],
        tempo_center=140, tempo_spread=30,
        energy=0.65, danceability=0.60, brightness=0.38,
        acousticness=0.08, valence=0.30, density=0.55, minor_share=0.85,
        audience="Rage/trap core; young male skew, event-driven spikes.",
    ),
    ArtistProfile(
        name="Olivia Rodrigo", genres=["pop", "pop punk", "alt pop"],
        tempo_center=120, tempo_spread=40,
        energy=0.55, danceability=0.48, brightness=0.48,
        acousticness=0.40, valence=0.38, density=0.42, minor_share=0.55,
        audience="Gen-Z pop/pop-punk; high emotional engagement, TikTok-native.",
    ),
    ArtistProfile(
        name="Ed Sheeran", genres=["pop", "acoustic pop", "singer-songwriter"],
        tempo_center=100, tempo_spread=35,
        energy=0.48, danceability=0.60, brightness=0.45,
        acousticness=0.55, valence=0.55, density=0.38, minor_share=0.3,
        audience="Broad adult pop; wedding/coffeehouse playlists, all-ages reach.",
    ),
    ArtistProfile(
        name="Doja Cat", genres=["pop-rap", "r&b", "dance pop"],
        tempo_center=120, tempo_spread=30,
        energy=0.62, danceability=0.72, brightness=0.52,
        acousticness=0.12, valence=0.55, density=0.48, minor_share=0.6,
        audience="Pop-rap crossover; meme-literate, short-form-video driven discovery.",
    ),
    ArtistProfile(
        name="Luke Combs", genres=["country"],
        tempo_center=108, tempo_spread=30,
        energy=0.60, danceability=0.50, brightness=0.46,
        acousticness=0.50, valence=0.50, density=0.40, minor_share=0.3,
        audience="Traditional-leaning country mainstream; strong radio + streaming blend.",
    ),
    ArtistProfile(
        name="Hozier", genres=["indie rock", "soul", "folk rock"],
        tempo_center=110, tempo_spread=35,
        energy=0.50, danceability=0.42, brightness=0.40,
        acousticness=0.60, valence=0.38, density=0.38, minor_share=0.55,
        audience="Indie/soul crossover; deep-listening audience, high completion rates.",
    ),
    ArtistProfile(
        name="Ariana Grande", genres=["pop", "r&b pop"],
        tempo_center=112, tempo_spread=30,
        energy=0.58, danceability=0.62, brightness=0.55,
        acousticness=0.18, valence=0.50, density=0.42, minor_share=0.5,
        audience="Vocal-pop mainstream; strong female 16-30, high playlist adds.",
    ),
    ArtistProfile(
        name="Kendrick Lamar", genres=["hip-hop", "conscious rap", "west coast"],
        tempo_center=130, tempo_spread=40,
        energy=0.58, danceability=0.58, brightness=0.42,
        acousticness=0.20, valence=0.38, density=0.55, minor_share=0.7,
        audience="Lyric-first hip-hop; critic-aligned listeners, album-mode consumption.",
    ),
    ArtistProfile(
        name="Lana Del Rey", genres=["alt pop", "dream pop", "baroque pop"],
        tempo_center=85, tempo_spread=30,
        energy=0.35, danceability=0.35, brightness=0.35,
        acousticness=0.55, valence=0.25, density=0.28, minor_share=0.7,
        audience="Cinematic sad-pop core; aesthetic-driven, extremely loyal catalog listeners.",
    ),
    ArtistProfile(
        name="Fred again..", genres=["electronic", "house", "uk dance"],
        tempo_center=126, tempo_spread=12,
        energy=0.70, danceability=0.75, brightness=0.52,
        acousticness=0.08, valence=0.48, density=0.60, minor_share=0.6,
        audience="Emotional dance/electronic; festival-driven, DJ-set discovery.",
    ),
]

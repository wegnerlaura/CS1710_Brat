// Currently, I did something wrong to the algorithm because it only shows Apple or 360, but I will fix that in the next iterations.

document.addEventListener("DOMContentLoaded", function () {
    // Song dataset with normalized attributes
    let songsData = [
        { name: "360", youtube_id: "WJW-VvmRKsE", danceability: 0.928, energy: 0.649, valence: 0.951, tempo: 120.042, popularity: 54 },
        { name: "Club Classics", youtube_id: "bg9EmWTRt3Y", danceability: 0.716, energy: 0.879, valence: 0.693, tempo: 144.95, popularity: 54 },
        { name: "Sympathy is a Knife", youtube_id: "KrxDhDDXUwQ", danceability: 0.718, energy: 0.706, valence: 0.580, tempo: 131.944, popularity: 54 },
        { name: "I Might Say Something Stupid", youtube_id: "zw6bA75H2jc", danceability: 0.504, energy: 0.3, valence: 0.16, tempo: 79.25, popularity: 49 },
        { name: "Talk Talk", youtube_id: "K5jyIoPbu4M", danceability: 0.701, energy: 0.82, valence: 0.49, tempo: 130.146, popularity: 52 },
        { name: "Von Dutch", youtube_id: "cwZ1L_0QLjw", danceability: 0.8, energy: 0.95, valence: 0.6, tempo: 140.0, popularity: 50 },
        { name: "Everything is Romantic", youtube_id: "fUr2t-KnILQ", danceability: 0.6, energy: 0.5, valence: 0.4, tempo: 115.0, popularity: 48 },
        { name: "Rewind", youtube_id: "WlM7nm3TLnY", danceability: 0.55, energy: 0.6, valence: 0.5, tempo: 118.5, popularity: 47 },
        { name: "So I", youtube_id: "g-PovEJ1qWc", danceability: 0.68, energy: 0.7, valence: 0.65, tempo: 125.0, popularity: 53 },
        { name: "Girl So Confusing", youtube_id: "0q3K6FPzY18", danceability: 0.7, energy: 0.6, valence: 0.5, tempo: 135.0, popularity: 51 },
        { name: "Apple", youtube_id: "CPWxExGk7PM", danceability: 0.804, energy: 0.957, valence: 0.962, tempo: 150.0, popularity: 55 },
        { name: "B2B", youtube_id: "Lp8TaMWU-Ho", danceability: 0.6, energy: 0.8, valence: 0.4, tempo: 120.0, popularity: 50 },
        { name: "Mean Girls", youtube_id: "IKUQDMEBXN0", danceability: 0.7, energy: 0.75, valence: 0.6, tempo: 140.0, popularity: 52 },
        { name: "I Think About It All the Time", youtube_id: "Mn0aho8Ayfk", danceability: 0.65, energy: 0.7, valence: 0.55, tempo: 132.0, popularity: 53 },
        { name: "365", youtube_id: "Ol9CCM240Ag", danceability: 0.75, energy: 0.8, valence: 0.7, tempo: 145.0, popularity: 54 }
    ];

    // Event listener for quiz submission
    document.getElementById("quiz-submit").addEventListener("click", function () {
        const responses = { danceability: 0, energy: 0, valence: 0 };

        // Collect responses
        new FormData(document.getElementById("quiz-form")).forEach((value, key) => {
            if (value in responses) {
                responses[value]++;
            }
        });

        // Normalize attributes
        const maxAttributes = {
            danceability: Math.max(...songsData.map(s => s.danceability)),
            energy: Math.max(...songsData.map(s => s.energy)),
            valence: Math.max(...songsData.map(s => s.valence)),
            tempo: Math.max(...songsData.map(s => s.tempo)),
            popularity: Math.max(...songsData.map(s => s.popularity))
        };

        // Calculate scores for each song and store them
        const scoredSongs = songsData.map(song => {
            const score =
                (responses.danceability * song.danceability / maxAttributes.danceability) * 0.4 +
                (responses.energy * song.energy / maxAttributes.energy) * 0.3 +
                (responses.valence * song.valence / maxAttributes.valence) * 0.2 +
                (song.tempo / maxAttributes.tempo) * 0.05 +
                (song.popularity / maxAttributes.popularity) * 0.05;

            return { ...song, score };
        });

        // Sort songs by score in descending order
        const sortedSongs = scoredSongs.sort((a, b) => b.score - a.score);

        // Get the best song (highest score)
        const bestSong = sortedSongs[0];

        // Display result
        const resultSection = document.getElementById("quiz-result");
        resultSection.classList.remove("hidden");

        // Display the top song
        if (bestSong) {
            document.getElementById("result-song").innerHTML = `
                <h3>${bestSong.name}</h3>
                <p><strong>Danceability:</strong> ${bestSong.danceability.toFixed(2)}</p>
                <p><strong>Energy:</strong> ${bestSong.energy.toFixed(2)}</p>
                <p><strong>Valence:</strong> ${bestSong.valence.toFixed(2)}</p>
                <div id="youtube-video">
                    <iframe width="560" height="315"
                        src="https://www.youtube.com/embed/${bestSong.youtube_id}"
                        title="${bestSong.name}" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        }

        // Render song rankings with perfectly aligned numbers
        const rankingList = sortedSongs.map((song, index) => `
    <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5px 0;
        font-size: 1.1rem;
    ">
        <div style="width: 30px; text-align: right; margin-right: 10px;">${index + 1}.</div>
        <div style="text-align: left;">${song.name}</div>
    </div>
`).join("");

// Display rankings in the result section
        document.getElementById("song-ranking").innerHTML = `
    <h4 style="text-align: center;">Song Rankings:</h4>
    <div style="display: flex; flex-direction: column; align-items: center;">
        ${rankingList}
    </div>
`;



        // Reset quiz form after displaying the result
        document.getElementById("quiz-form").reset();
    });
});



// The matching logic works by comparing the user's preferences, gathered from their quiz responses, with the attributes of each
// song in the dataset. Each song has specific values for danceability, energy, and valence, which describe how
// rhythmic, energetic, or emotionally positive or negative the song is. The user's preferences are mapped to these attributes based on their quiz
// answers, and each attribute is assigned a score based on how strongly the user favors it. For every song, a total score is calculated
// by multiplying the user's preference weight for each attribute by the song's corresponding attribute value, and then summing these
// results. The song with the highest total score is the best match because it aligns most closely with the user's expressed preferences,
// although I think the quiz questions will be adjusted a bit to be more interesting.

// For example, if a user selects "High Energy" and "Party and Energetic," the energy attribute gets a higher weight, while other attributes like
// danceability or valence may remain lower or at zero if not selected. The matching process evaluates each song in the dataset by calculating a
// score for every song. This score is determined by multiplying the user's response weight for each attribute with the respective attribute value
// of the song and summing the results. For instance, if a user gives a weight of 2 to energy, 1 to valence, and 0 to danceability, and a song
// has attribute values of danceability: 0.8, energy: 0.9, and valence: 0.7, the score is calculated as (0.8 * 0) + (0.9 * 2) + (0.7 * 1) = 2.5.
// This calculation is repeated for all songs, and the song with the highest cumulative score is selected as the best match.

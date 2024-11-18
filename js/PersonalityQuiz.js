// At first, I planned to do this next week because it involves more planning than the other visualizations,
// but I decided to just do it now, so that there is more time for iteration later on based on feedback. It currently just
// has the basic quiz and results, but that will be improved for next time, especially because it currently does not really
// have an actual "visualization" aspect.

document.addEventListener("DOMContentLoaded", function () {

    let songsData = [
        // Songs and YouTube video IDs (need to add more and need to update this with directly coming from dataset)
        {
            name: "360",
            danceability: 0.857,
            energy: 0.62,
            valence: 0.796,
            lyrics: "I went my own way and I made it...",
            youtube_id: "WJW-VvmRKsE"
        },
        {
            name: "Club Classics",
            danceability: 0.716,
            energy: 0.879,
            valence: 0.693,
            lyrics: "When I go to the club, I wanna hear those club classics...",
            youtube_id: "rd1AZym4lEY"
        },
        {
            name: "Sympathy is a Knife",
            danceability: 0.718,
            energy: 0.706,
            valence: 0.58,
            lyrics: "I don't wanna share the space...",
            youtube_id: "S9s4Ckt-aKo"
        },
        {
            name: "I Might Say Something Stupid",
            danceability: 0.504,
            energy: 0.3,
            valence: 0.16,
            lyrics: "I might say something stupid...",
            youtube_id: "TD2j1OuHoik"
        },
        {
            name: "Always Forever",
            danceability: 0.701,
            energy: 0.82,
            valence: 0.49,
            lyrics: "Always forever, I'll be yours...",
            youtube_id: "COKJ_gdTkIY"
        },
        {
            name: "Brat Anthem",
            danceability: 0.8,
            energy: 0.95,
            valence: 0.6,
            lyrics: "Brat anthem, raw and unfiltered...",
            youtube_id: "E6oq5HCzG4c"
        },
        {
            name: "Night Drive",
            danceability: 0.9,
            energy: 0.5,
            valence: 0.7,
            lyrics: "Driving at night, city lights...",
            youtube_id: "TxZwCpgxttQ"
        },
        {
            name: "Pink Destruction",
            danceability: 0.68,
            energy: 0.75,
            valence: 0.65,
            lyrics: "Pink destruction, tearing it apart...",
            youtube_id: "_FU8xyVC-tk"
        }
    ];

    // Event listener to "Find My Song" button
    document.getElementById("quiz-submit").addEventListener("click", function () {

        // Store the user's quiz responses
        const responses = {
            danceability: 0,
            energy: 0,
            valence: 0
        };

        // Access quiz form and collect user responses
        let form = document.getElementById("quiz-form");

        // Iterate over the form data to update responses object
        new FormData(form).forEach((value, key) => {
            if (value in responses) {
                // Increment corresponding response value based on user input
                responses[value]++;
            }
        });

        // Initialize variables to find best-matching song
        let bestSong = null;
        let highestScore = -Infinity;

        // Loop through each song in the dataset (need to improve this I think)
        songsData.forEach((song) => {
            // Initialize the score for the current song
            let score = 0;

            // Calculate the score based on user preferences and song attributes
            score += responses.danceability * song.danceability;
            score += responses.energy * song.energy;
            score += responses.valence * song.valence;

            // Check if this song has the highest score so far
            if (score > highestScore) {
                bestSong = song;
                highestScore = score;
            }
        });

        // Result section
        let resultSection = document.getElementById("quiz-result");
        resultSection.classList.remove("hidden");

        // If a best-matching song is found, display details (will probably add more details, especially because valence is hard to understand)
        if (bestSong) {
            document.getElementById("result-song").innerHTML = `
                <h3>${bestSong.name}</h3>
                <p><strong>Lyrics Preview:</strong> ${bestSong.lyrics}</p>
                <p><strong>Danceability:</strong> ${bestSong.danceability}</p>
                <p><strong>Energy:</strong> ${bestSong.energy}</p>
                <p><strong>Valence:</strong> ${bestSong.valence}</p>
                <div id="youtube-video">
                    <iframe width="560" height="315"
                        src="https://www.youtube.com/embed/${bestSong.youtube_id}"
                        title="${bestSong.name}" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        } else {
            // If no match is found, display an appropriate message
            document.getElementById("result-song").innerText = "No match found. Try again!";
        }
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

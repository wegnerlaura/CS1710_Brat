document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".quiz-question");
    const nextButton = document.getElementById("next-button");
    const submitButton = document.getElementById("quiz-submit");
    const resultContainer = document.getElementById("quiz-result");
    const countdownContainer = document.getElementById("countdown");
    const resultContent = document.getElementById("result-content");
    let currentQuestionIndex = 0;

    const responses = {};

    // Mock song dataset
    const songsData = [
        { name: "360", youtube_id: "WJW-VvmRKsE", danceability: 0.9, energy: 0.7, valence: 0.8, tempo: 120 },
        { name: "Club Classics", youtube_id: "bg9EmWTRt3Y", danceability: 0.7, energy: 0.8, valence: 0.6, tempo: 145 },
        { name: "Stupid", youtube_id: "zw6bA75H2jc", danceability: 0.5, energy: 0.3, valence: 0.2, tempo: 80 },
        // Add more songs here
    ];

    function showQuestion(index) {
        questions.forEach((question, i) => {
            question.classList.toggle("hidden", i !== index);
        });

        // If it's the last question, hide "Next" and show "Find My Song"
        if (index === questions.length - 1) {
            nextButton.classList.add("hidden");
            submitButton.classList.remove("hidden");
        } else {
            nextButton.classList.remove("hidden");
            submitButton.classList.add("hidden");
        }
    }

    function calculateResults() {
        const rankedSongs = songsData.map(song => {
            let score = 0;
            for (const [key, value] of Object.entries(responses)) {
                if (song[key] !== undefined) {
                    score += song[key] * value;
                }
            }
            return { ...song, score };
        }).sort((a, b) => b.score - a.score);

        return rankedSongs;
    }

    function displayResults(rankedSongs) {
        const bestSong = rankedSongs[0];

        resultContent.innerHTML = `
            <h2>Your Result:</h2>
            <h3>${bestSong.name}</h3>
            <p><strong>Danceability:</strong> ${bestSong.danceability}</p>
            <p><strong>Energy:</strong> ${bestSong.energy}</p>
            <p><strong>Valence:</strong> ${bestSong.valence}</p>
            <p><strong>Tempo:</strong> ${bestSong.tempo}</p>
            <div id="youtube-video">
                <iframe width="560" height="315"
                    src="https://www.youtube.com/embed/${bestSong.youtube_id}"
                    title="${bestSong.name}" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>
        `;

        // Display full rankings
        const rankings = rankedSongs.map((song, index) => `
            <p>${index + 1}. ${song.name} (Score: ${song.score.toFixed(2)})</p>
        `).join("");

        resultContent.innerHTML += `
            <h3>Full Rankings:</h3>
            <div>${rankings}</div>
        `;
    }

    function startCountdown(callback) {
        let countdown = 3;
        countdownContainer.classList.remove("hidden");
        countdownContainer.textContent = countdown;

        const interval = setInterval(() => {
            countdown -= 1;
            countdownContainer.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(interval);
                countdownContainer.classList.add("hidden");
                callback();
            }
        }, 1000);
    }

    // Event Listeners
    nextButton.addEventListener("click", () => {
        showQuestion(++currentQuestionIndex);
    });

    submitButton.addEventListener("click", () => {
        // Start the countdown before showing results
        startCountdown(() => {
            const rankedSongs = calculateResults();
            resultContainer.classList.remove("hidden");
            displayResults(rankedSongs);
        });
    });

    document.querySelectorAll(".star-button").forEach(button => {
        button.addEventListener("click", () => {
            const value = button.getAttribute("data-value");
            responses[value] = (responses[value] || 0) + 1;

            // Highlight selected button
            button.classList.add("selected");

            // Enable "Next" button
            nextButton.disabled = false;
        });
    });

    // Initialize the first question
    showQuestion(currentQuestionIndex);
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

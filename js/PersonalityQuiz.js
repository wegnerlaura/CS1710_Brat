class PersonalityQuiz {
    constructor() {
        this.currentQuestion = 1;
        this.totalQuestions = 5;
        this.answers = {};
        this.songsData = [];

        // Load the song data
        d3.csv("data/brat.csv").then(data => {
            this.songsData = data.filter(song => !song.name.includes("featuring"));
            this.initializeQuiz();
        });
    }

    initializeQuiz() {
        // Hide all questions except the first
        for (let i = 2; i <= this.totalQuestions; i++) {
            document.getElementById(`question-${i}`).classList.add('hidden');
        }

        // Add event listeners
        this.addOptionListeners();
        this.addButtonListeners();
    }

    addOptionListeners() {
        const buttons = document.querySelectorAll('.star-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove selection from other buttons in same question
                const currentQuestion = e.target.closest('.quiz-question');
                currentQuestion.querySelectorAll('.star-button').forEach(btn => {
                    btn.classList.remove('selected');
                });

                // Add selection to clicked button
                button.classList.add('selected');

                // Store the answer
                this.answers[this.currentQuestion] = button.dataset.value;

                // Enable next/submit button
                const nextButton = document.getElementById('next-button');
                const submitButton = document.getElementById('quiz-submit');
                if (this.currentQuestion === this.totalQuestions) {
                    submitButton.disabled = false;
                } else {
                    nextButton.disabled = false;
                }
            });
        });
    }

    addButtonListeners() {
        const nextButton = document.getElementById('next-button');
        const submitButton = document.getElementById('quiz-submit');

        nextButton.addEventListener('click', () => this.nextQuestion());
        submitButton.addEventListener('click', () => this.showResults());
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            // Hide current question
            document.getElementById(`question-${this.currentQuestion}`).classList.add('hidden');

            // Show next question
            this.currentQuestion++;
            document.getElementById(`question-${this.currentQuestion}`).classList.remove('hidden');

            // Update buttons
            if (this.currentQuestion === this.totalQuestions) {
                document.getElementById('next-button').classList.add('hidden');
                document.getElementById('quiz-submit').classList.remove('hidden');
            }

            // Disable next button until an option is selected
            document.getElementById('next-button').disabled = true;
        }
    }

    startCountdown() {
        const countdown = document.getElementById('countdown');
        countdown.classList.remove('hidden');
        let count = 3;

        return new Promise(resolve => {
            const interval = setInterval(() => {
                countdown.textContent = count;
                count--;

                if (count < 0) {
                    clearInterval(interval);
                    countdown.classList.add('hidden');
                    resolve();
                }
            }, 1000);
        });
    }

    calculateResult() {
        const weights = {
            danceability: 0.25,
            energy: 0.2,
            valence: 0.2,
            tempo: 0.15,
            acousticness: 0.1,
            instrumentalness: 0.05,
            speechiness: 0.05
        };

        const tempoRanges = {
            slow: { min: 0, max: 100 },
            medium: { min: 100, max: 130 },
            fast: { min: 130, max: Infinity }
        };

        return this.songsData.map(song => {
            let score = 0;
            Object.entries(this.answers).forEach(([_, answer]) => {
                if (answer === 'slow' || answer === 'medium' || answer === 'fast') {
                    const tempo = parseFloat(song.tempo);
                    const range = tempoRanges[answer];
                    if (tempo >= range.min && tempo <= range.max) {
                        score += weights.tempo;
                    }
                } else if (answer === 'explicit') {
                    if (song.explicit === "TRUE") {
                        score += 0.1;
                    }
                } else if (song[answer]) {
                    score += parseFloat(song[answer]) * (weights[answer] || 0.1);
                }
            });

            return {
                name: song.name,
                score: score
            };
        }).sort((a, b) => b.score - a.score);
    }

    async showResults() {
        // Hide the quiz form
        document.getElementById('quiz-form').classList.add('hidden');

        // Show countdown
        await this.startCountdown();

        // Calculate results
        const results = this.calculateResult();
        const bestMatch = results[0];
        const topFive = results.slice(0, 5);
        const bottomFive = results.slice(-5);

        // Show results
        const resultContent = document.getElementById('result-content');
        resultContent.innerHTML = `
            <h2>Your song is: ${bestMatch.name}</h2>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${this.getVideoId(bestMatch.name)}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
            
            <div class="view-toggle">
                <button class="toggle-button active" data-view="rankings">Show Rankings</button>
                <button class="toggle-button" data-view="graphs">Show Graphs</button>
            </div>
            
            <div id="rankings-container">
                <h3>Top 5 Songs:</h3>
                ${topFive.map((song, index) => `
                    <div class="song-rank">${index + 1}. ${song.name}</div>
                `).join('')}
                
                <h3>Bottom 5 Songs:</h3>
                ${bottomFive.map((song, index) => `
                    <div class="song-rank">${index + 1}. ${song.name}</div>
                `).join('')}
            </div>
            
            <div id="graphs-container" class="hidden">
                <div id="top-songs-chart"></div>
                <div id="bottom-songs-chart"></div>
            </div>
        `;

        document.getElementById('quiz-result').classList.remove('hidden');
        this.initializeResultsView();
    }

    getVideoId(songName) {
        const videoIds = {
            "360": "WJW-VvmRKsE",
            "Club classics": "bg9EmWTRt3Y",
            "Sympathy is a knife": "KrxDhDDXUwQ",
            "I might say something stupid": "zw6bA75H2jc",
            "Talk talk": "K5jyIoPbu4M",
            "Von dutch": "cwZ1L_0QLjw",
            "Everything is romantic": "fUr2t-KnILQ",
            "Rewind": "WlM7nm3TLnY",
            "So I": "g-PovEJ1qWc",
            "Girl, so confusing": "0q3K6FPzY18",
            "Apple": "CPWxExGk7PM",
            "B2b": "Lp8TaMWU-Ho",
            "Mean girls": "IKUQDMEBXN0",
            "I think about it all the time": "Mn0aho8Ayfk",
            "365": "Ol9CCM240Ag",
            "Hello goodbye": "your-video-id",
            "Guess": "your-video-id",
            "Spring breakers": "your-video-id"
        };
        return videoIds[songName] || "dQw4w9WgXcQ";
    }

    initializeResultsView() {
        const toggleButtons = document.querySelectorAll('.toggle-button');
        const rankingsContainer = document.getElementById('rankings-container');
        const graphsContainer = document.getElementById('graphs-container');

        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                toggleButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                if (e.target.dataset.view === 'rankings') {
                    rankingsContainer.classList.remove('hidden');
                    graphsContainer.classList.add('hidden');
                } else {
                    rankingsContainer.classList.add('hidden');
                    graphsContainer.classList.remove('hidden');
                    this.createCharts();
                }
            });
        });
    }

    createCharts() {
        // Implement D3.js charts here if needed
    }
}

// Initialize the quiz when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PersonalityQuiz();
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

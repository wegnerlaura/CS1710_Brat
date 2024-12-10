document.addEventListener("DOMContentLoaded", function () {
    let currentQuestionIndex = 0;
    const questions = document.querySelectorAll(".quiz-question");
    const nextButton = document.getElementById("next-button");
    const findSongButton = document.getElementById("quiz-submit");
    const answers = {};

    // Song dataset with normalized attributes
    const songsData = [
        { name: "360", youtube_id: "WJW-VvmRKsE", danceability: 0.928, energy: 0.649, valence: 0.951, tempo: 120.042, popularity: 54 },
        { name: "Club Classics", youtube_id: "bg9EmWTRt3Y", danceability: 0.716, energy: 0.879, valence: 0.693, tempo: 144.95, popularity: 54 },
        { name: "Sympathy is a Knife", youtube_id: "KrxDhDDXUwQ", danceability: 0.718, energy: 0.706, valence: 0.580, tempo: 131.944, popularity: 54 },
        { name: "Something Stupid", youtube_id: "zw6bA75H2jc", danceability: 0.504, energy: 0.3, valence: 0.16, tempo: 79.25, popularity: 49 },
        { name: "Talk Talk", youtube_id: "K5jyIoPbu4M", danceability: 0.701, energy: 0.82, valence: 0.49, tempo: 130.146, popularity: 52 },
        { name: "Von Dutch", youtube_id: "cwZ1L_0QLjw", danceability: 0.8, energy: 0.95, valence: 0.6, tempo: 140.0, popularity: 50 },
        { name: "Everything Is Romantic", youtube_id: "fUr2t-KnILQ", danceability: 0.6, energy: 0.5, valence: 0.4, tempo: 115.0, popularity: 48 },
        { name: "Rewind", youtube_id: "WlM7nm3TLnY", danceability: 0.55, energy: 0.6, valence: 0.5, tempo: 118.5, popularity: 47 },
        { name: "So I", youtube_id: "g-PovEJ1qWc", danceability: 0.68, energy: 0.7, valence: 0.65, tempo: 125.0, popularity: 53 },
        { name: "Girl So Confusing", youtube_id: "0q3K6FPzY18", danceability: 0.7, energy: 0.6, valence: 0.5, tempo: 135.0, popularity: 51 },
        { name: "Apple", youtube_id: "CPWxExGk7PM", danceability: 0.804, energy: 0.957, valence: 0.962, tempo: 150.0, popularity: 55 },
        { name: "B2B", youtube_id: "Lp8TaMWU-Ho", danceability: 0.6, energy: 0.8, valence: 0.4, tempo: 120.0, popularity: 50 },
        { name: "Mean Girls", youtube_id: "IKUQDMEBXN0", danceability: 0.7, energy: 0.75, valence: 0.6, tempo: 140.0, popularity: 52 },
        { name: "Think About It All The Time", youtube_id: "Mn0aho8Ayfk", danceability: 0.65, energy: 0.7, valence: 0.55, tempo: 132.0, popularity: 53 },
        { name: "365", youtube_id: "Ol9CCM240Ag", danceability: 0.75, energy: 0.8, valence: 0.7, tempo: 145.0, popularity: 54 }
    ];

    // Show only the first question initially
    questions.forEach((question, index) => {
        if (index === 0) {
            question.classList.remove("hidden");
        } else {
            question.classList.add("hidden");
        }
    });

    // Add event listeners to all buttons for single selection logic
    document.querySelectorAll(".star-button").forEach((button) => {
        button.addEventListener("click", function () {
            const answerContainer = button.closest(".answer-container");
            const questionId = button.closest(".quiz-question").id;

            // Deselect other buttons in the same question
            answerContainer.querySelectorAll(".star-button").forEach((btn) => {
                btn.classList.remove("selected");
            });

            // Select the clicked button
            button.classList.add("selected");

            // Save the answer value for the current question
            answers[questionId] = button.getAttribute("data-value");

            if (questionId === "question-5") {
                // Changing the Next button to "Show My Song" for question 5
                const nextButton = document.getElementById("next-button");
                if (nextButton) {
                    nextButton.textContent = "Show My Song";
                    nextButton.disabled = false;
                    nextButton.onclick = displayResult;
                }
            } else {
                // Enable the "Next" button if it's not question 5
                const nextButton = document.getElementById("next-button");
                if (nextButton) {
                    nextButton.disabled = false;
                }
            }
        });
    });

    // Event listener for the "Next" button
    nextButton.addEventListener("click", function () {
        // Move to the next question
        questions[currentQuestionIndex].classList.add("hidden");
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            questions[currentQuestionIndex].classList.remove("hidden");
        }

        // Disable "Next" button for the next question until an answer is selected
        nextButton.disabled = true;
    });

    // Function to calculate and display the result
    function displayResult() {
        const resultContent = document.getElementById("result-content");
        const quizResult = document.getElementById("quiz-result");
        const countdown = document.getElementById("countdown");
        const nextButton = document.getElementById("next-button");

        if (!resultContent || !quizResult || !countdown || !nextButton) {
            console.error("Required elements not found");
            return;
        }

        // Hide the Show My Song button
        nextButton.style.display = 'none';

        // Show countdown only
        quizResult.classList.remove("hidden");
        countdown.classList.remove("hidden");
        resultContent.classList.add("hidden");

        let count = 3;
        countdown.textContent = count;

        const countInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdown.textContent = count;
            } else {
                clearInterval(countInterval);
                countdown.classList.add("hidden");

                // Calculate and display the actual result
                const songScores = calculateScores(answers);
                const bestSong = songScores[0];

                // Update the song title
                resultContent.querySelector('h3').textContent = bestSong.name;

                // Update the stats
                const pre = resultContent.querySelector('pre');
                pre.innerHTML = `
<div style="display: flex; justify-content: center; align-items: center; height: 12vh;">
  <div style="display: grid; grid-template-columns: 120px auto; gap: 3px; text-align: left;">
    <div>Danceability:</div><div>${bestSong.danceability.toFixed(2)}</div>
    <div>Energy:</div><div>${bestSong.energy.toFixed(2)}</div>
    <div>Valence:</div><div>${bestSong.valence.toFixed(2)}</div>
  </div>
</div>

`;
                // Update video
                const iframe = resultContent.querySelector('iframe');
                iframe.src = `https://www.youtube.com/embed/${bestSong.youtube_id}`;
                iframe.title = bestSong.name;

                // Show results
                resultContent.classList.remove("hidden");
                resultContent.style.display = 'block';

                // Create bar charts
                createBarCharts(songScores);
            }
        }, 1000);
    }

// Function to create bar charts
    function createBarCharts(songScores) {
        // Clear previous charts if they exist
        d3.select("#top-songs-chart").html("");
        d3.select("#bottom-songs-chart").html("");

        // Add tooltip div
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "black")
            .style("color", "white")
            .style("border", "solid")
            .style("border-color", "#64dd43")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "10px");

        const margin = { top: 80, right: 40, bottom: 150, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Get global maximum score for consistent scaling on both bar charts
        const maxScore = d3.max(songScores, d => d.score);

        // Top 5 songs
        const topSongs = songScores.slice(0, 5);
        createChart("#top-songs-chart", topSongs, "Top 5 Songs for you", "#64dd43", maxScore);

        // Create charts for bottom 5 songs
        const bottomSongs = songScores.slice(-5).reverse();
        createChart("#bottom-songs-chart", bottomSongs, "Bottom 5 Songs based on your answers", "#ff6b6b", maxScore);

        function createChart(selector, data, title, color, maxScore) {
            // Create SVG
            const svg = d3.select(selector)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Create scales
            const x = d3.scaleBand()
                .domain(data.map(d => d.name))
                .range([0, width])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, maxScore])
                .range([height, 0]);

            // Add the y-axis label (Brat Score)
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -(height / 2))
                .attr("text-anchor", "middle")
                .attr("fill", "#FFFFFF")
                .attr("font-size", "24px")
                .text("Brat Score");

            // Add bars with tooltip interaction
            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.name))
                .attr("y", d => y(d.score))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.score))
                .attr("fill", color)
                .attr("opacity", 0.8)
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(
                        `<div style="display: grid; grid-template-columns: 120px auto; gap: 10px;">
            <div style="text-align: left;">danceability:</div><div>${d.danceability.toFixed(2)}</div>
            <div style="text-align: left;">energy:</div><div>${d.energy.toFixed(2)}</div>
            <div style="text-align: left;">valence:</div><div>${d.valence.toFixed(2)}</div>
        </div>`
                    )
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");

                    d3.select(this)
                        .attr("opacity", 1);
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);

                    d3.select(this)
                        .attr("opacity", 0.8);
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                });

            svg.selectAll(".song-label")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "song-label")
                .attr("x", d => x(d.name) + x.bandwidth() / 2)
                .attr("y", height + 40)
                .attr("text-anchor", "middle")
                .attr("fill", "#FFFFFF")
                .style("font-size", "22px")
                .each(function(d) {
                    const text = d3.select(this);
                    const words = d.name.split(' ');

                    text.text('');

                    let tspan = text.append('tspan')
                        .attr("x", x(d.name) + x.bandwidth() / 2)
                        .attr("dy", 0)
                        .style("font-size", "22px")
                        .text(words[0]);

                    let lineNumber = 0;
                    let line = words[0];

                    for(let i = 1; i < words.length; i++) {
                        let testLine = line + " " + words[i];
                        if (testLine.length * 12 > x.bandwidth()) {
                            lineNumber++;
                            line = words[i];
                            tspan = text.append('tspan')
                                .attr("x", x(d.name) + x.bandwidth() / 2)
                                .attr("dy", "1.4em")
                                .style("font-size", "22px")
                                .text(words[i]);
                        } else {
                            line = testLine;
                            tspan.text(line);
                        }
                    }
                });

            // Add scores above bars
            svg.selectAll(".score-label")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "score-label")
                .attr("x", d => x(d.name) + x.bandwidth() / 2)
                .attr("y", d => y(d.score) - 10)
                .attr("text-anchor", "middle")
                .attr("fill", "#FFFFFF")
                .attr("font-size", "14px")
                .text(d => d.score.toFixed(2));

            // Add title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -40)
                .attr("text-anchor", "middle")
                .attr("fill", "#FFFFFF")
                .attr("font-size", "32px")
                .attr("font-weight", "bold")
                .text(title);
        }
    }

    // Function to calculate scores based on answers
    function calculateScores(answers) {
        const weights = {
            danceability: 0.4,
            energy: 0.3,
            valence: 0.2,
            tempo: 0.1
        };

        return songsData.map((song) => {
            let score = 0;

            // Question 1: Music preference
            if (answers["question-1"] === "danceability") {
                score += song.danceability * weights.danceability;
            } else if (answers["question-1"] === "energy") {
                score += song.energy * weights.energy;
            } else if (answers["question-1"] === "valence") {
                score += song.valence * weights.valence;
            }

            // Question 2: Vibe preference
            if (answers["question-2"] === "acousticness") {
                score += (1 - song.energy) * weights.energy;
            } else if (answers["question-2"] === "danceability") {
                score += song.danceability * weights.danceability;
            } else if (answers["question-2"] === "instrumentalness") {
                score += song.energy * weights.energy;
            }

            // Question 3: Expression
            if (answers["question-3"] === "explicit") {
                score += song.energy * weights.energy;
            } else if (answers["question-3"] === "speechiness") {
                score += (1 - song.valence) * weights.valence;
            } else if (answers["question-3"] === "valence") {
                score += song.valence * weights.valence;
            }

            // Question 4: Tempo preference
            if (answers["question-4"] === "slow") {
                score += (song.tempo < 100 ? 1 : 0) * weights.tempo;
            } else if (answers["question-4"] === "medium") {
                score += ((song.tempo >= 100 && song.tempo <= 130) ? 1 : 0) * weights.tempo;
            } else if (answers["question-4"] === "fast") {
                score += (song.tempo > 130 ? 1 : 0) * weights.tempo;
            }

            // Question 5: What matters most
            if (answers["question-5"] === "danceability") {
                score += song.danceability * weights.danceability;
            } else if (answers["question-5"] === "valence") {
                score += song.valence * weights.valence;
            } else if (answers["question-5"] === "energy") {
                score += song.energy * weights.energy;
            }

            return { ...song, score };
        }).sort((a, b) => b.score - a.score);
    }
});

function showBarCharts() {
    // Show the Bar Charts section and hide the Ranking section
    document.getElementById('barChartsSection').style.display = 'block';
    document.getElementById('rankingSection').style.display = 'none';

    // Highlight the active button
    document.getElementById('barChartsButton').style.backgroundColor = '#ddd';
    document.getElementById('rankingButton').style.backgroundColor = '';
}


function showRanking() {
    // Hide the Bar Charts section and show the Ranking section
    document.getElementById('barChartsSection').style.display = 'none';
    document.getElementById('rankingSection').style.display = 'block';

    // Highlight the active button
    document.getElementById('barChartsButton').style.backgroundColor = '';
    document.getElementById('rankingButton').style.backgroundColor = '#ddd';

    // Dynamically populate the ranking list
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';

    // Use the quiz answers to get the scores
    const songScores = calculateScores(answers);

    // Sort the songs by score and generate the ranked list
    songScores.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${song.name} - ${song.score.toFixed(2)}`;
        rankingList.appendChild(listItem);
    });
}



function resetQuiz(event) {
    event.preventDefault();

    // Reset quiz to initial state
    currentQuestionIndex = 0;
    answers = {};

    // Reload all questions to initial state
    questions.forEach((question, index) => {
        if (index === 0) {
            question.classList.remove("hidden");
        } else {
            question.classList.add("hidden");
        }
    });

    // Reset next button to initial state
    const nextButton = document.getElementById("next-button");
    nextButton.textContent = "Next";
    nextButton.style.display = "block";
    nextButton.disabled = true;

    // Hide results section
    document.getElementById("quiz-result").classList.add("hidden");

    // Reset all selected buttons
    document.querySelectorAll(".star-button").forEach(btn => {
        btn.classList.remove("selected");
    });

    // Stay in quiz section
    document.getElementById("quiz-section").scrollIntoView({ behavior: "smooth" });
}




// The quiz determines the user's perfect song match from Charli XCX's Brat album by aligning the answers to specific musical
// attributes of each track, building a personalized profile of preferences. Each response they give directly influences
// how certain attributes like danceability, energy, valence (positivity or happiness), tempo (speed), and other unique qualities
// are weighted in finding the ideal track for a user. For example, in Question 1, when asked how they like their music,
// selecting "Danceable & Groovy" strongly increases the danceability attribute by +1, prioritizing tracks that make the user want to move.
// If they choose "High Energy & Intense," the energy attribute is boosted by +1, signaling a love for bold, powerful tracks, while "Upbeat & Happy"
// emphasizes the valence attribute with +1, focusing on cheerful, happy songs that radiate positivity. Moving to Question 2, which asks about the user's ideal vibe,
// selecting "Chill & Relaxed" increases valence slightly by +0.5 while decreasing tempo by -1, reflecting a preference for slower, more relaxed songs with a chill aesthetic.
// Opting for "Party & Fun" strongly prioritizes both danceability and energy, increasing each by +1 for high-energy, lively tracks that fit a party atmosphere.
// Choosing "Experimental & Unique" raises instrumentalness by +1, focusing on more creative, unique tracks, while slightly reducing energy by -0.5 to reflect a
// preference for complexity over intensity. In Question 3, the user is asked how they express themselves. If they select "Raw & Unfiltered," it increases the explicit attribute by +1,
// pointing toward tracks with unfiltered, edgy lyrics. Choosing "Deep & Emotional" raises speechiness by +1, which highlights tracks with more spoken-word or narrative qualities,
// while "Playful & Light" adds +1 to valence, reflecting songs with a whimsical, cheerful tone. Question 4 focuses on tempo, where choosing "Slow & Steady" decreases the tempo attribute by -1
// for slower tracks, "Medium Pace" leaves tempo unchanged, and "Fast & Energetic" increases it by +1, favoring upbeat and faster songs. Lastly, in Question 5, the user is asked what matters most in a song.
// Selecting "The Beat" increases the danceability attribute by +1. Choosing "The Mood" increases valence by +1, giving weight to the emotional tone and positivity of a track, while "The Production" increases
// energy by +1, focusing on high-energy, polished songs with impactful production. The quiz takes this profile and compares it to the attributes of every song on the album. To ensure fairness, song attributes like tempo, danceability,
// and energy are normalized to a 0-to-1 scale. A compatibility score is calculated for each song using a weighted formula that prioritizes the attributes most important to the user. For example, danceability might carry more weight if
// they selected "The Beat," while valence could be weighted higher if they prioritized "The Mood." The song with the highest compatibility score is revealed as the perfect match, along with its title, key attributes, and a YouTube video link.
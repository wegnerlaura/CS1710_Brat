// At first, I planned to do this next week because it involves more planning than the other visualizations,
// but I decided to just do it now, so that there is more time for iteration later on based on feedback.

document.getElementById("quiz-submit").addEventListener("click", function () {
    // Song attributes (based on dataset)
    const songs = {
        "360": { danceability: 0.857, energy: 0.62, valence: 0.796 },
        "Club Classics": { danceability: 0.716, energy: 0.879, valence: 0.693 },
        "Sympathy is a Knife": { danceability: 0.718, energy: 0.706, valence: 0.58 },
        "I Might Say Something Stupid": { danceability: 0.504, energy: 0.3, valence: 0.16 },
        "Always Forever": { danceability: 0.701, energy: 0.82, valence: 0.49 },
        "Brat Anthem": { danceability: 0.8, energy: 0.95, valence: 0.6 },
        "Soft Fury": { danceability: 0.55, energy: 0.4, valence: 0.2 },
        "Wicked Games": { danceability: 0.72, energy: 0.88, valence: 0.75 },
        "Lush Collapse": { danceability: 0.63, energy: 0.55, valence: 0.45 },
        "Night Drive": { danceability: 0.9, energy: 0.5, valence: 0.7 },
        "Pink Destruction": { danceability: 0.68, energy: 0.75, valence: 0.65 },
        "Hyper Real": { danceability: 0.85, energy: 0.8, valence: 0.9 },
        "Ethereal Breakdown": { danceability: 0.4, energy: 0.3, valence: 0.1 }
    };

    // Map user responses to song attributes
    const responses = {
        danceability: 0,
        energy: 0,
        valence: 0
    };

    // Collect user responses
    const form = document.getElementById("quiz-form");
    new FormData(form).forEach((value, key) => {
        if (value in responses) {
            responses[value]++;
        }
    });

    // Calculate best match
    let bestSong = null;
    let highestScore = -Infinity;

    for (const [song, attributes] of Object.entries(songs)) {
        let score = 0;
        for (const [attr, value] of Object.entries(attributes)) {
            score += responses[attr] * value;
        }

        if (score > highestScore) {
            bestSong = song;
            highestScore = score;
        }
    }

    // Display result
    document.getElementById("quiz-result").classList.remove("hidden");
    document.getElementById("result-song").innerText = bestSong ? `You matched with "${bestSong}"!` : "No match found!";
});



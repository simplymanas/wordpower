let wordChain = [];
let score = 0;
let badges = [];

document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const goButton = document.getElementById('goButton');
    const clearButton = document.getElementById('clearButton');

    goButton.addEventListener('click', addToChain);
    clearButton.addEventListener('click', clearChain);

    // Add event listener for "Enter" key
    wordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addToChain();
        }
    });
});

async function addToChain() {
    const wordInput = document.getElementById('wordInput');
    const wordChainDiv = document.getElementById('wordChain');
    const scoreValue = document.getElementById('scoreValue');
    const achievementsDiv = document.getElementById('achievements');
    const flashDiv = document.getElementById('flash');

    const userEnteredWord = wordInput.value.trim();

    if (userEnteredWord !== '' && (wordChain.length === 0 || userEnteredWord.toLowerCase().startsWith(wordChain[wordChain.length - 1].slice(-1).toLowerCase()))) {
        if (!wordChain.includes(userEnteredWord)) {
            wordChain.push(userEnteredWord);
            wordInput.value = '';
            await suggestWord();
            displayWordChain();
            updateScore();
            updateBadge();
            if (score % 10 === 0) {
                flashDiv.textContent = 'Bravo!';
                setTimeout(() => {
                    flashDiv.textContent = '';
                }, 1000);
            }
        } else {
            alert('Invalid word. This word is already in the chain. Enter a different word.');
        }
    } else {
        alert('Invalid word. Please enter a word starting with the last letter of the previous word.');
    }
}

function clearChain() {
    wordChain = [];
    score = 0;
    badges = [];
    displayWordChain();
    updateScore();
    updateBadge();
}

function updateScore() {
    const scoreValue = document.getElementById('scoreValue');
    score += 1;
    scoreValue.textContent = score;
}

function updateBadge() {
    const achievementsDiv = document.getElementById('achievements');
    const flashDiv = document.getElementById('flash');

    if (score >= 10 && score % 10 === 0) {
        const emojiBadge = generateRandomEmoji();
        badges.push(emojiBadge);
        achievementsDiv.textContent = `Achievements: ${badges.join(' ')}`;
    }
}

function generateRandomEmoji() {
    // Replace this array with a larger set of emojis if desired
    const emojis = ['😎', '🏆', '🥳', '🌟', '🎉', '🚀', '💡', '👍', '❤️', '🎈', '👏', '🤩'];

    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
}

async function suggestWord() {
    const lastWord = wordChain[wordChain.length - 1].slice(-1).toLowerCase();

    try {
        const response = await fetch(`https://api.datamuse.com/words?sp=${lastWord}*`);
        const data = await response.json();

        const suggestedWords = data.filter(word => !wordChain.includes(word.word));

        if (suggestedWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * suggestedWords.length);
            const suggestedWord = suggestedWords[randomIndex].word;
            wordChain.push(suggestedWord);
        }
    } catch (error) {
        console.error('Error fetching word suggestions:', error);
    }
}

function displayWordChain() {
    const wordChainDiv = document.getElementById('wordChain');
    wordChainDiv.innerHTML = ''; // Clear previous content

    wordChain.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = capitalizeFirstLetter(word);
        span.style.color = generateRandomColor();
        wordChainDiv.appendChild(span);

        // Add arrow (except for the last word)
        if (index < wordChain.length - 1) {
            const arrow = document.createElement('span');
            arrow.textContent = ' ➔ ';
            wordChainDiv.appendChild(arrow);
        }
    });
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

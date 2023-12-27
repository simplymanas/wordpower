let wordChain = [];

async function addToChain() {
    const wordInput = document.getElementById('wordInput');
    const userEnteredWord = wordInput.value.trim();

    if (userEnteredWord !== '' && (wordChain.length === 0 || userEnteredWord.toLowerCase().startsWith(wordChain[wordChain.length - 1].slice(-1).toLowerCase()))) {
        if (!wordChain.includes(userEnteredWord)) {
            wordChain.push(userEnteredWord);
            wordInput.value = '';
            await suggestWord();
            displayWordChain();
        } else {
            alert('Invalid word. This word is already in the chain. Enter a different word.');
        }
    } else {
        alert('Invalid word. Please enter a word starting with the last letter of the previous word.');
    }
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
    wordChainDiv.innerHTML = wordChain.join(' ➔ ');
}

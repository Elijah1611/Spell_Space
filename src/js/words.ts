import axios from "axios";

class Words {
    public static wordGroupId: number = parseInt(window.location.search.replace('?id=', ''))
    public static async getWords() {
        try {
            const result = await axios.get(`http://localhost:5000/api/words/groups/${this.wordGroupId}`)
            const group = result.data
            const words = result.data.words
            console.log(words)

            const title = document.querySelector('.title-outline')
            const wordSection = document.querySelector('.word-list-section')

            title.innerHTML = `${group.name} words`
            wordSection.innerHTML = this.buildWordListElement(words)
        } catch (err) {
            console.log(err)
        }
    }

    private static buildWordListElement(words) {
        // <img src="./img/TwoStar.svg" class="stars" /> -> Star Image

        return words.map(w => (
            `<a href="index.html">
            <div class="word-list-card">
                <h2>${w.text}</h2>
            </div>
            </a>`
        )).join('')
    }
}

Words.getWords()
import axios from "axios";

class Words {
    public static wordGroupId: number = parseInt(window.location.search.replace('?id=', ''))
    private static starImages = {
        0: 'https://firebasestorage.googleapis.com/v0/b/itemmanager-d1e2b.appspot.com/o/ZeroStars.svg?alt=media&token=361e7948-541b-42bb-8a95-eae6b8e551f9',
        1: 'https://firebasestorage.googleapis.com/v0/b/itemmanager-d1e2b.appspot.com/o/OneStar.svg?alt=media&token=f8d49b19-4411-4bdc-b86f-1cb24d60bc60',
        2: 'https://firebasestorage.googleapis.com/v0/b/itemmanager-d1e2b.appspot.com/o/TwoStar.svg?alt=media&token=61f758ff-9dca-4edf-b221-c7612f54ba11',
        3: 'https://firebasestorage.googleapis.com/v0/b/itemmanager-d1e2b.appspot.com/o/ThreeStar.svg?alt=media&token=bd493d7e-e101-4436-895c-4a14b8e99915'
    }

    public static async getWords() {
        try {
            const groupResult = await axios.get(`http://localhost:5000/api/words/groups/${this.wordGroupId}`)
            const group = groupResult.data
            const words = groupResult.data.words

            const userId = localStorage.getItem('userId')
            const quizResult = await axios.get(`http://localhost:5000/api/quiz/user/${userId}`)
            const quizzes = quizResult.data
            const starRatings = quizzes.map(q => ({ word: q.word.text, wordId: q.word.id, rating: q.star_level }))
            console.log(quizzes)
            console.log(starRatings)

            const title = document.querySelector('.title-outline')
            const wordSection = document.querySelector('.word-list-section')

            title.innerHTML = `${group.name}`
            wordSection.innerHTML = this.buildWordListElement(words, starRatings)
        } catch (err) {
            console.log(err)
        }
    }

    private static buildWordListElement(words, ratings) {
        const ratingElement = (rating) => ({
            1: `<img src="${this.starImages[rating]}" class="stars" />`,
            2: `<img src="${this.starImages[rating]}" class="stars" />`,
            3: `<img src="${this.starImages[rating]}" class="stars" />`
        }[rating])

        
        return words.map(w => (
            `<a href="index.html">
            ${ratingElement(ratings.filter(r => r.wordId === w.id)[0].rating)}
            <div class="word-list-card">
                <h2>${w.text}</h2>
            </div>
            </a>`
        )).join('')
    }
}

Words.getWords()
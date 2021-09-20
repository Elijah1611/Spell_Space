import axios from "axios";
import { User } from "./user";
import { docQuery, starRatingImageUrls } from './helpers'

class Words {
    public static wordGroupId: number = parseInt(window.location.search.replace('?id=', ''))
    private static words = [];
    private static quizzes = [];
    
    public static async getWords() {
        try {
            const groupResult = await axios.get(`http://${process.env.HOST}/api/words/groups/${this.wordGroupId}`)
            const group = groupResult.data
            this.words = groupResult.data.words

            docQuery('#group-remove a').setAttribute('href', `group-remove.html?id=${group.id}`)
            docQuery('#word-add a').setAttribute('href', `word-add.html?id=${group.id}`)
            docQuery('#word-remove a').setAttribute('href', `word-remove.html?id=${group.id}`)
            docQuery('#group-edit a').setAttribute('href', `group-edit.html?id=${group.id}`)
            docQuery('#group-remove a').setAttribute('href', `group-remove.html?id=${group.id}`)
            
            const title = document.querySelector('.title-outline')
            const wordSection = document.querySelector('.word-list-section')
            
            title.innerHTML = `${group.name}`
            
            const userId = localStorage.getItem('userId')
            const quizResult = await axios.get(`http://${process.env.HOST}/api/quiz/user/${userId}`)
            this.quizzes = quizResult.data
            
            console.log(quizResult)
            
            wordSection.innerHTML = this.buildWordListElement(this.words, this.quizzes)
        } catch (err) {
            const groupResult = await axios.get(`http://${process.env.HOST}/api/words/groups/${this.wordGroupId}`)
            this.words = groupResult.data.words
            const wordSection = document.querySelector('.word-list-section')
            wordSection.innerHTML = this.buildWordListElement(this.words, this.quizzes)

            console.log(err)
        }
    }
    
    private static getStarLevelImage(quizzes, wordId) {
        const quizRatingForWord = quizzes.filter(q => q.word.id === wordId)[0]?.star_level || 0
        return starRatingImageUrls[quizRatingForWord]
    }
    
    private static buildWordListElement(words, quizzes) {
        
        if (words.length === 0) {
            return "<h1 style='text-align: center; color: #fff;'>No Words Here.</h1>"
        }
        
        return words.map(w => (
            `<a href="word-preview.html?id=${w.id}">
            <img src="${this.getStarLevelImage(quizzes, w.id)}" class="stars" width="50px" />
            <div class="word-list-card">
            <h2>${w.text}</h2>
            </div>
            </a>`
            )).join('')
        }
    }
    
    
    const main = () => {
        if (localStorage.getItem('token')) {
            Words.getWords()
            User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()
import axios from "axios";
import { User } from "./user";
import { docQuery } from './helpers'

class WordRemove {
    public static wordGroupId: number = parseInt(window.location.search.replace('?id=', ''))

    public static async getWords() {
        try {
            const groupResult = await axios.get(`http://localhost:5000/api/words/groups/${this.wordGroupId}`)
            const group = groupResult.data
            const words = groupResult.data.words
            let markedForRemovalId = null

            const title = docQuery('.title-outline')

            title.innerHTML = `${group.name}`

            User.loadUserStars()

            docQuery('.word-del-input').addEventListener('keyup', (e) => {
                const word = e.target.value
                console.log(word)
                const results = words.filter(w => w.text.toUpperCase() == word.toUpperCase())

                if (results.length > 0) {
                    console.log('Match Found')
                    docQuery('#result-msg').innerHTML = 'Match Found'
                    markedForRemovalId = results[0].id
                    docQuery('.remove-btn').classList.remove('hide')
                    docQuery('.remove-btn').classList.add('show')
                }
                else {
                    console.log('No Match Found')
                    docQuery('#result-msg').innerHTML = 'No Match Found'
                    docQuery('.remove-btn').classList.remove('show')
                    docQuery('.remove-btn').classList.add('hide')
                    markedForRemovalId = null
                }
            })

            docQuery('.remove-btn').addEventListener('click', async (e) => {
                e.preventDefault()

                if (markedForRemovalId){
                    console.log('deleting...', markedForRemovalId)
                    const test = await axios.delete(`http://localhost:5000/api/words/${markedForRemovalId}`) 
                    console.log(test)
                    window.location.href = `/word-list.html?id=${this.wordGroupId}`
                }
                else {
                    console.log('no delete word')
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
}

WordRemove.getWords()
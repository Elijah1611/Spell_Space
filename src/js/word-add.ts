import axios from "axios";
import { User } from "./user";
import { docQuery } from './helpers'

class WordAdd {
    public static wordGroupId: number = parseInt(window.location.search.replace('?id=', ''))

    private static newWord: string = null

    public static async addWord() {
        try {
            docQuery('.word-add-input').addEventListener('change', (e) => {
                const word = e.target.value
                this.newWord = word.toLowerCase()
            })

            docQuery('.add-btn').addEventListener('click', async (e) => {
                try {
                    e.preventDefault()
                    const result = await axios.post(`http://${process.env.HOST}/api/words/`, {
                        word: this.newWord,
                        group_id: this.wordGroupId
                    }) 

                    console.log(result.data)
                    const newWord = result.data
                    window.location.href = `/word-preview.html?id=${newWord.id}`
                } catch (err) {
                    console.log(err)
                    docQuery('#error').innerHTML = `${err}`
                }
            })
        } catch (err) {
            console.log(err)
            docQuery('#error').innerHTML = `${err}`
        }
    }
}

const main = () => {
    if (localStorage.getItem('token')) {
        WordAdd.addWord()
        User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()
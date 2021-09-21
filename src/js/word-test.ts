import axios from "axios";
import { User } from './user'
import { docQuery, docQueryAll } from './helpers'
import humanize from "humanize-duration";
import { starRatingImageUrls } from './helpers'
import dayjs from "dayjs";

export class WordTest {
    public static wordId: number = parseInt(window.location.search.replace('?id=', ''))
    public static audioForError = 'https://soundbible.com/mp3/Computer%20Error-SoundBible.com-1655839472.mp3';

    private static word: string;
    private static wordGroupId: number;
    private static definition: string;
    private static wordAudio: string;
    private static groupName: string;
    private static quizList;
    private static highestStarLevel: number;
    private static latestQuiz;
    private static totalQuizTime: number;

    private static starLevelElement = docQuery('#starLevel')
    private static lastTestedDateElement = docQuery('#lastTested span')
    private static lastQuizTimeElement = docQuery('#lastQuizTime span')
    private static totalQuizTimeElement = docQuery('#totalQuizTime span')
    private static quizCountElement = docQuery('#quizCount span')

    private static wordTitleElement = docQuery('.title-outline')
    private static wordDefinitionElement = docQuery('#def')
    private static wordAudioElement = docQuery('#wordAudio')
    private static wordAudioErrorElement = docQuery('#wordAudioError')
    private static wordAudioImgElement = docQuery('#wordAudio img')
    private static wordGroupElement = docQuery('#wordGroup')

    private static testButtonElement = docQuery('.test-controls a')
    private static spellingFormElement = docQuery('#spelling-input-form')
    private static spellingInputElement = docQuery('.spelling-input')
    private static letterCountElement = docQuery('.letter-count')
    private static quizFails = 0
    private static timerState = 15

    private static async fetchWordDetails() {
        try {
            const result = await axios.get(`${process.env.HOST}/api/words/${this.wordId}`)
            const word = result.data

            const {text, definition, audio_url, group } = word

            console.log(word)

            this.word = text
            this.definition = definition
            this.wordAudio = audio_url
            this.groupName = group.name
            this.wordGroupId = group.id
            this.wordGroupElement.innerHTML = this.groupName
            this.wordId = word.id
        } catch (e) {
            console.log(e)
        }
    }

    private static async fetchQuizDetails() {
        try {
            const userId = localStorage.getItem('userId')
            const result = await axios.get(`${process.env.HOST}/api/quiz/user/${userId}`)
            const quizList = result.data

            const wordQuizList = quizList.filter(q => q.word.text === this.word)

            this.quizList = wordQuizList

            if (wordQuizList.length === 0) return

            this.latestQuiz = this.sortQuizListOnDate(wordQuizList)
            this.totalQuizTime = this.calculateTotalQuizTime(wordQuizList)
            this.highestStarLevel = this.sortQuizListOnStars(wordQuizList).star_level

            console.log(this.quizList)
            console.log(this.latestQuiz)
            console.log(this.totalQuizTime)
            console.log(this.highestStarLevel)
        } catch (e) {
            console.log(e)
        }
    }

    private static sortQuizListOnDate(quizList) {
        return quizList.sort((a, b) => {
            return new Date(a.created_at).getUTCMilliseconds() - new Date(b.created_at).getUTCMilliseconds()
        })[0]
    }

    private static sortQuizListOnStars(quizList) {
        return quizList.sort((a, b) => {
            return a.star_level < b.star_level
        })[0]
    }

    private static calculateTotalQuizTime(quizList): number {
        const getSum = (total, num) => total + num
        console.log(quizList.map(q => q.elapsed_time).reduce(getSum, 0))
        return quizList.map(q => q.elapsed_time).reduce(getSum, 0)
    }

    private static makeStarRatingImageElement() {
        const imgUrl = starRatingImageUrls[this.latestQuiz?.star_level || 0]
        return `<img src="${imgUrl}" width="148" alt="Star Level">`
    }

    public static async handleWordAudio() {
        let audio = null

        this.wordAudioImgElement.addEventListener('click', (e) => {
            console.log(this.wordAudio)
            try {
                audio = new Audio(this.wordAudio);

                if (audio) {
                    audio.play();
                }

                audio.onerror = () => {
                    audio = new Audio(this.audioForError)
                    audio.play();
                    this.wordAudioErrorElement.classList.remove('hide')
                    this.wordAudioErrorElement.classList.add('show')
                    throw "Failed to load word audio."
                }
            } catch (e) {
                audio = new Audio(this.audioForError)
                audio.play();
                console.log(e)
            }
        })
    }

    private static checkSpellingInput() {
        this.spellingFormElement.addEventListener('submit', async (e) => {
            e.preventDefault()

            const spelledWord: string = e.target[0].value

            console.log(spelledWord)

            if (spelledWord.toUpperCase() === this.word.toUpperCase()) {
                const userId = localStorage.getItem('userId')

                const results = await axios.post(`${process.env.HOST}/api/quiz/`, {
                    star_level: 3 - this.quizFails,
                    elapsed_time: (15 - this.timerState) * 1000,
                    user_id: userId,
                    word_id: this.wordId
                })

                console.log(results.data)
                window.location.href = `/pass.html?id=${this.wordId}&fails=${this.quizFails}&group=${this.wordGroupId}`
            } 
            else {
                this.quizFails += 1
                this.handleFails()
                if (this.quizFails === 3) {
                    window.location.href = `/fail.html?id=${this.wordId}&group=${this.wordGroupId}`
                }
            }
        })
    }

    private static handleLetterCount() {
        this.letterCountElement.innerHTML = `Letter Count 0/${this.word.length}`

        this.spellingInputElement.addEventListener('keyup', (e: any) => {
            const typedWord = e.target.value

            this.letterCountElement.innerHTML = `Letter Count ${typedWord.length}/${this.word.length}`
        })
    }

    private static handleBackButton() {
        docQuery('.close-btn').setAttribute('href', `/word-preview.html?id=${this.wordId}`)
    }

    private static handleFails() {
        const failImg = 'https://firebasestorage.googleapis.com/v0/b/itemmanager-d1e2b.appspot.com/o/Failed.svg?alt=media&token=3ce044cd-89e8-42aa-a516-3061c757fed3'
        const failList = [docQuery('#fail-icon-1'), docQuery('#fail-icon-2'), docQuery('#fail-icon-3')]

        failList[(this.quizFails-1 || 0)].setAttribute('src', failImg)
    }

    private static startQuizTimer() {
        let seconds = 15
        const timerElement = docQuery('.timer')

        const timer = () => {
            if (seconds < 0) {
                clearInterval(intervalId)
                timerElement.innerHTML = 'Out of Time!'
                window.location.href = `/fail.html?id=${this.wordId}`
                return
            }

            timerElement.innerHTML = seconds.toString()
            this.timerState = seconds
            seconds-- 
        }

        const intervalId = setInterval(timer, 1000)
    }

    public static async loadWordPreviewPage() {
        await this.fetchWordDetails()
        await this.fetchQuizDetails()

        this.wordTitleElement.innerHTML = this.word;
        this.wordDefinitionElement.innerHTML = this.definition
        this.starLevelElement.innerHTML = this.makeStarRatingImageElement()

        await this.handleWordAudio()
        this.testButtonElement.setAttribute('href', `./testing.html?id=${this.wordId}`)
        

        if (!this.latestQuiz) return

        this.quizCountElement.innerHTML = this.quizList.length
        this.lastTestedDateElement.innerHTML = dayjs(this.latestQuiz.created_at).format('MMM D, YYYY h:ma (Z)')
        this.lastQuizTimeElement.innerHTML = humanize(this.latestQuiz.elapsed_time, { round: true });
        this.totalQuizTimeElement.innerHTML = humanize(this.totalQuizTime, { round: true });



    }

    

    public static async loadWordQuizPage() {
        await this.fetchWordDetails()

        // const wordBlur = this.word[0] + this.word.slice(1).split('').map(x=>'*').join('')

        this.wordTitleElement.innerHTML = `Testing`

        await this.handleWordAudio()

        this.checkSpellingInput()
        this.handleLetterCount()
        this.handleBackButton()

        this.startQuizTimer()
    }
}

const main = () => {
    if (localStorage.getItem('token')) {
        if (window.location.pathname.includes('word-preview')) {
            User.loadUserStars()
            WordTest.loadWordPreviewPage()
        }
        
        if (window.location.pathname.includes('testing')) {
            User.loadUserStars()
            WordTest.loadWordQuizPage() 
        }
    } 
    else {
        window.location.href = "/signin.html";
    }
}

main()
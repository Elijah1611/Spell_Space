import axios from "axios";
import { docQuery } from "./helpers";
import { starRatingImageUrls } from './helpers'
import { User } from "./user";
import humanize from 'humanize-duration'
import day from 'dayjs'

class Quizzes {
    public static async getQuizzes() {
        try {
            const userId = window.localStorage.getItem('userId')
            const result = await axios.get(`${process.env.HOST}/api/quiz/user/${userId}`)
            const quizzes = result.data

            console.log(quizzes)

            const quizListSection = docQuery('.quiz-list-section')

            quizListSection.innerHTML = this.buildQuizList(quizzes)
        } catch (err) {
            console.log(err)
        }
    }

    private static buildQuizList(quizzes) {
        return quizzes
        .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map(q => (
            `<div class="quiz-block">
            <img src="${starRatingImageUrls[q.star_level]}" class="stars" width="50px" />
            <div class="quiz-card">
                <h2><span>${q.word.text}</span></h2>
                <p>${q.word.group.name}</p>
                <p>${humanize(q.elapsed_time)}</p>
                <p>${day(q.created_at).format('MMM D, YYYY h:mm A (Z)')}</p>
            </div>
        </div>`
        )).join('')
    }
}

const main = () => {
    if (localStorage.getItem('token')) {
        Quizzes.getQuizzes()
        User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()

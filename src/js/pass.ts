import { starRatingImageUrls } from './helpers'
import { docQuery } from './helpers'
import { User } from './user'

const passPage = () => {
    const wordId: number = parseInt(window.location.search.split('&')[0].replace('?id=', ''))
    const fails: number = parseInt(window.location.search.split('&')[1].replace('fails=', ''))
    const groupId: number = parseInt(window.location.search.split('&')[2].replace('group=', ''))

    const rewardedStars: number = (3 - fails)

    console.log(rewardedStars)

    docQuery('#restart').setAttribute('href', `/testing.html?id=${wordId}`)
    docQuery('#words').setAttribute('href', `/word-list.html?id=${groupId}`)
    docQuery('#words h2').innerHTML = `Word List`
    docQuery('#stars').setAttribute('src', starRatingImageUrls[rewardedStars])
}

const main = () => {
    if (localStorage.getItem('token')) {
        passPage()
        User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()
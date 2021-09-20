import { docQuery } from './helpers'
import { User } from './user'

function failPage() {
    const wordId = parseInt(window.location.search.replace('?id=', ''))
    const groupId: number = parseInt(window.location.search.split('&')[1].replace('group=', ''))
    document.querySelector('#restart').setAttribute('href', `/testing.html?id=${wordId}`)
    document.querySelector('#words').setAttribute('href', `/word-list.html?id=${groupId}`)

    
    docQuery('#words h2').innerHTML = `Word List`

    User.loadUserStars()
}


const main = () => {
    if (localStorage.getItem('token')) {
        failPage()
        User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()
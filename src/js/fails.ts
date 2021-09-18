import { User } from './user'

function failPage() {
    const wordId = parseInt(window.location.search.replace('?id=', ''))
    document.querySelector('#restart').setAttribute('href', `/testing.html?id=${wordId}`)
    document.querySelector('#words').setAttribute('href', `/word-list.html?id=${wordId}`)

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
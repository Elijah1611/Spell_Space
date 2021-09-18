import { User } from './user'

function main() {
    const wordId = parseInt(window.location.search.replace('?id=', ''))
    document.querySelector('#restart').setAttribute('href', `/testing.html?id=${wordId}`)
    document.querySelector('#words').setAttribute('href', `/word-list.html?id=${wordId}`)

    User.loadUserStars()
}

main()
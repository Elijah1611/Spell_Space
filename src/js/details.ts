import {User} from './user'

const main = () => {
    if (localStorage.getItem('token')) {
        User.loadDetailsPage()
    } else {
        window.location.href = "/signin.html";
    }
}

main()
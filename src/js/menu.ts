import axios from "axios";
import { User } from './user'

const main = () => {
    if (localStorage.getItem('token')) {
        User.loadUserStars()
        User.loadMenuPage()
    } else {
        window.location.href = "/signin.html";
    }
}

main()
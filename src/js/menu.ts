import axios from "axios";
import { User } from './user'

const logout = () => {
    const logoutBtn = document.querySelector('#logout')
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        window.location.href = "/index.html";
    })
}

const main = () => {
    if (localStorage.getItem('token')) {
        User.loadUserStars()
        User.loadMenuPage()
        logout()
    } else {
        window.location.href = "/signin.html";
    }
}

main()
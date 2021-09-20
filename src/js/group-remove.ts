import axios from "axios";
import { User } from "./user";
import { docQuery } from './helpers'

class GroupRemove {
    public static wordGroupId: number = parseInt(window.location.search.replace('?id=', ''))

    public static async removeGroup() {
        try {
            const groupResult = await axios.get(`http://localhost:5000/api/words/groups/${this.wordGroupId}`)
            const group = groupResult.data

            const title = document.querySelector('.title-outline')
            title.innerHTML = `${group.name}`
            
            docQuery('.remove-btn').addEventListener('click', async (e) => {
                e.preventDefault()
                const gid = parseInt(window.location.search.replace('?id=', ''))
                console.log(gid)
                const test = await axios.delete(`http://localhost:5000/api/words/groups/${gid}`) 
                console.log(test)
                window.location.href = `/word-groups.html`
            })
        } catch (err) {
            console.log(err)
        }
    }
}

const main = () => {
    if (localStorage.getItem('token')) {
        GroupRemove.removeGroup()
        User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()

import axios from "axios";
import { User } from "./user";
import { docQuery } from './helpers'

class GroupAdd {
    private static newGroup: string = null

    public static async addGroup() {
        try {
            docQuery('.word-add-input').addEventListener('change', (e) => {
                const newGroupName = e.target.value
                this.newGroup = newGroupName.toLowerCase()
            })

            docQuery('.add-btn').addEventListener('click', async (e) => {
                e.preventDefault()
                    const result = await axios.post(`http://localhost:5000/api/words/groups/`, {
                        "name": this.newGroup
                    }) 

                    console.log(result.data)
                    window.location.href = `/word-groups.html`
            })
        } catch (err) {
            console.log(err)
        }
    }
}

const main = () => {
    if (localStorage.getItem('token')) {
        GroupAdd.addGroup()
        User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()

import axios from "axios";
import { User } from "./user";
import { docQuery } from './helpers'

class GroupEdit {
    private static newGroup: string = null

    public static async renameGroup() {
        try {
            docQuery('.word-add-input').addEventListener('change', (e) => {
                const newGroupName = e.target.value
                this.newGroup = newGroupName.toLowerCase()
            })

            docQuery('.add-btn').addEventListener('click', async (e) => {
                e.preventDefault()
                const groupId: number= parseInt(window.location.search.replace('?id=', ''))
                const result = await axios.put(`${process.env.HOST}/api/words/groups/${groupId}`, {
                    "name": this.newGroup,
                    "user_id": localStorage.getItem("userId")
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
        GroupEdit.renameGroup()
        User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()
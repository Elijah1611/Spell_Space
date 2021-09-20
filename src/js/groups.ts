import axios from "axios";
import { User } from "./user";

class WordGroups {
    public static async getGroups() {
        try {
            const userId = localStorage.getItem('userId')
            const result = await axios.get('http://localhost:5000/api/words/groups/')
            const groups = result.data.filter(g => g.user_id == userId)

            console.log(groups)

            const groupSection = document.querySelector('.word-group-section')

            if (groups.length > 0) {
                groupSection.innerHTML = this.buildWordGroupElement(groups)
            }
            else {
                groupSection.innerHTML = "<span class=\"no-content-text\">No Word Groups Available</span>"
            }
        } catch (err) {
            console.log(err)
        }
    }

    private static buildWordGroupElement(groups) {
        return groups.map(g => (
            `<a href="word-list.html?id=${g.id}">
                <div class="word-group-card">
                    <h2><span>${g.name}</span></h2>
                </div>
            </a>`
        )).join('')
    }
}

const main = () => {
    if (localStorage.getItem('token')) {
        WordGroups.getGroups()
        User.loadUserStars()
    } else {
        window.location.href = "/signin.html";
    }
}

main()

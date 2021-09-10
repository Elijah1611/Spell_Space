import axios from "axios";

class WordGroups {
    public static async getGroups() {
        try {
            const result = await axios.get('http://localhost:5000/api/words/groups/')
            const groups = result.data

            const groupSection = document.querySelector('.word-group-section')

            groupSection.innerHTML = this.buildWordGroupElement(groups)
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

WordGroups.getGroups()
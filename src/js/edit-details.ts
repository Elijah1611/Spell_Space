import { User } from './user'
import axios from "axios";
import { docQuery } from './helpers';

class EditUserForm {
    public static formElement = document.getElementById('edit-user-form');

    public static async submitForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData);
        console.log(formProps)
        try {
            const userId = localStorage.getItem('userId')
            const response = await axios.put(`http://${process.env.HOST}/api/users/${userId}`, formProps, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status == 200) {
                console.log(response)
                window.location.href = "/details.html";
            }
        } catch (e) {
            console.log(e)
            document.querySelector('.hint').classList.add('hint-error')
        }
    }

    public static activateForm(): void {
        if (localStorage.getItem('token') && localStorage.getItem('userId')) {
            this.formElement.addEventListener('submit', this.submitForm);
        } else {
            window.location.href = "/signin.html";
        }
    }

    public static handleAccountDelete() {
        docQuery('.remove-account-btn').addEventListener('click', async () => {
            const userId = localStorage.getItem('userId')
            const results = await axios.delete(`http://${process.env.HOST}/api/users/${userId}`)
            console.log(results.data)
            window.localStorage.removeItem('userId')
            window.localStorage.removeItem('token')
            window.location.href = '/index.html'
        })
    }
}


const main = () => {
    if (localStorage.getItem('token')) {
        User.loadEditDetailsPage()
    } else {
        window.location.href = "/signin.html";
    }
    EditUserForm.activateForm();
    EditUserForm.handleAccountDelete()
}

main()
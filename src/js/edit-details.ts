import {User} from './user'

import axios from "axios";

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
            const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formProps, {
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
        }
    }   

    public static activateForm(): void {
        if (localStorage.getItem('token') && localStorage.getItem('userId')) {
            this.formElement.addEventListener('submit', this.submitForm);
        } else {
            window.location.href = "/signin.html";
        }
    }
}


const main = () => {
    if (localStorage.getItem('token')) {
        User.loadEditDetailsPage()
    } else {
        window.location.href = "/signin.html";
    }
}

EditUserForm.activateForm();
main()
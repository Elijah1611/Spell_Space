import axios, { AxiosResponse } from "axios";

class SignUpForm {
    public static formElement = document.getElementById('signup-form');

    public static async submitForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData);

        const newUser = {
            location: "Earth",
            profile_image: "https://i.pravatar.cc/150?img=13",
            ...formProps,
        }
        
        try {
            const response = await axios.post(`${process.env.HOST}/api/auth/register/`, newUser);

            console.log(response)

            if (response.status == 201) {
                const {token, user} = response.data
                localStorage.setItem('token', token)
                localStorage.setItem('userId', user.id)
                window.location.href = "/details.html";
            }
        } catch (e) {
            const loginError = document.getElementById('login-error');
            const errorMessages = document.getElementById('error-messages');
            console.log(e)
            loginError.style.display = 'block'
            errorMessages.innerHTML = `[Error: ${e.message}]`
        }
    }   

    public static activateForm(): void {
        if (localStorage.getItem('token')) {
            window.location.href = "/details.html";
        } else {
            this.formElement.addEventListener('submit', this.submitForm);
        }
    }
}

SignUpForm.activateForm();
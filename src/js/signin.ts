import axios, { AxiosResponse } from "axios";

class SignInForm {
    public static formElement = document.getElementById('signin-form');

    public static async submitForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData);
        
        try {
            const response = await axios.post(`http://${process.env.HOST}/api/auth/login/`, formProps, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status == 200) {
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

SignInForm.activateForm();
import axios, { AxiosResponse } from "axios";

class SignInForm {
    public static formElement = document.getElementById('signin-form');

    public static async submitForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData);
        
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login/', formProps, {
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYyODk1OTIzNCwianRpIjoiY2FmZjZlNjktZGMxZi00YjczLWI2YzItOGEyNGEwNjBmZDZhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IkphY2tTU1MiLCJuYmYiOjE2Mjg5NTkyMzQsImV4cCI6MTYyODk2MDEzNH0.KphQ6pTE7FquI07wrDtQi12NgYBLsr6iIwget538jLc'
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
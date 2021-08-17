import axios from "axios";

const getUser = async () => {
    try {
        const response = await axios.get('http://localhost:5000/users/1');
        return response.data
    } catch (e) {
        console.log(e)
    }
}

const updateUserHeader = async () => {
    const user = await getUser()

    const profileName = document.querySelector('.profile-header .profile-name')
    const profileImage = document.querySelector('.profile-header .profile-image')

    profileName.innerHTML = user.username
    profileImage.setAttribute('src', user.profile_image)
}

const updateUserDetails = async () => {
    const user = await getUser()

    const accountDetailFields = document.querySelectorAll('.account-details div p')

    const firstNameField = accountDetailFields[0]
    const lastNameField = accountDetailFields[1]
    const usernameField = accountDetailFields[2]
    const emailField = accountDetailFields[3]
    const passwordField = accountDetailFields[4]
    const locationField = accountDetailFields[5]
    const joinDateField = accountDetailFields[6]

    usernameField.innerHTML = user.username
    emailField.innerHTML = user.email
    firstNameField.innerHTML = user.first_name
    lastNameField.innerHTML = user.last_name
    joinDateField.innerHTML = new Date(user.join_date).toDateString()
}

updateUserHeader()
updateUserDetails()
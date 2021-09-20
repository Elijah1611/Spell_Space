import axios from "axios";
import humanize from "humanize-duration";
import { docQuery, docQueryAll } from './helpers'

export class User {
    public static firstName: string;
    public static lastName: string;
    public static username: string;
    public static email: string;
    public static location: string;
    public static profileImage: string;
    public static joinDate: Date;
    public static totalStars: number = 0;
    public static totalTime: number = 0;

    private static async fetchAndLoadUser() {
        try {
            const response = await (await axios.get(`${process.env.HOST}/api/users/${localStorage.getItem('userId')}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }));

            console.log(response.data)
            const { first_name: firstName, last_name: lastName, username, email, location, join_date: joinDate, profile_image: profileImage } = response.data

            this.firstName = firstName;
            this.lastName = lastName;
            this.username = username;
            this.email = email;
            this.location = location;
            this.joinDate = joinDate;
            this.profileImage = profileImage
        } catch (e) {
            console.log(e)
        }
    }

    private static async fetchUserTotals() {
        try {
            const response = await (await axios.get(`${process.env.HOST}/api/quiz/user/${localStorage.getItem('userId')}/totals`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }));

            console.log(response.data)
            const { total_stars: totalStars, total_time: totalTime } = response.data

            this.totalStars = totalStars
            this.totalTime = totalTime

            localStorage.setItem('total_stars', totalStars)
            localStorage.setItem('total_quiz_time', totalTime)
        } catch (e) {
            console.log(e)
        }
    }

    private static updateUserHeader() {
        const profileName = docQuery('.profile-header .profile-name')
        const profileImage = docQuery('.profile-header .profile-image')

        profileName.innerHTML = this.username
        profileImage.setAttribute('src', this.profileImage)
    }

    private static updateUserStars() {
        const starElement = docQuery('.star-rating h3')

        starElement.innerHTML = this.totalStars.toString()
    }

    private static updateUserDetails() {
        this.updateUserStars()

        const accountDetailFields = docQueryAll('.account-details div p')

        const firstNameField = accountDetailFields[0]
        const lastNameField = accountDetailFields[1]
        const usernameField = accountDetailFields[2]
        const emailField = accountDetailFields[3]
        const locationField = accountDetailFields[5]
        const quizTimeField = accountDetailFields[6]
        const joinDateField = accountDetailFields[7]
        console.log(humanize(this.totalTime))
        usernameField.innerHTML = this.username
        emailField.innerHTML = this.email
        firstNameField.innerHTML = this.firstName
        lastNameField.innerHTML = this.lastName
        locationField.innerHTML = this.location
        quizTimeField.innerHTML = humanize(this.totalTime, { round: true });
        joinDateField.innerHTML = new Date(this.joinDate).toDateString()
    }

    private static updateEditUserDetails() {
        this.updateUserStars()

        const getField = (query): any => document.getElementById(`${query}`)
        let firstNameField = getField('fname-box')
        let lastNameField = getField('lname-box')
        let usernameField = getField('username-box')
        let emailField = getField('email-box')
        let locationField = getField('location-box')
        let profileImageField = getField('profile-image-box')
        let joinDateField = getField('joined-box')
        let passwordField = getField('password-box')

        usernameField.value = this.username
        emailField.value = this.email
        firstNameField.value = this.firstName
        lastNameField.value = this.lastName
        locationField.value = this.location
        profileImageField.value = this.profileImage

        joinDateField.innerHTML = new Date(this.joinDate).toDateString()
    }

    private static updateMenuDetails() {
        const usernameElement = docQuery('.profile-name');
        const profileImgElement = docQuery('.profile-image');

        usernameElement.innerHTML = this.username
        profileImgElement.setAttribute('src', this.profileImage)
    }

    public static async loadDetailsPage() {
        await this.fetchAndLoadUser()
        await this.fetchUserTotals()
        this.updateUserHeader()
        this.updateUserDetails()
    }

    public static async loadEditDetailsPage() {
        await this.fetchAndLoadUser()
        await this.fetchUserTotals()
        this.updateUserHeader()
        this.updateEditUserDetails()
    }

    public static async loadUserStars() {
        await this.fetchUserTotals()
        this.updateUserStars()
    }

    public static async loadMenuPage() {
        await this.fetchAndLoadUser()
        this.updateMenuDetails()
    }
}
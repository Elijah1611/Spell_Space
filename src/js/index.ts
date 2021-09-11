class IndexPage {
    public static checkAuth(): void {
        const noAccountBox: HTMLElement = document.querySelector('.auth1')
        const haveAccountBox: HTMLElement = document.querySelector('.auth2')

        if (localStorage.getItem('token')) {
            noAccountBox.style.display = 'none'
            haveAccountBox.style.display = 'block'
        } else {
            haveAccountBox.style.display = 'none'
            noAccountBox.style.display = 'block'
        }
    }

    public static logout(): void {
        const logoutBtn = document.querySelector('#signout-btn')
        
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            this.checkAuth()
        })
    }
}

IndexPage.checkAuth()
IndexPage.logout()
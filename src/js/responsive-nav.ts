export class ResponsiveNav {
    public static activate(): void {
        window.addEventListener('resize', (e: any) => {
            this.handleResponsiveNav(e)
        })
    }

    private static handleResponsiveNav(e) {
        const screenSize = e.target.innerWidth
        if (screenSize <=  768) {
            console.log('mobile', screenSize)
        }

        if (screenSize >  768) {
            console.log('desktop', screenSize)
        }
    }
}
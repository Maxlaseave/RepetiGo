export default function Layout(props) {
    console.log(props)
    const { children } = props
    return (
        <>
            <header>
                <h1 className="text-gradient">RepitoGo</h1>
            </header>
            <main>
                {children}
            </main>

            <footer>
                <small>Created by</small>
                <a target="_blang"href="https://github.com/Maxlaseave">
                    <img src="https://avatars.githubusercontent.com/u/89351211?v=4" alt="pfp" />
                    maxine
                    <i className="fa-brands fa-github"></i>
                </a>
            </footer>
        </>
            
    )
}
import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import { LOGIN } from "../queries"

const LoginForm = ({ setToken, show, setPageToBooks }) => {

    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => console.log(error.graphQLErrors[0].message)
    })

    useEffect(() => {
        if(result.data){
            const token = result.data.login.value 
            setToken(token)
            localStorage.setItem('library-jwt-token', token)
        }
    }, [result.data]) // eslint-disable-line

    if(!show) return null

    const submit = (event) => {
        event.preventDefault()
        login({ variables: { username, password }})
        setPageToBooks()
    }

    return(
        <form onSubmit={submit}>
            <div>
                username:
                <input 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                password:
                <input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Log In</button>
        </form>
    )
}

export default LoginForm
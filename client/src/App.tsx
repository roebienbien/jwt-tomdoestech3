import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from './config/config';

function App() {
  const [loginData, setLoginData] = useState();
  const [sessionData, setSessionData] = useState();
  const [logoutData, setLogoutData] = useState();

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    axios
      .post(
        `${API_ENDPOINT}/api/session`,
        { email, password },
        {
          withCredentials: true,
        }
      )
      .then((res) => setLoginData(res.data))
      .catch((error) => setLoginData(error.message));
  }

  async function getSessionData() {
    axios
      .get(`${API_ENDPOINT}/api/session`, {
        withCredentials: true,
      })
      .then((res) => setSessionData(res.data))
      .catch((error) => setSessionData(error.message));
  }

  async function logout() {
    axios
      .delete(`${API_ENDPOINT}/api/session`, {
        withCredentials: true,
      })
      .then((res) => setLogoutData(res.data))
      .catch((error) => setLogoutData(error.message));
  }

  return (
    <div className='App'>
      <div className='wrapper'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' placeholder='jane.doe@example.com' defaultValue={'test@test.com'} />
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' placeholder='******' defaultValue={'password'} />

          <button type='submit'>Login</button>
        </form>

        <div className='data'>{JSON.stringify(loginData)}</div>
      </div>

      <div className='wrapper'>
        <h2>Session</h2>
        <button onClick={getSessionData}>Get session data</button>

        <div className='data'>{JSON.stringify(sessionData, null, 4)}</div>
      </div>

      <div className='wrapper'>
        <h2>Logout</h2>
        <button onClick={logout}>Logout</button>

        <div className='data'>{JSON.stringify(logoutData, null, 4)}</div>
      </div>
    </div>
  );
}

export default App;

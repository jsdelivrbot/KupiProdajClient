import axios from 'axios';
import { browserHistory } from 'react-router';

import { 
	AUTH_USER,
	AUTH_ERROR
} from './types'

const ROOT_URL = 'http://localhost:3090'

export function signupUser({email, password}) {
	return dispatch => {
		axios.post(`${ROOT_URL}/signup`, {email, password})
			.then(response => {
				dispatch({type: AUTH_USER})
				localStorage.setItem('token', response.data.token)
				browserHistory.push('/')
			})
			.catch(error => {
				dispatch({
					type: AUTH_ERROR,
					payload: 'Погрешни податоци!'
				})
			})

  }
}
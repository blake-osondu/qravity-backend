
import { authService } from '../services/auth.service.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const errorMessage = document.querySelector('.error-message');
    errorMessage.style.display = 'none';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        console.log(email);
        console.log(password);
        const response = await authService.login(email, password);
        console.log(response);
        if (response.error) {
            errorMessage.textContent = reponse.error;
            errorMessage.style.display = 'block';
        } else if (response.success) {
            window.location.href = response.redirect;
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
    }
});
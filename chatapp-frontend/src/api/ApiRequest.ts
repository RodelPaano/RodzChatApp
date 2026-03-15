import axios from 'axios';

export async function login(email: string, password: string): Promise<unknown> {
  try {
    const res = await axios.post('/api/login', { email, password });
    return res.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}


export async function register(userName: string, firstName: string, middleName: string, 
    lastName: string, email: string, password: string, phoneNumber: string, avatar: string, address: string, 
    city: string, state: string, zipCode: string, country: string, role: string): Promise<unknown> {
        try {
            const res = await axios.post('/api/register', {
                userName,
                firstName,
                middleName,
                lastName,
                email,
                password,
                phoneNumber,
                avatar,
                address,
                city,
                state,
                zipCode,
                country,
                role,
                // preferences
            });
            return res.data;
            alert('Registration successful!');

        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please check your details and try again.');
            throw error;
        }

    }

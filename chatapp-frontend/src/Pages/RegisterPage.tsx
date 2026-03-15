import React, {useState} from 'react'
import { register } from '../api/ApiRequest'
import  NavbarLandingPage from '../Components/NavbarLandingPageComponent'


function RegisterPage() {
    const [userName, setUserName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [avatar, setAvatar] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState("")
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [country, setCountry] = useState('')
    const [role, setRole] = useState('user')
    // const [preferences, setPreferences] = useState({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('UserName:', userName)
        console.log('First Name:', firstName)
        console.log('Middle Name:', middleName)
        console.log('Last Name:', lastName)
        console.log('Email:', email)
        console.log('Password:', password)
        console.log('Phone Number:', phoneNumber)
        console.log('Avatar:', avatar)
        console.log('Address:', address)
        console.log('City:', city)
        console.log('State:', state)
        console.log('Zip Code:', zipCode)
        console.log('Country:', country)
        console.log('Role:', role)
        // console.log('Preferences:', preferences)

        // Reset Form Fields
        setUserName('')
        setFirstName('')
        setMiddleName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setPhoneNumber('')
        setAvatar(null)
        setAvatarPreview('')
        setAddress('')
        setCity('')
        setState('')
        setZipCode('')
        setCountry('')
        setRole('user')
        // setPreferences({})
        
        try {
            const res = await register(userName, firstName, middleName, lastName, email, password, phoneNumber, avatar ? URL.createObjectURL(avatar) : '', address, city, state, zipCode, country, role);
            console.log('Registration successful:', res);
            alert('Registration successful!');

            setUserName('')
            setFirstName('')
            setMiddleName('')
            setLastName('')
            setEmail('')
            setPassword('')
            setPhoneNumber('')
            setAvatar(null)
            setAvatarPreview('')
            setAddress('')            
            setCity('')
            setState('')
            setZipCode('')
            setCountry('')
            setRole('user')
            // setPreferences({})

            window.location.href = '/homepage'; // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please check your details and try again.');
        }
    }
  return (
    // Section of the Register Page
    <div className='w-full h-screen items-center justify-center bg-gray-100  flex flex-col'>

        {/* Navbar */}
        <NavbarLandingPage />
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md sticky top-4 h-[90vh] overflow-y-auto'>
            <h2 className='text-2xl font-bold mb-4 text-center font-sans'>Register <span className="text-blue-600"> Page</span></h2>
            <form className='space-y-6 ' onSubmit={handleSubmit}>
                <div className='flex flex-col'>
                    <label htmlFor='userName' className='mb-1 text-gray-600'>UserName</label>
                    <input
                        type='userName'
                        id='userName'
                        name='userName'
                        placeholder='Enter your userName'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='firstName' className='mb-1 text-gray-600'>First Name</label>
                    <input
                        type='firstName'
                        id='firstName'
                        name='firstName'
                        placeholder='Enter your first name'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='lastName' className='mb-1 text-gray-600'>Last Name</label>
                    <input
                        type='lastName'
                        id='lastName'
                        name='lastName'
                        placeholder='Enter your last name'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='email' className='mb-1 text-gray-600'>Email</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Enter your email'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='password' className='mb-1 text-gray-600'>Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter your password'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='phoneNumber' className='mb-1 text-gray-600'>Phone Number</label>
                    <input
                        type='phoneNumber'                        
                        id='phoneNumber'
                        name='phoneNumber'
                        placeholder='Enter your phone number'                       
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>

                    <label htmlFor='avatar' className='mb-1 text-gray-600 text-center'>Avatar URL</label>
                    <div className='w-20 h-20 rounded-full overflow-hidden border mb-2 text-center mx-auto'>
                        {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar preview" className='w-full h-full object-cover' />
                        ) : (
                        <span className='flex items-center justify-center w-full h-full text-gray-400'>
                            No Image
                        </span>
                        )}
                    </div>
                    <input
                        type='file'
                        id='avatar'
                        name='avatar'
                        placeholder='Enter your avatar URL'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        accept='image/*'
                        onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            if(file) {
                                setAvatar(file);
                                setAvatarPreview(URL.createObjectURL(file));
                            }
                        }}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='address' className='mb-1 text-gray-600'>Address</label>
                    <input
                        type='address'
                        id='address'
                        name='address'
                        placeholder='Enter your address'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='city' className='mb-1 text-gray-600'>City</label>
                    <input
                        type='city'
                        id='city'
                        name='city'
                        placeholder='Enter your city'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='state' className='mb-1 text-gray-600'>State</label>
                    <input
                        type='state'
                        id='state'
                        name='state'
                        placeholder='Enter your state'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='zipCode' className='mb-1 text-gray-600'>Zip Code</label>
                    <input
                        type='zipCode'
                        id='zipCode'
                        name='zipCode'
                        placeholder='Enter your zip code'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='country' className='mb-1 text-gray-600'>Country</label>
                    <input
                        type='country'
                        id='country'
                        name='country'
                        placeholder='Enter your country'
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='role' className='mb-1 text-gray-600'>Role</label>
                    <select
                        id='role'
                        name='role'                        
                        className='w-full p-2 border border-gray-300 rounded-md'
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >                       
                        <option value='user'>User</option>
                        <option value='admin'>Admin</option>
                        <option value='moderator'>Moderator</option>
                        <option value='bot'>Bot</option>
                        <option value='premium'>Premium</option>
                    </select>
                </div>
            <button type='submit' className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md'>
                Register
            </button>

                <p className='text-center text-gray-600'>Already have an account? {" "}
                <a href='/login' className='text-blue-600 hover:underline'>
                    Log in here
                </a>.</p>
            </form>
        </div>
    </div>
  )
}

export default RegisterPage

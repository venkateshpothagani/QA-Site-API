# QA-Site-API

## Authentication Related End Points

1. Signup

    - End Point - `/api/auth/signup`
    - Request - `{ username: string, password: string, email: string }`
    - Response - `{ message: string, data: { username: string, email: string, }, }`
    - Email and Username are unique fields.

2. Signin

    - End Point - `/api/auth/signin`
    - Request - `{ username: string, password: string }`
    - Response - `{ message: string, data: { token: string, username: string, }, }`
    - Authentication Technique - **JWT Tokens**

3) Get Email

    - End Point - `/api/auth/check-email`
    - Request - `{ email: string }`
    - Response - `{ message: string, data: { isValid: boolean }, }`
    - To checks user email is unique or duplicate

4) Get Username

    - End Point - `/api/auth/check-username`
    - Request - `{ username: string }`
    - Response - `{ message: string, data: { isValid: boolean }, }`
    - To checks username is unique or duplicate

5) Update Fields (username, password, email)

    - End Point - `/api/auth/update-XXXX` Here _XXXX = username or email or password_
    - Request - `{ username: string, newValue: string }`
    - Reponse - `{ message: string, data: { status: number } }` _Upated(1) or not Updated(-1) or Authorization Failed(0)_
    - This operation are done when user is authenticated

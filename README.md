# QA-Site-API

    * All date and time formats are UTC *
    * userId/username field will remove from all end point (Authenticated). This data can be extracted from JWT Tokens *


##### user document
```
{
    "age": {
        "year": -1,
        "month": 6,
        "day": 3
    },
    "_id": "5eff53b54dc88c2ab8ee4362",
    "username": "My_Unique_Name",
    "email": "New@Email.com",
    "password": "********",
    "date": "2020-07-03T15:50:13.573Z",
    "dob": "2020-12-30T18:30:00.000Z",
    "__v": 0
}

```

##### info document
```
{
    "upvotes": 3,
    "downvotes": 0,
    "_id": "5efeef038f831e3158b3fcc4",
    "title": "Question_01",
    "description": "Description_01",
    "userId": "5efee06873f8e92ba44bac3f",
    "username": "User_01",
    "date": "2020-07-03T08:40:35.600Z",
    "__v": 0
}
```


## Authentication Related End Points

1. Signup
   * End point
    ```
    /api/auth/signup [POST]
    ```
    * Request
    ```
    // Example
    {
        "username": "My_Unique_Name", # Unique
        "password": "My_Secret_Password", 
        "email": "My_Unique_Email", # Unique
        "dob": "12-31-2020" # MM-DD-YYYY
    }
    ```
    * Response
    ```
    {
        "message": "Account Created",
        "data": {
            "_id": "5eff53b54dc88c2ab8ee4362",
            "username": "My_Unique_Name",
            "email": "My_Unique_Email",
            "password": "********", # Just predefined text
            "date": "2020-07-03T15:50:13.573Z", # Account created time
            "dob": "2020-12-30T18:30:00.000Z",
            "age": {
                "year": -1,
                "month": 6,
                "day": 3
            },
            "__v": 0
        }
    }
    ```
    * Description
    > Username and Email are Unique

    > Age is calculated in server side

2. Signin
    * End point
    ```
    /api/auth/signin [POST]
    ```
    * Request
    ```
    {
        "username": "My_Unique_Name",
        "password": "My_Secret_Password"
    }
    ```
    * Response
    ```
    {
        "message": "User Logged in",
        "data": {
            "token": "eyJhbGci*****OiJIUuk", # JWT Token
            "username": "My_Unique_Name",
            "userId": "5eff53b54dc88c2ab8ee4362"
        }
    }
    ```

3. Update XXXXXX 
    > Here YYYYYY = newUsername, newPassword, newEmail, newDOB
    
    > Here XXXXXX = username, password, email, dob
    * End point
    ```
    /api/auth/update-XXXXXX [POST]
    ```
    * Request 
    ```
    {
        "YYYYYY": "New Value"
    }
    ```
    * Response 
    ```
    {
        "message": "XXXXXX Updated",
        "data": {
            "previous": oldDocument
            "updated": newDocument
        }
    }
    ```

4. Update Profile
   * End point
    ```
    /api/auth/update-profile [POST]
    ```
    * Request
    ```
    {
        newEmail: "value",
        newUsername: "value",
        newDOB: "value",
    }
    ```
    * Response
    ```
    {
        "message": "Profile Updated",
        "data": {
            "previous": oldDocument
            "updated": newDocument
        }
    }
    ```

5. Remove Account
    * End point 
    ```
    /api/auth/remove [DELETE]
    ```
    * Request 
    ```
    userId can extracted from JWT Token
    ```
    * Response 
    ```
    {
        "message": "Deleted",
        "data": document
    }
    ```

6. Check XXXXXX
    > Here XXXXXX = email, username
    * End point 
    ```
    /api/auth/check-XXXXXX [POST]
    ```
    * Request 
    ```
    {
        "XXXXXX": "Form Input Value"
    }
    ```
    * Response 
    ```
    {
        "message": "Valid/Invalid XXXXXX",
        "data": {
            "isValid": true/false
        }
    }
    ```

## End points for all Features (Answer, Comment, Question)
6. Add
    * End point 
    ```
    # question
    /api/info/question/create [POST]

    # answer
    /api/info/answer/create [POST]
    
    # comment
    /api/info/comment/create [POST]

    ```
    * Request 
    ```
    # Question
    {
        title: 'question',
        description: 'question description'
    }

    # Answer
    {
        questionId: 'question id',
        description: 'answer description'
    }

    # Comment
    {
        targetId: 'question or answer id',
        description: 'comment description'
    }
    ```
    * Response 
    ```
    # Question, Answer, Comment
    {
        message: 'XXXXXX Added',
        data: document
    }
    ```

7. Get All
   * End point 
    ```
    # question
    /api/info/question/get-all [GET]

    # answer (question Id)
    /api/info/answer/get-all/:id [GET]
    
    # comment (question or answer id)
    /api/info/comment/get-all/:id [GET]

    ```
    * Request 
    ```
    # Question, Answer, Comment
    {
    }
    ```
    * Response 
    ```
    # Question, Answer, Answer
    {
        message: 'XXXXXX Fetched',
        data: document[]
    }
    ```
    

8. Get All for a user
    * End point 
    ```
    # question
    /api/info/question/get-user-all [GET]

    # answer
    /api/info/answer/get-user-all [GET]
    
    # comment
    /api/info/comment/get-user-all [GET]

    ```
    * Request 
    ```
    # Question, Answer, Comment
    {
    }
    ```
    * Response 
    ```
    # Question
    {

    }

    # Answer
    {
        message: 'XXXXXX Fetched',
        data: document[]
    }


9. Get One
    * End point 
    ```
    # question
    /api/info/question/get-one/:id [GET]

    # answer
    /api/info/answer/get-one/:id  [GET]
    
    # comment
    /api/info/comment/get-one/:id [GET]

    ```
    * Request 
    ```
    # Question, Answer, Comment
    {

    }

    ```
    * Response 
    ```
    # Question, Answer, Comment
    {
        message: 'XXXXXX Fetched',
        data: document
    }
    ```


10. Update
    * End point 
    ```
    # question, answer, comment
    /api/info/XXXXXX/update [PATCH]
    
    ```
    * Request 
    ```
    # Question, Answer, Comment
    {
        featureId: "id"
        title: "only for question",
        description: "for all"
    }

    ```
    * Response 
    ```
    # Question, Answer, Comment
    {
        message: 'XXXXXX Updated',
        data: {
            previous: oldDocument,
            current: newDocument
        }
    }

    ```
    

11. Remove
    * End point 
    ```
    # question, answer, comment
    /api/info/XXXXXX/remove [DELETE]

    ```
    * Request 
    ```
    # Question, Answer, Comment
    {
        featureId: "id"
    }

    ```
    * Response 
    ```
    # Question, Answer, Comment
    {
        message: 'XXXXXX Deleted',
        data: document
    }

## Upvote and Downvote (Same for all features [Answer, Question, Comment])

12. Upvote and Downvote
    > Here XXXXXX = answer, question, comment

    > Here YYYYYY = upvote, downvote
    * End point 
    ```
    /api/XXXXXX/YYYYYY [POST]
    ```
    * Request 
    ```
    {
        featureId: "unique _feature_id",
    }
    ```
    * Response 
    ```
    {
        message: "YYYYYY Added/Removed",
        data: {
            status: 1/-1 (Added/Removed)
            previous: {...document.toJSON()},
            current: {...document.toJSON()}
        }
    }
    ```
    * Description
    > If same featureId, send second time from same user then existing upvote/downvote will removed


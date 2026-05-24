# Nexus Platform API Documentation

## Authentication (`/api/auth`)

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "investor",
    "bio": "Tech investor",
    "profileImage": "http://example.com/img.png"
  }
  ```

### Login & Request OTP
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Note**: Returns a mock OTP in the response for testing 2FA.

### Verify OTP
- **URL**: `/api/auth/verify-otp`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Returns**: JWT token upon successful validation.

---

## Meetings (`/api/meetings`)
*All routes require Bearer Token (`Authorization: Bearer <token>`)*

### Send Meeting Request
- **URL**: `/api/meetings`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "Investment Pitch",
    "receiver": "60d0fe4f5311236168a109ca",
    "startTime": "2024-05-15T10:00:00.000Z",
    "endTime": "2024-05-15T11:00:00.000Z"
  }
  ```

### Update Meeting Status
- **URL**: `/api/meetings/:id`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "status": "accepted" // or 'rejected'
  }
  ```

### Get User Meetings
- **URL**: `/api/meetings`
- **Method**: `GET`
- **Description**: Fetches all meetings where the user is either the sender or receiver.

---

## Documents (`/api/documents`)
*All routes require Bearer Token (`Authorization: Bearer <token>`)*

### Upload Document
- **URL**: `/api/documents/upload`
- **Method**: `POST`
- **Headers**: `Content-Type: multipart/form-data`
- **Body (Form-Data)**:
  - `file`: File upload
  - `fileName`: String (optional)
  - `version`: Number (optional)
  - `esignatureStatus`: Boolean (optional)

### Get User Documents
- **URL**: `/api/documents`
- **Method**: `GET`

---

## Payments (`/api/payments`)
*All routes require Bearer Token (`Authorization: Bearer <token>`)*

### Checkout (Mock Stripe Payment)
- **URL**: `/api/payments/checkout`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "amount": 500,
    "type": "deposit" // or 'withdraw'
  }
  ```

### Get Transaction History
- **URL**: `/api/payments/history`
- **Method**: `GET`

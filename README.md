# Emobility System Lab

Backend and Frontend for the Emobility System Lab platform. Master the future of smart mobility, embedded systems, and AI technologies.

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: Passport.js (Google OAuth 2.0)
- **Payments**: Razorpay

## Features
- User Registration & Login
- Google OAuth Integration
- Course Enrollment
- Payment Gateway Integration
- Dynamic Course Content

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Stitch
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_uri
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   PORT=5050
   CALLBACK_URL=http://localhost:5050/api/auth/google/callback
   CLIENT_URL=http://localhost:5050
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Run the server**:
   ```bash
   node server.js
   ```

## License
MIT

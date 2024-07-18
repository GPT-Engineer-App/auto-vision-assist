# auto-vision-assist

Auto Vision V2 Overview
Auto Vision V2 is a mobile application designed to assist users in diagnosing automobile issues through AI-powered responses based on symptoms or diagnostic trouble codes (DTCs). The app provides a comprehensive user experience with functionalities ranging from user authentication to detailed vehicle diagnostics. It offers both a free and a Pro version, with the latter providing enhanced capabilities.




Features and Functions
1. User Authentication
Sign Up: Allows users to create an account with a username, email, and password.
Log In: Enables users to log in with their email and password.
Log Out: Allows users to log out of their account.
User Data Storage: Securely stores user data using Firebase.
2. Garage Management
Add Vehicle: Users can add vehicle details including year, make, model, engine size, drivetrain configuration, and body configuration.
View Vehicles: Users can view a list of their saved vehicles.
Pro Version:
Free users can store details for one vehicle.
Pro users can store details for up to three vehicles.
Enhanced Garage View: A visually appealing, modern, high-end garage with visual representations of advanced equipment and tools.
3. Diagnostic Chat
Enter Symptoms or Codes: Users can input vehicle symptoms or diagnostic trouble codes (DTCs).
Receive AI Responses: The app calls an AI language model (e.g., GPT-3.5) to provide logical causes and troubleshooting tips for the entered symptoms or codes.
Query Limits:
Free users can make up to 30 queries every 29 days.
Pro users have unlimited queries.
4. Vehicle History (Pro Users)
Store Query History: Pro users can store the history of queries and responses for each of their vehicles.
View History: Users can view past queries and responses for troubleshooting reference.
5. User Interface
Visually Appealing Design: Consistent color scheme and typography for an engaging user experience.
User-Friendly Navigation: Easy navigation between different pages and features.
Mobile-Responsive Design: Ensures the app works well on various screen sizes.
Realistic Scanner UI: The diagnostic interface mimics the look and feel of a SnapOn Zeus Diagnostic Scanner, enhancing user experience with realistic design elements and interactions.
6. Monetization
Ads for Free Users: Display ads to monetize the free version of the app.
Pro Subscription: Users can subscribe to a Pro version to remove ads, get unlimited queries, and access additional features like vehicle history and storing multiple vehicles.
7. Additional Features for Pro Users
Unlimited Diagnostic Questions: No query limits for Pro users.
Additional Tips and Tricks: Provide extra troubleshooting tips and tricks for Pro users.
Detailed Breakdown of UI/UX Components
Sign Up and Log In Pages
Sign Up Page: Input fields for username, email, and password with a button to submit the form.
Log In Page: Input fields for email and password with a button to submit the form.
Garage Management Pages
Garage Page: Displays a list of saved vehicles with a button to add a new vehicle. Enhanced with visual representations of a high-end garage.
Add Vehicle Page: Input fields for vehicle details and a button to save the information.
Diagnostic Chat Page
Diagnostic Chat Interface: Input field to enter symptoms or DTCs, a button to submit the query, and a display area for AI responses.
Enhanced UI: Realistic interface similar to the SnapOn Zeus Diagnostic Scanner with detailed diagnostic information and interactive elements.
Vehicle History Page (Pro Users)
Vehicle History Interface: List of past queries and responses for a selected vehicle, providing easy reference for troubleshooting.
Diagnostic Results Page
Diagnostic Results: Displays detailed diagnostic information, technical bulletins, top repairs graph, and code-specific scanner data.
Technical Bulletins Section: Shows related technical bulletins based on the diagnostic code.
Top Repairs Graph: Displays a graph of the most common fixes for the provided DTC.
Scanner Data Section: Provides detailed code-specific scanner data.
Capabilities
AI-Powered Diagnostics: Leverages AI models to provide accurate troubleshooting tips based on user inputs.
Firebase Integration: Secure user data storage and management.
Pro Subscription Model: Offers enhanced features and unlimited queries for Pro users.
Ad Monetization: Ads displayed for free users to generate revenue.
User-Friendly Interface: Designed with modern UI/UX principles to ensure ease of use and engagement.
Auto Vision V2 combines the power of AI with a user-centric design to offer a robust tool for automobile diagnostics, catering to both casual users and professional mechanics.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with .

- Vite
- React
- shadcn-ui
- Tailwind CSS

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/auto-vision-assist.git
cd auto-vision-assist
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

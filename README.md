# Helpify - Automated Complaint Management System

![Helpify Project Banner](https://i.imgur.com/your-banner-image-url.png)
A full-stack MERN stack web application designed to streamline the complaint management process in a student hostel environment. Helpify provides a transparent, real-time platform for students to submit issues, for staff to manage assigned tasks, and for administrators to oversee the entire resolution workflow.

## ✨ Core Features

The application is built with a clear separation of roles, providing a unique dashboard and set of functionalities for each user type.

### 🧑‍🎓 Student Portal
* **Secure Authentication**: Students can register and log in to a personal dashboard.
* **Complaint Submission**: An intuitive form allows students to submit complaints with a category, detailed description, and a mandatory photo upload.
* **Live Status Tracking**: Students can view a list of their submitted complaints and track their live status (`Submitted`, `In Progress`, `Resolved`) through a visual timeline.

### 👨‍💼 Admin Dashboard
* **Statistical Overview**: A dynamic doughnut chart provides an at-a-glance summary of resolved vs. pending complaints.
* **Centralized Complaint Management**: View, filter, and inspect all complaints submitted by students across the system.
* **Intelligent Staff Assignment**: Assign complaints to specific staff members. The system intelligently suggests relevant staff based on the complaint category (e.g., only shows plumbers for a "Plumbing" issue).
* **Full Staff Management (CRUD)**: A dedicated interface to add, view, update, and delete staff members and their roles.

### 🛠️ Staff Portal
* **Task-Oriented Dashboard**: Staff members log in to see a clean, tabbed view of their assigned tasks, separated into "Active" and "Completed History".
* **Update Complaint Status**: Staff can mark a complaint as "Resolved" and add completion remarks.
* **Seamless Workflow**: Status updates made by staff are instantly reflected on both the student's and admin's dashboards.

## 🚀 Tech Stack

This project is built using the MERN stack and other modern web technologies.

* **Frontend**: React.js, Tailwind CSS, React Router, Axios, Chart.js
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (with Mongoose)
* **Authentication**: JSON Web Tokens (JWT) & bcrypt.js
* **File Handling**: Multer for handling file uploads.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js (v18 or later)
* npm (or yarn)
* A MongoDB Atlas account to get a connection string.

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone [https://github.com/your-username/Helpify---Complaint-Management-System.git](https://github.com/your-username/Helpify---Complaint-Management-System.git)
    cd Helpify---Complaint-Management-System
    ```

2.  **Setup the Backend**
    ```sh
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` root and add the following variables:
    ```env
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_super_secret_key_for_jwt
    ADMIN_EMAIL=admin@hostel.com
    ADMIN_PASSWORD=admin123
    ```

3.  **Setup the Frontend**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Run the Application**
    * To run the backend server (from the `backend` folder):
        ```sh
        npm run dev
        ```
    * To run the frontend client (from the `frontend` folder, in a separate terminal):
        ```sh
        npm start
        ```
    The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## <details><summary>📂 API Endpoints</summary>

| Endpoint                             | Method | Description                                    | Access   |
| ------------------------------------ | ------ | ---------------------------------------------- | -------- |
| `/api/auth/register`                 | `POST` | Register a new student                         | Public   |
| `/api/auth/login`                    | `POST` | Authenticate any user (student, staff, admin)  | Public   |
| `/api/complaints`                    | `POST`   | (Student) Submit a new complaint             | Student  |
| `/api/complaints/my-complaints`      | `GET`    | (Student) Get all of their own complaints    | Student  |
| `/api/admin/complaints`              | `GET`    | (Admin) Get all complaints from all users    | Admin    |
| `/api/admin/complaints/stats`        | `GET`    | (Admin) Get statistics for the dashboard chart | Admin    |
| `/api/admin/complaints/:id/assign`   | `PUT`    | (Admin) Assign a complaint to a staff member   | Admin    |
| `/api/admin/staff`                   | `GET`    | (Admin) Get a list of all staff members      | Admin    |
| `/api/admin/staff`                   | `POST`   | (Admin) Create a new staff member            | Admin    |
| `/api/admin/staff/:id`               | `PUT`    | (Admin) Update a staff member's details      | Admin    |
| `/api/admin/staff/:id`               | `DELETE` | (Admin) Remove a staff member                | Admin    |
| `/api/staff/complaints/active`       | `GET`    | (Staff) Get their active assigned complaints | Staff    |
| `/api/staff/complaints/resolved`     | `GET`    | (Staff) Get their resolved complaints        | Staff    |
| `/api/staff/complaints/:id/status`   | `PUT`    | (Staff) Update the status of a complaint     | Staff    |

</details>

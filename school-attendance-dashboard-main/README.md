# School Attendance Dashboard

A web-based application for managing school attendance reports across different user roles: Administrators, Supervisors (Principals), and Teachers.

## Project Structure

```
school-attendance-dashboard/
├── index.html                 # Main portal page
├── about_us.html             # About page
├── firebase.json             # Firebase configuration
├── logo 1.png               # Logo assets
├── logo 2.png
├── admin/                    # Admin-specific pages
│   ├── admin_dashboard.html
│   └── admin_login.html
├── Supervisor/               # Supervisor-specific pages
│   ├── supervisor_dashboard.html
│   ├── supervisor_login.html
│   ├── about_us.html
│   ├── logo 1.png
│   └── logo 2.png
├── Teacher/                  # Teacher-specific pages
│   ├── teacher_dashboard.html
│   ├── teacher_login.html
│   ├── about_us.html
│   ├── logo 1.png
│   └── logo 2.png
├── css/                      # Stylesheets
│   ├── base.css             # Base styles and utilities
│   ├── components.css       # Component-specific styles
│   ├── dashboard.css        # Dashboard-specific styles
│   ├── login.css            # Login page styles
│   ├── portal.css           # Portal page styles
│   └── theme.css            # Theme variables
├── js/                       # JavaScript files
│   ├── ui.js                # UI utilities (theme, export)
│   ├── teacher.js           # Teacher dashboard logic
│   ├── supervisor.js        # Supervisor dashboard logic
│   └── main-supervisor.js   # Supervisor main functionality
└── functions/                # Backend functions (if applicable)
    ├── index.js
    ├── package.json
    ├── package-lock.json
    └── .eslintrc.js
```

## Features

### Administrator Dashboard
- User management for principals and teachers
- Add, edit, and delete user accounts
- Password reset functionality
- Role-based access control

### Supervisor Dashboard
- View absence reports for assigned divisions
- Filter reports by date range and search terms
- Switch between card and table views
- Sort table data by columns
- Export reports to CSV
- Reset daily absences

### Teacher Dashboard
- Submit daily absence reports
- Select class, section, and division
- Real-time class data loading

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Authentication & Firestore
- **External API**: Custom server for class and absence data
- **Styling**: Custom CSS with CSS Variables for theming
- **Icons**: Font Awesome

## Setup and Usage

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-attendance-dashboard
   ```

2. **Configure Firebase**
   - Update `firebase.json` with your Firebase project config
   - Ensure Firebase Authentication and Firestore are enabled

3. **Backend API**
   - The application expects a backend API at `https://ziad-school-app.onrender.com/`
   - Endpoints: `/classes`, `/absences`, `/absences/today`

4. **Run locally**
   - Open `index.html` in a web browser
   - No build process required - pure static files

## User Roles

- **Admin**: Full system access, user management
- **Supervisor/Principal**: View reports for their divisions
- **Teacher**: Submit absence reports for their classes

## Browser Support

- Modern browsers with ES6 support
- Responsive design for mobile and desktop

## Development

- CSS uses a spacing scale and typography scale for consistency
- JavaScript is modular with separate files per role
- Theme system supports light/dark mode (supervisor dashboard)

## Contributing

1. Follow the existing code style
2. Use semantic HTML and ARIA labels for accessibility
3. Test across different screen sizes
4. Update documentation for any new features

## License

© 2025 RHTI. All rights reserved. Made by Ziad
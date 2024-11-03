# YoobeeProjectMSE800
This repo is created for the Object Orientated group project

#Angular Setup

## prerequisite:
Install Node(12.22.12) and npm(6.14.16)
Install Angluar 12.0.5

# Install nvm if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.nvm/nvm.sh

# Install Node.js 12.22.12
nvm install 12.22.12

# Use Node.js version 12.22.12
nvm use 12.22.12

# Verify versions
node -v  # Should output v12.22.12
npm -v   # Should output 6.14.16

# Install Angular 12
npm install -g @angular/cli@12.0.5

# Verify Angular version
ng version


## Locally up Frontend
1. Navigate to Frontend
2. npm i
3. ng serve

##  Backed of the project management system.

to run the project, 
1. install the recruitments.txt
2. change the .env file MySQL url configuration
3. to start the service uvicorn app.main:app --reload

you can see the docs on the localhost:8000/docs url.

JWT token updated with below object
{
  "email": "employee@example.com",
  "first_name": "string",
  "title": "string",
  "last_name": "string",
  "role": "EMPLOYER",
  "exp": 1728611624
}

Employer code field is used for create employee

Project endpoint created
Get Projects
Assign project to employees
Get project employees


Check in/out endpoints added
note: checkinout table need to be drop before start

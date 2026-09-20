
## idfyNow

 ## The Problem I am Solving

Across villages, towns, and every corner of India, faculties and teachers spend a significant portion of their valuable time managing manual administrative tasks, particularly attendance tracking. In tier-2 and tier-3 cities, the lack of accessible, user-friendly digital infrastructure often means educators have to rely on cumbersome manual data entry, which is both time-consuming and error-prone. 

**idfyNow** is an automated helper designed specifically for faculties . Our mission is to reduce manual data handling and administrative burden by **80%** and able to handle multiple sections, hundreds of students from a single dashboard student. By providing an intuitive, highly accessible platform, we empower educators to focus on what they do best—teaching—while the system seamlessly handles attendance, session management, and Excel integration behind the scenes as well as provided option to integration the data to third party ERP portals or dynamic dashboards.

##  Tech Stack

- **Frontend**: Next.js, HTML/CSS, JavaScript
- **Barcode Scanning**: HTML5 QR Code library for scanning student IDs
- **Backend**: Node.js, Express.js (providing over 6 robust REST APIs)
- **Data Structures & Logic**: 
  - Hash Maps for student ID lookups, ensuring O(1) average lookup time.
  - Automated Excel processing (dynamically handles date columns, initializes absentees to 0, and updates scanned students to 1).
- **Integrations**: ERP integration for seamless institution-wide synchronization.

## Architecture

The system is built on a serverless, highly scalable architecture using AWS. It utilizes a microservices approach where the frontend communicates securely with the backend via API endpoints. 

Key architectural highlights:
- **Session Management & Validation**: Implemented robust session handling and validation mechanisms using modern DBMS concepts.
- **Efficient Data Processing**: The backend rapidly processes scanned student data and directly updates Excel sheets which are then synced with the college's ERP systems.

##  How I Used AWS

AWS forms the backbone of our scalable and secure infrastructure:

- **AWS Cognito**: Handles secure user authentication and authorization, ensuring that faculty data is protected and accessible only to verified users.
- **AWS Lambda**: Executes our business logic serverlessly. This means the system scales automatically with demand, handling high traffic during peak attendance hours without managing servers.
- **Amazon API Gateway**: Acts as the secure "front door" for our Next.js frontend to communicate with the Lambda functions.
- **Amazon S3**: Securely stores the generated and processed Excel files, making them easily retrievable for ERP integration and faculty downloads.
- **AWS Amplify**:the product is deployed live on amplify 
##  Repository Structure

Within this repo, you will find:

- `/aws_screenshots`: Will contain visual evidence screenshots of the AWS services utilized in this project and architectural diagram mapping out the data flow and system design


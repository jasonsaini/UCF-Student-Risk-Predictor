```sql 
Frontend (Chrome Extension)
         |
         |  User Interface: Interacts with users, collects inputs, and displays results.
         |  |
         |  --> Communication Layer: Sends and receives data from the backend.
         |
         V
Backend
         |
         |  API Gateway: Receives requests from the frontend.
         |        |
         |        V
         |  Middleware: Handles business logic, authentication, and initial preprocessing.
         |        |
         |        V
         |  Database: Stores data.
         |        |
         |        V
         |  Data Preprocessing Service: Performs extensive data cleaning and transformation.
         |
         V
AI/ML Model
         |
         |  Receives preprocessed data.
         |  |
         |  --> Performs advanced processing (feature extraction, dimensionality reduction).
         |  |
         |  --> Runs prediction algorithms.
         |
         V
Back to Backend for storage and further processing.


```
# MongoDB Atlas Setup Guide for Career Compass AI

Since you do not have MongoDB installed locally, follow these steps to set up a free database cluster on **MongoDB Atlas** and link it to this project.

---

## Step 1: Create a Free MongoDB Atlas Cluster
1. **Sign Up / Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. **Create a Project**: Once logged in, create a new project (e.g., named `CareerCompass`).
3. **Deploy a Database**:
   - Click on **Build a Database** / **Create**.
   - Select the **M0 (Free)** tier.
   - Choose your preferred cloud provider (e.g., AWS) and region closest to you.
   - Click **Create**.
4. **Security Configuration**:
   - **Username & Password**: Create a database user. Note down the username and password (you will need them in the connection string).
   - **IP Access List**: Add `0.0.0.0/0` (Allow Access from Anywhere) to make it easy to connect from your local development environment. Click **Add IP Address**.
   - Click **Finish and Close** / **Go to Databases**.

---

## Step 2: Get Your Connection String
1. On your MongoDB Atlas Dashboard, find your database cluster and click **Connect**.
2. Select **Drivers** (under "Connect to your application").
3. Choose **Node.js** as your driver and copy the provided connection string. It will look like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

---

## Step 3: Configure `backend/.env`
1. Open [backend/.env](file:///d:/career%20compass%20ai/backend/.env) in your editor.
2. Replace the local MongoDB connection string with your Atlas connection string. Make sure to:
   - Replace `<username>` with your database user's username.
   - Replace `<password>` with your database user's password (ensure special characters are URL-encoded if applicable).
   - Specify the database name (e.g., `career_compass`) right before the query parameters.
3. Your final `backend/.env` should look like this:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://myUsername:myPassword123@cluster0.xxxxxx.mongodb.net/career_compass?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=career_compass_ai_jwt_secret_token_12345
   ```

---

## Step 4: Verify the Database Connection
Once you have saved your updated `backend/.env` file with the correct URI, you can run the following verify command in your terminal inside the `backend/` folder:

```powershell
npm run seed
```

If the connection is successful, you will see the following output:
```
MongoDB connected for seeding...
Cleared existing skill requirements.
Successfully seeded skill requirements data.
```
This confirms that the backend can read and write to your Atlas database!

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import Admin model
const Admin = require("../models/Admin")

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB")

    try {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ username: "admin" })

      if (existingAdmin) {
        console.log("Admin user already exists. Updating password...")

        // Update the admin password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash("admin123", salt)

        existingAdmin.password = hashedPassword
        await existingAdmin.save()

        console.log("Admin password updated successfully")
        console.log("Username: admin")
        console.log("Password: admin123")
      } else {
        // Create a new admin
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash("admin123", salt)

        const newAdmin = new Admin({
          username: "admin",
          password: hashedPassword,
          email: "admin@example.com",
        })

        await newAdmin.save()
        console.log("Admin user created successfully")
        console.log("Username: admin")
        console.log("Password: admin123")
      }

      // Verify the admin user
      const adminUser = await Admin.findOne({ username: "admin" })
      if (adminUser) {
        console.log("Admin user verified in database")

        // Test password comparison
        const isMatch = await bcrypt.compare("admin123", adminUser.password)
        console.log("Password match test:", isMatch ? "SUCCESS" : "FAILED")
      }
    } catch (error) {
      console.error("Error creating/updating admin user:", error)
    } finally {
      // Disconnect from MongoDB
      mongoose.disconnect()
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

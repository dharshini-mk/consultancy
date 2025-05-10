const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB")

    try {
      // First, let's drop the existing Admin collection to start fresh
      await mongoose.connection
        .collection("admins")
        .drop()
        .catch((err) => {
          // Collection might not exist yet, which is fine
          if (err.code !== 26) {
            console.error("Error dropping collection:", err)
          }
        })

      console.log("Creating admin user from scratch...")

      // Define the Admin schema directly in this script to avoid any issues
      const AdminSchema = new mongoose.Schema({
        username: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      })

      const Admin = mongoose.model("Admin", AdminSchema)

      // Generate a salt and hash the password directly
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("admin123", salt)

      // Create a new admin with the hashed password
      const newAdmin = new Admin({
        username: "admin",
        password: hashedPassword,
        email: "admin@example.com",
      })

      await newAdmin.save()
      console.log("New admin user created successfully")
      console.log("Username: admin")
      console.log("Password: admin123")

      // Test password comparison directly with bcrypt
      const adminFromDB = await Admin.findOne({ username: "admin" })
      const isMatch = await bcrypt.compare("admin123", adminFromDB.password)
      console.log("Password match test:", isMatch ? "SUCCESS" : "FAILED")

      if (isMatch) {
        console.log("✅ Admin user is ready to use!")
      } else {
        console.log("❌ There's still an issue with password comparison")
      }
    } catch (error) {
      console.error("Error creating admin user:", error)
    } finally {
      // Disconnect from MongoDB
      mongoose.disconnect()
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

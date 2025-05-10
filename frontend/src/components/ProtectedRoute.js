import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute

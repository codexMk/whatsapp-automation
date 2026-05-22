export default function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">🛡️ Admin Setup</h1>
          <p className="text-gray-600">One-click admin panel activation</p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            Click the button below to:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 ml-4">
            <li>✅ Create super admin account</li>
            <li>✅ Set up default plans</li>
            <li>✅ Auto-login to admin panel</li>
          </ul>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
            <strong>⚠️ Warning:</strong> This will delete all existing users. Use only on new installations.
          </div>

          <a
            href="/api/admin/quick-start"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition"
          >
            1️⃣ Quick Start Setup
          </a>

          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-gray-600 mb-3">Or setup manually:</p>
            <div className="space-y-2">
              <a
                href="/api/admin/quick-start"
                className="block text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                → Get Credentials
              </a>
              <a
                href="/login"
                className="block text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                → Go to Login
              </a>
              <a
                href="/admin"
                className="block text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                → Go to Admin Dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-xs text-gray-500">
          <p>After setup, save your credentials</p>
          <p className="mt-1">Email: <strong>admin@123.com</strong></p>
          <p className="mt-1">Password: <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

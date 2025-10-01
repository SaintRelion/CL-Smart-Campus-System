import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Link } from "react-router-dom";
import { UserRole } from "@/models/userrole";
import { Department } from "@/models/department";
import { registerUser } from "@saintrelion/auth-lib";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<string>("student");
  const [department, setDepartment] = useState<string>("IT");

  function handleRegister() {
    registerUser(email, password, { role: role, department: department });
    // console.log(clientApp);
  }

  return (
    <div className="grid h-screen w-full md:grid-cols-2">
      {/* Left panel (illustration/brand) */}
      <div className="hidden flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-10 text-white md:flex">
        <h1 className="mb-4 text-4xl font-bold">Join Our Platform 🚀</h1>
        <p className="text-center text-lg text-blue-100">
          Create your account and start managing your classes and attendance
          with ease.
        </p>
      </div>

      {/* Right panel (form) */}
      <div className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(UserRole).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Department).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={handleRegister}>
            Register
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegistrationPage;

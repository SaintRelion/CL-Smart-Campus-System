import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  const [role, setRole] = useState<string>("student");

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
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="superadmin">Super Admin</TabsTrigger>
              <TabsTrigger value="departmentadmin">Dept Admin</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
            </TabsList>
          </Tabs>

          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Input type="password" placeholder="Confirm Password" />

          <Button className="w-full">Register</Button>

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

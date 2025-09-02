import { useState } from "react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@saintrelion/auth-lib";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = () => {
    // Normally you'd call API here, then save returned user
    setUser({
      id: 14, // fake user id
      email,
      role,
      department: "IT",
    });

    navigate("/"); // redirect to dashboard
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="superadmin">Super</TabsTrigger>
              <TabsTrigger value="departmentadmin">Dept</TabsTrigger>
              <TabsTrigger value="instructor">Instr</TabsTrigger>
              <TabsTrigger value="student">Stud</TabsTrigger>
            </TabsList>
          </Tabs>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginPage;

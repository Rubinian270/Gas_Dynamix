"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { DashboardHeader } from "../../../components/dashboard-header";
import { DashboardShell } from "../../../components/dashboard-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CaseParameters {
  description: string;
  ambient_pressure: number;
  ambient_pressure_unit: string;
  ambient_temperature: number;
  ambient_temperature_unit: string;
  guarantee_point: boolean;
  suppress: boolean;
  pressure: number;
  pressure_unit: string;
  temperature: number;
  temperature_unit: string;
  flow_type: string;
  flow_value: number;
  flow_unit: string;
}

export default function AddCasePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CaseParameters>({
    description: "",
    ambient_pressure: 0,
    ambient_pressure_unit: "Pa",
    ambient_temperature: 0,
    ambient_temperature_unit: "K",
    guarantee_point: false,
    suppress: false,
    pressure: 0,
    pressure_unit: "Pa",
    temperature: 0,
    temperature_unit: "K",
    flow_type: "Mass flow",
    flow_value: 0,
    flow_unit: "kg/s"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`https://gaxmixer-production.up.railway.app/user/CaseRequiredParameters/?project_id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify([formData])
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add case');
      }

      setSuccess(true);
      // Redirect back to project details page after successful submission
      setTimeout(() => {
        router.push(`/dashboard/projects/${id}`);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-4 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Project
      </Button>

      <DashboardHeader
        heading="Add New Case"
        text="Add a new case with required parameters."
      />

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>Case added successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle>Case Parameters</CardTitle>
            <CardDescription>
              Enter the required parameters for the new case
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter case description"
                className="border-blue-200 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ambient_pressure">Ambient Pressure</Label>
                <div className="flex gap-2">
                  <Input
                    id="ambient_pressure"
                    name="ambient_pressure"
                    type="number"
                    value={formData.ambient_pressure}
                    onChange={handleInputChange}
                    className="border-blue-200"
                    required
                  />
                  <Select
                    value={formData.ambient_pressure_unit}
                    onValueChange={(value) => handleSelectChange('ambient_pressure_unit', value)}
                  >
                    <SelectTrigger className="w-[100px] border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pa">Pa</SelectItem>
                      <SelectItem value="kPa">kPa</SelectItem>
                      <SelectItem value="bar">bar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ambient_temperature">Ambient Temperature</Label>
                <div className="flex gap-2">
                  <Input
                    id="ambient_temperature"
                    name="ambient_temperature"
                    type="number"
                    value={formData.ambient_temperature}
                    onChange={handleInputChange}
                    className="border-blue-200"
                    required
                  />
                  <Select
                    value={formData.ambient_temperature_unit}
                    onValueChange={(value) => handleSelectChange('ambient_temperature_unit', value)}
                  >
                    <SelectTrigger className="w-[100px] border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K">K</SelectItem>
                      <SelectItem value="°C">°C</SelectItem>
                      <SelectItem value="°F">°F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressure">Pressure</Label>
                <div className="flex gap-2">
                  <Input
                    id="pressure"
                    name="pressure"
                    type="number"
                    value={formData.pressure}
                    onChange={handleInputChange}
                    className="border-blue-200"
                    required
                  />
                  <Select
                    value={formData.pressure_unit}
                    onValueChange={(value) => handleSelectChange('pressure_unit', value)}
                  >
                    <SelectTrigger className="w-[100px] border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pa">Pa</SelectItem>
                      <SelectItem value="kPa">kPa</SelectItem>
                      <SelectItem value="bar">bar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <div className="flex gap-2">
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="border-blue-200"
                    required
                  />
                  <Select
                    value={formData.temperature_unit}
                    onValueChange={(value) => handleSelectChange('temperature_unit', value)}
                  >
                    <SelectTrigger className="w-[100px] border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K">K</SelectItem>
                      <SelectItem value="°C">°C</SelectItem>
                      <SelectItem value="°F">°F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow_type">Flow Type</Label>
                <Select
                  value={formData.flow_type}
                  onValueChange={(value) => handleSelectChange('flow_type', value)}
                >
                  <SelectTrigger className="border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mass flow">Mass flow</SelectItem>
                    <SelectItem value="Volume flow">Volume flow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow_value">Flow Value</Label>
                <div className="flex gap-2">
                  <Input
                    id="flow_value"
                    name="flow_value"
                    type="number"
                    value={formData.flow_value}
                    onChange={handleInputChange}
                    className="border-blue-200"
                    required
                  />
                  <Select
                    value={formData.flow_unit}
                    onValueChange={(value) => handleSelectChange('flow_unit', value)}
                  >
                    <SelectTrigger className="w-[100px] border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg/s">kg/s</SelectItem>
                      <SelectItem value="m³/s">m³/s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="guarantee_point"
                  checked={formData.guarantee_point}
                  onCheckedChange={(checked) => handleCheckboxChange('guarantee_point', checked === true)}
                />
                <Label htmlFor="guarantee_point">Guarantee Point</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="suppress"
                  checked={formData.suppress}
                  onCheckedChange={(checked) => handleCheckboxChange('suppress', checked === true)}
                />
                <Label htmlFor="suppress">Suppress</Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Case...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Add Case
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </DashboardShell>
  );
} 
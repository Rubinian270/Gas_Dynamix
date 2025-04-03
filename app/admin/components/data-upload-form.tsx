"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function DataUploadForm() {
  const [formData, setFormData] = useState({
    name: "",
    molecular_weight: 0,
    density: 0,
    critical_pressure: 0,
    critical_temperature: 0,
    boiling_point: 0,
    toxicity: false,
    explosive: false,
    flammable: false,
    corrosive: false,
    oxidizing: false,
    sour: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      // Convert numeric values to numbers
      const numValue = parseFloat(value);
      setFormData((prev) => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch("https://gaxmixer-production.up.railway.app/admin/single-gase/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload gas data");
      }

      // Cache the gas name before resetting the form
      const gasName = formData.name;
      
      // Reset form
      setSubmitStatus("success");
      setFormData({
        name: "",
        molecular_weight: 0,
        density: 0,
        critical_pressure: 0,
        critical_temperature: 0,
        boiling_point: 0,
        toxicity: false,
        explosive: false,
        flammable: false,
        corrosive: false,
        oxidizing: false,
        sour: false
      });
      
      // Show success toast notification
      toast({
        title: "Gas Data Uploaded Successfully!",
        description: `The gas "${gasName}" has been added to the database and is now available for use in projects.`,
        variant: "default",
        className: "bg-green-50 border border-green-200 text-green-800",
      });
      
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
      
      // Show error toast notification
      toast({
        title: "Error Uploading Gas Data",
        description: error instanceof Error ? error.message : "An error occurred while uploading gas data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster />
      {submitStatus === "success" && (
        <Alert className="bg-green-50 border-green-200 text-green-800 shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-1 rounded-full mr-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <AlertDescription className="font-medium text-green-800">Gas data successfully uploaded!</AlertDescription>
              <p className="text-sm mt-1 text-green-700">
                The gas data has been added to the database and is now available for use in projects.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <X className="h-4 w-4 text-red-500" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Gas Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter gas name"
          value={formData.name}
          onChange={handleTextChange}
          required
          className="border-blue-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="molecular_weight">Molecular Weight (g/mol)</Label>
          <Input
            id="molecular_weight"
            name="molecular_weight"
            type="number"
            step="0.01"
            placeholder="Enter molecular weight"
            value={formData.molecular_weight || ""}
            onChange={handleTextChange}
            required
            className="border-blue-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="density">Density (kg/m³)</Label>
          <Input
            id="density"
            name="density"
            type="number"
            step="0.01"
            placeholder="Enter density"
            value={formData.density || ""}
            onChange={handleTextChange}
            required
            className="border-blue-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="critical_pressure">Critical Pressure (MPa)</Label>
          <Input
            id="critical_pressure"
            name="critical_pressure"
            type="number"
            step="0.01"
            placeholder="Enter critical pressure"
            value={formData.critical_pressure || ""}
            onChange={handleTextChange}
            required
            className="border-blue-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="critical_temperature">Critical Temperature (K)</Label>
          <Input
            id="critical_temperature"
            name="critical_temperature"
            type="number"
            step="0.01"
            placeholder="Enter critical temperature"
            value={formData.critical_temperature || ""}
            onChange={handleTextChange}
            required
            className="border-blue-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="boiling_point">Boiling Point (K)</Label>
          <Input
            id="boiling_point"
            name="boiling_point"
            type="number"
            step="0.01"
            placeholder="Enter boiling point"
            value={formData.boiling_point || ""}
            onChange={handleTextChange}
            required
            className="border-blue-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">Gas Properties</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="toxicity" 
              checked={formData.toxicity}
              onCheckedChange={(checked) => handleCheckboxChange("toxicity", checked === true)}
            />
            <Label htmlFor="toxicity" className="font-normal">Toxicity</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="explosive" 
              checked={formData.explosive}
              onCheckedChange={(checked) => handleCheckboxChange("explosive", checked === true)}
            />
            <Label htmlFor="explosive" className="font-normal">Explosive</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="flammable" 
              checked={formData.flammable}
              onCheckedChange={(checked) => handleCheckboxChange("flammable", checked === true)}
            />
            <Label htmlFor="flammable" className="font-normal">Flammable</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="corrosive" 
              checked={formData.corrosive}
              onCheckedChange={(checked) => handleCheckboxChange("corrosive", checked === true)}
            />
            <Label htmlFor="corrosive" className="font-normal">Corrosive</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="oxidizing" 
              checked={formData.oxidizing}
              onCheckedChange={(checked) => handleCheckboxChange("oxidizing", checked === true)}
            />
            <Label htmlFor="oxidizing" className="font-normal">Oxidizing</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sour" 
              checked={formData.sour}
              onCheckedChange={(checked) => handleCheckboxChange("sour", checked === true)}
            />
            <Label htmlFor="sour" className="font-normal">Sour</Label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Gas Data"
        )}
      </Button>
    </form>
  );
} 
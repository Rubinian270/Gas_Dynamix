"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Upload, File, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function DataFileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<null | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadStatus(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("error");
      setErrorMessage("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Simulate upload progress (replace with actual implementation)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 10;
          return next > 90 ? 90 : next;
        });
      }, 300);

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch("https://gaxmixer-production.up.railway.app/admin/upload-gases-csv/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload file");
      }

      // Save file name before clearing
      const fileName = selectedFile.name;
      
      setUploadStatus("success");
      
      // Show success toast notification
      toast({
        title: "CSV File Uploaded Successfully!",
        description: `Data from "${fileName}" has been processed and is now available for your projects.`,
        variant: "default",
        className: "bg-green-50 border border-green-200 text-green-800",
      });
      
      // Reset form after successful upload
      setTimeout(() => {
        clearFile();
      }, 3000);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An error occurred during upload");
      
      // Show error toast notification
      toast({
        title: "Error Uploading File",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Toaster />
      {uploadStatus === "success" && (
        <Alert className="bg-green-50 border-green-200 text-green-800 shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-1 rounded-full mr-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <AlertDescription className="font-medium text-green-800">Gas data CSV file successfully uploaded!</AlertDescription>
              <p className="text-sm mt-1 text-green-700">
                All gas data from the CSV file has been processed and added to the database.
                The data is now available for use in your projects.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {uploadStatus === "error" && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <X className="h-4 w-4 text-red-500" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Upload Gas Data CSV File</Label>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            selectedFile 
              ? "border-blue-300 bg-blue-50" 
              : "border-blue-200 hover:border-blue-300 hover:bg-blue-50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
            disabled={isUploading}
          />
          
          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-blue-400" />
              <div className="text-sm text-blue-700">
                <span className="font-medium">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-blue-700/70">
                CSV file with gas data (max 10MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <File className="h-6 w-6 text-blue-500" />
                <div className="text-sm text-blue-700 truncate max-w-[180px]">
                  {selectedFile.name}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-red-500 hover:text-red-700"
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-blue-700">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <Button
        type="button"
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Gas Data CSV
          </>
        )}
      </Button>

      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800">
        <h4 className="font-medium mb-2">CSV Format Instructions</h4>
        <p className="mb-2">Your CSV file should have the following columns:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>name (text): Gas name</li>
          <li>molecular_weight (number): Molecular weight in g/mol</li>
          <li>density (number): Density in kg/m³</li>
          <li>critical_pressure (number): Critical pressure in MPa</li>
          <li>critical_temperature (number): Critical temperature in K</li>
          <li>boiling_point (number): Boiling point in K</li>
          <li>toxicity (boolean): true/false</li>
          <li>explosive (boolean): true/false</li>
          <li>flammable (boolean): true/false</li>
          <li>corrosive (boolean): true/false</li>
          <li>oxidizing (boolean): true/false</li>
          <li>sour (boolean): true/false</li>
        </ul>
      </div>
    </div>
  );
} 
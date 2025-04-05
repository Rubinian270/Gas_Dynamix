"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, PlayCircle, Download, RefreshCw } from "lucide-react";
import { DashboardHeader } from "../../../components/dashboard-header";
import { DashboardShell } from "../../../components/dashboard-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface AnalyticsResult {
  composition_analysis: {
    total_percentage: number;
    components: Array<{
      name: string;
      percentage: number;
      status: "normal" | "warning" | "critical";
    }>;
  };
  property_analysis: {
    molecular_weight: number;
    density: number;
    heating_value: number;
  };
  safety_analysis: {
    flammability_index: number;
    toxicity_level: "low" | "medium" | "high";
    corrosion_risk: "low" | "medium" | "high";
  };
}

export default function RunAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [cases, setCases] = useState<Array<{ id: string; name: string }>>([]);
  const [analyticsResult, setAnalyticsResult] = useState<AnalyticsResult | null>(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch(`https://gasdynamix-production.up.railway.app/projects/${id}/cases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }

      const data = await response.json();
      setCases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!selectedCase) {
      setError('Please select a case to analyze');
      return;
    }

    setAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch(`https://gasdynamix-production.up.railway.app/analytics/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          project_id: id,
          case_id: selectedCase
        })
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('Failed to run analysis');
      }

      const data = await response.json();
      setAnalyticsResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
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
        heading="Run Analytics"
        text="Analyze gas composition and properties."
      >
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={fetchCases}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {analyticsResult && (
            <Button className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          )}
        </div>
      </DashboardHeader>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card className="border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle>Analysis Configuration</CardTitle>
            <CardDescription>
              Select a case to analyze its gas composition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Case</Label>
              <Select
                value={selectedCase}
                onValueChange={setSelectedCase}
                disabled={loading || analyzing}
              >
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Select a case to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {cases.map(case_ => (
                    <SelectItem key={case_.id} value={case_.id}>
                      {case_.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={runAnalysis}
              disabled={!selectedCase || analyzing}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Run Analysis
                </>
              )}
            </Button>

            {analyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Analysis in progress...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {analyticsResult && (
          <Tabs defaultValue="composition" className="space-y-6">
            <TabsList className="bg-gradient-to-r from-blue-50 to-blue-100/70 p-1 border border-blue-100 rounded-lg">
              <TabsTrigger value="composition">Composition</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
            </TabsList>

            <TabsContent value="composition">
              <Card className="border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle>Composition Analysis</CardTitle>
                  <CardDescription>
                    Detailed breakdown of gas composition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-800">Total Percentage:</span>
                      <span className="text-2xl font-bold text-blue-700">
                        {analyticsResult.composition_analysis.total_percentage}%
                      </span>
                    </div>

                    <div className="divide-y divide-blue-100">
                      {analyticsResult.composition_analysis.components.map((component, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-3"
                        >
                          <span className="font-medium text-blue-800">{component.name}</span>
                          <div className="flex items-center gap-4">
                            <span className={getStatusColor(component.status)}>
                              {component.status}
                            </span>
                            <span className="font-medium text-blue-700">
                              {component.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties">
              <Card className="border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle>Physical Properties</CardTitle>
                  <CardDescription>
                    Calculated physical properties of the gas mixture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 mb-1">Molecular Weight</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {analyticsResult.property_analysis.molecular_weight} g/mol
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 mb-1">Density</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {analyticsResult.property_analysis.density} kg/m³
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 mb-1">Heating Value</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {analyticsResult.property_analysis.heating_value} MJ/kg
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety">
              <Card className="border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle>Safety Analysis</CardTitle>
                  <CardDescription>
                    Safety considerations and risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 mb-1">Flammability Index</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {analyticsResult.safety_analysis.flammability_index}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 mb-1">Toxicity Level</div>
                      <div className="text-2xl font-bold text-blue-800 capitalize">
                        {analyticsResult.safety_analysis.toxicity_level}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 mb-1">Corrosion Risk</div>
                      <div className="text-2xl font-bold text-blue-800 capitalize">
                        {analyticsResult.safety_analysis.corrosion_risk}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardShell>
  );
} 
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../../components/dashboard-header";
import { DashboardShell } from "../../components/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileSpreadsheet, Loader2, Pencil, ChartBar, FlaskRound, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CaseDetails } from "../components/case-details";
import { toast } from "@/components/ui/use-toast";

interface InletCondition {
  name: string;
  value: number | string;
  unit: string;
  id?: number;
  guarantee_point?: boolean;
  suppress?: boolean;
}

interface GasComposition {
  name: string;
  value: number;
  unit: string;
  id?: number;
}

interface CaseGasComposition {
  case_id: number;
  gas_compositions: GasComposition[];
}

type Case = {
  case_id: number;
  name: string;
  is_default: boolean;
  inlet_condition_id?: number;
  inlet_conditions: InletCondition[];
  gas_composition: GasComposition[];
  calculated_properties?: {
    molar_mass?: number;
    volumetric_flow?: number;
    standard_volumetric_flow?: number;
    vapor_mole_fraction?: number;
    relative_humidity?: number;
    specific_heat_cp?: number;
    specific_heat_cv?: number;
    specific_heat_ratio?: number;
    specific_gas_constant?: number;
    specific_gravity?: number;
    density?: number;
    compressibility_factor?: number;
    speed_of_sound?: number;
    dew_point?: number;
  };
};

type ProjectDetails = {
  project_id: number;
  name: string;
  description: string;
  created_at: string;
  cases: Case[];
};

interface GasCompositionResponse {
  case_id: number;
  gas_compositions: {
    id: number;
    name: string;
    value: number;
    unit: string;
  }[];
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
  }, [id]);

  const fetchProjectDetails = async (projectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }
      
      // Fetch all projects from the available endpoint
      const projectsResponse = await fetch('https://gaxmixer-production.up.railway.app/projects/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!projectsResponse.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const projects = await projectsResponse.json();
      
      // Find the selected project
      const selectedProject = projects.find(
        (p: any) => p.project_id === parseInt(projectId)
      );

      if (!selectedProject) {
        throw new Error('Project not found');
      }

      // Fetch gas compositions with error handling
      let gasCompositionsData = null;
      try {
        const gasCompositionsResponse = await fetch(
          `https://gaxmixer-production.up.railway.app/projects/${projectId}/gas_compositions3`,
          {
            method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!gasCompositionsResponse.ok) {
          throw new Error(`Failed to fetch gas compositions: ${gasCompositionsResponse.status}`);
        }

        gasCompositionsData = await gasCompositionsResponse.json();
        console.log('Fetched Gas Compositions:', gasCompositionsData);
      } catch (error) {
        console.error('Error fetching gas compositions:', error);
      }

      // Fetch inlet conditions with error handling
      let inletConditionsData = null;
      try {
        const inletConditionsResponse = await fetch(`https://gaxmixer-production.up.railway.app/projects/${projectId}/inlet_conditions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (inletConditionsResponse.ok) {
          inletConditionsData = await inletConditionsResponse.json();
          console.log('Inlet conditions:', inletConditionsData);
        } else {
          console.error('Failed to fetch inlet conditions:', inletConditionsResponse.status);
        }
      } catch (err) {
        console.error('Error fetching inlet conditions:', err);
      }
      
      // Fetch calculated properties with error handling
      let calculatedPropertiesData = null;
      try {
        const calculatedPropertiesResponse = await fetch(`https://gaxmixer-production.up.railway.app/projects/${projectId}/calculated_properties`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (calculatedPropertiesResponse.ok) {
          calculatedPropertiesData = await calculatedPropertiesResponse.json();
          console.log('Calculated properties:', calculatedPropertiesData);
        } else {
          console.error('Failed to fetch calculated properties:', calculatedPropertiesResponse.status);
        }
      } catch (err) {
        console.error('Error fetching calculated properties:', err);
      }

      // Process and combine the data
      const cases: Case[] = [];
      
      // Check if we have valid data structures
      if (inletConditionsData?.projects?.[0]?.cases) {
        const inletCases = inletConditionsData.projects[0].cases;
        const calculatedCases = calculatedPropertiesData?.projects?.[0]?.cases || [];
        const gasCases = gasCompositionsData?.projects?.[0]?.cases || [];
        
        console.log('Processing cases from backend:', {
          inletCases,
          calculatedCases,
          gasCases
        });

        // Sort inlet cases by case_number to ensure proper order
        const sortedInletCases = [...inletCases].sort((a, b) => 
          (a.case_number || 0) - (b.case_number || 0)
        );
        
        // Map through inlet conditions cases and find matching gas composition cases
        sortedInletCases.forEach((inletCase: any) => {
          console.log('Processing inlet case:', {
            case_id: inletCase.case_id,
            case_number: inletCase.case_number,
            inlet_conditions: inletCase.inlet_conditions
          });

          const matchingGasCase = gasCases.find(
            (gasCase: any) => gasCase.case_id === inletCase.case_id
          );
          
          const matchingCalculatedCase = calculatedCases.find((calcCase: any) => 
            calcCase.case_id === inletCase.case_id
          );
          
          // Create default inlet condition if none exists
          const inletCondition = inletCase.inlet_conditions?.[0] || {
            inlet_condition_id: null,
            ambient_pressure: 0,
            ambient_pressure_unit: "mbara",
            ambient_temperature: 0,
            ambient_temperature_unit: "°C",
            pressure: 0,
            pressure_unit: "Pa",
            temperature: 0,
            temperature_unit: "K",
            flow_value: 0,
            flow_unit: "kg/s",
            guarantee_point: false,
            suppress: false
          };
          
          // Transform the data to match our Case type
          const caseItem: Case = {
            case_id: inletCase.case_id,
            name: `Case ${inletCase.case_number || cases.length + 1}`,
            is_default: inletCase.case_number === 1,
            inlet_condition_id: inletCondition.inlet_condition_id,
            inlet_conditions: [
              { 
                name: "Description", 
                value: inletCase.name || `Case ${inletCase.case_number || cases.length + 1}`, 
                unit: "",
                id: inletCondition.inlet_condition_id,
                guarantee_point: inletCondition.guarantee_point,
                suppress: inletCondition.suppress
              },
              { 
                name: "ambient_pressure", 
                value: inletCondition.ambient_pressure || 0, 
                unit: inletCondition.ambient_pressure_unit || "mbara",
                id: inletCondition.inlet_condition_id,
                guarantee_point: inletCondition.guarantee_point,
                suppress: inletCondition.suppress
              },
              { 
                name: "ambient_temperature", 
                value: inletCondition.ambient_temperature || 0, 
                unit: inletCondition.ambient_temperature_unit || "°C",
                id: inletCondition.inlet_condition_id,
                guarantee_point: inletCondition.guarantee_point,
                suppress: inletCondition.suppress
              },
              { 
                name: "pressure", 
                value: inletCondition.pressure || 0, 
                unit: inletCondition.pressure_unit || "Pa",
                id: inletCondition.inlet_condition_id,
                guarantee_point: inletCondition.guarantee_point,
                suppress: inletCondition.suppress
              },
              { 
                name: "temperature", 
                value: inletCondition.temperature || 0, 
                unit: inletCondition.temperature_unit || "K",
                id: inletCondition.inlet_condition_id,
                guarantee_point: inletCondition.guarantee_point,
                suppress: inletCondition.suppress
              },
              { 
                name: "mass_flow", 
                value: inletCondition.flow_value || 0, 
                unit: inletCondition.flow_unit || "kg/s",
                id: inletCondition.inlet_condition_id,
                guarantee_point: inletCondition.guarantee_point,
                suppress: inletCondition.suppress
              }
            ],
            gas_composition: matchingGasCase?.gas_compositions?.map((gas: any) => ({
              id: gas.gas_id,
              gas_id: gas.gas_id,
              name: getGasName(gas.gas_id),
              value: gas.amount || 0,
              unit: gas.unit || "mol %"
            })) || []
          };
          
          // Add calculated properties if available
          if (matchingCalculatedCase && matchingCalculatedCase.calculated_properties) {
            // Check if the calculated_properties array is not empty
            if (matchingCalculatedCase.calculated_properties.length > 0) {
              // Get the last calculated property (most recent)
              const calcProps = matchingCalculatedCase.calculated_properties[matchingCalculatedCase.calculated_properties.length - 1];
              caseItem.calculated_properties = {
                molar_mass: calcProps.molar_mass,
                volumetric_flow: calcProps.volumetric_flow,
                standard_volumetric_flow: calcProps.standard_volumetric_flow,
                vapor_mole_fraction: calcProps.vapor_mole_fraction,
                relative_humidity: calcProps.relative_humidity,
                specific_heat_cp: calcProps.specific_heat_cp,
                specific_heat_cv: calcProps.specific_heat_cv,
                specific_heat_ratio: calcProps.specific_heat_ratio,
                specific_gas_constant: calcProps.specific_gas_constant,
                specific_gravity: calcProps.specific_gravity,
                density: calcProps.density,
                compressibility_factor: calcProps.compressibility_factor,
                speed_of_sound: calcProps.speed_of_sound,
                dew_point: calcProps.dew_point
              };
            }
          }
          
          console.log('Created case item:', {
            case_id: caseItem.case_id,
            name: caseItem.name,
            is_default: caseItem.is_default
          });
          
          cases.push(caseItem);
        });

        console.log('Final processed cases:', cases.map(c => ({
          case_id: c.case_id,
          name: c.name,
          is_default: c.is_default
        })));
      }
      
      // If no cases were found, show a message instead of creating a default case
      if (cases.length === 0) {
        toast({
          title: "No cases found",
          description: "Click 'Add a new operating case' to create your first case.",
          variant: "default",
        });
      }

      // Transform the data to match our ProjectDetails type
      const transformedProject: ProjectDetails = {
        project_id: selectedProject.project_id,
        name: selectedProject.name,
        description: selectedProject.description,
        created_at: selectedProject.created_at,
        cases: cases // Use only the cases from the backend
      };

      setProject(transformedProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching project details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy - h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to get gas name from gas_id
  function getGasName(gasId: number): string {
    const gasNames: Record<number, string> = {
      1: "hydrogen",
      2: "methane",
      3: "hydrogen_sulfide",
      4: "oxygen",
      5: "nitrogen",
      6: "ethane",
      7: "propane",
      8: "n-butane",
      9: "i-butane"
    };
    return gasNames[gasId] || `Gas ${gasId}`;
  }

  return (
    <DashboardShell>
      <Button
        variant="ghost"
        className="mb-4 -ml-4 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>

      {loading ? (
        <div className="flex justify-center items-center py-40">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
          <span className="text-blue-700 text-lg">Loading project details...</span>
        </div>
      ) : error ? (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : project ? (
        <>
          <DashboardHeader 
            heading={project.name} 
            text={project.description}
          >
            {/* <Button className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Project
            </Button> */}
          </DashboardHeader>

          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            <Card className="bg-white/95 shadow-md border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-blue-800">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm pt-0">
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-blue-600">Project ID:</span>
                  <span className="font-medium">{project.project_id}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-blue-600">Cases:</span>
                  <span className="font-medium">{project.cases.length}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-blue-600">Created on:</span>
                  <span className="font-medium">{formatDate(project.created_at)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white shadow-md border-blue-100">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-medium text-blue-800">Quick Actions</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                      onClick={() => {
                        // PDF export logic will be implemented
                        toast({
                          title: "Coming Soon",
                          description: "PDF export functionality will be available soon!",
                        });
                      }}
                    >
                      Export as PDF
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                      onClick={() => {
                        // Excel export logic will be implemented
                        toast({
                          title: "Coming Soon",
                          description: "Excel export functionality will be available soon!",
                        });
                      }}
                    >
                      Export as Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full justify-start"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('access_token');
                        if (!token) {
                          throw new Error('Authentication required. Please login again.');
                        }

                        const response = await fetch(`https://gaxmixer-production.up.railway.app/projects/${id}/cases/`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ project_id: id }),
                        });

                        if (!response.ok) {
                          throw new Error('Failed to add case');
                        }

                        // Refresh data after adding a case
                        fetchProjectDetails(id as string);
                        toast({
                          title: "Success",
                          description: "Case added successfully!",
                        });
                      } catch (error) {
                        console.error('Error adding case:', error);
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: error instanceof Error ? error.message : 'An error occurred',
                        });
                      }
                    }}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Add a new operating case
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full justify-start"
                    onClick={() => fetchProjectDetails(id as string)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full justify-start"
                    onClick={() => router.push(`/dashboard/projects/${id}/run-analytics`)}
                  >
                    <FlaskRound className="mr-2 h-4 w-4" />
                    Run Analysis
                  </Button>
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full justify-start text-left">
                    <Pencil className="mr-2 h-4 w-4 shrink-0" />
                    Edit Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="cases" className="space-y-6">
            <TabsList className="bg-gradient-to-r from-blue-50 to-blue-100/70 p-1 border border-blue-100 rounded-lg shadow-sm">
              <TabsTrigger
                value="cases"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800"
              >
                Cases
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cases" className="space-y-6">
              {project.cases.map(caseItem => (
                <CaseDetails
                  key={caseItem.case_id}
                  projectId={project.project_id}
                  caseId={caseItem.case_id}
                  name={caseItem.name}
                  inletConditions={caseItem.inlet_conditions}
                  gasComposition={caseItem.gas_composition}
                  calculatedProperties={{
                    molar_mass: caseItem.calculated_properties?.molar_mass,
                    volumetric_flow: caseItem.calculated_properties?.volumetric_flow,
                    standard_volumetric_flow: caseItem.calculated_properties?.standard_volumetric_flow,
                    vapor_mole_fraction: caseItem.calculated_properties?.vapor_mole_fraction,
                    relative_humidity: caseItem.calculated_properties?.relative_humidity,
                    specific_heat_cp: caseItem.calculated_properties?.specific_heat_cp,
                    specific_heat_cv: caseItem.calculated_properties?.specific_heat_cv,
                    specific_heat_ratio: caseItem.calculated_properties?.specific_heat_ratio,
                    specific_gas_constant: caseItem.calculated_properties?.specific_gas_constant,
                    specific_gravity: caseItem.calculated_properties?.specific_gravity,
                    density: caseItem.calculated_properties?.density,
                    compressibility_factor: caseItem.calculated_properties?.compressibility_factor,
                    speed_of_sound: caseItem.calculated_properties?.speed_of_sound,
                    dew_point: caseItem.calculated_properties?.dew_point
                  }}
                  onCalculate={() => fetchProjectDetails(id as string)}
                />
              ))}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card className="border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    View analytical insights based on your project data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 bg-blue-50/50 rounded-lg border border-blue-100">
                    <p className="text-blue-700">
                      Select a case to view analytics and visualizations
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                  <CardDescription>
                    Manage project settings and configurations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 bg-blue-50/50 rounded-lg border border-blue-100">
                    <p className="text-blue-700">
                      Project settings interface will be available soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-40">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Project not found</h2>
          <p className="text-blue-600 mb-6">The project you're looking for doesn't exist or has been removed</p>
          <Link href="/dashboard/projects">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              Return to Projects
            </Button>
          </Link>
        </div>
      )}
    </DashboardShell>
  );
}


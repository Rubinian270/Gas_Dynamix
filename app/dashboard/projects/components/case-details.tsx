"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Database, X, Loader2, Save, Edit, Calculator, CheckCircle2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { SelectGasModal } from "./select-gas-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

// Add these enums at the top of the file, after imports
enum PressureUnit {
  BAR = "bar",
  ATM = "atm",
  PA = "Pa"
}

enum TemperatureUnit {
  CELSIUS = "C",
  FAHRENHEIT = "F",
  KELVIN = "K"
}

enum FlowUnit {
  KG_S = "kg/s",
  
  M3_s = "m³/s",
  SLPM = "SLPM"
}

type InletCondition = {
  name: string;
  value: number | string;
  unit: string;
  id?: number; // Added for backend reference
};

type GasComposition = {
  name: string;
  value: number;
  unit: string;
  id?: number; // Added for backend reference
};

interface CaseDetailsProps {
  key: number;
  projectId: number; // Added project ID
  caseId: number; // Added case ID
  name: string;
  inletConditions: { name: string; value: string | number; unit: string; id?: number }[];
  gasComposition: { name: string; value: number; unit: string; id?: number }[];
  calculatedProperties?: {
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
  onCalculate?: () => void; // Add a callback to refresh data after calculation
}

export function CaseDetails({ 
  projectId,
  caseId,
  name, 
  inletConditions: initialInletConditions, 
  gasComposition: initialGasComposition,
  calculatedProperties,
  onCalculate
}: CaseDetailsProps) {
  const [isSelectGasOpen, setIsSelectGasOpen] = useState(false);
  const [inletConditions, setInletConditions] = useState(initialInletConditions);
  const [gasComposition, setGasComposition] = useState(initialGasComposition);
  const [editingInlet, setEditingInlet] = useState<number | null>(null);
  const [editingGas, setEditingGas] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string | number>("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("inlet");
  
  // New state for section editing
  const [editingInletSection, setEditingInletSection] = useState(false);
  const [editingGasSection, setEditingGasSection] = useState(false);
  const [editedInletValues, setEditedInletValues] = useState<Record<number, string | number>>({});
  const [editedGasValues, setEditedGasValues] = useState<Record<number, number>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationSuccess, setCalculationSuccess] = useState(false);
  const [editedInletUnits, setEditedInletUnits] = useState<Record<number, string>>({});

  const selectedGases = gasComposition.map((gas, index) => ({
    id: gas.id || index + 1,
    name: gas.name
  }));

  const totalComposition = gasComposition.reduce((sum, gas) => sum + gas.value, 0);

  const handleGasSelection = (gases: { id: number; name: string }[]) => {
    // Handle gas selection (no-op for demo)
  };

  // Individual field editing functions
  const startEditingInlet = (index: number, value: string | number) => {
    if (!editingInletSection) {
      setEditingInlet(index);
      setEditValue(value);
    }
  };

  const startEditingGas = (index: number, value: number) => {
    if (!editingGasSection) {
      setEditingGas(index);
      setEditValue(value);
    }
  };

  // Section editing functions
  const startEditingInletSection = () => {
    setEditingInletSection(true);
    // Initialize edited values with current values
    const initialValues: Record<number, string | number> = {};
    inletConditions.forEach((condition, index) => {
      initialValues[index] = condition.value;
    });
    setEditedInletValues(initialValues);
  };

  const startEditingGasSection = () => {
    setEditingGasSection(true);
    // Initialize edited values with current values
    const initialValues: Record<number, number> = {};
    gasComposition.forEach((gas, index) => {
      initialValues[index] = gas.value;
    });
    setEditedGasValues(initialValues);
  };

  const cancelEditingInletSection = () => {
    setEditingInletSection(false);
    setEditedInletValues({});
  };

  const cancelEditingGasSection = () => {
    setEditingGasSection(false);
    setEditedGasValues({});
  };

  const handleInletValueChange = (index: number, value: string | number) => {
    setEditedInletValues({
      ...editedInletValues,
      [index]: value
    });
  };

  const handleGasValueChange = (index: number, value: string) => {
    setEditedGasValues({
      ...editedGasValues,
      [index]: parseFloat(value)
    });
  };

  // Save individual inlet condition
  const saveInletCondition = async (index: number) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const condition = inletConditions[index];
      const conditionId = condition.id || index + 1;
      
      // Create payload based on the condition type
      const payload = {
        description: index === 0 ? editValue : undefined,
        ambient_pressure: index === 1 ? Number(editValue) : undefined,
        ambient_pressure_unit: index === 1 ? condition.unit : undefined,
        ambient_temperature: index === 2 ? Number(editValue) : undefined,
        ambient_temperature_unit: index === 2 ? condition.unit : undefined,
        pressure: index === 3 ? Number(editValue) : undefined,
        pressure_unit: index === 3 ? condition.unit : undefined,
        temperature: index === 4 ? Number(editValue) : undefined,
        temperature_unit: index === 4 ? condition.unit : undefined,
        flow_value: index === 5 ? Number(editValue) : undefined,
        flow_unit: index === 5 ? condition.unit : undefined,
        flow_type: "Mass flow",
        guarantee_point: false,
        suppress: false
      };
      
      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/inlet/${conditionId}/update/`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to update ${condition.name}`);
      }

      // Update local state
      const updatedInletConditions = [...inletConditions];
      updatedInletConditions[index] = {
        ...updatedInletConditions[index],
        value: editValue
      };
      
      setInletConditions(updatedInletConditions);
      setEditingInlet(null);
      
      toast({
        title: "Success",
        description: `${condition.name} updated successfully`,
        variant: "default",
      });
      
      // Refresh data from server
      if (onCalculate) {
        onCalculate();
      }
    } catch (error) {
      console.error('Error updating inlet condition:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update inlet condition",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save all inlet conditions
  const saveAllInletConditions = async () => {
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Create a complete payload with all inlet conditions
      const payload = {
        description: editedInletValues[0] !== undefined ? editedInletValues[0] : inletConditions[0].value,
        ambient_pressure: Number(editedInletValues[1] !== undefined ? editedInletValues[1] : inletConditions[1].value),
        ambient_pressure_unit: editedInletUnits[1] !== undefined ? editedInletUnits[1] : inletConditions[1].unit,
        ambient_temperature: Number(editedInletValues[2] !== undefined ? editedInletValues[2] : inletConditions[2].value),
        ambient_temperature_unit: editedInletUnits[2] !== undefined ? editedInletUnits[2] : inletConditions[2].unit,
        pressure: Number(editedInletValues[3] !== undefined ? editedInletValues[3] : inletConditions[3].value),
        pressure_unit: editedInletUnits[3] !== undefined ? editedInletUnits[3] : inletConditions[3].unit,
        temperature: Number(editedInletValues[4] !== undefined ? editedInletValues[4] : inletConditions[4].value),
        temperature_unit: editedInletUnits[4] !== undefined ? editedInletUnits[4] : inletConditions[4].unit,
        flow_type: "Mass flow",
        flow_value: Number(editedInletValues[5] !== undefined ? editedInletValues[5] : inletConditions[5].value),
        flow_unit: editedInletUnits[5] !== undefined ? editedInletUnits[5] : inletConditions[5].unit,
        guarantee_point: false,
        suppress: false
      };

      // Get the inlet condition ID from the first condition
      const inletConditionId = inletConditions[0].id;
      if (!inletConditionId) {
        throw new Error('No inlet condition ID found');
      }

      // Log the payload being sent to backend
      console.log('Saving all inlet conditions:', {
        projectId,
        caseId,
        inletConditionId,
        payload
      });

      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/inlet/${inletConditionId}/update/`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update inlet conditions: ${response.status} ${errorText}`);
      }

      // Update local state with all the new values
      const updatedInletConditions = inletConditions.map((condition, index) => ({
        ...condition,
        value: editedInletValues[index] !== undefined ? editedInletValues[index] : condition.value,
        unit: editedInletUnits[index] !== undefined ? editedInletUnits[index] : condition.unit
      }));

      setInletConditions(updatedInletConditions);
        setEditingInletSection(false);
        setEditedInletValues({});
        setEditedInletUnits({});
        
        toast({
          title: "Success",
          description: "All inlet conditions updated successfully",
        });
        
        // Refresh data from server
        if (onCalculate) {
          onCalculate();
      }
    } catch (error) {
      console.error('Error saving inlet conditions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update inlet conditions",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save all gas compositions
  const saveAllGasCompositions = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Create an array of promises for each update
      const updatePromises = Object.entries(editedGasValues).map(async ([indexStr, value]) => {
        const index = parseInt(indexStr);
        const gas = gasComposition[index];
        const gasId = gas.id || index + 1;
        
        const payload = {
          amount: value,
          unit: gas.unit
        };
        
        const response = await fetch(
          `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/gases/${gasId}/update/`, 
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to update gas composition for ${gas.name}`);
        }
        
        return { index, value };
      });
      
      // Wait for all updates to complete
      const results = await Promise.all(updatePromises);
      
      // Update local state with all the new values
      const updatedGasComposition = [...gasComposition];
      results.forEach(({ index, value }) => {
        updatedGasComposition[index] = {
          ...updatedGasComposition[index],
          value
        };
      });
      
      setGasComposition(updatedGasComposition);
      
      toast({
        title: "Success",
        description: "All gas compositions updated successfully",
        variant: "default",
      });
      
      setEditingGasSection(false);
    } catch (error) {
      console.error('Error updating gas compositions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update gas compositions",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save individual gas composition
  const saveGasComposition = async (index: number) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const gas = gasComposition[index];
      if (!gas.gas_id) {
        throw new Error('Gas ID is required');
      }
      
      // Create payload with proper structure
      const payload = {
        amount: Number(editValue),
        unit: gas.unit,
        name: gas.name // Include the gas name in the payload
      };

      console.log('Saving gas composition:', {
        projectId,
        caseId,
        gasId: gas.gas_id,
        payload
      });
      
      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/gases/${gas.gas_id}/update/`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to update gas composition for ${gas.name}: ${response.status} ${response.statusText}`);
      }

      // Update local state
      const updatedGasComposition = [...gasComposition];
      updatedGasComposition[index] = {
        ...updatedGasComposition[index],
        value: Number(editValue)
      };
      
      setGasComposition(updatedGasComposition);
      setEditingGas(null);
      
      toast({
        title: "Success",
        description: `${gas.name} composition updated successfully`,
        variant: "default",
      });
      
      // Refresh data from server
      if (onCalculate) {
        onCalculate();
      }
    } catch (error) {
      console.error('Error updating gas composition:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update gas composition",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'inlet' | 'gas', index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'inlet') {
        saveInletCondition(index);
      } else {
        saveGasComposition(index);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (type === 'inlet') {
        setEditingInlet(null);
      } else {
        setEditingGas(null);
      }
    }
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (calculationSuccess) {
      timer = setTimeout(() => {
        setCalculationSuccess(false);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [calculationSuccess]);

  // Update the calculate function
  const calculateResults = async () => {
    try {
      setIsCalculating(true);
      setCalculationSuccess(false);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/calculate/`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to calculate results');
      }
      
      toast({
        title: "Calculation successful",
        description: "The results have been calculated successfully.",
        variant: "default",
      });
      
      setCalculationSuccess(true);
      
      // Call the callback to refresh data
      if (onCalculate) {
        onCalculate();
      }
    } catch (err) {
      console.error('Error calculating results:', err);
      toast({
        title: "Calculation failed",
        description: err instanceof Error ? err.message : "An error occurred during calculation",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Update the formatCalculatedValue function
  const formatCalculatedValue = (value: number | undefined, defaultText: string = "To be calculated") => {
    return value !== undefined && value !== 0 ? value.toString() : defaultText;
  };

  return (
    <Card className="border-blue-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-2">
        <CardTitle className="text-sm font-medium text-blue-800 flex items-center justify-between">
          <span>{name}</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={calculateResults}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="h-3 w-3 mr-1" /> Calculate Results
                  </>
                )}
              </Button>
              
              {calculationSuccess && (
                <div className="absolute -right-4 -top-4 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 border border-green-200 shadow-sm animate-fadeIn">
                  <CheckCircle2 className="h-3 w-3" /> Calculated!
                </div>
              )}
            </div>
            <span className="text-xs text-blue-600">Case Details</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inlet" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-blue-50/50 p-1 border border-blue-100 rounded-md">
            <TabsTrigger value="inlet" className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700">
              Project Properties
            </TabsTrigger>
            <TabsTrigger value="gas" className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700">
              Gas Composition
            </TabsTrigger>
            {calculatedProperties && (
              <TabsTrigger value="calculated" className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700">
                Calculated Properties
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="inlet" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-blue-800">Project properties</h3>
                {!editingInletSection ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={startEditingInletSection}
                  >
                    <Edit className="h-3 w-3 mr-1" /> Edit All
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs border-red-200 text-red-700 hover:bg-red-50"
                      onClick={cancelEditingInletSection}
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs border-green-200 text-green-700 hover:bg-green-50"
                      onClick={saveAllInletConditions}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />} 
                      Save All
                    </Button>
                  </div>
                )}
              </div>
              <Table>
                <TableHeader className="bg-blue-50/50">
                  <TableRow className="h-6">
                    <TableHead className="w-1/3 py-1 text-xs font-medium">Property</TableHead>
                    <TableHead className="w-24 py-1 text-xs font-medium">UoM</TableHead>
                    <TableHead className="py-1 text-xs font-medium">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inletConditions.map((condition, index) => (
                    <TableRow key={index} className="h-6 hover:bg-blue-50/30">
                      <TableCell className="py-0.5 text-xs text-blue-800">
                        {condition.name}
                      </TableCell>
                      <TableCell className="py-0.5 text-xs text-blue-600">
                        {editingInletSection ? (
                          <select
                            value={editedInletUnits[index] !== undefined ? editedInletUnits[index] : condition.unit}
                            onChange={(e) => setEditedInletUnits({
                              ...editedInletUnits,
                              [index]: e.target.value
                            })}
                            className="w-full bg-white border border-blue-200 p-0.5 text-xs focus:ring-1 focus:ring-blue-300 rounded"
                          >
                            {condition.name.toLowerCase().includes('pressure') && (
                              Object.values(PressureUnit).map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))
                            )}
                            {condition.name.toLowerCase().includes('temperature') && (
                              Object.values(TemperatureUnit).map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))
                            )}
                            {condition.name.toLowerCase().includes('flow') && (
                              Object.values(FlowUnit).map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))
                            )}
                          </select>
                        ) : (
                          condition.unit
                        )}
                      </TableCell>
                      <TableCell className="py-0.5 relative">
                        {editingInlet === index && !editingInletSection ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, 'inlet', index)}
                              className="w-full bg-white border border-blue-200 p-0.5 text-xs focus:ring-1 focus:ring-blue-300 rounded"
                              autoFocus
                            />
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-5 w-5 p-0 ml-1"
                              onClick={() => saveInletCondition(index)}
                              disabled={isSaving}
                            >
                              {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            </Button>
                          </div>
                        ) : editingInletSection ? (
                          <input
                            type="text"
                            value={editedInletValues[index] !== undefined ? editedInletValues[index] : condition.value}
                            onChange={(e) => handleInletValueChange(index, e.target.value)}
                            className="w-full bg-white border border-blue-200 p-0.5 text-xs focus:ring-1 focus:ring-blue-300 rounded"
                          />
                        ) : (
                          <input
                            type="text"
                            value={condition.value}
                            className="w-full bg-transparent border-0 p-0 text-xs focus:ring-0 cursor-pointer hover:bg-blue-50"
                            onClick={() => startEditingInlet(index, condition.value)}
                            readOnly
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="h-6">
                    <TableCell className="py-0.5 text-xs">Guarantee point</TableCell>
                    <TableCell colSpan={2} className="py-0.5">
                      <Checkbox checked={true} className="h-3 w-3" disabled />
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-6">
                    <TableCell className="py-0.5 text-xs">Suppress</TableCell>
                    <TableCell colSpan={2} className="py-0.5">
                      <Checkbox className="h-3 w-3" disabled />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="gas" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-blue-800">Gas composition</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setIsSelectGasOpen(true)}
                  >
                    Select gas components
                  </Button>
                  
                  {!editingGasSection ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={startEditingGasSection}
                    >
                      <Edit className="h-3 w-3 mr-1" /> Edit All
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 text-xs border-red-200 text-red-700 hover:bg-red-50"
                        onClick={cancelEditingGasSection}
                        disabled={isSaving}
                      >
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 text-xs border-green-200 text-green-700 hover:bg-green-50"
                        onClick={saveAllGasCompositions}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />} 
                        Save All
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Table>
                <TableHeader className="bg-blue-50/50">
                  <TableRow className="h-6">
                    <TableHead className="w-8 py-1 text-xs font-medium">#</TableHead>
                    <TableHead className="py-1 text-xs font-medium">Component</TableHead>
                    <TableHead className="w-24 py-1 text-xs font-medium text-right">mol %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gasComposition.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-4 text-center text-sm text-blue-600">
                        No gas components selected. Please click "Select gas components" to add gases.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {gasComposition.map((gas, index) => (
                        <TableRow key={gas.id || index} className="h-6 hover:bg-blue-50/30">
                          <TableCell className="py-0.5 text-xs">{index + 1}</TableCell>
                          <TableCell className="py-0.5 text-xs text-blue-800">
                            {gas.name}
                          </TableCell>
                          <TableCell className="py-0.5 text-right relative">
                            {editingGas === index && !editingGasSection ? (
                              <div className="flex items-center justify-end">
                                <input
                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, 'gas', index)}
                                  className="w-full bg-white border border-blue-200 p-0.5 text-xs focus:ring-1 focus:ring-blue-300 rounded text-right"
                                  step="0.001"
                                  min="0"
                                  max="100"
                                  autoFocus
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-5 w-5 p-0 ml-1"
                                  onClick={() => saveGasComposition(index)}
                                  disabled={isSaving}
                                >
                                  {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                </Button>
                              </div>
                            ) : editingGasSection ? (
                              <input
                                type="number"
                                value={editedGasValues[index] !== undefined ? editedGasValues[index] : gas.value}
                                onChange={(e) => handleGasValueChange(index, e.target.value)}
                                className="w-full bg-white border border-blue-200 p-0.5 text-xs focus:ring-1 focus:ring-blue-300 rounded text-right"
                                step="0.001"
                                min="0"
                                max="100"
                              />
                            ) : (
                              <input
                                type="text"
                                value={gas.value.toFixed(3)}
                                className="w-full bg-transparent border-0 p-0 text-xs focus:ring-0 text-right cursor-pointer hover:bg-blue-50"
                                onClick={() => startEditingGas(index, gas.value)}
                                readOnly
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="h-6 border-t border-blue-200">
                        <TableCell className="py-0.5" />
                        <TableCell className="py-0.5 text-xs font-medium text-blue-800">
                          Total
                        </TableCell>
                        <TableCell className="py-0.5 text-xs font-medium text-right">
                          {editingGasSection 
                            ? Object.values(editedGasValues).reduce((sum, val) => sum + (val || 0), 0).toFixed(3)
                            : totalComposition.toFixed(3)
                          }
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1">
                  <Checkbox id="assume-100" className="h-3 w-3" />
                  <label htmlFor="assume-100" className="text-xs text-blue-700">
                    Assume composition as 100%
                  </label>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Finish
                </button>
              </div>
            </div>
          </TabsContent>
          
          {calculatedProperties && (
            <TabsContent value="calculated" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-800">Calculated properties</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-50 border-b border-blue-100">
                        <th className="py-2 px-3 text-left text-sm font-medium text-blue-700">Property</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-blue-700">Value</th>
                        <th className="py-2 px-3 text-left text-sm font-medium text-blue-700">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Molar mass</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.molar_mass)}</td>
                        <td className="py-2 px-3 text-sm">kg/mol</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Volumetric flow</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.volumetric_flow)}</td>
                        <td className="py-2 px-3 text-sm">m³/h</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Standard volumetric flow</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.standard_volumetric_flow)}</td>
                        <td className="py-2 px-3 text-sm">Nm³/h, DIN 1343</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Vapour mole fraction</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.vapor_mole_fraction)}</td>
                        <td className="py-2 px-3 text-sm"></td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Relative humidity</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.relative_humidity)}</td>
                        <td className="py-2 px-3 text-sm">%</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Specific heat capacity (Cp)</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_heat_cp)}</td>
                        <td className="py-2 px-3 text-sm">J/(kg·K)</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Specific heat capacity (Cv)</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_heat_cv)}</td>
                        <td className="py-2 px-3 text-sm">J/(kg·K)</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Specific heat ratio</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_heat_ratio)}</td>
                        <td className="py-2 px-3 text-sm"></td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Specific gas constant</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_gas_constant)}</td>
                        <td className="py-2 px-3 text-sm">J/(kg·K)</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Specific gravity</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_gravity)}</td>
                        <td className="py-2 px-3 text-sm"></td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Density</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.density)}</td>
                        <td className="py-2 px-3 text-sm">kg/m³</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Compressibility factor</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.compressibility_factor)}</td>
                        <td className="py-2 px-3 text-sm"></td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Speed of sound</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.speed_of_sound)}</td>
                        <td className="py-2 px-3 text-sm">m/s</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                        <td className="py-2 px-3 text-sm text-blue-700">Dew point</td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.dew_point)}</td>
                        <td className="py-2 px-3 text-sm">°C</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={onCalculate}
                    disabled={isCalculating}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    onClick={calculateResults}
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-4 w-4" />
                        Calculate
                      </>
                    )}
                  </Button>
                  </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <SelectGasModal
          isOpen={isSelectGasOpen}
          onClose={() => setIsSelectGasOpen(false)}
          onSelect={handleGasSelection}
          initialSelected={selectedGases}
          projectId={projectId}
        />
      </CardContent>
    </Card>
  );
}

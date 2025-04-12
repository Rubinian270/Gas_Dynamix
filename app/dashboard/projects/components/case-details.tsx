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

enum FlowType {
  MASS_FLOW = "Mass flow",
  STANDARD_VOLUMETRIC_FLOW = "Standard volumetric flow",
  VOLUMETRIC_FLOW = "Volumetric flow"
}

enum FlowUnit {
  KG_S = "kg/s",
  M3_s = "m³/s",
  SLPM = "SLPM"
}

enum GasUnit {
  MOL_PERCENT = "mol %",
  WEIGHT_PERCENT = "weight %",
  MOL_FRACTION = "mol fraction",
  WEIGHT_FRACTION = "weight fraction"
}

type InletCondition = {
  name: string;
  value: number | string;
  unit: string;
  id?: number;
  guarantee_point?: boolean;
  suppress?: boolean;
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
  guaranteePoint?: boolean; // Add these new props
  suppress?: boolean;
}

export function CaseDetails({ 
  projectId,
  caseId,
  name, 
  inletConditions: initialInletConditions, 
  gasComposition: initialGasComposition,
  calculatedProperties,
  onCalculate,
  guaranteePoint: initialGuaranteePoint = false,
  suppress: initialSuppress = false
}: CaseDetailsProps) {
  const [isSelectGasOpen, setIsSelectGasOpen] = useState(false);
  const [inletConditions, setInletConditions] = useState(initialInletConditions);
  const [gasComposition, setGasComposition] = useState(initialGasComposition);
  const [editingInlet, setEditingInlet] = useState<number | null>(null);
  const [editingGas, setEditingGas] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string | number>("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("gas");
  
  // New state for section editing
  const [editingInletSection, setEditingInletSection] = useState(false);
  const [editingGasSection, setEditingGasSection] = useState(false);
  const [editedInletValues, setEditedInletValues] = useState<Record<number, string | number>>({});
  const [editedGasValues, setEditedGasValues] = useState<Record<number, number>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationSuccess, setCalculationSuccess] = useState(false);
  const [editedInletUnits, setEditedInletUnits] = useState<Record<number, string>>({});
  const [guaranteePoint, setGuaranteePoint] = useState(initialInletConditions[0]?.guarantee_point || false);
  const [suppress, setSuppress] = useState(initialInletConditions[0]?.suppress || false);
  const [editedGuaranteePoint, setEditedGuaranteePoint] = useState(initialInletConditions[0]?.guarantee_point || false);
  const [editedSuppress, setEditedSuppress] = useState(initialInletConditions[0]?.suppress || false);
  const [editedFlowType, setEditedFlowType] = useState<string>(FlowType.MASS_FLOW);

  // Initialize flow type state with a default value
  const [currentFlowType, setCurrentFlowType] = useState<string>(FlowType.MASS_FLOW);

  // Add useEffect to initialize flow type from inlet conditions if available
  useEffect(() => {
    const flowTypeFromInlet = initialInletConditions.find(condition => condition.name === "Flow type");
    if (flowTypeFromInlet) {
      setCurrentFlowType(flowTypeFromInlet.value as string);
      setEditedFlowType(flowTypeFromInlet.value as string);
    }
  }, [initialInletConditions]);

  const selectedGases = gasComposition.map((gas, index) => ({
    id: gas.id || index + 1,
    name: gas.name
  }));

  const totalComposition = gasComposition.reduce((sum, gas) => sum + gas.value, 0);

  const handleGasSelection = async (gases: { id: number; name: string }[]) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Create payload for selected gases
      const payload = gases.map(gas => ({
        gas_id: gas.id,
        amount: 0,
        unit: GasUnit.MOL_PERCENT
      }));

      console.log('Sending gas selection payload:', payload);

      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/gases/update_new/`,
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
        throw new Error('Failed to update gas selection');
      }

      const data = await response.json();
      console.log('Gas selection response:', data);

      toast({
        title: "Success",
        description: "Gas components updated successfully",
        variant: "default",
      });

      // Close the modal
      setIsSelectGasOpen(false);

      // If this is a new project (no existing gas composition)
      if (gasComposition.length === 0) {
        // Force reload the page to show newly selected gases
        window.location.reload();
      } else {
        // For existing projects, optionally refresh data without full page reload
        if (onCalculate) {
          onCalculate();
        }
      }
    } catch (error) {
      console.error('Error updating gas selection:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update gas selection",
        variant: "destructive",
      });
    }
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

      const inletConditionId = inletConditions[0].id;
      if (!inletConditionId) {
        throw new Error('No inlet condition ID found');
      }

      const payload = {
        description: editedInletValues[0] !== undefined ? String(editedInletValues[0]) : String(inletConditions[0].value),
        ambient_pressure: Number(editedInletValues[1] !== undefined ? editedInletValues[1] : inletConditions[1].value),
        ambient_pressure_unit: editedInletUnits[1] !== undefined ? editedInletUnits[1] : inletConditions[1].unit,
        ambient_temperature: Number(editedInletValues[2] !== undefined ? editedInletValues[2] : inletConditions[2].value),
        ambient_temperature_unit: editedInletUnits[2] !== undefined ? editedInletUnits[2] : inletConditions[2].unit,
        guarantee_point: editedGuaranteePoint,
        suppress: editedSuppress,
        pressure: Number(editedInletValues[3] !== undefined ? editedInletValues[3] : inletConditions[3].value),
        pressure_unit: editedInletUnits[3] !== undefined ? editedInletUnits[3] : inletConditions[3].unit,
        temperature: Number(editedInletValues[4] !== undefined ? editedInletValues[4] : inletConditions[4].value),
        temperature_unit: editedInletUnits[4] !== undefined ? editedInletUnits[4] : inletConditions[4].unit,
        flow_type: editedFlowType,
        flow_value: Number(editedInletValues[5] !== undefined ? editedInletValues[5] : inletConditions[5].value),
        flow_unit: editedInletUnits[5] !== undefined ? editedInletUnits[5] : inletConditions[5].unit
      };

      console.log('Sending payload:', payload);

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

      // Parse the response to get the updated values
      const updatedData = await response.json();
      console.log('Response data:', updatedData);

      // Update local state with the values from the backend response
      const updatedInletConditions = [
        { name: "Description", value: updatedData.description, unit: "" },
        { name: "Ambient pressure", value: updatedData.ambient_pressure, unit: updatedData.ambient_pressure_unit },
        { name: "Ambient temperature", value: updatedData.ambient_temperature, unit: updatedData.ambient_temperature_unit },
        { name: "Pressure", value: updatedData.pressure, unit: updatedData.pressure_unit },
        { name: "Temperature", value: updatedData.temperature, unit: updatedData.temperature_unit },
        { name: "Flow", value: updatedData.flow_value, unit: updatedData.flow_unit }
      ];

      setInletConditions(updatedInletConditions);
      setGuaranteePoint(updatedData.guarantee_point);
      setSuppress(updatedData.suppress);
      setEditedGuaranteePoint(updatedData.guarantee_point);
      setEditedSuppress(updatedData.suppress);
      
        setEditingInletSection(false);
        setEditedInletValues({});
        setEditedInletUnits({});
        
        toast({
          title: "Success",
          description: "All inlet conditions updated successfully",
        });
        
        if (onCalculate) {
          onCalculate();
      }

      // After successful save, update the current flow type
      setCurrentFlowType(editedFlowType);
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

  // Update the saveAllGasCompositions function
  const [assumeCompositionAs100, setAssumeCompositionAs100] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const saveAllGasCompositions = async () => {
    try {
      // Calculate total composition from edited values or current values
      const totalComposition = Object.values(editedGasValues).length > 0
        ? Object.values(editedGasValues).reduce((sum, val) => sum + (val || 0), 0)
        : gasComposition.reduce((sum, gas) => sum + gas.value, 0);
      
      // Show warning ONLY if total is less than 100 and assume100 is not checked
      if (totalComposition < 100 && !assumeCompositionAs100) {
        setWarningMessage(`Current total is ${totalComposition.toFixed(2)}%. Please ensure sum is 100% or select 'Assume composition as 100%'`);
        setShowWarningDialog(true);
        return;
      }

      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const payload = gasComposition.map((gas, index) => ({
        gas_id: gas.id || 0,
        amount: editedGasValues[index] !== undefined ? editedGasValues[index] : gas.value,
        unit: editedGasUnits[index] || gas.unit
      }));

      // If assume100 is checked and total is less than 100%, normalize the values
      if (assumeCompositionAs100 && totalComposition < 100) {
        const normalizationFactor = 100 / totalComposition;
        payload.forEach(item => {
          item.amount = Number((item.amount * normalizationFactor).toFixed(3));
        });
        
        toast({
          title: "Info",
          description: "Gas compositions have been normalized to sum to 100%",
          variant: "default",
        });
      }

      console.log('Sending payload:', payload);
        
        const response = await fetch(
        `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/gases/update_new/`, 
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
        throw new Error('Failed to update gas compositions');
      }

      // Get the updated data from response
      const updatedData = await response.json();
      console.log('Response data:', updatedData);
      
      // Ensure updatedData is an array
      const updatedGases = Array.isArray(updatedData) ? updatedData : [];
      
      // Update local state with the response data
      const updatedGasComposition = gasComposition.map(gas => {
        const updatedGas = updatedGases.find(updated => updated.gas_id === gas.id);
        if (updatedGas) {
          return {
            ...gas,
            value: updatedGas.amount,
            unit: updatedGas.unit
          };
        }
        return gas;
      });
      
      setGasComposition(updatedGasComposition);
      setEditingGasSection(false);
      setEditedGasValues({});
      setEditedGasUnits({});
      
      toast({
        title: "Success",
        description: "All gas compositions updated successfully",
        variant: "default",
      });
      
      if (onCalculate) {
        onCalculate();
      }

      // Refresh the page after successful save
      window.location.reload();
    } catch (error) {
      console.error('Error updating gas compositions:', error);
      toast({
        title: "Error",
        description: "Failed to update gas compositions",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update the total row to show the appropriate unit
  const getTotalUnit = () => {
    // Get the most common unit from the gas compositions
    const unitCounts = gasComposition.reduce((acc: Record<string, number>, gas) => {
      acc[gas.unit] = (acc[gas.unit] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(unitCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] || "mol %";
  };

  // Update the saveGasComposition function for individual updates
  const saveGasComposition = async (index: number) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const gas = gasComposition[index];
      if (!gas.id) {
        throw new Error('Gas ID is required');
      }
      
      // Create payload in the new format
      const payload = [{
        gas_id: gas.id,
        amount: Number(editValue),
        unit: editedGasUnits[index] || gas.unit
      }];

      console.log('Sending payload:', payload);
      
      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/gases/update_new/`, 
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
        throw new Error('Failed to update gas composition');
      }

      // Get the updated data from response
      const updatedData = await response.json();
      console.log('Response data:', updatedData);
      
      // Ensure updatedData is an array and get the first item
      const updatedGases = Array.isArray(updatedData) ? updatedData : [];
      const updatedGas = updatedGases[0];

      if (updatedGas) {
      // Update local state
      const updatedGasComposition = [...gasComposition];
      updatedGasComposition[index] = {
        ...updatedGasComposition[index],
          value: updatedGas.amount,
          unit: updatedGas.unit
      };
      
      setGasComposition(updatedGasComposition);
      }
      
      setEditingGas(null);
      setEditedGasUnits({});
      
      toast({
        title: "Success",
        description: `${gas.name} composition updated successfully`,
        variant: "default",
      });
      
      if (onCalculate) {
        onCalculate();
      }
    } catch (error) {
      console.error('Error updating gas composition:', error);
      toast({
        title: "Error",
        description: "Failed to update gas composition",
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

      console.log('Calculating results for:', {
        projectId,
        caseId,
        endpoint: `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/calculate/`
      });
      
      // First, ensure we have valid inlet conditions and gas compositions
      if (inletConditions.length === 0) {
        throw new Error('No inlet conditions available');
      }

      if (gasComposition.length === 0) {
        throw new Error('No gas composition available');
      }
      
      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/projects/${projectId}/cases/${caseId}/calculate/`, 
        {
          method: 'PUT',  // Changed from POST to PUT
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            project_id: projectId,
            case_id: caseId
          })
        }
      );
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        console.error('Calculate response error:', {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        });
        throw new Error(`Failed to calculate results: ${response.status} ${response.statusText}`);
      }

      let result;
      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        console.warn('Could not parse response as JSON:', e);
      }
      
      console.log('Calculate response success:', result);
      
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
  const formatCalculatedValue = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return "NA";
    }
    return value.toString();
  };

  // Update the checkbox handlers to handle the state optimistically
  const handleGuaranteePointChange = async (checked: boolean) => {
    const newGuaranteePoint = checked;
    setGuaranteePoint(newGuaranteePoint);
    setEditedGuaranteePoint(newGuaranteePoint);
    
    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // Get the inlet condition ID from the first condition
      const inletConditionId = inletConditions[0].id;
      if (!inletConditionId) {
        throw new Error('No inlet condition ID found');
      }

      const payload = {
        description: inletConditions[0].value,
        ambient_pressure: Number(inletConditions[1].value),
        ambient_pressure_unit: inletConditions[1].unit,
        ambient_temperature: Number(inletConditions[2].value),
        ambient_temperature_unit: inletConditions[2].unit,
        pressure: Number(inletConditions[3].value),
        pressure_unit: inletConditions[3].unit,
        temperature: Number(inletConditions[4].value),
        temperature_unit: inletConditions[4].unit,
        flow_type: "Mass flow",
        flow_value: Number(inletConditions[5].value),
        flow_unit: inletConditions[5].unit,
        guarantee_point: newGuaranteePoint,
        suppress: suppress
      };

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
        throw new Error('Failed to update guarantee point');
      }

      const updatedData = await response.json();
      console.log('Updated data:', updatedData);

      toast({
        title: "Success",
        description: "Guarantee point updated successfully",
        variant: "default",
      });

      if (onCalculate) {
        onCalculate();
      }
    } catch (error) {
      console.error('Error updating guarantee point:', error);
      // Revert the local state on error
      setGuaranteePoint(!newGuaranteePoint);
      setEditedGuaranteePoint(!newGuaranteePoint);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update guarantee point",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuppressChange = async (checked: boolean) => {
    const newSuppress = checked;
    setSuppress(newSuppress);
    setEditedSuppress(newSuppress);
    
    try {
      setIsSaving(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // Get the inlet condition ID from the first condition
      const inletConditionId = inletConditions[0].id;
      if (!inletConditionId) {
        throw new Error('No inlet condition ID found');
      }

      const payload = {
        description: inletConditions[0].value,
        ambient_pressure: Number(inletConditions[1].value),
        ambient_pressure_unit: inletConditions[1].unit,
        ambient_temperature: Number(inletConditions[2].value),
        ambient_temperature_unit: inletConditions[2].unit,
        pressure: Number(inletConditions[3].value),
        pressure_unit: inletConditions[3].unit,
        temperature: Number(inletConditions[4].value),
        temperature_unit: inletConditions[4].unit,
        flow_type: "Mass flow",
        flow_value: Number(inletConditions[5].value),
        flow_unit: inletConditions[5].unit,
        guarantee_point: guaranteePoint,
        suppress: newSuppress
      };

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
        throw new Error('Failed to update suppress setting');
      }

      const updatedData = await response.json();
      console.log('Updated data:', updatedData);

      toast({
        title: "Success",
        description: "Suppress setting updated successfully",
        variant: "default",
      });

      if (onCalculate) {
        onCalculate();
      }
    } catch (error) {
      console.error('Error updating suppress setting:', error);
      // Revert the local state on error
      setSuppress(!newSuppress);
      setEditedSuppress(!newSuppress);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update suppress setting",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add these new state variables and handlers near the other state declarations
  const [editedGasUnits, setEditedGasUnits] = useState<Record<number, string>>({});

  // Add this new handler function with the other handlers
  const handleGasUnitChange = (index: number, unit: string) => {
    setEditedGasUnits({
      ...editedGasUnits,
      [index]: unit
    });
  };

  // Add this after other state declarations
  const [filteredGases, setFilteredGases] = useState<GasComposition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Add this useEffect to sort and filter gases
  useEffect(() => {
    // Sort gases by gas_id
    const sortedGases = [...gasComposition].sort((a, b) => {
      const idA = a.id || 0;
      const idB = b.id || 0;
      return idA - idB;
    });

    // Filter gases based on search term
    const filtered = sortedGases.filter(gas => 
      gas.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredGases(filtered);
  }, [gasComposition, searchTerm]);

  return (
    <>
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Gas Composition Warning
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-red-50 rounded-full">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-center text-gray-700">
                {warningMessage}
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowWarningDialog(false)}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setAssumeCompositionAs100(true);
                setShowWarningDialog(false);
                saveAllGasCompositions();
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Assume as 100%
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
          <Tabs defaultValue="gas" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-blue-50/50 p-1 border border-blue-100 rounded-md">
            <TabsTrigger value="gas" className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700">
              Gas Composition
            </TabsTrigger>
              <TabsTrigger value="inlet" className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700">
                Project Properties
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
                          <div className="flex items-center gap-2">
                            <span className="font-mono w-6 border-r border-blue-200 pr-2">
                              {index === 0 ? "D" : 
                               index === 1 ? "pa" :
                               index === 2 ? "Ta" :
                               index === 3 ? "p" :
                               index === 4 ? "T" :
                               index === 5 ? "ṁ" : ""}
                            </span>
                            <span>
                              {condition.name.toLowerCase().includes('flow') ? (
                                editingInletSection ? (
                                  <select
                                    value={editedFlowType}
                                    onChange={(e) => setEditedFlowType(e.target.value)}
                                    className="w-full bg-white border border-blue-200 p-0.5 text-xs focus:ring-1 focus:ring-blue-300 rounded"
                                  >
                                    {Object.values(FlowType).map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                ) : (
                                  currentFlowType
                                )
                              ) : (
                                condition.name
                              )}
                            </span>
                          </div>
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
                        <Checkbox 
                          checked={editingInletSection ? editedGuaranteePoint : guaranteePoint}
                          onCheckedChange={(checked) => {
                            if (editingInletSection) {
                              setEditedGuaranteePoint(checked as boolean);
                            }
                          }}
                          className="h-3 w-3"
                          disabled={!editingInletSection || isSaving}
                        />
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-6">
                    <TableCell className="py-0.5 text-xs">Suppress</TableCell>
                    <TableCell colSpan={2} className="py-0.5">
                        <Checkbox 
                          checked={editingInletSection ? editedSuppress : suppress}
                          onCheckedChange={(checked) => {
                            if (editingInletSection) {
                              setEditedSuppress(checked as boolean);
                            }
                          }}
                          className="h-3 w-3"
                          disabled={!editingInletSection || isSaving}
                        />
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
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1.5 h-3 w-3 text-blue-500" />
                      <Input
                        type="text"
                        placeholder="Search gases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-6 pl-7 text-xs border-blue-200"
                      />
                    </div>
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
                      <TableHead className="w-8 py-1 text-xs font-medium">ID</TableHead>
                    <TableHead className="py-1 text-xs font-medium">Component</TableHead>
                      <TableHead className="w-24 py-1 text-xs font-medium text-right">Value</TableHead>
                      <TableHead className="w-24 py-1 text-xs font-medium text-right">Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredGases.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="py-4 text-center text-sm text-blue-600">
                          {searchTerm ? "No matching gases found" : "No gas components selected. Please click \"Select gas components\" to add gases."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                        {filteredGases.map((gas, index) => (
                        <TableRow key={gas.id || index} className="h-6 hover:bg-blue-50/30">
                            <TableCell className="py-0.5 text-xs">{gas.id || index + 1}</TableCell>
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
                            <TableCell className="py-0.5 text-xs text-right">
                              {editingGasSection ? (
                                <select
                                  value={editedGasUnits[index] || gas.unit}
                                  onChange={(e) => handleGasUnitChange(index, e.target.value)}
                                  className="w-full bg-white border border-blue-200 p-0.5 text-xs focus:ring-1 focus:ring-blue-300 rounded text-right"
                                >
                                  {Object.values(GasUnit).map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                  ))}
                                </select>
                              ) : (
                                gas.unit
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
                              : filteredGases.reduce((sum, gas) => sum + gas.value, 0).toFixed(3)
                          }
                        </TableCell>
                          <TableCell className="py-0.5 text-xs font-medium text-right">
                            {getTotalUnit()}
                          </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>

                <div className="mt-4">
                  <Table>
                    <TableHeader className="bg-blue-50/50">
                      <TableRow className="h-6">
                        <TableHead className="py-1 text-xs font-medium">Unit</TableHead>
                        <TableHead className="py-1 text-xs font-medium">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(GasUnit).map(([key, value]) => (
                        <TableRow key={key} className="h-6">
                          <TableCell className="py-0.5 text-xs">{value}</TableCell>
                          <TableCell className="py-0.5 text-xs">{key.toLowerCase().replace(/_/g, ' ')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1">
                    <Checkbox 
                      id="assume-100" 
                      className="h-3 w-3" 
                      checked={assumeCompositionAs100}
                      onCheckedChange={(checked) => setAssumeCompositionAs100(checked as boolean)}
                    />
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
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">M</span>
                              <span>Molar mass</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.molar_mass)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">kg/mol</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">V̇</span>
                              <span>Volumetric flow</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.volumetric_flow)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">m³/h</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">V̇n</span>
                              <span>Standard volumetric flow</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.standard_volumetric_flow)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">Nm³/h, DIN 1343</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">x</span>
                              <span>Vapour mole fraction</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.vapor_mole_fraction)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500"></td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">φ</span>
                              <span>Relative humidity</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.relative_humidity)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">%</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">cp</span>
                              <span>Specific heat capacity (Cp)</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_heat_cp)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">J/(kg·K)</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">cv</span>
                              <span>Specific heat capacity (Cv)</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_heat_cv)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">J/(kg·K)</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">κ</span>
                              <span>Specific heat ratio</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_heat_ratio)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500"></td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">R</span>
                              <span>Specific gas constant</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_gas_constant)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">J/(kg·K)</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">SG</span>
                              <span>Specific gravity</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.specific_gravity)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500"></td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">ρ</span>
                              <span>Density</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.density)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">kg/m³</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">Z</span>
                              <span>Compressibility factor</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.compressibility_factor)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500"></td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">a</span>
                              <span>Speed of sound</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.speed_of_sound)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">m/s</td>
                      </tr>
                      <tr className="border-b border-blue-50">
                          <td className="py-2 px-3 text-sm text-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="font-mono w-6 border-r border-blue-200 pr-2">Td</span>
                              <span>Dew point</span>
                            </div>
                          </td>
                        <td className="py-2 px-3 text-sm">{formatCalculatedValue(calculatedProperties?.dew_point)}</td>
                          <td className="py-2 px-3 text-sm text-blue-500">°C</td>
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
    </>
  );
}

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Database, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Gas {
  gas_id: number;
  name: string;
}

interface SelectedGas {
  id: number;
  name: string;
}

interface SelectGasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (gases: SelectedGas[]) => void;
  initialSelected?: SelectedGas[];
  projectName?: string;
  projectId: number;
}

interface GasCharacteristic {
  name: string;
  checked: boolean;
  description: string;
  icon: string;
}

export function SelectGasModal({ isOpen, onClose, onSelect, initialSelected = [], projectName, projectId }: SelectGasModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGases, setSelectedGases] = useState<SelectedGas[]>(initialSelected);
  const [showCharacteristicInfo, setShowCharacteristicInfo] = useState<string | null>(null);
  const [gases, setGases] = useState<Gas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGases = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://gaxmixer-production.up.railway.app/gases/?limit=50', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch gases');
        }

        const data = await response.json();
        setGases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch gases');
      } finally {
        setLoading(false);
      }
    };

    fetchGases();
  }, []);

  const filteredGases = gases.filter(gas => 
    gas.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGas = (gas: Gas) => {
    if (!selectedGases.some(g => g.id === gas.gas_id)) {
      setSelectedGases([...selectedGases, { id: gas.gas_id, name: gas.name }]);
    }
  };

  const handleRemoveGas = (gasId: number) => {
    setSelectedGases(selectedGases.filter(gas => gas.id !== gasId));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get project ID from props or localStorage as fallback
      const effectiveProjectId = projectId || localStorage.getItem('selectedProjectId');
      
      if (!effectiveProjectId) {
        throw new Error('No project ID found. Please select a project first.');
      }

      // Extract just the IDs as numbers
      const selectedGasIds = selectedGases.map(gas => Number(gas.id));
      
      // Log the data being sent
      console.log('Selected Gas IDs:', selectedGasIds);
      console.log('Project ID:', effectiveProjectId);
      console.log('Request URL:', `https://gaxmixer-production.up.railway.app/user/projects/${effectiveProjectId}/select-gases-correct/`);

      const response = await fetch(`https://gaxmixer-production.up.railway.app/user/projects/${effectiveProjectId}/select-gases-correct/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedGasIds)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to save selected gases: ${response.status} ${response.statusText}`);
      }

      onSelect(selectedGases);
      onClose();
    } catch (err) {
      console.error('Error in handleSave:', err);
      setError(err instanceof Error ? err.message : 'Failed to save selected gases');
      // You might want to show this error to the user in a more user-friendly way
      alert(err instanceof Error ? err.message : 'Failed to save selected gases');
    }
  };

  const [gasCharacteristics, setGasCharacteristics] = useState<GasCharacteristic[]>([
    { 
      name: "Explosive", 
      checked: selectedGases.some(g => g.name === "H2"),
      description: "Gas mixture contains components that can form explosive mixtures with air.",
      icon: "💥"
    },
    { 
      name: "Corrosive", 
      checked: false,
      description: "Gas mixture contains components that can cause material degradation.",
      icon: "⚠️"
    },
    { 
      name: "Inflammable", 
      checked: selectedGases.some(g => g.name === "CH4"),
      description: "Gas mixture contains components that can easily ignite and burn.",
      icon: "🔥"
    },
    { 
      name: "Sour", 
      checked: false,
      description: "Gas mixture contains hydrogen sulfide or other sulfur compounds.",
      icon: "☢️"
    },
    { 
      name: "Toxic", 
      checked: false,
      description: "Gas mixture contains components harmful to human health.",
      icon: "☠️"
    },
    { 
      name: "Oxidizing", 
      checked: false,
      description: "Gas mixture contains components that can support combustion.",
      icon: "🧪"
    },
  ]);

  const handleCharacteristicChange = (name: string) => {
    setGasCharacteristics(prev => 
      prev.map(char => 
        char.name === name ? { ...char, checked: !char.checked } : char
      )
    );
  };

  useEffect(() => {
    setGasCharacteristics(prev => prev.map(char => ({
      ...char,
      checked: 
        (char.name === "Explosive" && selectedGases.some(g => g.name === "H2")) ||
        (char.name === "Inflammable" && selectedGases.some(g => g.name === "CH4")) ||
        (char.name === "Sour" && selectedGases.some(g => g.name === "H2S")) ||
        (char.name === "Oxidizing" && selectedGases.some(g => g.name === "O2")) ||
        char.checked
    })));
  }, [selectedGases]);

  if (loading) {
    return <div>Loading gases...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-gradient-to-br from-white to-blue-50/30 shadow-xl">
        <DialogHeader className="p-2 border-b bg-gradient-to-r from-blue-50 to-white">
          <DialogTitle className="text-sm font-medium text-blue-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-blue-500" />
              Select gas components
            </div>
            {projectName && (
              <span className="text-[10px] text-blue-600 font-normal">
                Project: {projectName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[2fr,180px,1fr] gap-3 p-3">
          {/* Left Column - Available Components */}
          <div className="border rounded-md shadow-sm bg-white">
            <div className="p-1.5 border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="relative">
                <Search className="absolute left-1.5 top-1 h-3 w-3 text-gray-400" />
                <Input
                  placeholder="Search components..."
                  className="pl-6 h-5 text-[10px] py-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[280px] overflow-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-white sticky top-0">
                  <TableRow className="h-5">
                    <TableHead className="w-12 text-[10px] font-medium py-1">ID</TableHead>
                    <TableHead className="text-[10px] font-medium py-1">Name</TableHead>
                    <TableHead className="w-8 py-1"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGases.map((gas) => (
                    <TableRow key={gas.gas_id} className="h-5 hover:bg-blue-50/50">
                      <TableCell className="text-[10px] py-0.5">{gas.gas_id}</TableCell>
                      <TableCell className="text-[10px] py-0.5">{gas.name}</TableCell>
                      <TableCell className="py-0.5">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-4 w-4 p-0"
                          onClick={() => handleAddGas(gas)}
                          disabled={selectedGases.some(g => g.id === gas.gas_id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Middle Column - Selected Components */}
          <div className="border rounded-md p-1.5 bg-white shadow-sm">
            <div className="space-y-0.5 min-h-[240px] max-h-[280px] overflow-auto">
              {selectedGases.map((gas) => (
                <div key={gas.id} className="flex items-center justify-between text-[10px] px-1.5 py-1 hover:bg-blue-50/50 rounded group">
                  <span className="text-blue-900">{gas.id}. {gas.name}</span>
                  <button
                    onClick={() => handleRemoveGas(gas.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-2.5 w-2.5 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-1.5 mt-1.5 border-t">
              <Button size="sm" variant="outline" className="h-5 text-[10px] w-full" onClick={handleSave}>
                Save selection
              </Button>
            </div>
          </div>

          {/* Right Column - Gas Characteristics */}
          <div className="border rounded-md p-2 bg-white shadow-sm">
            <h4 className="text-[10px] font-medium mb-2 text-blue-800 flex items-center gap-1">
              <span>Gas characteristics</span>
              <span className="text-[9px] text-blue-500">(click to toggle)</span>
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {gasCharacteristics.map((char) => (
                <div 
                  key={char.name}
                  className="relative"
                  onMouseEnter={() => setShowCharacteristicInfo(char.name)}
                  onMouseLeave={() => setShowCharacteristicInfo(null)}
                >
                  <div 
                    className="flex items-center gap-1.5 cursor-pointer hover:bg-blue-50 rounded px-1 py-0.5"
                    onClick={() => handleCharacteristicChange(char.name)}
                  >
                    <Checkbox 
                      checked={char.checked} 
                      className="h-2.5 w-2.5"
                      onCheckedChange={() => handleCharacteristicChange(char.name)}
                    />
                    <span className="text-[10px] flex items-center gap-1">
                      <span>{char.icon}</span>
                      <span>{char.name}</span>
                    </span>
                  </div>
                  {showCharacteristicInfo === char.name && (
                    <div className="absolute left-full ml-2 top-0 z-10 bg-white shadow-lg rounded-md p-2 border min-w-[200px]">
                      <p className="text-[10px] text-gray-600">{char.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 space-y-1 text-[9px] text-gray-600">
              {selectedGases.some(g => g.name === "H2") && (
                <p className="leading-tight flex items-center gap-1">
                  <span>💥</span>
                  <span>The gas mixture is flagged as explosive due to Hydrogen content.</span>
                </p>
              )}
              {selectedGases.some(g => g.name === "CH4") && (
                <p className="leading-tight flex items-center gap-1">
                  <span>🔥</span>
                  <span>The gas mixture is flagged as flammable due to Methane content.</span>
                </p>
              )}
              {selectedGases.some(g => g.name === "H2S") && (
                <p className="leading-tight flex items-center gap-1">
                  <span>☢️</span>
                  <span>The gas mixture may be subject to sulfide stress cracking due to H2S.</span>
                </p>
              )}
              {selectedGases.some(g => g.name === "O2") && (
                <p className="leading-tight flex items-center gap-1">
                  <span>🧪</span>
                  <span>The mixture is oxygen enriched (exceeds 30 mol% O2)</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
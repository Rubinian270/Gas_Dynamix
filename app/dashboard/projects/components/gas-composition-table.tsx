import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const gasComponents = [
  {
    name: "Methane (CH₄)",
    formula: "CH₄",
    percentage: 85.2,
    concentration: "852,000 ppm",
    notes: "Primary component",
  },
  {
    name: "Ethane (C₂H₆)",
    formula: "C₂H₆",
    percentage: 6.4,
    concentration: "64,000 ppm",
    notes: "Secondary component",
  },
  {
    name: "Propane (C₃H₈)",
    formula: "C₃H₈",
    percentage: 3.1,
    concentration: "31,000 ppm",
    notes: "Tertiary component",
  },
  {
    name: "Carbon Dioxide (CO₂)",
    formula: "CO₂",
    percentage: 2.7,
    concentration: "27,000 ppm",
    notes: "Greenhouse gas",
  },
  {
    name: "Nitrogen (N₂)",
    formula: "N₂",
    percentage: 1.8,
    concentration: "18,000 ppm",
    notes: "Inert component",
  },
  {
    name: "Butane (C₄H₁₀)",
    formula: "C₄H₁₀",
    percentage: 0.4,
    concentration: "4,000 ppm",
    notes: "Minor component",
  },
  {
    name: "Hydrogen Sulfide (H₂S)",
    formula: "H₂S",
    percentage: 0.2,
    concentration: "2,000 ppm",
    notes: "Corrosive component",
  },
  {
    name: "Helium (He)",
    formula: "He",
    percentage: 0.1,
    concentration: "1,000 ppm",
    notes: "Trace component",
  },
  {
    name: "Other Trace Gases",
    formula: "Various",
    percentage: 0.1,
    concentration: "1,000 ppm",
    notes: "Combined trace components",
  },
]

export function GasCompositionTable() {
  return (
    <div className="rounded-md border border-blue-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-blue-50">
          <TableRow>
            <TableHead className="text-blue-900">Component</TableHead>
            <TableHead className="text-blue-900">Formula</TableHead>
            <TableHead className="text-right text-blue-900">Percentage (%)</TableHead>
            <TableHead className="text-right text-blue-900">Concentration</TableHead>
            <TableHead className="text-blue-900">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gasComponents.map((component, index) => (
            <TableRow key={component.name} className={index % 2 === 0 ? "bg-white" : "bg-blue-50/30"}>
              <TableCell className="font-medium text-blue-900">{component.name}</TableCell>
              <TableCell className="font-mono text-blue-700">{component.formula}</TableCell>
              <TableCell className="text-right text-blue-700">{component.percentage.toFixed(1)}</TableCell>
              <TableCell className="text-right text-blue-700">{component.concentration}</TableCell>
              <TableCell className="text-blue-700/70">{component.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


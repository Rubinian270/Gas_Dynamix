export function ProjectNotes() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-blue-100 p-4 bg-gradient-to-r from-blue-50/30 to-white">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-blue-900">Initial Sample Analysis</h3>
          <span className="text-xs text-blue-700/60">2025-01-18</span>
        </div>
        <p className="text-sm text-blue-700/70">
          Initial gas samples show higher than expected methane content (85.2%). This is above the typical range for
          this field (80-83%). Ethane and propane levels are within expected parameters. Trace amounts of hydrogen
          sulfide detected, but below threshold for concern.
        </p>
      </div>

      <div className="rounded-lg border border-blue-100 p-4 bg-gradient-to-r from-blue-50/30 to-white">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-blue-900">Secondary Sampling</h3>
          <span className="text-xs text-blue-700/60">2025-02-05</span>
        </div>
        <p className="text-sm text-blue-700/70">
          Secondary samples confirm high methane content. CO₂ levels have increased slightly from 2.5% to 2.7%, which
          should be monitored. Nitrogen content remains stable. Recommend continued monitoring of CO₂ levels in
          subsequent samples.
        </p>
      </div>

      <div className="rounded-lg border border-blue-100 p-4 bg-gradient-to-r from-blue-50/30 to-white">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-blue-900">Equipment Calibration</h3>
          <span className="text-xs text-blue-700/60">2025-02-20</span>
        </div>
        <p className="text-sm text-blue-700/70">
          Gas chromatograph calibrated using standard reference materials. All measurements are within ±0.1% accuracy.
          Detector sensitivity for trace components improved after maintenance. Next calibration scheduled for April
          2025.
        </p>
      </div>

      <div className="rounded-lg border border-blue-100 p-4 bg-gradient-to-r from-blue-50/30 to-white">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-blue-900">Quality Control Check</h3>
          <span className="text-xs text-blue-700/60">2025-03-10</span>
        </div>
        <p className="text-sm text-blue-700/70">
          QC samples analyzed alongside field samples. Results show excellent precision with RSD &lt; 0.5% for major
          components. All QC parameters within acceptable limits. Data quality is high and suitable for client
          reporting.
        </p>
      </div>
    </div>
  )
}


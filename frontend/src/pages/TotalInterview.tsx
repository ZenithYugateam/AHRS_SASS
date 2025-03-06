import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';

function TotalInterview() {
  // Retrieve the company_id from sessionStorage.
  const storedCompanyId = (sessionStorage.getItem("company_id") || "").trim();
  console.log("Stored Company ID:", storedCompanyId);

  // State for jobs, loading and error
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Define DataGrid columns for candidate details
  const columns: GridColDef[] = [
    { field: 'jobId', headerName: 'Job ID', width: 150 },
    { field: 'candidateId', headerName: 'Candidate ID', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 }
  ];

  // Fetch jobs from the API on component mount
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const response = await fetch('https://tngkmhvwjf.execute-api.us-east-1.amazonaws.com/default/total_interview');
        const data = await response.json();
        // Assuming the API returns { jobs: [...] }
        setJobs(data.jobs || []);
        console.log("Fetched jobs:", data.jobs);
      } catch (err: any) {
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Filter jobs based on the stored company id.
  const filteredJobs = useMemo(() => {
    if (!storedCompanyId) {
      console.warn("No company_id found in sessionStorage. Showing all jobs.");
      return jobs;
    }
    return jobs.filter(job =>
      job.company_id &&
      job.company_id.trim().toLowerCase() === storedCompanyId.toLowerCase()
    );
  }, [jobs, storedCompanyId]);

  // Build a flattened candidate list from all filtered jobs.
  const candidateRows = useMemo(() => {
    const rows: any[] = [];
    filteredJobs.forEach((job) => {
      const jobId = job.jobId; // Company job id
      const candidates = job.candidateList || [];
      candidates.forEach((candidate: any) => {
        let candidateStatus = candidate.status;
        if (candidateStatus === 5) candidateStatus = "Rejected";
        else if (candidateStatus === 10) candidateStatus = "Selected";
        rows.push({
          id: rows.length,
          jobId: jobId || "N/A",
          candidateId: candidate.candidateId || "N/A",
          status: candidateStatus || "N/A"
        });
      });
    });
    return rows;
  }, [filteredJobs]);

  // Count of candidates for this company.
  const totalCandidateCount = candidateRows.length;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Job Listings for {storedCompanyId || "All Companies"}</h1>
      <h3>Total Candidates: {totalCandidateCount}</h3>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={candidateRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
          />
        </div>
      )}
    </div>
  );
}

export default TotalInterview;

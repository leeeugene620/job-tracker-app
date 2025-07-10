import { useState, useEffect } from 'react';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import PromptModal from './components/PromptModal';

export default function App() {
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [promptData, setPromptData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Load jobs from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("jobTrackerData");
        if (saved) setJobs(JSON.parse(saved));
    }, []);

    // Save jobs to localStorage
    useEffect(() => {
        if (jobs.length > 0) {
            localStorage.setItem("jobTrackerData", JSON.stringify(jobs));
        }
    }, [jobs]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    // Clear all jobs
    const handleClear = () => {
        setPromptData({
            message: "Are you sure you want to clear all jobs?",
            options: [
                { label: "Yes", action: () => setJobs([]), type: "replace" },
                { label: "Cancel", action: () => {}, type: "cancel" }
            ]
        });
    };

    // Export jobs to file
    const handleExport = () => {
        setPromptData({
            message: "Do you want to export your job data?",
            options: [
            {
                label: "Export",
                action: () => {
                const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "jobTrackerData.json";
                a.click();
                URL.revokeObjectURL(url);
                },
                type: "merge"
            },
            { label: "Cancel", action: () => {}, type: "cancel" }
            ]
        });
    };

    // Import jobs from file
    const handleImport = () => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    setPromptData({
                        message: "Replace or merge with existing jobs?",
                        options: [
                            {label: "Replace", action: () => setJobs(imported), type: "replace"},
                            {label: "Merge", action: () => setJobs(prev => [...imported, ...prev]), type: "merge"},
                            {label: "Cancel", action: () => {}, type: "cancel"}
                        ]
                    });
                } else {
                    alert("Invalid file format");
            }
            } catch {
                alert("Failed to read file");
            }
        };
        reader.readAsText(selectedFile);
    };

    const addJob = (company, title, link, status, date) => {
        const newId = jobs.length === 0 ? 0 : Math.max(...jobs.map(j => j.id)) + 1;
        const newJob = {id: newId, company, title, link, status, date};
        setJobs(prev => [newJob, ...prev]);
    };

    const deleteJob = (id) => {
        setJobs(prev => prev.filter(job => job.id !== id));
    };

    const updateJob = (updatedJob) => {
        setJobs(prev =>
            prev.map(job => job.id === updatedJob.id ? updatedJob : job)
        );
    }

    return (
    <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-white/100">Job Tracker</h1>
        <div className="mb-4 flex gap-4 border">
            <button onClick={() => setShowForm(prev => !prev)} className="bg-pink-700 text-white px-4 py-2 rounded">{showForm ? "Close Form" : "Add Job"}</button>
            <button onClick={handleClear} className="bg-red-700 text-white px-4 py-2 rounded">Clear All</button>
            <button onClick={handleExport} className="bg-orange-700 text-white px-4 py-2 rounded">Export</button>
            <button onClick={() => handleImport(selectedFile)} className={`px-4 py-2 rounded ${selectedFile ? "bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} disabled={!selectedFile}>
                Import
            </button>
            <label className="flex items-center space-x-2 cursor-pointer">
                <span className="bg-gray-700 text-white px-4 py-2 rounded">Choose File</span>
                <input
                    type="file"
                    accept="application/json"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <span className="text-white">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
            </label>

        </div>
        {showForm && <JobForm onAdd={addJob} />}
        <JobList jobs={jobs} onDelete={deleteJob} onUpdate={updateJob}/>
        {promptData && (
        <PromptModal
            message={promptData.message}
            options={promptData.options}
            onClose={() => {
                setPromptData(null); 
            }}
        />
        )}
    </div>
    );
} 

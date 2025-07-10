import { useEffect, useState } from "react";

export default function JobList({ jobs, onDelete, onUpdate}) {
    const [editBuffer, setEditBuffer] = useState(null);
    const [editId, setEditId] = useState(null);

    if (jobs.length === 0) return <p>No job applications yet.</p>;

    const startEdit = (job) => {
        const today = new Date().toISOString().slice(0, 10);
        setEditId(job.id);
        setEditBuffer({...job, date: today});
    };

    const handleFieldChange = (field, value) => {
        setEditBuffer(prev => ({...prev, [field]: value}))
    };

    const saveEdit = () => {
        onUpdate(editBuffer);
        setEditId(null);
        setEditBuffer(null);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditBuffer(null);
    };
  
    return (
        <table className="w-full border-collapse border">
            <thead>
                <tr className="bg-black/20 text-center">
                    <th className="border p-2">Company</th>
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Link</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Actions</th>
                </tr>
            </thead>

            <tbody>
                {jobs.map((job) => (
                    editId === job.id ? (
                    // editable row JSX goes here
                    <tr key={job.id}>
                        {/* inputs and save/cancel buttons */}
                        <td className="border p-2">
                            <input value={editBuffer.company} onChange={(e) => handleFieldChange("company", e.target.value)}
                                className="border p-1 w-full" />
                        </td>
                        <td className="border p-2">
                            <input value={editBuffer.title} onChange={(e) => handleFieldChange("title", e.target.value)}
                                className="border p-1 w-full" />
                        </td>
                        <td className="border p-2">
                            <input value={editBuffer.link} onChange={(e) => handleFieldChange("link", e.target.value)}
                                className="border p-1 w-full" />
                        </td>
                        <td className="border p-2">
                            <select value={editBuffer.status} onChange={(e) => handleFieldChange("status", e.target.value)}
                                className="border p-1 w-full">
                                <option>Applied</option>
                                <option>Interviewing</option>
                                <option>Offer</option>
                                <option>Rejected</option>
                            </select>
                        </td>
                        <td className="border p-2">
                            {editBuffer.date}
                        </td>
                        <td  className="border flex justify-center p-2" colSpan={2}>
                            <button onClick={saveEdit} className="bg-gray-400 text-green-600 mr-2">Save</button>
                            <button onClick={cancelEdit} className="bg-gray-400 text-red-600 mr-2">Cancel</button>
                        </td>                                                                                                
                    </tr>
                    ) : (
                    // normal display row JSX goes here
                    <tr key={job.id}>
                        {/* plain text and edit/delete buttons */}
                        <td className="border p-2">{job.company}</td>
                        <td className="border p-2">{job.title}</td>
                        <td className="border p-2">
                            <a href={job.link.startsWith('http') ? job.link : `https://${job.link}`} target="_blank" rel="noreferrer" className="text-blue-500 underline">{job.link}</a>
                        </td>
                        <td className="border p-2">{job.status}</td>
                        <td className="border p-2">{job.date}</td>
                        <td className="border p-2 flex justify-center gap-2">
                            <button onClick={() => onDelete(job.id)} className="bg-gray-400 text-red-600">Delete</button>
                            <button onClick={() => startEdit(job)} className="bg-gray-400 text-blue-600">Edit</button>
                        </td>                      
                    </tr>
                    )
                ))}
            </tbody>
        </table>
    );
}

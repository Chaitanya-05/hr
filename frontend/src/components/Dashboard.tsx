import { useState, useMemo, useEffect } from 'react';
import AddEmployee from './AddEmployee';
import toast from 'react-hot-toast';
import api from '../services/axios';
import type { Employee } from '../config/assessmentquestions';
import ViewEmployee from './ViewEmployee';
import { FaEye, FaPencilAlt } from 'react-icons/fa';
import { exportFilteredToCSV } from '../utils/exportCSV';
import { MdOutlineFileDownload } from 'react-icons/md';
import { IoMdExit } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '../store/authSlice';

import type { RootState } from '../store/store';
type EmployeeFilter = {
    search: string;
    role: string;
    interest: string;
    goals: string;
    culture: string;
    learning: string;
    sortOption: string;
};

export default function EmployeeDashboard() {
    const [search, setSearch] = useState<string>('');
    const [role, setRole] = useState<string>('All Roles');
    const [interest, setInterest] = useState<string>('All Interests');
    const [goals, setGoals] = useState<string>('All Goals');
    const [culture, setCulture] = useState<string>('All Cultures');
    const [learning, setLearning] = useState<string>('All Learnings');
    const [sortOption, setSortOption] = useState<string>('name-asc');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [employeesData, setEmployeesData] = useState<Employee[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.auth.role);


    const [presets, setPresets] = useState<{ name: string; filters: EmployeeFilter }[]>([]);
    const [presetName, setPresetName] = useState('');

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setShowEditModal(true);
    };

    const handleView = (employee: Employee) => {
        setSelectedEmployee(employee);
        setShowViewModal(true);
    };

    const uniqueValues = useMemo(() => {
        const getUnique = (key: keyof Employee, allLabel: string) =>
            [allLabel, ...new Set(employeesData.map(emp => emp[key] as string))];

        return {
            roles: getUnique('role', 'All Roles'),
            interests: getUnique('interest', 'All Interests'),
            goals: getUnique('goals', 'All Goals'),
            cultures: getUnique('culture', 'All Cultures'),
            learnings: getUnique('learning', 'All Learnings')
        };
    }, [employeesData]);


    const filteredEmployees = useMemo(() => {
        const result = employeesData.filter(emp => {
            const matchesSearch =
                emp.name.toLowerCase().includes(search.toLowerCase()) ||
                emp.email.toLowerCase().includes(search.toLowerCase()) ||
                emp.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

            return (
                matchesSearch &&
                (role === 'All Roles' || emp.role === role) &&
                (interest === 'All Interests' || emp.interest === interest) &&
                (goals === 'All Goals' || emp.goals === goals) &&
                (culture === 'All Cultures' || emp.culture === culture) &&
                (learning === 'All Learnings' || emp.learning === learning)
            );
        });

        const dateNum = (d?: string) => new Date(d ?? 0).getTime();
        const num = (n?: number) => n ?? 0;

        switch (sortOption) {
            case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
            case 'date-recent': result.sort((a, b) => dateNum(b.createdAt) - dateNum(a.createdAt)); break;
            case 'date-oldest': result.sort((a, b) => dateNum(a.createdAt) - dateNum(b.createdAt)); break;
            case 'learning-high': result.sort((a, b) => num(b.learning_score) - num(a.learning_score)); break;
            case 'learning-low': result.sort((a, b) => num(a.learning_score) - num(b.learning_score)); break;
        }


        return result;
    }, [search, role, interest, goals, culture, learning, sortOption, employeesData]);

    const handleAddEmployee = () => {
        setShowModal(false);
        fetchEmployees();
    };

    const fetchEmployees = async () => {
        try {
            const response = await api.get<Employee[]>('employees');
            console.log("Fetched employees:", response.data);
            setEmployeesData(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error("Failed to load employee data.");
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);

    const logout = () => {
        dispatch(clearToken());
    };




    const removePreset = (name: string) => {
        const updated = presets.filter(p => p.name !== name);
        setPresets(updated);
        localStorage.setItem("employeeFilterPresets", JSON.stringify(updated));
    };

    const applyPreset = (preset: typeof presets[number]) => {
        setSearch(preset.filters.search);
        setRole(preset.filters.role);
        setInterest(preset.filters.interest);
        setGoals(preset.filters.goals);
        setCulture(preset.filters.culture);
        setLearning(preset.filters.learning);
        setSortOption(preset.filters.sortOption);
    };

    const savePreset = () => {
        if (!presetName.trim()) return toast.error("Preset name is required");

        const newPreset = {
            name: presetName.trim(),
            filters: { search, role, interest, goals, culture, learning, sortOption }
        };

        const updatedPresets = [...presets, newPreset];
        setPresets(updatedPresets);
        localStorage.setItem("employeeFilterPresets", JSON.stringify(updatedPresets));
        setPresetName('');
        toast.success("Preset saved!");
    };

    useEffect(() => {
        const savedPresets = localStorage.getItem("employeeFilterPresets");
        if (savedPresets) {
            setPresets(JSON.parse(savedPresets));
        }
    }, []);


    return (
        <>
            {userRole === 'admin' || userRole === 'HR' ? (<div className="p-8 pt-2 bg-gray-50 min-h-screen">
                <div className='flex justify-end items-center'>
                    <p onClick={logout} className='cursor-pointer flex items-center text-gray-500'>Logout <IoMdExit className='ml-2' /></p>
                </div>
                <div className="bg-purple-100 p-6 rounded-xl mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Employee Dashboard</h1>
                        <p className="text-gray-700">View, filter, and sort employees based on mindset and attitude assessments.</p>
                    </div>
                    <div>
                        <button onClick={() => setShowModal(true)} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Add Employee</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-4 mb-4">
                    <input
                        type="text"
                        className="col-span-2 border p-2 rounded"
                        placeholder="Search name, email, keywords"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select className="border p-2 rounded" value={role} onChange={e => setRole(e.target.value)}>
                        {uniqueValues.roles.map((r, i) => <option key={i} value={r}>{r}</option>)}
                    </select>
                    <select className="border p-2 rounded" value={interest} onChange={e => setInterest(e.target.value)}>
                        {uniqueValues.interests.map((v, i) => <option key={i} value={v}>{v}</option>)}
                    </select>
                    <select className="border p-2 rounded" value={goals} onChange={e => setGoals(e.target.value)}>
                        {uniqueValues.goals.map((v, i) => <option key={i} value={v}>{v}</option>)}
                    </select>
                    <select className="border p-2 rounded" value={culture} onChange={e => setCulture(e.target.value)}>
                        {uniqueValues.cultures.map((v, i) => <option key={i} value={v}>{v}</option>)}
                    </select>
                    <select className="border p-2 rounded" value={learning} onChange={e => setLearning(e.target.value)}>
                        {uniqueValues.learnings.map((v, i) => <option key={i} value={v}>{v}</option>)}
                    </select>
                    <select className="border p-2 rounded" value={sortOption} onChange={e => setSortOption(e.target.value)}>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="date-recent">Submission Date (Recent)</option>
                        <option value="date-oldest">Submission Date (Oldest)</option>
                        <option value="learning-high">Learning Score (High)</option>
                        <option value="learning-low">Learning Score (Low)</option>
                    </select>

                </div>
                <div className='flex justify-between items-center'>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {presets.map(preset => (
                            <span
                                key={preset.name}
                                className="bg-purple-100 text-purple-800 px-2 py-1 rounded h-fit text-sm flex items-center cursor-pointer"
                                onClick={() => applyPreset(preset)}
                            >
                                {preset.name}
                                <button
                                    onClick={(e) => { e.stopPropagation(); removePreset(preset.name); }}
                                    className="ml-3 text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Preset Name"
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <button
                            onClick={savePreset}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                        >
                            Save Preset
                        </button>
                    </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <p className='text-xl font-bold'>Employees</p>
                    <button className='mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2' onClick={() => exportFilteredToCSV(filteredEmployees)}>
                        <MdOutlineFileDownload size={22} /> Export CSV
                    </button>

                </div>
                <div className="overflow-x-auto">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-xl overflow-hidden">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="py-2 px-4">Name</th>
                                    <th className="py-2 px-4">Role</th>
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4">Tags</th>
                                    <th className="py-2 px-4">Submitted</th>
                                    <th className="py-2 px-4">Learning Score</th>
                                    <th className="py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-2 px-4 font-medium text-gray-900">{emp.name}</td>
                                        <td className="py-2 px-4">{emp.role}</td>
                                        <td className="py-2 px-4">{emp.email}</td>
                                        <td className="py-2 px-4">
                                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                                {emp.assessment_submitted ? 'Submitted' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 space-x-1">
                                            {emp.tags.map((tag, i) => (
                                                <span key={i} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">{tag}</span>
                                            ))}
                                        </td>
                                        <td className="py-2 px-4">{emp.createdAt}</td>
                                        <td className="py-2 px-4">{emp.learning_score}</td>
                                        <td className="py-2 px-4 flex gap-2">
                                            <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:text-blue-800">
                                                <FaPencilAlt size={16} />
                                            </button>
                                            <button onClick={() => handleView(emp)} className="text-green-600 hover:text-green-800">
                                                <FaEye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                </div>

                {showModal && (
                    <AddEmployee onClose={() => setShowModal(false)} onSave={handleAddEmployee} />
                )}

                {showEditModal && selectedEmployee && (
                    <AddEmployee
                        initialData={{
                            ...selectedEmployee,
                            learning_score: selectedEmployee.learning_score ?? 0
                        }}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleAddEmployee}
                    />
                )}

                {showViewModal && selectedEmployee && (
                    <ViewEmployee
                        employee={selectedEmployee}
                        onClose={() => setShowViewModal(false)}
                    />
                )}
            </div>) : (
                <div className="p-8 pt-2 bg-gray-50 min-h-screen flex flex-col w-full h-full">
                    <div className='flex justify-end items-center'>
                        <p onClick={logout} className='cursor-pointer flex items-center text-gray-500'>Logout <IoMdExit className='ml-2' /></p>
                    </div>
                    <div className='w-full flex justify-end'>
                        <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Apply</button>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <p className='text-4xl text-gray-600'>You Are not authorised</p>
                    </div>
                </div>
            )}
        </>
    );
}
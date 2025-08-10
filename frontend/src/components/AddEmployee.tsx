import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/axios';
import type { Employee } from '../config/assessmentquestions';



export default function AddEmployee({
  onClose,
  onSave,
  initialData,
}: {
  onClose: () => void;
  onSave: (data: Employee) => void;
  initialData?: Employee;
}) {
  const isEditMode = Boolean(initialData?._id);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [culture, setCulture] = useState('');
  const [learning, setLearning] = useState('');
  const [interest, setInterest] = useState('');
  const [goals, setGoals] = useState('');
  const [learningScore, setLearningScore] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  

  const interestOptions = [
  { value: '', label: 'Select Interest Area' },
  { value: 'ai-enthusiast', label: 'AI Enthusiast' },
  { value: 'hr-tech-passionate', label: 'HR-Tech Passionate' },
  { value: 'exploring', label: 'Looking to Explore' }
];

const goalsOptions = [
  { value: '', label: 'Select Long-Term Goals' },
  { value: 'career-focused', label: 'Career-focused' },
  { value: 'entrepreneurial', label: 'Entrepreneurial' },
  { value: 'technical', label: 'Technically Inclined' },
  { value: 'unclear', label: 'Unclear/Exploring' }
];

const cultureOptions = [
  { value: '', label: 'Select Work Culture Preference' },
  { value: 'healthy-culture', label: 'Prefers Healthy Culture' },
  { value: 'salary-driven', label: 'Salary-Driven' }
];

const learningOptions = [
  { value: '', label: 'Select Learning Attitude' },
  { value: 'active-learner', label: 'Active Learner' },
  { value: 'passive', label: 'Passive / No Recent Skill Added' }
];


  const questions = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), []);

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name || '');
    setEmail(initialData.email || '');
    setRole(initialData.role || '');
    setAnswers(initialData.assessment_answers || {});
    setTags(initialData.tags || []);
    setCulture(initialData.culture || '');
    setLearning(initialData.learning || '');
    setInterest(initialData.interest || '');
    setGoals(initialData.goals || '');
    setLearningScore(initialData.learning_score ?? 0);

    const hasAnswers = Boolean(
      Object.keys(initialData.assessment_answers || {}).length &&
      Object.values(initialData.assessment_answers || {}).some(v => v && v.trim() !== '')
    );
    setAssignmentSubmitted(hasAnswers);
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!role.trim()) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleToggle = () => {
    setAssignmentSubmitted(prev => {
      const next = !prev;
      if (next) {
        // initialize all answers as empty strings if enabling assignment
        setAnswers(questions.reduce((acc, i) => ({ ...acc, [`q${i}`]: '' }), {}));
      } else {
        // clear answers when disabling assignment
        setAnswers({});
      }
      return next;
    });
  };

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim();
      if (!tags.includes(t)) {
        setTags(prev => [...prev, t]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const generateEmptyAnswers = (): Employee["assessment_answers"] =>
      Array.from({ length: 20 }, (_, i) => `q${i + 1}`)
        .reduce((acc, key) => {
          acc[key as keyof Employee["assessment_answers"]] = '';
          return acc;
        }, {} as Employee["assessment_answers"]);

    const payload: Employee = {
      _id: initialData?._id,
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      assessment_answers: assignmentSubmitted
        ? questions.reduce((acc, i) => ({
          ...acc,
          [`q${i}`]: answers[`q${i}`] ?? ''
        }), {} as Employee["assessment_answers"])
        : generateEmptyAnswers(),
      assessment_submitted: assignmentSubmitted,
      tags,
      culture,
      learning,
      interest,
      goals,
      learning_score: learningScore || 0,
    };


    try {
      let res;
      if (isEditMode && payload._id) {
        res = await api.put(`employees/${payload._id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Employee updated successfully!');
      } else {
        res = await api.post('employees', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Employee added successfully!');
      }

      onSave(res.data);
      onClose();
    } catch (error: unknown) {
      let message = 'Failed to save employee';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setErrors({ api: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEditMode ? 'Edit Employee' : 'Add Employee'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label="Close modal"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {errors.api && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errors.api}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Name *"
                className={`border p-2 w-full rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                disabled={isLoading}
                autoFocus
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email *"
                className={`border p-2 w-full rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Role *"
              className={`border p-2 w-full rounded ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
              value={role}
              onChange={e => {
                setRole(e.target.value);
                if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
              }}
              disabled={isLoading}
            />
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          <div>
            <input
              type="number"
              placeholder="Learning Score"
              className="border border-gray-300 p-2 w-full rounded"
              value={learningScore}
              onChange={e => setLearningScore(Number(e.target.value))}
              disabled={isLoading}
              min={0}
            />
          </div>

          <div>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Add tags (press Enter to add)"
                className="border border-gray-300 p-2 w-full rounded"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                disabled={isLoading}
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm flex items-center">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Assessment Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <select
                className="border border-gray-300 p-2 w-full rounded"
                value={culture}
                onChange={e => setCulture(e.target.value)}
                disabled={isLoading}
              >
                {cultureOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="border border-gray-300 p-2 w-full rounded"
                value={learning}
                onChange={e => setLearning(e.target.value)}
                disabled={isLoading}
              >
                {learningOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <select
                className="border border-gray-300 p-2 w-full rounded"
                value={interest}
                onChange={e => setInterest(e.target.value)}
                disabled={isLoading}
              >
                {interestOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="border border-gray-300 p-2 w-full rounded"
                value={goals}
                onChange={e => setGoals(e.target.value)}
                disabled={isLoading}
              >
                {goalsOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={assignmentSubmitted}
              onChange={handleToggle}
              className="rounded"
              disabled={isLoading}
            />
            <span className="font-medium">Assignment Submitted</span>
          </label>

          {assignmentSubmitted && (
            <div className="space-y-3 max-h-64 overflow-y-auto border-t pt-4">
              <h3 className="font-semibold text-gray-700">Assignment Answers *</h3>
              {errors.answers && <p className="text-red-500 text-sm">{errors.answers}</p>}
              {questions.map(i => (
                <div key={i} className="bg-gray-50 p-3 rounded border">
                  <label className="block font-medium mb-2 text-sm">Question {i}</label>
                  <input
                    type="text"
                    placeholder={`Answer for Question ${i}`}
                    className="border border-gray-300 p-2 w-full rounded text-sm"
                    value={answers[`q${i}`] || ''}
                    onChange={e => handleAnswerChange(`q${i}`, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              isEditMode ? 'Update Employee' : 'Save Employee'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

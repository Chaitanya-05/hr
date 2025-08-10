import { assessmentQuestions, type Employee } from "../config/assessmentquestions";

export default function ViewEmployee({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Employee Details</h2>

        {/* Top-level info */}
        <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
          <div><strong>Name:</strong> {employee.name}</div>
          <div><strong>Email:</strong> {employee.email}</div>
          <div><strong>Role:</strong> {employee.role}</div>
          <div><strong>Culture:</strong> {employee.culture}</div>
          <div><strong>Learning:</strong> {employee.learning}</div>
          <div><strong>Interest:</strong> {employee.interest}</div>
          <div><strong>Goals:</strong> {employee.goals}</div>
          <div><strong>Tags:</strong> {employee.tags?.join(", ")}</div>
          <div><strong>Learning Score:</strong> {employee.learning_score ?? "N/A"}</div>
          <div><strong>Submission Date:</strong> {employee.submission_date ? new Date(employee.submission_date).toLocaleDateString() : "N/A"}</div>
          <div><strong>Assessment Submitted:</strong> {employee.assessment_submitted ? "Yes" : "No"}</div>
        </div>

        {/* Assessment answers */}
        <h3 className="text-xl font-semibold mb-2">Assessment Answers</h3>
        <div className="space-y-3">
          {Object.entries(assessmentQuestions).map(([key, question]) => (
            <div key={key}>
              <strong>{question}</strong>
              <p className="ml-2 text-gray-700">{employee.assessment_answers?.[key as keyof typeof employee.assessment_answers] || "No answer"}</p>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Close
        </button>
      </div>
    </div>
  );
}

import type { Employee } from "../config/assessmentquestions";

export const exportFilteredToCSV = (data: Employee[]) => {
  if (!data.length) return;

  const flattened = data.map(emp => ({
    id: emp._id || "",
    name: emp.name,
    email: emp.email,
    role: emp.role,
    assessment_submitted: emp.assessment_submitted ? "Yes" : "No",
    ...emp.assessment_answers,
    tags: emp.tags.join(", "),
    culture: emp.culture || "",
    learning: emp.learning || "",
    interest: emp.interest || "",
    goals: emp.goals || "",
    submission_date: emp.submission_date || "",
    learning_score: emp.learning_score?.toString() || "",
    createdAt: emp.createdAt || "",
    updated_at: emp.updated_at || ""
  }));

  const headers = Object.keys(flattened[0]);
  const rows = flattened.map((row: Record<string, string>) =>
    headers.map(header => `"${row[header] ?? ""}"`).join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `employees_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

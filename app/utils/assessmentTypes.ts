export function getAssessmentTypeLabel(type: string | undefined): string {
  if (!type) return "Assessment";
  const labels: Record<string, string> = {
    in_person_interview: "In-Person Interview",
    online_interview: "Online Interview",
    assessment_center: "Assessment Center",
    hirevue: "Hirevue",
    online_assessment: "Online Assessment",
  };
  return labels[type] || type;
}


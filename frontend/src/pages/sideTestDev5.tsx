
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function sideTestDev5() {
  const navigate = useNavigate();

  useEffect(() => {
    const mock = {
      id: 123,
      title: "Mock Published Quiz",
      difficulty: "medium",
      category: "Math",
      questionsCount: 10,
    };

    navigate(`/quiz/${mock.id}/published`, { state: mock });
  }, [navigate]);

  return null; // vi rendrer ikke noe her, vi bare redirecter
}

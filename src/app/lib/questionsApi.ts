import type { QuestionResponseDto } from "../types/question";
import { api } from "./api";

export async function listQuestions(params?: {
  topicId?: number;
  subjectId?: number;
}): Promise<QuestionResponseDto[]> {
  const { data } = await api.get<QuestionResponseDto[]>("/api/v1/questions", { params });
  return data;
}

export async function deleteQuestion(questionId: number): Promise<void> {
  await api.delete(`/api/v1/questions/${questionId}`);
}

// API funksjoner for Quiz

// 

import { http } from './http.js';
//Henter alle quizzer
export const listQuizzes = (published) =>
  http(`/api/quizzes${published!=null?`?published=${published}`:''}`);
//get - henter, create - lager, update - opdaterer og delete - sletter...
export const getQuiz = (id) => http(`/api/quizzes/${id}`);
export const createQuiz = (dto) => http('/api/quizzes', { method:'POST', body:dto });
export const updateQuiz = (id,dto) => http(`/api/quizzes/${id}`, { method:'PUT', body:dto });
export const deleteQuiz = (id) => http(`/api/quizzes/${id}`, { method:'DELETE' });

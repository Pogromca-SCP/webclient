import { get, post, put, del } from "./basicCalls";

interface TutorialBase {
  // Not blank
  name: string,

  // Enum - TutorialType
  tutorialType: string,
  tutorialHTML: string | null,
  thumbnail: string
}

export interface TutorialRequest extends TutorialBase {
  // Integer
  tutorialId?: number
}

export interface TutorialResponse extends TutorialBase {
  tutorialId: number,
  avarageRating: number
}

export interface ReviewRequest {
  value: number,
  discription: string
}

const tutorialBase = "tutorial";
export const getTutorials = (abort: AbortController) => get(tutorialBase, abort);
export const getTutorialById = (id: number, abort: AbortController) => get(`${tutorialBase}/${id}`, abort);
export const createTutorial = (req: Readonly<TutorialRequest>, abort: AbortController) => post(tutorialBase, req, abort);
export const updateTutorial = (req: Readonly<TutorialRequest>, abort: AbortController) => put(tutorialBase, req, abort);
export const deleteTutorial = (id: number, abort: AbortController) => del(`${tutorialBase}/${id}`, abort);
export const addReview = (id: number, user: number, req: Readonly<ReviewRequest>, abort: AbortController) => post(`${tutorialBase}/${id}/${user}`, req, abort);
export const deleteReview = (id: number, user: number, review: number, abort: AbortController) => del(`${tutorialBase}/${id}/${user}/${review}`, abort);
export const updateReview = (id: number, req: Readonly<ReviewRequest>, abort: AbortController) => put(`${tutorialBase}/${id}`, req, abort);

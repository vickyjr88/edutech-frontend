// Assignment type definitions

export interface Assignment {
    id: string;
    title: string;
    status: "completed" | "pending_review" | "in_progress" | "upcoming" | "late";
    submitDate?: string;
    dueDate: string;
    score?: string;
    grade?: string;
    feedback?: string;
    type: "individual" | "group";
    description?: string;
    progress?: number;
    groupMembers?: number;
    lateBy?: string;
    course?: string;
}

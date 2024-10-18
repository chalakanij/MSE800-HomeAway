export interface CreateProjectData {
    id?: number;
    title: string;
    description: string;
    work_hours: string;
    status?: string;
    user_id?: number;
}
export interface ResumeAPIResponse {
    success: boolean;
    message: string;
    errors: string[];
    data: Record<string, any>;
}

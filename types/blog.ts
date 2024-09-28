export interface Post {
    _id: string;
    title: string;
    slug: string;
    isPublic: boolean;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt?: string;
    tags?: string[];
}

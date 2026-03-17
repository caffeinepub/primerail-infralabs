import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Submission {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export type ContentCategory = 
    | { __kind__: "Post" }
    | { __kind__: "Blog" }
    | { __kind__: "News" }
    | { __kind__: "Article" };
export interface ContentItem {
    id: bigint;
    title: string;
    body: string;
    category: ContentCategory;
    imageUrl: Option<string>;
    author: string;
    createdAt: Time;
    published: boolean;
}
export type UserRole = 
    | { __kind__: "admin" }
    | { __kind__: "user" }
    | { __kind__: "guest" };
export interface backendInterface {
    getAllSubmissions(): Promise<Array<Submission>>;
    getAllSubmissionsSortedByTimestamp(): Promise<Array<Submission>>;
    getSubmissionsByEmail(email: string): Promise<Array<Submission>>;
    getSubmissionsByPhone(phone: string): Promise<Array<Submission>>;
    submitContactForm(name: string, phone: string, email: string, message: string): Promise<void>;
    // Authorization
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    // Content Management
    createContent(title: string, body: string, category: ContentCategory, imageUrl: Option<string>, author: string): Promise<bigint>;
    updateContent(id: bigint, title: string, body: string, category: ContentCategory, imageUrl: Option<string>, author: string, published: boolean): Promise<boolean>;
    deleteContent(id: bigint): Promise<boolean>;
    getAllPublishedContent(): Promise<Array<ContentItem>>;
    getPublishedContentByCategory(category: ContentCategory): Promise<Array<ContentItem>>;
    getAllContentAdmin(): Promise<Array<ContentItem>>;
}

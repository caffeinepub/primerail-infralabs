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
export interface backendInterface {
    getAllSubmissions(): Promise<Array<Submission>>;
    getAllSubmissionsSortedByTimestamp(): Promise<Array<Submission>>;
    getSubmissionsByEmail(email: string): Promise<Array<Submission>>;
    getSubmissionsByPhone(phone: string): Promise<Array<Submission>>;
    submitContactForm(name: string, phone: string, email: string, message: string): Promise<void>;
}
